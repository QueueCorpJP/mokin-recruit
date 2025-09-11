import { z } from 'zod';

export const educationSchema = z.object({
  finalEducation: z.string().min(1, '最終学歴を選択してください。'),
  schoolName: z.string().min(1, '学校名を入力してください。'),
  department: z.string().min(1, '学部学科専攻を入力してください。'),
  graduationYear: z.string().min(1, '卒業年月を選択してください。'),
  graduationMonth: z.string().min(1, '卒業年月を選択してください。'),
  industries: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        experienceYears: z.string().optional(),
      })
    )
    .min(1, '業種を1つ以上選択してください。')
    .max(3)
    .refine(
      items =>
        items.every(
          item => item.experienceYears && item.experienceYears !== ''
        ),
      '経験年数を選択してください。'
    ),
  jobTypes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        experienceYears: z.string().optional(),
      })
    )
    .min(1, '職種を1つ以上選択してください。')
    .max(3)
    .refine(
      items =>
        items.every(
          item => item.experienceYears && item.experienceYears !== ''
        ),
      '経験年数を選択してください。'
    ),
});

export type EducationFormData = z.infer<typeof educationSchema>;
