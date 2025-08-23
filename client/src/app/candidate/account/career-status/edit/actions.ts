'use server';

import { requireCandidateAuth } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';

export async function getCareerStatusData() {
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
      transferDesiredTime: candidateData.job_change_timing || '',
      currentActivityStatus: candidateData.current_activity_status || '',
      selectionCompanies: [],
    };
  } catch (error) {
    console.error('キャリアステータスデータの取得に失敗しました:', error);
    return null;
  }
}