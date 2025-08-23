'use server';

import { requireCandidateAuth, requireCandidateAuthForAction } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function getSummaryData() {
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
      jobSummary: candidateData.job_summary || '',
      selfPr: candidateData.self_pr || '',
    };
  } catch (error) {
    console.error('概要データの取得に失敗しました:', error);
    return null;
  }
}

export async function updateSummaryData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const { candidateId } = authResult.data;

    // フォームデータをパース
    const jobSummary = formData.get('jobSummary')?.toString() || '';
    const selfPr = formData.get('selfPr')?.toString() || '';

    console.log('Updating summary data:', {
      candidateId,
      jobSummary,
      selfPr
    });

    const supabase = getSupabaseAdminClient();

    // candidatesテーブルを更新
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({
        job_summary: jobSummary || null,
        self_pr: selfPr || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (candidateError) {
      console.error('Summary update error:', candidateError);
      throw new Error('概要の更新に失敗しました');
    }

    console.log('Summary update success:', { candidateId });
    return { success: true };

  } catch (error) {
    console.error('Summary update failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新に失敗しました' 
    };
  }
}