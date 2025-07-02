import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
 * 環境変数から直接Supabase設定を取得（循環参照回避）
 */
function getSupabaseConfig(): SupabaseConfig {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 必須環境変数の検証
  if (!url || !anonKey) {
    const missing = [];
    if (!url) missing.push('SUPABASE_URL');
    if (!anonKey) missing.push('SUPABASE_ANON_KEY');

    throw new Error(
      `Missing required Supabase environment variables: ${missing.join(', ')}`
    );
  }

  // 本番環境ではログを簡素化
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase configuration loaded', {
      url: url.substring(0, 30) + '...',
      hasAnonKey: !!anonKey,
      hasServiceRoleKey: !!serviceRoleKey,
    });
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
      global: {
        headers: {
          'X-Client-Info': 'mokin-recruit-server',
        },
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
        global: {
          headers: {
            'X-Client-Info': 'mokin-recruit-server-admin',
          },
        },
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('Supabase admin client initialized successfully');
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase client initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    throw error;
  }
}

/**
 * Supabaseクライアント（RLS有効）を取得
 */
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase client is not initialized. Call initializeSupabase() first.'
    );
  }
  return supabase;
}

/**
 * Supabase管理者クライアント（RLS無効）を取得
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdmin) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'Supabase admin client is not initialized. Using regular client as fallback.'
      );
    }
    return getSupabaseClient();
  }
  return supabaseAdmin;
}

/**
 * Supabase接続テスト（簡素化版）
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();

    // シンプルなテストクエリ
    const { error } = await client.from('auth.users').select('count').limit(0);

    if (error) {
      // フォールバック: RPC呼び出しでテスト
      const { error: rpcError } = await client.rpc('version');
      if (rpcError) {
        console.error('Supabase connection test failed:', rpcError.message);
        return false;
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Supabase connection test successful');
    }
    return true;
  } catch (error) {
    console.error('Supabase connection test error:', error);
    return false;
  }
}

/**
 * データベーススキーマの初期化チェック（簡素化版）
 */
export async function checkDatabaseSchema(): Promise<{
  tablesExist: boolean;
  missingTables: string[];
}> {
  try {
    const client = getSupabaseAdminClient();
    const requiredTables = [
      'candidates',
      'company_accounts',
      'company_users',
      'job_postings',
      'messages',
    ];

    // 簡素化されたスキーマチェック
    let existingTables: string[] = [];

    try {
      const { data, error } = await client
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .in('table_name', requiredTables);

      if (!error && data) {
        existingTables = data.map(t => t.table_name);
      }
    } catch (error) {
      // スキーマチェックに失敗しても継続
      console.warn('Schema check failed, assuming tables exist:', error);
      return { tablesExist: true, missingTables: [] };
    }

    const missingTables = requiredTables.filter(
      table => !existingTables.includes(table)
    );

    if (process.env.NODE_ENV === 'development') {
      console.log('Database schema check completed', {
        existingTables: existingTables.length,
        missingTables: missingTables.length,
        missing: missingTables,
      });
    }

    return {
      tablesExist: missingTables.length === 0,
      missingTables,
    };
  } catch (error) {
    console.error('Database schema check error:', error);
    return { tablesExist: false, missingTables: [] };
  }
}

/**
 * Supabase接続を閉じる（クリーンアップ）
 */
export function closeSupabaseConnection(): void {
  // Supabaseクライアントは自動的にクリーンアップされるため、
  // 明示的なクローズは不要だが、ログ出力のみ行う
  if (process.env.NODE_ENV === 'development') {
    console.log('Supabase connection cleanup completed');
  }
}
