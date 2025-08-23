'use server';

import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';

export async function getExpectationData() {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      throw new Error('認証が必要です');
    }

    const candidateData = await getCandidateData(user.id);
    if (!candidateData) {
      return null;
    }

    return {
      desiredIncome: candidateData.desired_salary || '',
      industries: Array.isArray(candidateData.desired_industries) 
        ? candidateData.desired_industries 
        : [],
      jobTypes: Array.isArray(candidateData.desired_job_types) 
        ? candidateData.desired_job_types 
        : [],
      workLocations: Array.isArray(candidateData.desired_locations) 
        ? candidateData.desired_locations 
        : [],
      workStyles: Array.isArray(candidateData.interested_work_styles) 
        ? candidateData.interested_work_styles 
        : [],
    };
  } catch (error) {
    console.error('希望条件データの取得に失敗しました:', error);
    return null;
  }
}