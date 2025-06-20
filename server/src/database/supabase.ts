import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';

// Supabase設定の型定義
interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey: string | undefined;
}

// Supabaseクライアントインスタンス
let supabase: SupabaseClient;
let supabaseAdmin: SupabaseClient;

/**
 * Supabase設定を環境変数から取得
 */
function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase URL and ANON_KEY are required');
  }

  return {
    url,
    anonKey,
    serviceRoleKey,
  };
}

/**
 * Supabaseクライアントを初期化
 */
export function initializeSupabase(): void {
  try {
    const config = getSupabaseConfig();

    // 通常のクライアント（RLS有効）
    supabase = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // サーバーサイドでは無効
      },
      db: {
        schema: 'public',
      },
    });

    // 管理者クライアント（RLS無効、サービスロールキー使用）
    if (config.serviceRoleKey) {
      supabaseAdmin = createClient(config.url, config.serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema: 'public',
        },
      });
    }

    logger.info('Supabase client initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize Supabase client:', error);
    throw error;
  }
}

/**
 * Supabaseクライアント（RLS有効）を取得
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase client is not initialized. Call initializeSupabase() first.');
  }
  return supabase;
}

/**
 * Supabase管理者クライアント（RLS無効）を取得
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client is not initialized or service role key is not provided.');
  }
  return supabaseAdmin;
}

/**
 * Supabase接続テスト
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.from('candidates').select('count').limit(1);
    
    if (error) {
      logger.error('Supabase connection test failed:', error);
      return false;
    }

    logger.info('Supabase connection test successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection test error:', error);
    return false;
  }
}

/**
 * Supabase接続を閉じる（クリーンアップ）
 */
export function closeSupabaseConnection(): void {
  // Supabaseクライアントは自動的にクリーンアップされるため、
  // 明示的なクローズは不要だが、ログ出力のみ行う
  logger.info('Supabase connection cleanup completed');
} 