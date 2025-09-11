import { z } from 'zod';

// 職務要約フォームのバリデーションスキーマ
// - jobSummary: 職務要約（必須、最大1000文字）
// - selfPr: 自己PR（任意、最大1000文字）
export const summarySchema = z.object({
  jobSummary: z
    .string()
    .min(1, '職務要約を入力してください')
    .max(1000, '職務要約は1000文字以内で入力してください'),
  selfPr: z
    .string()
    .max(1000, '自己PRは1000文字以内で入力してください')
    .optional(),
});

// 型定義も同時にエクスポート（zodの型推論を活用）
export type SummaryFormData = z.infer<typeof summarySchema>;
