'use server';

import {
  getCachedCandidateUser,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { validateFormDataWithZod } from '../../_shared/actions/validateFormDataWithZod';
import { summarySchema } from '../../_shared/schemas/summarySchema';

export async function getSummaryData() {
  try {
    const user = await getCachedCandidateUser();
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
      return {
        success: false,
        errors: {},
        message: authResult.error,
      };
    }

    const { candidateId } = authResult.data;

    // 共通ユーティリティでバリデーション・型変換
    const validation = await validateFormDataWithZod(summarySchema, formData);
    if (!validation.success) {
      return {
        success: false,
        errors: validation.errors,
        message: validation.message,
      };
    }
    const { jobSummary, selfPr } = validation.data;

    const supabase = await getSupabaseServerClient();
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({
        job_summary: jobSummary || null,
        self_pr: selfPr || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (candidateError) {
      return {
        success: false,
        errors: {},
        message: '概要の更新に失敗しました',
      };
    }

    return { success: true, errors: {}, message: '更新に成功しました' };
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: error instanceof Error ? error.message : '更新に失敗しました',
    };
  }
}
