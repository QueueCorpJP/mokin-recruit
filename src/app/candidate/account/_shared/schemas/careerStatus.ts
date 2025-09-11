import { z } from 'zod';

export const careerStatusSchema = z.object({
  transferDesiredTime: z.string().min(1, '転職希望時期を選択してください'),
  currentActivityStatus: z.string().min(1, '現在の活動状況を選択してください'),
  selectionCompanies: z.array(
    z.object({
      privacyScope: z.string(),
      isPrivate: z.boolean(),
      industries: z.array(z.string()),
      companyName: z.string(),
      department: z.string(),
      progressStatus: z.string(),
      declineReason: z.string(),
    })
  ),
});

export type CareerStatusFormData = z.infer<typeof careerStatusSchema>;
