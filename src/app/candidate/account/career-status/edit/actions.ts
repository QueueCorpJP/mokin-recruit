'use server';

import { redirect } from 'next/navigation';
import { requireCandidateAuth, requireCandidateAuthForAction } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { any } from 'zod';

interface CareerStatusFormData {
  transferDesiredTime: string;
  currentActivityStatus: string;
  selectionCompanies: Array<{
    privacyScope: string;
    isPrivate: boolean;
    industries: string[];
    companyName: string;
    department: string;
    progressStatus: string;
    declineReason: string;
  }>;
}

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

    return {
      transferDesiredTime: candidateData.job_change_timing || '',
      currentActivityStatus: candidateData.current_activity_status || '',
      selectionCompanies,
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('キャリアステータスデータの取得に失敗しました:', error);
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
    const transferDesiredTime = formData.get('transferDesiredTime')?.toString() || '';
    const currentActivityStatus = formData.get('currentActivityStatus')?.toString() || '';
    const selectionCompaniesJson = formData.get('selectionCompanies')?.toString();
    
    let selectionCompanies: Array<{
      privacyScope: string;
      isPrivate: boolean;
      industries: string[];
      companyName: string;
      department: string;
      progressStatus: string;
      declineReason: string;
    }> = [];
    
    if (selectionCompaniesJson) {
      try {
        selectionCompanies = JSON.parse(selectionCompaniesJson);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') console.error('Selection companies JSON parse error:', e);
      }
    }
    
    if (process.env.NODE_ENV === 'development') console.log('Updating career status:', {
      candidateId,
      transferDesiredTime,
      currentActivityStatus,
      selectionCompanies
    });

    const supabase = await getSupabaseServerClient();

    // candidatesテーブルを更新
    const { data, error: candidateError } = await supabase
      .from('candidates')
      .update({
        job_change_timing: transferDesiredTime || null,
        current_activity_status: currentActivityStatus || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId)
      .select();

    if (candidateError) {
      if (process.env.NODE_ENV === 'development') console.error('Candidate update error:', candidateError);
      throw new Error('転職活動状況の更新に失敗しました');
    }

    // 選考状況データを保存（既存のエントリを削除してから新規挿入）
    if (selectionCompanies && selectionCompanies.length > 0) {
      // 既存の選考状況エントリを削除
      const { error: deleteError } = await supabase
        .from('career_status_entries')
        .delete()
        .eq('candidate_id', candidateId);

      if (deleteError) {
        if (process.env.NODE_ENV === 'development') console.error('Career status entries delete error:', deleteError);
        // エラーでも処理を続行（主要な情報は既に保存済み）
        if (process.env.NODE_ENV === 'development') console.warn('既存の選考状況エントリの削除に失敗しましたが、処理を続行します');
      }

      // 新しい選考状況エントリを挿入
      const careerEntries = selectionCompanies.map(company => ({
        candidate_id: candidateId,
        is_private: company.isPrivate,
        industries: company.industries,
        company_name: company.companyName || null,
        department: company.department || null,
        progress_status: company.progressStatus || null,
        decline_reason: company.declineReason || null,
      }));

      const { error: insertError } = await supabase
        .from('career_status_entries')
        .insert(careerEntries);

      if (insertError) {
        if (process.env.NODE_ENV === 'development') console.error('Career status entries insert error:', insertError);
        // エラーでも処理を続行（主要な情報は既に保存済み）
        if (process.env.NODE_ENV === 'development') console.warn('選考状況エントリの挿入に失敗しましたが、処理を続行します');
      }
    }

    if (process.env.NODE_ENV === 'development') console.log('Career status update success:', { candidateId, updatedData: data });
    return { success: true };

  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Career status update failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新に失敗しました' 
    };
  }
}