'use server';

import {
  getCachedCandidateUser,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { validateFormDataWithZod } from '../../_shared/actions/validateFormDataWithZod';
import { type ActionResult, fail, ok } from '@/lib/server/actions/utils';
import { summarySchema } from '../../_shared/schemas';

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

export async function updateSummaryData(
  formData: FormData
): Promise<ActionResult<{ updated: boolean }>> {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) return fail(authResult.error);

    const { candidateId } = authResult.data;

    // 共通ユーティリティでバリデーション・型変換
    const validation = await validateFormDataWithZod(summarySchema, formData);
    if (!validation.success) return fail(validation.message, validation.errors);
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

    if (candidateError) return fail('概要の更新に失敗しました');

    return ok('更新に成功しました', { updated: true });
  } catch (error) {
    return fail(error instanceof Error ? error.message : '更新に失敗しました');
  }
}
