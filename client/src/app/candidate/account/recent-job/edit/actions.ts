'use server';

import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';

export async function getRecentJobData() {
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
      jobHistories: [
        {
          companyName: candidateData.recent_job_company_name || '',
          departmentPosition: candidateData.recent_job_department_position || '',
          startYear: candidateData.recent_job_start_year || '',
          startMonth: candidateData.recent_job_start_month || '',
          endYear: candidateData.recent_job_end_year || '',
          endMonth: candidateData.recent_job_end_month || '',
          isCurrentlyWorking: candidateData.recent_job_is_currently_working || false,
          industries: Array.isArray(candidateData.recent_job_industries) 
            ? candidateData.recent_job_industries 
            : [],
          jobTypes: Array.isArray(candidateData.recent_job_types) 
            ? candidateData.recent_job_types 
            : [],
          jobDescription: candidateData.recent_job_description || '',
        },
      ],
    };
  } catch (error) {
    console.error('職務経歴データの取得に失敗しました:', error);
    return null;
  }
}