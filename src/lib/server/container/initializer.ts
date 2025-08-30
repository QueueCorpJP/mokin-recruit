import 'reflect-metadata';
import * as process from 'process';
import { logger } from '@/utils/logger';
import { container } from './bindings';

/**
 * DIコンテナの初期化クラス
 * アプリケーション起動時のコンテナ設定を管理
 */
export class ContainerInitializer {
  private static initialized = false;

  /**
   * DIコンテナを初期化
   */
  public static initialize(): void {
    if (this.initialized) {
      logger.warn('DI Container already initialized');
      return;
    }

    try {
      logger.info('Initializing DI Container...');

      // コンテナは既に初期化済み（bindings.tsで実行）
      this.initialized = true;

      logger.info('✅ DI Container initialization completed');
    } catch (error) {
      logger.error('❌ DI Container initialization failed:', error);
      throw new Error(
        `DI Container initialization failed: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
  }

  /**
   * 初期化状態を確認
   */
  public static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * コンテナを取得
   */
  public static getContainer() {
    if (!this.initialized) {
      this.initialize();
    }
    return container;
  }

  /**
   * 環境変数の検証
   */
  private static validateEnvironment(): void {
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const missingVars = requiredEnvVars.filter(
      varName => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
  }

  /**
   * 完全な初期化（環境変数チェック含む）
   */
  public static async initializeWithValidation(): Promise<void> {
    // 環境変数の検証
    this.validateEnvironment();

    // DIコンテナの初期化
    this.initialize();
  }
}
