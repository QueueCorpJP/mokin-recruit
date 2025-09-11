import { ZodSchema, ZodError, ZodTypeAny } from 'zod';

/**
 * FormDataをzodスキーマでバリデーションし、型変換・エラーflattenを返す共通ユーティリティ
 * - 成功時: { success: true, data }
 * - 失敗時: { success: false, errors, message }
 *
 * @param schema zodスキーマ
 * @param formData FormData
 */
export async function validateFormDataWithZod<T extends ZodTypeAny>(
  schema: T,
  formData: FormData
): Promise<
  | { success: true; data: ReturnType<T['parse']> }
  | { success: false; errors: Record<string, string[]>; message: string }
> {
  // FormDataをオブジェクトに変換
  const obj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }

  // zodでバリデーション
  const result = schema.safeParse(obj);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // エラーをflattenして返却
    const errors = result.error.flatten().fieldErrors;
    return {
      success: false,
      errors,
      message: 'バリデーションエラーがあります',
    };
  }
}
