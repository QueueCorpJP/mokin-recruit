import {
  AppError,
  ErrorType,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ServerError,
} from './types';

import type { ApiResponse } from './types';

/**
 * HTTPステータスコードからエラータイプを判定
 */
export const getErrorTypeFromStatus = (status: number): ErrorType => {
  if (status === 401) return ErrorType.AUTHENTICATION;
  if (status === 403) return ErrorType.AUTHORIZATION;
  if (status === 404) return ErrorType.NOT_FOUND;
  if (status >= 400 && status < 500) return ErrorType.VALIDATION;
  if (status >= 500) return ErrorType.SERVER;
  return ErrorType.UNKNOWN;
};

/**
 * Fetchエラーを適切なAppErrorに変換
 */
export const createErrorFromResponse = async (response: Response): Promise<AppError> => {
  let errorData: any = {};
  
  try {
    const text = await response.text();
    if (text) {
      errorData = JSON.parse(text);
    }
  } catch {
    // JSONパースに失敗した場合は空オブジェクトのまま
  }

  const message = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
  const code = errorData.code;
  const details = errorData.details;

  switch (response.status) {
    case 401:
      return new AuthenticationError(message, response.status);
    case 403:
      return new AuthorizationError(message, response.status);
    case 404:
      return new NotFoundError(message);
    case 400:
    case 422:
      return new ValidationError(message, details);
    default:
      if (response.status >= 500) {
        return new ServerError(message, response.status);
      }
      return new AppError(
        getErrorTypeFromStatus(response.status),
        message,
        { status: response.status, code, details }
      );
  }
};

/**
 * ネットワークエラーやその他の例外をAppErrorに変換
 */
export const createErrorFromException = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    // ネットワークエラーの判定
    if (
      error.name === 'TypeError' && 
      error.message.includes('fetch')
    ) {
      return new NetworkError('ネットワーク接続に問題があります', error);
    }

    if (error.name === 'AbortError') {
      return new NetworkError('リクエストがタイムアウトしました', error);
    }

    return new AppError(ErrorType.UNKNOWN, error.message, { cause: error });
  }

  return new AppError(ErrorType.UNKNOWN, '予期しないエラーが発生しました');
};

/**
 * ユーザーフレンドリーなエラーメッセージを生成
 */
export const getUserFriendlyMessage = (error: AppError): string => {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'インターネット接続を確認してください';
    case ErrorType.AUTHENTICATION:
      return 'ログインが必要です';
    case ErrorType.AUTHORIZATION:
      return 'この操作を行う権限がありません';
    case ErrorType.VALIDATION:
      return error.message || '入力内容を確認してください';
    case ErrorType.NOT_FOUND:
      return '指定された情報が見つかりません';
    case ErrorType.SERVER:
      return 'サーバーに問題が発生しています。しばらく後に再度お試しください';
    default:
      return error.message || '予期しないエラーが発生しました';
  }
};

/**
 * エラーをログに記録
 */
export const logError = (error: AppError, context?: string) => {
  const logData = {
    type: error.type,
    message: error.message,
    code: error.code,
    status: error.status,
    details: error.details,
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack,
  };

  if (process.env.NODE_ENV === 'development') {
    if (process.env.NODE_ENV === 'development') console.error('App Error:', logData);
  } else {
    // 本番環境では外部ログサービスに送信
    // 例: Sentry, LogRocket, など
    if (process.env.NODE_ENV === 'development') console.error('App Error:', {
      type: error.type,
      message: error.message,
      context,
    });
  }
};

/**
 * API レスポンスの型ガード
 */
export const isApiError = (response: ApiResponse): response is { success: false; error: string } => {
  return response.success === false;
};

export const isApiSuccess = <T>(response: ApiResponse<T>): response is { success: true; data: T } => {
  return response.success === true;
};