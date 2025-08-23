'use server';

import { requireCandidateAuth } from '@/lib/auth/server';
import { getSkillsData as getSkillsFromDB } from '@/lib/server/candidate/candidateData';

export async function getSkillsData() {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      throw new Error('認証が必要です');
    }

    const skillsData = await getSkillsFromDB(user.id);
    if (!skillsData) {
      return null;
    }

    return {
      englishLevel: skillsData.english_level || '',
      otherLanguages: Array.isArray(skillsData.other_languages) 
        ? skillsData.other_languages 
        : [],
      skills: Array.isArray(skillsData.skills_list) 
        ? skillsData.skills_list 
        : [],
      qualifications: skillsData.qualifications || '',
    };
  } catch (error) {
    console.error('スキルデータの取得に失敗しました:', error);
    return null;
  }
}