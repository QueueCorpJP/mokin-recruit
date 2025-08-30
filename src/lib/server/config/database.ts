// Supabase データベース設定インターフェース
export interface ISupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

// Supabase データベース設定クラス (SRP準拠)
export class SupabaseConfig implements ISupabaseConfig {
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly supabaseServiceRoleKey: string;
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;

  constructor() {
    // バリデーション済み環境変数から取得 (synchronous fallback)
    const env = this.getValidatedEnvSync();

    this.supabaseUrl = env.SUPABASE_URL;
    this.supabaseAnonKey = env.SUPABASE_ANON_KEY;
    this.supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

    // 環境判定
    this.isDevelopment = env.NODE_ENV === 'development';
    this.isProduction = env.NODE_ENV === 'production';

    // 必須チェック（既にバリデーション済みだが念のため）
    this.validateConfiguration();
  }

  private getValidatedEnvSync() {
    // フォールバック: 従来の方式 (synchronous)
    return {
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      NODE_ENV: process.env.NODE_ENV || 'development',
    };
  }

  private async getValidatedEnv() {
    try {
      // 新しいバリデーションシステムを使用
      const { getValidatedEnv } = await import('@/lib/server/config/env-validation');
      return getValidatedEnv();
    } catch (error) {
      return this.getValidatedEnvSync();
    }
  }

  private validateConfiguration(): void {
    const requiredEnvVars = [
      { key: 'SUPABASE_URL', value: this.supabaseUrl },
      { key: 'SUPABASE_ANON_KEY', value: this.supabaseAnonKey },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: this.supabaseServiceRoleKey },
    ];

    const missingVars = requiredEnvVars.filter(env => !env.value);

    if (missingVars.length > 0) {
      const missingKeys = missingVars.map(env => env.key).join(', ');
      throw new Error(
        `Missing required Supabase environment variables: ${missingKeys}`
      );
    }

    // URL形式の検証
    if (!this.isValidSupabaseUrl(this.supabaseUrl)) {
      throw new Error(
        'Invalid SUPABASE_URL format. Expected: https://your-project.supabase.co'
      );
    }
  }

  private isValidSupabaseUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname.endsWith('.supabase.co');
    } catch {
      return false;
    }
  }

  get projectId(): string {
    try {
      const url = new URL(this.supabaseUrl);
      return url.hostname.split('.')[0];
    } catch {
      return '';
    }
  }

  get hasValidConfiguration(): boolean {
    return !!(
      this.supabaseUrl &&
      this.supabaseAnonKey &&
      this.supabaseServiceRoleKey
    );
  }

  get connectionInfo(): {
    url: string;
    projectId: string;
    environment: string;
  } {
    return {
      url: this.supabaseUrl,
      projectId: this.projectId,
      environment: this.isProduction ? 'production' : 'development',
    };
  }
}

// 後方互換性のための型エイリアス（段階的に削除予定）
export interface IDatabaseConfig extends ISupabaseConfig {}
export const DatabaseConfig = SupabaseConfig;
