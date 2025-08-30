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

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Supabase client initialized for API route');
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(
      '❌ Failed to initialize Supabase client for API route:',
      error
    );

    throw new Error(`Supabase initialization failed: ${errorMessage}`);
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
    try {
      ensureSupabaseInitialized();
      return handler(...args);
    } catch (error) {
      console.error('Supabase initialization error in wrapper:', error);
      throw error;
    }
  }) as T;
}
