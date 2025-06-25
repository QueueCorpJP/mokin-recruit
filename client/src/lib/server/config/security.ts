// セキュリティ設定インターフェース
export interface ISecurityConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
  sessionSecret: string;
}

// セキュリティ設定クラス (SRP準拠)
export class SecurityConfig implements ISecurityConfig {
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly bcryptRounds: number;
  readonly sessionSecret: string;

  constructor() {
    // セキュリティ関連の環境変数取得
    this.jwtSecret = process.env.JWT_SECRET || this.generateDefaultSecret();
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    this.sessionSecret =
      process.env.SESSION_SECRET || this.generateDefaultSecret();

    // 本番環境でのデフォルト値警告
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.JWT_SECRET) {
        console.warn('⚠️  JWT_SECRET not set in production environment');
      }
      if (!process.env.SESSION_SECRET) {
        console.warn('⚠️  SESSION_SECRET not set in production environment');
      }
    }
  }

  private generateDefaultSecret(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  get isSecure(): boolean {
    return this.jwtSecret.length >= 32 && this.sessionSecret.length >= 32;
  }
}
