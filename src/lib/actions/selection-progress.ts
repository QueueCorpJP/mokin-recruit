'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export interface SelectionProgressUpdateParams {
  candidateId: string;
  companyGroupId: string;
  jobPostingId?: string;
  stage:
    | 'document_screening'
    | 'first_interview'
    | 'secondary_interview'
    | 'final_interview'
    | 'offer';
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
  // 非破壊の再認可チェック（現状はログのみ）
  try {
    const { softReauthorizeForCompany } = await import(
      '@/lib/server/utils/soft-auth-check'
    );
    await softReauthorizeForCompany('updateSelectionProgressAction', {});
  } catch {}

  try {
    const supabase = await getSupabaseServerClient();

    // 企業の認証情報を取得（アクセス可能なグループのみに制限）
    const { requireCompanyAuthForAction } = await import('@/lib/auth/server');
    const authResult = await requireCompanyAuthForAction();

    if (!authResult.success) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    // ユーザーがアクセス可能なグループを取得
    const { data: userPermissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', authResult.data.companyUserId);

    if (!userPermissions || userPermissions.length === 0) {
      return {
        success: false,
        error: 'アクセス権限がありません',
      };
    }

    const accessibleGroupIds = userPermissions.map(
      (perm: any) => perm.company_group_id
    );

    // 指定されたグループIDがアクセス可能なグループに含まれているかチェック
    if (!accessibleGroupIds.includes(companyGroupId)) {
      return {
        success: false,
        error: 'このグループの進捗状況を更新する権限がありません',
      };
    }

    // 既存の進捗レコードを確認
    const { data: existingProgress } = await supabase
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
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}

/**
 * 選考進捗を取得するaction（単一グループ）
 */
export async function getSelectionProgressAction(
  candidateId: string,
  companyGroupId: string
) {
  // 非破壊の再認可チェック（現状はログのみ）
  try {
    const { softReauthorizeForCompany } = await import(
      '@/lib/server/utils/soft-auth-check'
    );
    await softReauthorizeForCompany('getSelectionProgressAction', {});
  } catch {}

  try {
    const supabase = await getSupabaseServerClient();

    // 企業の認証情報を取得（アクセス可能なグループのみに制限）
    const { requireCompanyAuthForAction } = await import('@/lib/auth/server');
    const authResult = await requireCompanyAuthForAction();

    if (!authResult.success) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    // ユーザーがアクセス可能なグループを取得
    const { data: userPermissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', authResult.data.companyUserId);

    if (!userPermissions || userPermissions.length === 0) {
      return {
        success: false,
        error: 'アクセス権限がありません',
      };
    }

    const accessibleGroupIds = userPermissions.map(
      (perm: any) => perm.company_group_id
    );

    // 指定されたグループIDがアクセス可能なグループに含まれているかチェック
    if (!accessibleGroupIds.includes(companyGroupId)) {
      return {
        success: false,
        error: 'このグループの進捗状況にアクセスする権限がありません',
      };
    }

    const { data, error } = await supabase
      .from('selection_progress')
      .select(
        `
        *,
        company_groups (
          group_name
        ),
        job_postings (
          title
        )
      `
      )
      .eq('candidate_id', candidateId)
      .eq('company_group_id', companyGroupId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error
      console.error('進捗取得エラー:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // データを整形して返す
    const formattedData = data
      ? {
          ...data,
          group_name: data.company_groups?.group_name || '',
          job_title: data.job_postings?.title || '',
        }
      : null;

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    console.error('進捗取得エラー:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}

/**
 * 候補者の全ての選考進捗を取得するaction
 */
export async function getAllSelectionProgressAction(candidateId: string) {
  // 非破壊の再認可チェック（現状はログのみ）
  try {
    const { softReauthorizeForCompany } = await import(
      '@/lib/server/utils/soft-auth-check'
    );
    await softReauthorizeForCompany('getAllSelectionProgressAction', {});
  } catch {}

  try {
    const supabase = await getSupabaseServerClient();

    // 企業の認証情報を取得（アクセス可能なグループのみに制限）
    const { requireCompanyAuthForAction } = await import('@/lib/auth/server');
    const authResult = await requireCompanyAuthForAction();

    if (!authResult.success) {
      return {
        success: false,
        error: '認証が必要です',
      };
    }

    // ユーザーがアクセス可能なグループを取得
    const { data: userPermissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', authResult.data.companyUserId);

    if (!userPermissions || userPermissions.length === 0) {
      return {
        success: true,
        data: [],
      };
    }

    const accessibleGroupIds = userPermissions.map(
      (perm: any) => perm.company_group_id
    );

    // 候補者の選考進捗を、アクセス可能なグループに限定して取得
    const { data, error } = await supabase
      .from('selection_progress')
      .select(
        `
        *,
        company_groups (
          group_name
        ),
        job_postings (
          title
        )
      `
      )
      .eq('candidate_id', candidateId)
      .in('company_group_id', accessibleGroupIds)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('全進捗取得エラー:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // データを整形して返す
    const formattedData = (data || []).map(item => ({
      ...item,
      group_name: item.company_groups?.group_name || '',
      job_title: item.job_postings?.title || '',
    }));

    return {
      success: true,
      data: formattedData,
    };
  } catch (error) {
    console.error('全進捗取得エラー:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : '不明なエラーが発生しました',
    };
  }
}
