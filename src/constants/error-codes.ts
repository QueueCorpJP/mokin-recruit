/**
 * エラーコード体系定義
 * 形式: CATEGORY_CODE (例: AUTH_001, DB_002)
 */

export const ERROR_CODES = {
  // 認証関連エラー (AUTH_001-AUTH_099)
  AUTH_001: '認証失敗',
  AUTH_002: '無効なトークン',
  AUTH_003: 'トークン有効期限切れ',
  AUTH_004: '無効な認証情報',
  AUTH_005: 'アカウントがロックされています',
  AUTH_006: 'メールアドレス未確認',
  AUTH_007: 'パスワードリセット失敗',
  AUTH_008: 'セッション有効期限切れ',
  AUTH_009: '無効なユーザー種別',

  // データベース関連エラー (DB_001-DB_099)
  DB_001: 'データベース接続エラー',
  DB_002: 'レコード未発見',
  DB_003: '重複データエラー',
  DB_004: 'データ挿入失敗',
  DB_005: 'データ更新失敗',
  DB_006: 'データ削除失敗',
  DB_007: 'クエリ実行エラー',
  DB_008: 'トランザクション失敗',

  // バリデーション関連エラー (VALIDATION_001-VALIDATION_099)
  VALIDATION_001: '必須フィールドが入力されていません',
  VALIDATION_002: '無効なメールアドレス形式',
  VALIDATION_003: 'パスワードが要件を満たしていません',
  VALIDATION_004: '無効な電話番号形式',
  VALIDATION_005: '無効な日付形式',
  VALIDATION_006: '数値が範囲外です',
  VALIDATION_007: '文字列が長すぎます',
  VALIDATION_008: '無効な選択値',
  VALIDATION_009: 'ファイルサイズが大きすぎます',

  // API関連エラー (API_001-API_099)
  API_001: 'API呼び出し失敗',
  API_002: 'ネットワーク接続エラー',
  API_003: 'APIタイムアウト',
  API_004: '無効なAPIレスポンス',
  API_005: 'APIレート制限超過',
  API_006: 'API認証失敗',
  API_007: 'API権限不足',
  API_008: 'APIサーバーエラー',

  // ファイル関連エラー (FILE_001-FILE_099)
  FILE_001: 'ファイルアップロード失敗',
  FILE_002: '無効なファイル形式',
  FILE_003: 'ファイルサイズ超過',
  FILE_004: 'ファイル保存失敗',
  FILE_005: 'ファイル削除失敗',
  FILE_006: 'ファイルが見つかりません',

  // システム関連エラー (SYSTEM_001-SYSTEM_099)
  SYSTEM_001: 'システム内部エラー',
  SYSTEM_002: '設定ファイル読み込みエラー',
  SYSTEM_003: 'メモリ不足',
  SYSTEM_004: 'タイムアウト',
  SYSTEM_005: 'サービス利用不可',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

/**
 * エラーコードからメッセージを取得する関数
 * @param code エラーコード
 * @returns エラーメッセージ
 */
export function getErrorMessage(code: ErrorCode): string {
  return ERROR_CODES[code] || '不明なエラー';
}

/**
 * エラーオブジェクトを生成する関数
 * @param code エラーコード
 * @param customMessage カスタムメッセージ（オプション）
 * @param details 詳細情報（オプション）
 * @returns エラーオブジェクト
 */
export function createError(
  code: ErrorCode,
  customMessage?: string,
  details?: Record<string, any>
) {
  return {
    success: false,
    code,
    message: customMessage || getErrorMessage(code),
    details
  };
}

/**
 * エラーコードのカテゴリを取得する関数
 * @param code エラーコード
 * @returns カテゴリ
 */
export function getErrorCategory(code: ErrorCode): string {
  return code.split('_')[0];
}
