export type ActionResult<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export function ok<T>(message = 'OK', data?: T): ActionResult<T> {
  const result: ActionResult<T> = { success: true, message };
  if (data !== undefined) {
    result.data = data;
  }
  return result;
}

export function fail(
  message: string,
  errors: Record<string, string[]> = {}
): ActionResult<never> {
  return { success: false, message, errors };
}

export function formDataToObject(formData: FormData): Record<string, any> {
  const obj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
}

export function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseJsonFields<T extends Record<string, any>>(
  obj: T,
  fields: string[]
): T {
  const next: Record<string, any> = { ...obj };
  for (const field of fields) {
    next[field] = safeJsonParse(
      next[field],
      Array.isArray(next[field]) ? [] : next[field] ?? null
    );
  }
  return next as T;
}

export async function runAction<T>(
  fn: () => Promise<T>,
  opts?: { onErrorMessage?: string; logTag?: string }
): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return ok('OK', data);
  } catch (error) {
    if (opts?.logTag) {
      console.error(`[${opts.logTag}] action failed:`, error);
    } else {
      console.error('[action] failed:', error);
    }
    const message =
      error instanceof Error
        ? error.message
        : opts?.onErrorMessage || 'アクションの実行に失敗しました';
    return fail(message);
  }
}
