import 'reflect-metadata';
import { Container } from 'inversify';
import { logger } from '../utils/logger';

/**
 * DIコンテナクラス
 * アプリケーション全体の依存性注入を管理
 * シングルトンパターンで実装
 */
export class DIContainer {
  private static instance: DIContainer;
  private readonly container: Container;

  private constructor() {
    this.container = new Container({
      defaultScope: 'Singleton',
      skipBaseClassChecks: true,
      autoBindInjectable: true,
    });

    logger.info('DIContainer initialized');
  }

  /**
   * DIコンテナのシングルトンインスタンスを取得
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * Inversifyコンテナインスタンスを取得
   */
  public getContainer(): Container {
    return this.container;
  }

  /**
   * 依存性を解決して取得
   */
  public get<T>(serviceIdentifier: symbol | string): T {
    try {
      return this.container.get<T>(serviceIdentifier);
    } catch (error) {
      logger.error(
        `Failed to resolve dependency: ${String(serviceIdentifier)}`,
        error
      );
      throw new Error(
        `Dependency resolution failed: ${String(serviceIdentifier)}`
      );
    }
  }

  /**
   * 依存性を安全に解決して取得（エラー時はnullを返す）
   */
  public getOptional<T>(serviceIdentifier: symbol | string): T | null {
    try {
      return this.container.get<T>(serviceIdentifier);
    } catch (error) {
      logger.warn(
        `Optional dependency not found: ${String(serviceIdentifier)}`
      );
      return null;
    }
  }

  /**
   * 依存性が登録されているかチェック
   */
  public isBound(serviceIdentifier: symbol | string): boolean {
    return this.container.isBound(serviceIdentifier);
  }

  /**
   * 依存性のバインディングを解除
   */
  public unbind(serviceIdentifier: symbol | string): void {
    if (this.container.isBound(serviceIdentifier)) {
      this.container.unbind(serviceIdentifier);
      logger.debug(`Unbound dependency: ${String(serviceIdentifier)}`);
    }
  }

  /**
   * コンテナの状態をリセット（主にテスト用）
   */
  public reset(): void {
    this.container.unbindAll();
    logger.debug('DIContainer reset completed');
  }

  /**
   * 登録済み依存性の一覧を取得（デバッグ用）
   */
  public getRegisteredServices(): string[] {
    const services: string[] = [];

    // Inversifyの内部APIを使用してサービス一覧を取得
    // 注意: これは内部実装に依存するため、バージョンアップ時に注意が必要
    try {
      const bindings = (this.container as any)._bindingDictionary;
      if (bindings && typeof bindings.getMap === 'function') {
        const bindingMap = bindings.getMap();
        for (const [key] of bindingMap) {
          services.push(String(key));
        }
      }
    } catch (error) {
      logger.warn('Failed to retrieve registered services', error);
    }

    return services;
  }

  /**
   * コンテナの統計情報を取得
   */
  public getStats(): {
    totalBindings: number;
    registeredServices: string[];
  } {
    const registeredServices = this.getRegisteredServices();

    return {
      totalBindings: registeredServices.length,
      registeredServices,
    };
  }
}

/**
 * グローバルDIコンテナインスタンス
 */
export const diContainer = DIContainer.getInstance();

/**
 * 依存性解決のヘルパー関数
 */
export const resolve = <T>(serviceIdentifier: symbol | string): T => {
  return diContainer.get<T>(serviceIdentifier);
};

/**
 * オプショナル依存性解決のヘルパー関数
 */
export const resolveOptional = <T>(
  serviceIdentifier: symbol | string
): T | null => {
  return diContainer.getOptional<T>(serviceIdentifier);
};

/**
 * DIコンテナ初期化関数
 */
export const initializeDI = async (): Promise<void> => {
  try {
    // ContainerInitializerを使用して完全な初期化を実行
    const { ContainerInitializer } = await import('./initializer');
    await ContainerInitializer.initialize();

    logger.info('DI Container initialization completed successfully');
  } catch (initError) {
    logger.error('DI Container initialization failed:', initError);
    throw initError;
  }
};
