/**
 * 動的URL取得ユーティリティ
 * Vercel、ローカル、その他の環境を自動判定してベースURLを返す
 */

/**
 * 現在の環境に応じたベースURLを取得（シンプル・確実性重視）
 */
export function getBaseUrl(): string {
  // 優先順位に基づいた環境変数チェック

  // 1. 明示的に設定されたベースURL
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 2. Vercel環境での自動検出
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. 開発環境（3000ポート固定）
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 4. CORS設定からの取得
  if (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN !== '*') {
    return process.env.CORS_ORIGIN;
  }

  // 5. フォールバック（本番環境でのデフォルト）
  return 'https://mokin-recruit-client.vercel.app';
}

/**
 * パスワードリセット用のリダイレクトURLを生成
 */
export function getPasswordResetRedirectUrl(): string {
  const baseUrl = getBaseUrl();
  const resetPath = '/auth/reset-password/new';

  // URLの正規化
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const fullUrl = `${normalizedBaseUrl}${resetPath}`;

  // 開発環境でのデバッグログ
  if (process.env.NODE_ENV === 'development') {
    console.log('Password reset redirect URL generated:', {
      baseUrl: normalizedBaseUrl,
      resetPath,
      fullUrl,
    });
  }

  return fullUrl;
}

/**
 * 認証関連のリダイレクトURLを生成
 */
export function getAuthRedirectUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedBaseUrl = baseUrl.endsWith('/')
    ? baseUrl.slice(0, -1)
    : baseUrl;

  return `${normalizedBaseUrl}${normalizedPath}`;
}

/**
 * CORS用のオリジンを取得
 */
export function getCorsOrigin(): string {
  // 明示的に設定されたCORS origin
  if (process.env.CORS_ORIGIN) {
    return process.env.CORS_ORIGIN;
  }

  // 開発環境では全てのオリジンを許可
  if (process.env.NODE_ENV === 'development') {
    return '*';
  }

  // 本番環境ではベースURLを使用
  return getBaseUrl();
}

/**
 * 環境情報を取得（デバッグ用・簡素化版）
 */
export function getEnvironmentInfo() {
  const baseUrl = getBaseUrl();

  return {
    baseUrl,
    isVercel: !!process.env.VERCEL_URL,
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    nodeEnv: process.env.NODE_ENV,
    vercelUrl: process.env.VERCEL_URL,
    corsOrigin: process.env.CORS_ORIGIN,
    nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  };
}
