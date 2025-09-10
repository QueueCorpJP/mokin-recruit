'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export interface SelectionProgressUpdateParams {
  candidateId: string;
  companyGroupId: string;
  jobPostingId?: string;
  stage: 'document_screening' | 'first_interview' | 'secondary_interview' | 'final_interview' | 'offer';
  result: 'pass' | 'fail';
  applicationId?: string;
  scoutSendId?: string;
}

/**
 * 進捗ステータスを更新するaction
 */
export async function updateSelectionProgressAction({
  candidateId,
  companyGroupId,
  jobPostingId,
  stage,
  result,
  applicationId,
  scoutSendId,
}: SelectionProgressUpdateParams) {
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
      updated_at: now,
    };

    // ステージに応じたフィールドを更新
    switch (stage) {
      case 'document_screening':
        updateData.document_screening_result = result;
        updateData.document_screening_date = now;
        break;
      case 'first_interview':
        updateData.first_interview_result = result;
        updateData.first_interview_date = now;
        break;
      case 'secondary_interview':
        updateData.secondary_interview_result = result;
        updateData.secondary_interview_date = now;
        break;
      case 'final_interview':
        updateData.final_interview_result = result;
        updateData.final_interview_date = now;
        break;
      case 'offer':
        updateData.offer_result = result === 'pass' ? 'accepted' : 'declined';
        updateData.offer_date = now;
        break;
    }

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
      // 新規レコードを作成
      updateData.created_at = now;
      response = await supabase
        .from('selection_progress')
        .insert(updateData)
        .select('*')
        .single();
    }

    if (response.error) {
      console.error('進捗更新エラー:', response.error);
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
    console.error('進捗更新エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}

/**
 * 選考進捗を取得するaction
 */
export async function getSelectionProgressAction(candidateId: string, companyGroupId: string) {
  try {
    const supabase = await getSupabaseServerClient();

    const { data, error } = await supabase
      .from('selection_progress')
      .select(`
        *,
        company_groups (
          group_name
        ),
        job_postings (
          title
        )
      `)
      .eq('candidate_id', candidateId)
      .eq('company_group_id', companyGroupId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('進捗取得エラー:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // データを整形して返す
    const formattedData = data ? {
      ...data,
      group_name: data.company_groups?.group_name || '',
      job_title: data.job_postings?.title || ''
    } : null;

    return {
      success: true,
      data: formattedData,
    };

  } catch (error) {
    console.error('進捗取得エラー:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}