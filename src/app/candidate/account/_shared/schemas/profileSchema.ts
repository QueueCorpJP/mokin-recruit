import { z } from 'zod';

// 性別・都道府県・年収などの選択肢は必要に応じてimport/定義

export const profileSchema = z.object({
  gender: z.string().min(1, '性別を選択してください'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  birthYear: z.string().min(1, '生年を選択してください'),
  birthMonth: z.string().min(1, '月を選択してください'),
  birthDay: z.string().min(1, '日を選択してください'),
  phoneNumber: z
    .string()
    .min(10, '電話番号を正しく入力してください')
    .max(15, '電話番号を正しく入力してください'),
  currentIncome: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
