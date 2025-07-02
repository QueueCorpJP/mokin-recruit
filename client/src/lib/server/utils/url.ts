/**
 * 動的URL取得ユーティリティ
 * Vercel、ローカル、その他の環境を自動判定してベースURLを返す
 */

/**
 * 現在の環境に応じたベースURLを取得
 * 新しいバリデーションシステムを使用
 */
export function getBaseUrl(): string {
  try {
    const {
      getValidatedEnv,
      getDynamicUrls,
    } = require('@/lib/server/config/env-validation');
    const env = getValidatedEnv();
    const urls = getDynamicUrls(env);
    return urls.baseUrl;
  } catch (error) {
    // フォールバック: 従来の方式
    if (process.env.NEXT_PUBLIC_BASE_URL) {
      return process.env.NEXT_PUBLIC_BASE_URL;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NODE_ENV === 'development') {
      const port = process.env.PORT || '3000';
      return `http://localhost:${port}`;
    }
    return process.env.CORS_ORIGIN || 'http://localhost:3000';
  }
}

/**
 * パスワードリセット用のリダイレクトURLを生成
 */
export function getPasswordResetRedirectUrl(): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/auth/reset-password/new`;
}

/**
 * 認証関連のリダイレクトURLを生成
 */
export function getAuthRedirectUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * 環境情報を取得（デバッグ用）
 */
export function getEnvironmentInfo() {
  return {
    baseUrl: getBaseUrl(),
    isVercel: !!process.env.VERCEL_URL,
    isDevelopment: process.env.NODE_ENV === 'development',
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    corsOrigin: process.env.CORS_ORIGIN,
    nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  };
}
