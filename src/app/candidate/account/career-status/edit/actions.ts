'use server';

import {
  requireCandidateAuth,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { parseJsonField } from '../../_shared/utils/formData';

// 型はスキーマ側で定義済みのためここでは重複定義しない

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

    // 選考状況エントリを取得
    const supabase = await getSupabaseServerClient();
    const { data: careerEntries, error: careerError } = await supabase
      .from('career_status_entries')
      .select('*')
      .eq('candidate_id', user.id)
      .order('created_at', { ascending: false });

    let selectionCompanies: Array<{
      privacyScope: string;
      isPrivate: boolean;
      industries: string[];
      companyName: string;
      department: string;
      progressStatus: string;
      declineReason: string;
    }> = [];

    if (!careerError && careerEntries && careerEntries.length > 0) {
      selectionCompanies = careerEntries.map((entry: any) => ({
        privacyScope: entry.is_private ? 'private' : 'public',
        isPrivate: entry.is_private,
        industries: Array.isArray(entry.industries) ? entry.industries : [],
        companyName: entry.company_name || '',
        department: entry.department || '',
        progressStatus: entry.progress_status || '',
        declineReason: entry.decline_reason || '',
      }));
    }

    // 転職活動状況をcareer_status_entriesから取得
    let hasCareerChange = '';
    let transferDesiredTime = '';
    let currentActivityStatus = '';

    if (!careerError && careerEntries && careerEntries.length > 0) {
      // 最新のエントリから転職活動状況を取得
      const latestEntry = careerEntries[0];
      hasCareerChange = latestEntry.has_career_change || '';
      transferDesiredTime = latestEntry.job_change_timing || '';
      currentActivityStatus = latestEntry.current_activity_status || '';
    }

    return {
      hasCareerChange,
      transferDesiredTime,
      currentActivityStatus,
      selectionCompanies,
    };
  } catch (error) {
    console.error('キャリアステータスデータの取得に失敗しました:', error);
    return null;
  }
}

export async function updateCareerStatusData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error((authResult as any).error);
    }

    const { candidateId } = authResult.data;

    // フォームデータをパース
    const hasCareerChange = formData.get('hasCareerChange')?.toString() || '';
    const transferDesiredTime =
      formData.get('transferDesiredTime')?.toString() || '';
    const currentActivityStatus =
      formData.get('currentActivityStatus')?.toString() || '';
    const selectionCompanies = parseJsonField<
      Array<{
        privacyScope: string;
        isPrivate: boolean;
        industries: string[];
        companyName: string;
        department: string;
        progressStatus: string;
        declineReason: string;
      }>
    >(formData, 'selectionCompanies', []);

    console.log('Updating career status:', {
      candidateId,
      hasCareerChange,
      transferDesiredTime,
      currentActivityStatus,
      selectionCompanies,
    });

    const supabase = await getSupabaseServerClient();

    // 既存の選考状況エントリを削除
    const { error: deleteError } = await supabase
      .from('career_status_entries')
      .delete()
      .eq('candidate_id', candidateId);

    if (deleteError) {
      console.error('Career status entries delete error:', deleteError);
      throw new Error('既存データの削除に失敗しました');
    }

    // 新しいエントリを作成（転職活動状況を含む）
    const baseEntry = {
      candidate_id: candidateId,
      has_career_change: hasCareerChange || null,
      job_change_timing: transferDesiredTime || null,
      current_activity_status: currentActivityStatus || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let entriesToInsert = [];

    if (selectionCompanies && selectionCompanies.length > 0) {
      // 選考状況がある場合は各企業のエントリを作成
      entriesToInsert = selectionCompanies.map(company => ({
        ...baseEntry,
        is_private: company.isPrivate,
        industries: company.industries,
        company_name: company.companyName || null,
        department: company.department || null,
        progress_status: company.progressStatus || null,
        decline_reason: company.declineReason || null,
      }));
    } else {
      // 選考状況がない場合でも転職希望時期と現在の活動状況は保存
      entriesToInsert = [
        {
          ...baseEntry,
          is_private: false,
          industries: null,
          company_name: null,
          department: null,
          progress_status: null,
          decline_reason: null,
        },
      ];
    }

    const { error: insertError } = await supabase
      .from('career_status_entries')
      .insert(entriesToInsert);

    if (insertError) {
      console.error('Career status entries insert error:', insertError);
      throw new Error('選考状況エントリの挿入に失敗しました');
    }

    console.log('Career status update success:', {
      candidateId,
      hasCareerChange,
      transferDesiredTime,
      currentActivityStatus,
    });
    return { success: true };
  } catch (error) {
    console.error('Career status update failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '更新に失敗しました',
    };
  }
}
