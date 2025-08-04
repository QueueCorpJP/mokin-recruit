// アプリケーション設定インターフェース
export interface IAppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  apiPrefix: string;
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

// アプリケーション設定クラス (SRP準拠)
export class AppConfig implements IAppConfig {
  readonly port: number;
  readonly nodeEnv: string;
  readonly corsOrigin: string;
  readonly apiPrefix: string;
  readonly rateLimitWindowMs: number;
  readonly rateLimitMaxRequests: number;

  constructor() {
    // バリデーション済み環境変数から取得
    const env = this.getValidatedEnv();

    this.port = env.PORT;
    this.nodeEnv = env.NODE_ENV;
    this.corsOrigin = env.CORS_ORIGIN || `http://localhost:${env.PORT}`;
    this.apiPrefix = '/api'; // 固定値
    this.rateLimitWindowMs = env.RATE_LIMIT_WINDOW;
    this.rateLimitMaxRequests = env.RATE_LIMIT_MAX;
  }

  private getValidatedEnv() {
    try {
      // 新しいバリデーションシステムを使用
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { getValidatedEnv } = require('@/lib/server/config/env-validation');
      return getValidatedEnv();
    } catch (error) {
      // フォールバック: 従来の方式
      return {
        PORT: parseInt(process.env.PORT || '3000', 10),
        NODE_ENV: process.env.NODE_ENV || 'development',
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        RATE_LIMIT_WINDOW: parseInt(
          process.env.RATE_LIMIT_WINDOW || '900000',
          10
        ),
        RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      };
    }
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
}
