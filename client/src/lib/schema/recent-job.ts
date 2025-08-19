import { z } from 'zod';

// 業種・職種のスキーマ（career-statusと同じ構造）
export const industrySchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const jobTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// 直近の在籍企業フォームのスキーマ
export const recentJobSchema = z
  .object({
    // 企業名
    companyName: z
      .string()
      .min(1, '企業名を入力してください')
      .max(100, '企業名は100文字以内で入力してください'),

    // 部署名・役職名
    department: z
      .string()
      .min(1, '部署名・役職名を入力してください')
      .max(100, '部署名・役職名は100文字以内で入力してください'),

    // 開始年月
    startYear: z.string().min(1, '開始年月を選択してください'),
    startMonth: z.string().min(1, '開始年月を選択してください'),

    // 終了年月
    endYear: z.string().optional(),
    endMonth: z.string().optional(),

    // 在職中フラグ
    isCurrentlyWorking: z.boolean().default(false),

    // 業種（1〜3個選択）
    industries: z
      .array(industrySchema)
      .min(1, '業種を1つ以上選択してください')
      .max(3, '業種は最大3つまで選択可能です'),

    // 職種（1〜3個選択）
    jobTypes: z
      .array(jobTypeSchema)
      .min(1, '職種を1つ以上選択してください')
      .max(3, '職種は最大3つまで選択可能です'),

    // 業務内容
    jobDescription: z
      .string()
      .min(1, '業務内容を入力してください')
      .max(1000, '業務内容は1000文字以内で入力してください'),
  })
  .refine(
    (data) => {
      // 在職中でない場合は終了年月が必須
      if (!data.isCurrentlyWorking) {
        return data.endYear && data.endMonth;
      }
      return true;
    },
    {
      message: '終了年月を選択するか、「在職中」にチェックを入れてください',
      path: ['endYear'],
    },
  )
  .refine(
    (data) => {
      // 開始年月と終了年月の整合性チェック
      if (!data.isCurrentlyWorking && data.endYear && data.endMonth) {
        const startDate = new Date(
          parseInt(data.startYear),
          parseInt(data.startMonth) - 1,
        );
        const endDate = new Date(
          parseInt(data.endYear),
          parseInt(data.endMonth) - 1,
        );
        return endDate >= startDate;
      }
      return true;
    },
    {
      message: '終了年月は開始年月より後の日付を選択してください',
      path: ['endYear'],
    },
  );

export type RecentJobFormData = z.infer<typeof recentJobSchema>;
export type Industry = z.infer<typeof industrySchema>;
export type JobType = z.infer<typeof jobTypeSchema>;
