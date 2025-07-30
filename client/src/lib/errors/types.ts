// エラーの種類を定義
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

// 基本エラーインターface
export interface BaseError {
  type: ErrorType;
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

// API エラーレスポンス
export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  code?: string;
  details?: any;
}

// API 成功レスポンス
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

// API レスポンスの型
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

// カスタムエラークラス
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly status?: number;
  public readonly details?: any;

  constructor(
    type: ErrorType,
    message: string,
    options: {
      code?: string;
      status?: number;
      details?: any;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = options.code;
    this.status = options.status;
    this.details = options.details;
    
    if (options.cause) {
      this.cause = options.cause;
    }
  }
}

// ネットワークエラー
export class NetworkError extends AppError {
  constructor(message: string = 'ネットワークエラーが発生しました', cause?: Error) {
    super(ErrorType.NETWORK, message, { cause });
  }
}

// 認証エラー
export class AuthenticationError extends AppError {
  constructor(message: string = '認証が必要です', status: number = 401) {
    super(ErrorType.AUTHENTICATION, message, { status });
  }
}

// 認可エラー
export class AuthorizationError extends AppError {
  constructor(message: string = 'アクセス権限がありません', status: number = 403) {
    super(ErrorType.AUTHORIZATION, message, { status });
  }
}

// バリデーションエラー
export class ValidationError extends AppError {
  constructor(message: string = '入力内容に問題があります', details?: any) {
    super(ErrorType.VALIDATION, message, { status: 400, details });
  }
}

// 404エラー
export class NotFoundError extends AppError {
  constructor(message: string = '指定されたリソースが見つかりません') {
    super(ErrorType.NOT_FOUND, message, { status: 404 });
  }
}

// サーバーエラー
export class ServerError extends AppError {
  constructor(message: string = 'サーバーエラーが発生しました', status: number = 500) {
    super(ErrorType.SERVER, message, { status });
  }
}