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
      // 基本学歴情報
      final_education: formData.get('finalEducation')?.toString() || '',
      school_name: formData.get('schoolName')?.toString() || '',
      department: formData.get('department')?.toString() || '',
      graduation_year: formData.get('graduationYear')?.toString() || '',
      graduation_month: formData.get('graduationMonth')?.toString() || '',
      
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
        final_education: data.final_education || null,
        school_name: data.school_name || null,
        department: data.department || null,
        graduation_year: data.graduation_year ? parseInt(data.graduation_year) : null,
        graduation_month: data.graduation_month ? parseInt(data.graduation_month) : null,
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
          final_education: data.final_education || null,
          school_name: data.school_name || null,
          department: data.department || null,
          graduation_year: data.graduation_year ? parseInt(data.graduation_year) : null,
          graduation_month: data.graduation_month ? parseInt(data.graduation_month) : null,
        });
      
      if (insertError) {
        educationError = insertError;
      }
    }

    if (educationError) {
      console.error('Education update error:', educationError);
      throw new Error('学歴情報の更新に失敗しました');
    }

    // candidatesテーブルのupdated_atのみ更新
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
        .from('work_experience')
        .delete()
        .eq('candidate_id', candidateId);

      // 新しい業種データを挿入
      const industriesData = data.industries.map(industry => ({
        candidate_id: candidateId,
        industry_id: industry.id,
        industry_name: industry.name,
        experience_years: parseInt(industry.experienceYears?.replace('年', '') || '0'),
      }));

      const { error: industriesError } = await supabase
        .from('work_experience')
        .insert(industriesData);

      if (industriesError) {
        console.error('Industries update error:', industriesError);
        console.error('Industries data that failed to insert:', industriesData);
      }
    }

    // 職種データの更新（必要に応じて）
    if (data.jobTypes && data.jobTypes.length > 0) {
      // 既存の職種データを削除
      await supabase
        .from('job_type_experience')
        .delete()
        .eq('candidate_id', candidateId);

      // 新しい職種データを挿入
      const jobTypesData = data.jobTypes.map(jobType => ({
        candidate_id: candidateId,
        job_type_id: jobType.id,
        job_type_name: jobType.name,
        experience_years: parseInt(jobType.experienceYears?.replace('年', '') || '0'),
      }));

      const { error: jobTypesError } = await supabase
        .from('job_type_experience')
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