import { z } from 'zod';

export const recentJobSchema = z.object({
  jobHistories: z.array(
    z.object({
      companyName: z.string().min(1, '企業名を入力してください'),
      departmentPosition: z.string().optional(),
      startYear: z.string().min(1, '開始年を入力してください'),
      startMonth: z.string().min(1, '開始月を入力してください'),
      endYear: z.string().optional(),
      endMonth: z.string().optional(),
      isCurrentlyWorking: z.boolean(),
      industries: z.array(z.string()),
      jobTypes: z.array(z.string()),
      jobDescription: z.string().optional(),
    })
  ),
});

export type RecentJobFormData = z.infer<typeof recentJobSchema>;
