import { z } from 'zod';

export const profileSchema = z
  .object({
    lastName: z
      .string()
      .min(1, '姓を入力してください')
      .max(50, '姓は50文字以内で入力してください'),

    firstName: z
      .string()
      .min(1, '名を入力してください')
      .max(50, '名は50文字以内で入力してください'),

    lastNameKana: z
      .string()
      .min(1, 'セイを入力してください')
      .max(50, 'セイは50文字以内で入力してください')
      .regex(/^[ァ-ヶー　]+$/, '全角カタカナで入力してください'),

    firstNameKana: z
      .string()
      .min(1, 'メイを入力してください')
      .max(50, 'メイは50文字以内で入力してください')
      .regex(/^[ァ-ヶー　]+$/, '全角カタカナで入力してください'),

    gender: z.enum(['male', 'female', 'unspecified'], {
      errorMap: () => ({ message: '性別を選択してください' }),
    }),

    prefecture: z.string().min(1, '現在の住まいを選択してください'),

    birthYear: z.string().min(1, '生年月日を選択してください'),

    birthMonth: z.string().min(1, '生年月日を選択してください'),

    birthDay: z.string().min(1, '生年月日を選択してください'),

    phoneNumber: z
      .string()
      .min(1, '電話番号を入力してください')
      .regex(
        /^\d{10,11}$/,
        '電話番号は10桁または11桁の半角数字のみで入力してください',
      ),

    currentIncome: z.string().min(1, '現在の年収を選択してください'),
  })
  .refine(
    (data) => {
      // 年月日が全て選択されているかチェック
      if (!data.birthYear || !data.birthMonth || !data.birthDay) {
        return false;
      }

      // 有効な日付かチェック
      const year = parseInt(data.birthYear);
      const month = parseInt(data.birthMonth);
      const day = parseInt(data.birthDay);
      const date = new Date(year, month - 1, day);

      return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
      );
    },
    {
      message: '有効な生年月日を選択してください',
      path: ['birthDay'],
    },
  );

export type ProfileFormData = z.infer<typeof profileSchema>;
