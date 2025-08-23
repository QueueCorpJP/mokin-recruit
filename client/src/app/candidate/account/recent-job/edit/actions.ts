'use server';

import { requireCandidateAuth, requireCandidateAuthForAction } from '@/lib/auth/server';
import { getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

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
            ? candidateData.recent_job_industries.map((item: any) => 
                typeof item === 'string' ? item : item.id || item.name || item)
            : [],
          jobTypes: Array.isArray(candidateData.recent_job_types) 
            ? candidateData.recent_job_types.map((item: any) => 
                typeof item === 'string' ? item : item.id || item.name || item)
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

export async function updateRecentJobData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const { candidateId } = authResult.data;

    // フォームデータをパース
    const companyName = formData.get('companyName')?.toString() || '';
    const departmentPosition = formData.get('departmentPosition')?.toString() || '';
    const startYear = formData.get('startYear')?.toString() || '';
    const startMonth = formData.get('startMonth')?.toString() || '';
    const endYear = formData.get('endYear')?.toString() || '';
    const endMonth = formData.get('endMonth')?.toString() || '';
    const isCurrentlyWorking = formData.get('isCurrentlyWorking') === 'true';
    const jobDescription = formData.get('jobDescription')?.toString() || '';
    
    // 配列データをパース
    const industriesJson = formData.get('industries')?.toString();
    const jobTypesJson = formData.get('jobTypes')?.toString();
    
    let industries: any[] = [];
    let jobTypes: any[] = [];
    
    if (industriesJson) {
      try {
        industries = JSON.parse(industriesJson);
      } catch (e) {
        console.error('Industries JSON parse error:', e);
      }
    }
    
    if (jobTypesJson) {
      try {
        jobTypes = JSON.parse(jobTypesJson);
      } catch (e) {
        console.error('Job types JSON parse error:', e);
      }
    }

    console.log('Updating recent job data:', {
      candidateId,
      companyName,
      departmentPosition,
      startYear,
      startMonth,
      endYear,
      endMonth,
      isCurrentlyWorking,
      industries,
      jobTypes
    });

    const supabase = getSupabaseAdminClient();

    // candidatesテーブルを更新
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({
        recent_job_company_name: companyName || null,
        recent_job_department_position: departmentPosition || null,
        recent_job_start_year: startYear || null,
        recent_job_start_month: startMonth || null,
        recent_job_end_year: endYear || null,
        recent_job_end_month: endMonth || null,
        recent_job_is_currently_working: isCurrentlyWorking,
        recent_job_industries: industries,
        recent_job_types: jobTypes,
        recent_job_description: jobDescription || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (candidateError) {
      console.error('Recent job update error:', candidateError);
      throw new Error('職務経歴の更新に失敗しました');
    }

    console.log('Recent job update success:', { candidateId });
    return { success: true };

  } catch (error) {
    console.error('Job history update failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新に失敗しました' 
    };
  }
}