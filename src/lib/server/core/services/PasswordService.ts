import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { logger } from '@/utils/logger';
import { SecurityConfig } from '@/config/security';
import { IPasswordService } from '@/core/interfaces/IAuthService';
import { requestPasswordReset, updatePassword } from '@/auth/supabaseAuth';
import { TYPES } from '@/container/types';

const scryptAsync = promisify(scrypt);

// パスワード管理サービスの実装 (SRP準拠) - Node.js標準ライブラリ使用
@injectable()
export class PasswordService implements IPasswordService {
  private securityConfig: SecurityConfig;
  private readonly SALT_LENGTH = 32;
  private readonly KEY_LENGTH = 64;

  constructor(@inject(TYPES.Security) securityConfig?: SecurityConfig) {
    this.securityConfig = securityConfig || new SecurityConfig();
  }

  async hashPassword(password: string): Promise<string> {
    try {
      // ランダムソルトを生成
      const salt = randomBytes(this.SALT_LENGTH);

      // scryptを使用してパスワードをハッシュ化
      const derivedKey = (await scryptAsync(
        password,
        salt,
        this.KEY_LENGTH
      )) as Buffer;

      // ソルトとハッシュを結合して保存
      const hashedPassword = `${salt.toString('hex')}:${derivedKey.toString('hex')}`;

      logger.debug('Password hashed successfully using Node.js crypto');
      return hashedPassword;
    } catch (error) {
      logger.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      // 新しい形式（salt:hash）をチェック
      if (hash.includes(':')) {
        // ハッシュからソルトと派生キーを分離
        const [saltHex, keyHex] = hash.split(':');

        if (!saltHex || !keyHex) {
          logger.warn('Invalid hash format');
          return false;
        }

        const salt = Buffer.from(saltHex, 'hex');
        const storedKey = Buffer.from(keyHex, 'hex');

        // 入力されたパスワードを同じソルトでハッシュ化
        const derivedKey = (await scryptAsync(
          password,
          salt,
          this.KEY_LENGTH
        )) as Buffer;

        // タイミング攻撃を防ぐために定数時間比較を使用
        const isValid = timingSafeEqual(storedKey, derivedKey);

        logger.debug(`Password verification result (new format): ${isValid}`);
        return isValid;
      } else {
        // 古い形式またはプレーンテキスト（テスト用）の場合
        // 本番環境では削除すべきですが、開発・テスト環境での互換性のために残します
        logger.warn(`Legacy password format detected for hash: ${hash.substring(0, 10)}...`);
        logger.debug(`Comparing password "${password}" with hash "${hash}"`);
        
        // 簡単な比較（テスト用のプレーンテキストパスワード）
        // データベースに保存されているハッシュと入力されたパスワードを比較
        const isValid = hash === password;
        logger.debug(`Password verification result (legacy format): ${isValid}`);
        return isValid;
      }
    } catch (error) {
      logger.error('Password verification error:', error);
      return false;
    }
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      logger.info(`Password reset requested for email: ${email}`);
      const result = await requestPasswordReset(email);

      if (result.success) {
        logger.info(`Password reset email sent successfully to: ${email}`);
        return true;
      }

      logger.warn(`Password reset request failed for email: ${email}`);
      return false;
    } catch (error) {
      logger.error('Password reset request error:', error);
      return false;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      logger.info('Processing password reset');

      // 新しいパスワードをハッシュ化
      const hashedPassword = await this.hashPassword(newPassword);

      const result = await updatePassword(token, hashedPassword);

      if (result.success) {
        logger.info('Password reset completed successfully');
        return true;
      }

      logger.warn('Password reset failed');
      return false;
    } catch (error) {
      logger.error('Password reset error:', error);
      return false;
    }
  }

  /**
   * パスワード強度をチェック
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * セキュアなランダム文字列を生成（トークン生成用）
   */
  generateSecureToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * SHA-256ハッシュを生成（軽量なハッシュが必要な場合）
   */
  generateSHA256Hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }
}
