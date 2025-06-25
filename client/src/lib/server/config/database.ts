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
    // 必須環境変数の取得
    this.supabaseUrl = process.env.SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
    this.supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    // 環境判定
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';

    // 必須チェック
    this.validateConfiguration();
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
