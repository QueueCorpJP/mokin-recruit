/**
 * DIコンテナモジュールのメインエクスポート
 * 依存性注入システムの統一インターフェース
 */

// === Core Classes ===
export {
  DIContainer,
  diContainer,
  resolve,
  resolveOptional,
} from './container';
export { ContainerBindings } from './bindings';
export { ContainerInitializer } from './initializer';

// === Types & Constants ===
export { TYPES } from './types';
export type {
  DITypes,
  ServiceIdentifier,
  ServiceRegistration,
  ContainerOptions,
} from './types';

// === Convenience Re-exports ===
import { ContainerInitializer } from './initializer';
import { diContainer } from './container';

/**
 * アプリケーション起動時の初期化ヘルパー
 */
export const initializeDI = ContainerInitializer.initializeWithValidation;

/**
 * 健全性チェックヘルパー
 */
export const checkDIHealth = ContainerInitializer.healthCheck;

/**
 * コンテナ取得ヘルパー
 */
export const getContainer = () => diContainer;

/**
 * 依存性解決のショートハンド
 */
export const inject = <T>(serviceIdentifier: symbol | string): T => {
  return diContainer.get<T>(serviceIdentifier);
};

/**
 * オプショナル依存性解決のショートハンド
 */
export const tryInject = <T>(serviceIdentifier: symbol | string): T | null => {
  return diContainer.getOptional<T>(serviceIdentifier);
};
