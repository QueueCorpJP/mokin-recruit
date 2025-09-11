import { z } from 'zod';

export const skillsSchema = z.object({
  englishLevel: z.string().optional(),
  otherLanguages: z.array(
    z.object({
      language: z.string().optional(),
      level: z.string().optional(),
    })
  ),
  skills: z.array(z.string()),
  qualifications: z.string().optional(),
});

export type SkillsFormData = z.infer<typeof skillsSchema>;
