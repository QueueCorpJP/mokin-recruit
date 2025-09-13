/**
 * PII (個人情報) を安全にログ出力するためのユーティリティ
 */

/**
 * メールアドレスをマスクする関数
 * @param email マスクするメールアドレス
 * @returns マスクされたメールアドレス
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string') return '[INVALID_EMAIL]';

  const [local, domain] = email.split('@');
  if (!domain) return '[INVALID_EMAIL]';

  const maskedLocal = local.length <= 2
    ? '*'.repeat(local.length)
    : local.slice(0, 2) + '*'.repeat(local.length - 2);

  return `${maskedLocal}@${domain}`;
}

/**
 * パスワードをマスクする関数
 * @param password マスクするパスワード
 * @returns マスクされたパスワード
 */
export function maskPassword(password: string): string {
  if (!password) return '[EMPTY_PASSWORD]';
  return `[${password.length}文字]`;
}

/**
 * ユーザーIDをマスクする関数
 * @param userId マスクするユーザーID
 * @returns マスクされたユーザーID
 */
export function maskUserId(userId: string): string {
  if (!userId) return '[EMPTY_USER_ID]';
  if (userId.length <= 4) return '*'.repeat(userId.length);
  return userId.slice(0, 4) + '*'.repeat(userId.length - 4);
}

/**
 * 電話番号をマスクする関数
 * @param phone 電話番号
 * @returns マスクされた電話番号
 */
export function maskPhone(phone: string): string {
  if (!phone) return '[EMPTY_PHONE]';
  if (phone.length <= 4) return '*'.repeat(phone.length);
  return '*'.repeat(phone.length - 4) + phone.slice(-4);
}

/**
 * オブジェクト内のPIIフィールドをマスクする関数
 * @param obj マスク対象のオブジェクト
 * @param fields マスクするフィールド名の配列
 * @returns マスクされたオブジェクト
 */
export function maskObjectPII<T extends Record<string, any>>(
  obj: T,
  fields: string[]
): T {
  if (!obj || typeof obj !== 'object') return obj;

  const masked = { ...obj };

  for (const field of fields) {
    if (field in masked) {
      const value = masked[field];
      if (typeof value === 'string') {
        switch (field.toLowerCase()) {
          case 'email':
            masked[field] = maskEmail(value);
            break;
          case 'password':
            masked[field] = maskPassword(value);
            break;
          case 'phone':
          case 'phonenumber':
            masked[field] = maskPhone(value);
            break;
          case 'userid':
          case 'id':
            if (field.toLowerCase() === 'userid' || field === 'id') {
              masked[field] = maskUserId(value);
            }
            break;
          default:
            masked[field] = `[${field.toUpperCase()}_MASKED]`;
        }
      }
    }
  }

  return masked;
}

/**
 * PII安全なログ出力関数
 * @param level ログレベル
 * @param message ログメッセージ
 * @param data ログデータ（自動的にPIIがマスクされる）
 */
export function safeLog(
  level: 'info' | 'error' | 'warn' | 'debug',
  message: string,
  data?: any
): void {
  const maskedData = data ? maskObjectPII(data, ['email', 'password', 'phone', 'phoneNumber', 'userId', 'id']) : undefined;

  switch (level) {
    case 'info':
      if (process.env.NODE_ENV === 'development') console.log(`ℹ️ ${message}`, maskedData || '');
      break;
    case 'error':
      if (process.env.NODE_ENV === 'development') console.error(`❌ ${message}`, maskedData || '');
      break;
    case 'warn':
      if (process.env.NODE_ENV === 'development') console.warn(`⚠️ ${message}`, maskedData || '');
      break;
    case 'debug':
      if (process.env.NODE_ENV === 'development') console.log(`🔍 ${message}`, maskedData || '');
      break;
  }
}

/**
 * エラーログ出力関数（スタックトレース付き）
 * @param message エラーメッセージ
 * @param error Errorオブジェクト
 * @param context 追加コンテキスト
 */
export function safeErrorLog(
  message: string,
  error: Error | unknown,
  context?: Record<string, any>
): void {
  const maskedContext = context ? maskObjectPII(context, ['email', 'password', 'phone', 'phoneNumber', 'userId']) : undefined;

  if (process.env.NODE_ENV === 'development') console.error(`❌ ${message}`, {
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...maskedContext
  });
}
