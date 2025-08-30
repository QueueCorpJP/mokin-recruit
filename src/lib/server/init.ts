/**
 * サーバーサイドの初期化処理
 * この処理はサーバー起動時に一度だけ実行される
 */

import { logger } from '@/lib/server/utils/logger';

// 環境変数のバリデーション（起動時に一度だけ実行）
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    // 開発環境では警告、本番環境ではエラー
    const message = `Missing required environment variables: ${missing.join(', ')}`;
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(message);
    } else {
      logger.warn(message);
    }
  }

  logger.info('Environment variables validated successfully');
}

// グローバル設定の初期化
export function initializeGlobalConfig() {
  // タイムゾーン設定
  process.env.TZ = process.env.TZ || 'Asia/Tokyo';
  
  // Node.jsのメモリ制限設定（既に設定されていない場合）
  if (!process.env.NODE_OPTIONS?.includes('max-old-space-size')) {
    process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim();
  }

  logger.info('Global configuration initialized');
}

// エラーハンドラーの設定
export function setupErrorHandlers() {
  // 未処理のPromise拒否をキャッチ
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // 未処理の例外をキャッチ
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    // 本番環境では、適切にシャットダウン
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });
}

// すべての初期化処理を実行
let initialized = false;

export function initializeServer() {
  if (initialized) {
    return;
  }

  try {
    validateEnvironment();
    initializeGlobalConfig();
    setupErrorHandlers();
    
    initialized = true;
    logger.info('Server initialization completed successfully');
  } catch (error) {
    logger.error('Server initialization failed:', error);
    throw error;
  }
}

// Next.jsのサーバー起動時に自動実行
if (typeof window === 'undefined') {
  initializeServer();
}