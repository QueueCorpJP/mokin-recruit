import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '@/utils/logger';
import { DatabaseConfig } from '@/config/database';

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
  const dbConfig = new DatabaseConfig();

  logger.info('Supabase configuration loaded', {
    url: dbConfig.supabaseUrl.substring(0, 30) + '...',
    hasAnonKey: !!dbConfig.supabaseAnonKey,
    hasServiceRoleKey: !!dbConfig.supabaseServiceRoleKey,
  });

  return {
    url: dbConfig.supabaseUrl,
    anonKey: dbConfig.supabaseAnonKey,
    serviceRoleKey: dbConfig.supabaseServiceRoleKey,
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
      logger.info('Supabase admin client initialized successfully');
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
    logger.warn(
      'Supabase admin client is not initialized. Using regular client as fallback.'
    );
    return getSupabaseClient();
  }
  return supabaseAdmin;
}

/**
 * Supabase接続テスト（改善版）
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();

    // より汎用的なテストクエリを使用
    const { data, error } = await client
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    if (error) {
      logger.warn(
        'Supabase connection test failed with query error:',
        error.message
      );

      // フォールバック: RPC呼び出しでテスト
      const { data: rpcData, error: rpcError } = await client.rpc('version');
      if (rpcError) {
        logger.error('Supabase RPC test also failed:', rpcError.message);
        return false;
      }
      logger.info('Supabase connection successful via RPC');
      return true;
    }

    logger.info('Supabase connection test successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection test error:', error);
    return false;
  }
}

/**
 * データベーススキーマの初期化チェック
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

    const { data, error } = await client
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', requiredTables);

    if (error) {
      logger.error('Failed to check database schema:', error);
      return { tablesExist: false, missingTables: requiredTables };
    }

    const existingTables = data?.map(t => t.table_name) || [];
    const missingTables = requiredTables.filter(
      table => !existingTables.includes(table)
    );

    logger.info('Database schema check completed', {
      existingTables: existingTables.length,
      missingTables: missingTables.length,
      missing: missingTables,
    });

    return {
      tablesExist: missingTables.length === 0,
      missingTables,
    };
  } catch (error) {
    logger.error('Database schema check error:', error);
    return { tablesExist: false, missingTables: [] };
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
