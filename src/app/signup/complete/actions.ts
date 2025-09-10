'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';

export interface AutoLoginResult {
  success: boolean;
  error?: string;
}

export async function autoLoginAction(): Promise<AutoLoginResult> {
  try {
    logger.info('Auto-login action called - but password-based auto-login is disabled for security');
    
    // パスワードベースの自動ログインは廃止
    // ユーザーは通常のログインフローを使用する
    return {
      success: false,
      error: 'セキュリティ上の理由により、ログインページからログインしてください。'
    };

  } catch (error) {
    logger.error('Auto-login error:', error);
    return {
      success: false,
      error: 'ログインに失敗しました'
    };
  }
}