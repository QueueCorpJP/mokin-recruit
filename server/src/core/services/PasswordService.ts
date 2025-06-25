import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { logger } from '@/utils/logger';
import { SecurityConfig } from '@/config/security';
import { IPasswordService } from '@/core/interfaces/IAuthService';
import { requestPasswordReset, updatePassword } from '@/auth/supabaseAuth';
import { TYPES } from '@/container/types';

// パスワード管理サービスの実装 (SRP準拠)
@injectable()
export class PasswordService implements IPasswordService {
  private securityConfig: SecurityConfig;

  constructor(@inject(TYPES.Security) securityConfig?: SecurityConfig) {
    this.securityConfig = securityConfig || new SecurityConfig();
  }

  async hashPassword(password: string): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(
        password,
        this.securityConfig.bcryptRounds
      );
      logger.debug('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      logger.error('Password hashing error:', error);
      throw new Error('Failed to hash password');
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hash);
      logger.debug(`Password verification result: ${isValid}`);
      return isValid;
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
}
