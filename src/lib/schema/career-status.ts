import { z } from 'zod';

// 業種の選択エントリー
export const industrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

// 選考状況エントリー
export const selectionEntrySchema = z.object({
  id: z.string(),
  isPrivate: z.boolean().default(false),
  industries: z
    .array(z.string())
    .min(1, {
      message: '業種を1つ以上選択してください',
    })
    .max(3, {
      message: '業種は最大3つまで選択可能です',
    }),
  companyName: z
    .string()
    .min(1, { message: '企業名を入力してください' })
    .max(100, { message: '企業名は100文字以内で入力してください' }),
  department: z
    .string()
    .min(1, { message: '部署名・役職名を入力してください' })
    .max(100, { message: '部署名・役職名は100文字以内で入力してください' }),
  progressStatus: z.string().min(1, { message: '進捗状況を選択してください' }),
  declineReason: z.string().optional(),
});

// メインのフォームスキーマ
export const careerStatusSchema = z
  .object({
    // 転職経験
    hasCareerChange: z.enum(['yes', 'no'], {
      required_error: '転職経験を選択してください',
      invalid_type_error: '転職経験を選択してください',
    }),
    // 転職希望時期
    jobChangeTiming: z.string().min(1, {
      message: '転職希望時期を選択してください',
    }),
    // 現在の活動状況
    currentActivityStatus: z.string().min(1, {
      message: '現在の活動状況を選択してください',
    }),
    // 選考状況エントリー
    selectionEntries: z.array(selectionEntrySchema),
  })
  .refine(
    (data) => {
      // 「まだ始めていない」「情報収集中」以外の場合は最低1件の選考状況が必要
      if (
        data.currentActivityStatus !== 'not_started' &&
        data.currentActivityStatus !== 'researching'
      ) {
        return data.selectionEntries.length > 0;
      }
      return true;
    },
    {
      message: '選考状況を1件以上入力してください',
      path: ['selectionEntries'],
    },
  )
  .refine(
    (data) => {
      // 進捗状況が「辞退」の場合は辞退理由が必須
      return data.selectionEntries.every((entry) => {
        if (entry.progressStatus === 'declined') {
          return entry.declineReason && entry.declineReason.length > 0;
        }
        return true;
      });
    },
    {
      message: '進捗状況が「辞退」の場合は辞退理由を選択してください',
      path: ['selectionEntries'],
    },
  );

export type CareerStatusFormData = z.infer<typeof careerStatusSchema>;
export type SelectionEntry = z.infer<typeof selectionEntrySchema>;
export type Industry = z.infer<typeof industrySchema>;
