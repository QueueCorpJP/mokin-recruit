'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export interface JoiningDateUpdateParams {
  candidateId: string;
  companyGroupId: string;
  joiningDate: string;
  jobPostingId?: string;
  applicationId?: string;
  scoutSendId?: string;
}

/**
 * 入社日を登録するaction
 */
export async function updateJoiningDateAction({
  candidateId,
  companyGroupId,
  joiningDate,
  jobPostingId,
  applicationId,
  scoutSendId,
}: JoiningDateUpdateParams) {
  try {
    const supabase = await getSupabaseServerClient();

    // 既存の進捗レコードを確認
    let { data: existingProgress } = await supabase
      .from('selection_progress')
      .select('*')
      .eq('candidate_id', candidateId)
      .eq('company_group_id', companyGroupId)
      .single();

    const now = new Date().toISOString();

    // 更新するフィールドを準備
    const updateData: any = {
      candidate_id: candidateId,
      company_group_id: companyGroupId,
      job_posting_id: jobPostingId,
      application_id: applicationId,
      scout_send_id: scoutSendId,
      joining_date: joiningDate,
      updated_at: now,
    };

    let response;
    
    if (existingProgress) {
      // 既存レコードを更新
      response = await supabase
        .from('selection_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select('*')
        .single();
    } else {
      // 新規レコードを作成（通常は既存のレコードがあるはず）
      updateData.created_at = now;
      response = await supabase
        .from('selection_progress')
        .insert(updateData)
        .select('*')
        .single();
    }

    if (response.error) {
      console.error('入社日更新エラー:', response.error);
      return {
        success: false,
        error: response.error.message,
      };
    }

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error('入社日更新エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}
