import 'reflect-metadata';
import * as process from 'process';
import { logger } from '@/utils/logger';
import { DIContainer } from './container';
import { ContainerBindings } from './bindings';
import { TYPES } from './types';

/**
 * DIコンテナ初期化クラス
 * アプリケーション起動時の依存性注入セットアップを担当
 */
export class ContainerInitializer {
  private static isInitialized = false;
  private static container: DIContainer;

  /**
   * DIコンテナを初期化
   */
  public static async initialize(): Promise<DIContainer> {
    if (this.isInitialized) {
      logger.warn('DIContainer is already initialized');
      return this.container;
    }

    try {
      logger.info('Initializing DIContainer...');

      // コンテナインスタンスを取得
      this.container = DIContainer.getInstance();

      // 依存性をバインド
      ContainerBindings.bindAll(this.container.getContainer());

      // 必須サービスの検証
      const validationResult = ContainerBindings.validateEssentialServices(
        this.container.getContainer()
      );

      if (!validationResult) {
        throw new Error('Essential services validation failed');
      }

      // 初期化完了フラグを設定
      this.isInitialized = true;

      // 統計情報を出力
      const stats = this.container.getStats();
      logger.info('DIContainer initialization completed', {
        totalBindings: stats.totalBindings,
        timestamp: new Date().toISOString(),
      });

      return this.container;
    } catch (error) {
      logger.error('DIContainer initialization failed:', error);
      throw new Error(`DIContainer initialization failed: ${error}`);
    }
  }

  /**
   * DIコンテナが初期化済みかチェック
   */
  public static isContainerInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * 初期化済みコンテナを取得
   */
  public static getContainer(): DIContainer {
    if (!this.isInitialized || !this.container) {
      throw new Error(
        'DIContainer is not initialized. Call initialize() first.'
      );
    }
    return this.container;
  }

  /**
   * 特定のサービスの健全性チェック
   */
  public static async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy';
    services: Array<{
      name: string;
      status: 'ok' | 'error';
      error?: string;
    }>;
  }> {
    if (!this.isInitialized) {
      return {
        status: 'unhealthy',
        services: [
          { name: 'DIContainer', status: 'error', error: 'Not initialized' },
        ],
      };
    }

    const services = [
      { identifier: TYPES.Logger, name: 'Logger' },
      { identifier: TYPES.Config, name: 'Config' },
      { identifier: TYPES.Security, name: 'Security' },
      { identifier: TYPES.DatabaseClient, name: 'DatabaseClient' },
      { identifier: TYPES.SupabaseClient, name: 'SupabaseClient' },
      { identifier: TYPES.CandidateRepository, name: 'CandidateRepository' },
      { identifier: TYPES.CompanyRepository, name: 'CompanyRepository' },
    ];

    const results = [];
    let overallStatus: 'healthy' | 'unhealthy' = 'healthy';

    for (const service of services) {
      try {
        const instance = this.container.get(service.identifier);
        if (instance) {
          results.push({ name: service.name, status: 'ok' as const });
        } else {
          results.push({
            name: service.name,
            status: 'error' as const,
            error: 'Instance is null',
          });
          overallStatus = 'unhealthy';
        }
      } catch (error) {
        results.push({
          name: service.name,
          status: 'error' as const,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        overallStatus = 'unhealthy';
      }
    }

    return { status: overallStatus, services: results };
  }

  /**
   * DIコンテナをリセット（主にテスト用）
   */
  public static reset(): void {
    if (this.container) {
      this.container.reset();
    }
    this.isInitialized = false;
    logger.debug('DIContainer reset completed');
  }

  /**
   * アプリケーション終了時のクリーンアップ
   */
  public static async shutdown(): Promise<void> {
    try {
      logger.info('Shutting down DIContainer...');

      // 必要に応じてリソースのクリーンアップを実行
      // 例: データベース接続の切断、キャッシュのクリア等

      if (this.container) {
        // コンテナ内のサービスで終了処理が必要なものがあれば実行
        // 現在は特に処理なし
      }

      this.isInitialized = false;
      logger.info('DIContainer shutdown completed');
    } catch (error) {
      logger.error('DIContainer shutdown error:', error);
      throw error;
    }
  }

  /**
   * 開発環境用デバッグ情報
   */
  public static getDebugInfo(): {
    isInitialized: boolean;
    containerStats: any;
    registeredServices?: string[];
  } {
    const debugInfo: any = {
      isInitialized: this.isInitialized,
    };

    if (this.isInitialized && this.container) {
      debugInfo.containerStats = this.container.getStats();
      debugInfo.registeredServices = this.container.getRegisteredServices();
    }

    return debugInfo;
  }

  /**
   * 環境変数チェック
   */
  private static validateEnvironment(): void {
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
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
  public static async initializeWithValidation(): Promise<DIContainer> {
    // 環境変数の検証
    this.validateEnvironment();

    // DIコンテナの初期化
    return await this.initialize();
  }
}
