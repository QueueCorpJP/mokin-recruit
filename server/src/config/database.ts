// データベース設定インターフェース
export interface IDatabaseConfig {
  url: string;
  directUrl?: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
}

// データベース設定クラス (SRP準拠)
export class DatabaseConfig implements IDatabaseConfig {
  readonly url: string;
  readonly directUrl?: string;
  readonly supabaseUrl: string;
  readonly supabaseAnonKey: string;
  readonly supabaseServiceRoleKey?: string;

  constructor() {
    // 開発環境用のデフォルト値を提供
    this.url =
      process.env.DATABASE_URL ||
      'postgresql://localhost:5432/mokin_recruit_dev';
    this.directUrl = process.env.DIRECT_URL;
    this.supabaseUrl =
      process.env.SUPABASE_URL || 'https://your-project.supabase.co';
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
    this.supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // 本番環境では必須チェックを実行
    if (process.env.NODE_ENV === 'production') {
      const requiredEnvVars = [
        'DATABASE_URL',
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
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
  }

  get hasServiceRoleKey(): boolean {
    return !!this.supabaseServiceRoleKey;
  }

  get isPoolerConnection(): boolean {
    return this.url.includes('pooler.supabase.com');
  }
}
