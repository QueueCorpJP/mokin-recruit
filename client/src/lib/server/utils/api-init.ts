import { logger } from '@/lib/server/utils/logger';
import { initializeSupabase } from '@/lib/server/database/supabase';

/**
 * API Routes専用の初期化ユーティリティ
 * 各API Routeで確実にSupabaseクライアントが初期化されることを保証
 */
let isInitialized = false;

export function ensureSupabaseInitialized(): void {
  if (isInitialized) {
    return;
  }

  try {
    // Supabaseクライアントの初期化
    initializeSupabase();
    isInitialized = true;
    logger.info('✅ Supabase client initialized for API route');
  } catch (error) {
    logger.error(
      '❌ Failed to initialize Supabase client for API route:',
      error
    );
    throw new Error(
      `Supabase initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * API Route用のSupabase初期化ラッパー
 * 使用方法: const handler = withSupabaseInit(async (req) => { ... });
 */
export function withSupabaseInit<T extends (...args: any[]) => any>(
  handler: T
): T {
  return ((...args: any[]) => {
    ensureSupabaseInitialized();
    return handler(...args);
  }) as T;
}
