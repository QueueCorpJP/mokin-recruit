import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';

// キャッシュされたクライアントインスタンス
let cachedActionClient: SupabaseClient | null = null;
let cachedAdminClient: SupabaseClient | null = null;

/**
 * 環境変数の取得とバリデーション（統一）
 * 一度だけ実行されてキャッシュされる
 */
const supabaseConfig = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mjhqeagxibsklugikyma.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjY1MzcsImV4cCI6MjA2NTkwMjUzN30.pNWyWJ1OxchoKfEJTsn7KC1yduaR6S6xETmfbrUdHIk';
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    const missing = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
    if (!supabaseAnonKey) missing.push('SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    
    throw new Error(`Missing required Supabase environment variables: ${missing.join(', ')}`);
  }

  return { supabaseUrl, supabaseAnonKey, supabaseServiceRoleKey };
})();

function getSupabaseConfig() {
  return supabaseConfig;
}

/**
 * 統一されたSupabaseサーバークライアント（SSR対応）
 * 重複初期化を防ぎ、一貫したクッキー処理を提供
 */
export async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignore cookie setting errors in Server Actions
            if (process.env.NODE_ENV === 'development') console.warn('Cookie setting error:', error);
          }
        },
      },
    }
  );
}

/**
 * Server Actions用の基本的なSupabaseクライアント
 * クッキー処理が不要な場合に使用
 * シングルトンパターンでインスタンスをキャッシュ
 */
export function getSupabaseActionClient() {
  if (cachedActionClient) {
    return cachedActionClient;
  }

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  
  cachedActionClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'mokin-recruit-server',
      },
    },
  });

  return cachedActionClient;
}

/**
 * Server Actions用の管理者クライアント（Service Role Key使用）
 * RLSをバイパスして全データにアクセス可能
 * シングルトンパターンでインスタンスをキャッシュ
 */
export function getSupabaseAdminClient() {
  if (cachedAdminClient) {
    return cachedAdminClient;
  }

  const { supabaseUrl, supabaseServiceRoleKey } = getSupabaseConfig();
  
  if (!supabaseServiceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for admin client');
  }
  
  cachedAdminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'X-Client-Info': 'mokin-recruit-server-admin',
      },
    },
  });

  return cachedAdminClient;
}

/**
 * Server Actions用のヘルパー関数
 * 統一されたエラーハンドリングとログ出力を提供
 */
export async function withSupabaseClient<T>(
  handler: (supabase: any) => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const supabase = await getSupabaseServerClient();
    const data = await handler(supabase);
    return { success: true, data };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Supabase operation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '操作に失敗しました'
    };
  }
}