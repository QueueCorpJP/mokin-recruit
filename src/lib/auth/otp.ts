import * as crypto from 'crypto';
import { logger } from '@/lib/server/utils/logger';

export interface OtpData {
  code: string;
  email: string;
  expiresAt: Date;
  type: 'signup' | 'login' | 'password-reset';
}

export interface OtpResult {
  success: boolean;
  error?: string;
}

/**
 * 6桁のOTPコードを生成
 * @returns 6桁の数字文字列
 */
export function generateOtp(): string {
  // 000000-999999の6桁数字をランダム生成
  const otp = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return otp;
}

/**
 * OTPの有効期限を生成（10分後）
 * @returns 有効期限のDate
 */
export function generateOtpExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10); // 10分後
  return expiry;
}

/**
 * OTPが有効かどうかをチェック
 * @param expiresAt OTPの有効期限
 * @returns 有効かどうか
 */
export function isOtpValid(expiresAt: Date): boolean {
  return new Date() < expiresAt;
}

/**
 * OTPコードと有効期限をセットで生成
 * @param email メールアドレス
 * @param type OTPタイプ
 * @returns OTPデータ
 */
export function createOtpData(
  email: string,
  type: 'signup' | 'login' | 'password-reset' = 'signup'
): OtpData {
  const code = generateOtp();
  const expiresAt = generateOtpExpiry();

  logger.info('OTP generated', {
    email: email.substring(0, 3) + '***',
    type,
    expiresAt: expiresAt.toISOString(),
  });

  return {
    code,
    email,
    expiresAt,
    type,
  };
}

/**
 * 入力されたOTPコードを検証
 * @param inputCode ユーザーが入力したコード
 * @param storedCode 保存されているコード
 * @param expiresAt 有効期限
 * @returns 検証結果
 */
export function verifyOtp(
  inputCode: string,
  storedCode: string,
  expiresAt: Date
): OtpResult {
  try {
    // コードの前後の空白を除去
    const cleanInputCode = inputCode.trim();
    const cleanStoredCode = storedCode.trim();

    // 有効期限チェック
    if (!isOtpValid(expiresAt)) {
      logger.warn('OTP verification failed: expired', {
        expiresAt: expiresAt.toISOString(),
        now: new Date().toISOString(),
      });
      return {
        success: false,
        error:
          '認証コードの有効期限が切れています。新しいコードを取得してください。',
      };
    }

    // コードの一致チェック
    if (cleanInputCode !== cleanStoredCode) {
      logger.warn('OTP verification failed: code mismatch');
      return {
        success: false,
        error: '認証コードが正しくありません。',
      };
    }

    logger.info('OTP verification successful');
    return {
      success: true,
    };
  } catch (error) {
    logger.error('OTP verification error:', error);
    return {
      success: false,
      error: '認証コードの検証中にエラーが発生しました。',
    };
  }
}
