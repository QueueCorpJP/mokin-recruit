import { z } from 'zod';

export const expectationSchema = z.object({
  desiredIncome: z.string().min(1, '希望年収を選択してください'),
  industries: z
    .array(z.string())
    .min(1, '業種を選択してください')
    .max(3, '業種は最大3つまで選択可能です'),
  jobTypes: z
    .array(z.string())
    .min(1, '職種を選択してください')
    .max(3, '職種は最大3つまで選択可能です'),
  workLocations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, '勤務地を選択してください'),
  workStyles: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, '働き方を選択してください'),
});

export type ExpectationFormData = z.infer<typeof expectationSchema>;
