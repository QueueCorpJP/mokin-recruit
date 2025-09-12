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
  formData: FormData,
  options?: {
    // zod検証前にFormData->Objectへ変換した後の前処理を差し込むための変換関数
    transform?: (obj: Record<string, any>) => Record<string, any>;
  }
): Promise<
  | { success: true; data: ReturnType<T['parse']> }
  | { success: false; errors: Record<string, string[]>; message: string }
> {
  // FormDataをオブジェクトに変換
  let obj: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }

  // 事前変換（JSONフィールドのパース等）
  if (options?.transform) {
    try {
      obj = options.transform(obj);
    } catch (e) {
      // 変換で致命的エラーが出た場合はそのままzodへ（zodが適切にエラー化）
    }
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
