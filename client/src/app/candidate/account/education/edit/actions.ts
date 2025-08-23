'use server';

import { requireCandidateAuth, requireCandidateAuthForAction } from '@/lib/auth/server';
import { getEducationData as getEducationFromDB, getCandidateData } from '@/lib/server/candidate/candidateData';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

interface EducationFormData {
  university_name?: string;
  university_department?: string;
  university_graduation_year?: string;
  university_graduation_month?: string;
  university_graduation_status?: string;
  
  vocational_school_name?: string;
  vocational_school_department?: string;
  vocational_school_graduation_year?: string;
  vocational_school_graduation_month?: string;
  vocational_school_graduation_status?: string;
  
  industries?: Array<{
    id: string;
    name: string;
    experienceYears: string;
  }>;
  
  jobTypes?: Array<{
    id: string;
    name: string;
    experienceYears: string;
  }>;
}

export async function getEducationData() {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      throw new Error('認証が必要です');
    }

    // 候補者データから学歴関連の情報を取得
    const candidateData = await getCandidateData(user.id);
    
    // 既存のeducationテーブルからも取得
    const educationData = await getEducationFromDB(user.id);
    
    return {
      finalEducation: educationData?.final_education || '',
      schoolName: educationData?.school_name || '',
      department: educationData?.department || '',
      graduationYear: educationData?.graduation_year?.toString() || '',
      graduationMonth: educationData?.graduation_month?.toString() || '',
      
      // 候補者データから大学情報を取得（型安全性のためasを使用）
      universityName: (candidateData as any)?.university_name || '',
      universityDepartment: (candidateData as any)?.university_department || '',
      universityGraduationYear: (candidateData as any)?.university_graduation_year || '',
      universityGraduationMonth: (candidateData as any)?.university_graduation_month || '',
      universityGraduationStatus: (candidateData as any)?.university_graduation_status || '',
      
      // 専門学校情報を取得（型安全性のためasを使用）
      vocationalSchoolName: (candidateData as any)?.vocational_school_name || '',
      vocationalSchoolDepartment: (candidateData as any)?.vocational_school_department || '',
      vocationalSchoolGraduationYear: (candidateData as any)?.vocational_school_graduation_year || '',
      vocationalSchoolGraduationMonth: (candidateData as any)?.vocational_school_graduation_month || '',
      vocationalSchoolGraduationStatus: (candidateData as any)?.vocational_school_graduation_status || '',
      
      industries: [],
      jobTypes: [],
    };
  } catch (error) {
    console.error('学歴データの取得に失敗しました:', error);
    return null;
  }
}

export async function updateEducationData(formData: FormData) {
  try {
    // 認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      throw new Error(authResult.error);
    }

    const { candidateId } = authResult.data;

    // フォームデータをパース
    const data: EducationFormData = {
      university_name: formData.get('university_name')?.toString() || '',
      university_department: formData.get('university_department')?.toString() || '',
      university_graduation_year: formData.get('university_graduation_year')?.toString() || '',
      university_graduation_month: formData.get('university_graduation_month')?.toString() || '',
      university_graduation_status: formData.get('university_graduation_status')?.toString() || '',
      
      vocational_school_name: formData.get('vocational_school_name')?.toString() || '',
      vocational_school_department: formData.get('vocational_school_department')?.toString() || '',
      vocational_school_graduation_year: formData.get('vocational_school_graduation_year')?.toString() || '',
      vocational_school_graduation_month: formData.get('vocational_school_graduation_month')?.toString() || '',
      vocational_school_graduation_status: formData.get('vocational_school_graduation_status')?.toString() || '',
    };

    // 業種・職種データの処理（JSON文字列として渡されると仮定）
    const industriesJson = formData.get('industries')?.toString();
    const jobTypesJson = formData.get('jobTypes')?.toString();

    if (industriesJson) {
      try {
        data.industries = JSON.parse(industriesJson);
      } catch (e) {
        console.error('Industries JSON parse error:', e);
      }
    }

    if (jobTypesJson) {
      try {
        data.jobTypes = JSON.parse(jobTypesJson);
      } catch (e) {
        console.error('Job types JSON parse error:', e);
      }
    }

    console.log('Updating education data:', {
      candidateId,
      ...data
    });

    const supabase = getSupabaseAdminClient();

    // educationテーブルを更新（まず更新を試し、存在しなければ挿入）
    const { data: updateData, error: updateError } = await supabase
      .from('education')
      .update({
        university_name: data.university_name || null,
        university_department: data.university_department || null,
        university_graduation_year: data.university_graduation_year || null,
        university_graduation_month: data.university_graduation_month || null,
        university_graduation_status: data.university_graduation_status || null,
        vocational_school_name: data.vocational_school_name || null,
        vocational_school_department: data.vocational_school_department || null,
        vocational_school_graduation_year: data.vocational_school_graduation_year || null,
        vocational_school_graduation_month: data.vocational_school_graduation_month || null,
        vocational_school_graduation_status: data.vocational_school_graduation_status || null,
      })
      .eq('candidate_id', candidateId)
      .select();

    let educationError = null;
    
    if (updateError) {
      educationError = updateError;
    } else if (!updateData || updateData.length === 0) {
      // 更新された行がない場合は新規挿入
      const { error: insertError } = await supabase
        .from('education')
        .insert({
          candidate_id: candidateId,
          university_name: data.university_name || null,
          university_department: data.university_department || null,
          university_graduation_year: data.university_graduation_year || null,
          university_graduation_month: data.university_graduation_month || null,
          university_graduation_status: data.university_graduation_status || null,
          vocational_school_name: data.vocational_school_name || null,
          vocational_school_department: data.vocational_school_department || null,
          vocational_school_graduation_year: data.vocational_school_graduation_year || null,
          vocational_school_graduation_month: data.vocational_school_graduation_month || null,
          vocational_school_graduation_status: data.vocational_school_graduation_status || null,
        });
      
      if (insertError) {
        educationError = insertError;
      }
    }

    if (educationError) {
      console.error('Education update error:', educationError);
      throw new Error('学歴情報の更新に失敗しました');
    }

    // candidatesテーブルのupdated_atも更新
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (candidateError) {
      console.error('Candidate updated_at update error:', candidateError);
      // これはエラーにしない（主要な情報は既に保存済み）
      console.warn('候補者テーブルの更新日時の更新に失敗しましたが、処理を続行します');
    }

    // 業種データの更新（必要に応じて）
    if (data.industries && data.industries.length > 0) {
      // 既存の業種データを削除
      await supabase
        .from('candidate_industries')
        .delete()
        .eq('candidate_id', candidateId);

      // 新しい業種データを挿入
      const industriesData = data.industries.map(industry => ({
        candidate_id: candidateId,
        industry_id: industry.id,
        experience_years: industry.experienceYears || null,
      }));

      const { error: industriesError } = await supabase
        .from('candidate_industries')
        .insert(industriesData);

      if (industriesError) {
        console.error('Industries update error:', industriesError);
      }
    }

    // 職種データの更新（必要に応じて）
    if (data.jobTypes && data.jobTypes.length > 0) {
      // 既存の職種データを削除
      await supabase
        .from('candidate_job_types')
        .delete()
        .eq('candidate_id', candidateId);

      // 新しい職種データを挿入
      const jobTypesData = data.jobTypes.map(jobType => ({
        candidate_id: candidateId,
        job_type_id: jobType.id,
        experience_years: jobType.experienceYears || null,
      }));

      const { error: jobTypesError } = await supabase
        .from('candidate_job_types')
        .insert(jobTypesData);

      if (jobTypesError) {
        console.error('Job types update error:', jobTypesError);
      }
    }

    console.log('Education update success:', { candidateId });
    return { success: true };

  } catch (error) {
    console.error('Education update failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '更新に失敗しました' 
    };
  }
}