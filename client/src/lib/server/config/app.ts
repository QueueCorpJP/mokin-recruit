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
    this.port = parseInt(process.env.PORT || '3001', 10);
    this.nodeEnv = process.env.NODE_ENV || 'development';
    this.corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
    this.apiPrefix = process.env.API_PREFIX || '/api';
    this.rateLimitWindowMs = parseInt(
      process.env.RATE_LIMIT_WINDOW_MS || '900000',
      10
    );
    this.rateLimitMaxRequests = parseInt(
      process.env.RATE_LIMIT_MAX_REQUESTS || '100',
      10
    );
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
