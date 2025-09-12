'use server';

import {
  requireCandidateAuth,
  requireCandidateAuthForAction,
} from '@/lib/auth/server';
import {
  getEducationData as getEducationFromDB,
  getCandidateData,
} from '@/lib/server/candidate/candidateData';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { educationSchema } from '../../_shared/schemas';
import { validateFormDataWithZod } from '../../_shared/actions/validateFormDataWithZod';

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
      universityGraduationYear:
        (candidateData as any)?.university_graduation_year || '',
      universityGraduationMonth:
        (candidateData as any)?.university_graduation_month || '',
      universityGraduationStatus:
        (candidateData as any)?.university_graduation_status || '',

      // 専門学校情報を取得（型安全性のためasを使用）
      vocationalSchoolName:
        (candidateData as any)?.vocational_school_name || '',
      vocationalSchoolDepartment:
        (candidateData as any)?.vocational_school_department || '',
      vocationalSchoolGraduationYear:
        (candidateData as any)?.vocational_school_graduation_year || '',
      vocationalSchoolGraduationMonth:
        (candidateData as any)?.vocational_school_graduation_month || '',
      vocationalSchoolGraduationStatus:
        (candidateData as any)?.vocational_school_graduation_status || '',

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
      return {
        success: false,
        errors: {},
        message: (authResult as any).error,
      };
    }

    const { candidateId } = authResult.data;

    // 共通ユーティリティで検証（配列JSON文字列の事前変換を含む）
    const validation = await validateFormDataWithZod(
      educationSchema,
      formData,
      {
        transform: obj => {
          const output = { ...obj } as any;
          const parseIfStringJson = (value: any) => {
            if (typeof value !== 'string') return value;
            try {
              return JSON.parse(value);
            } catch {
              return value;
            }
          };
          output.industries = parseIfStringJson(output.industries) ?? [];
          output.jobTypes = parseIfStringJson(output.jobTypes) ?? [];
          return output;
        },
      }
    );

    if (!validation.success) {
      return {
        success: false,
        errors: validation.errors,
        message: validation.message,
      };
    }
    const {
      finalEducation,
      schoolName,
      department,
      graduationYear,
      graduationMonth,
      industries,
      jobTypes,
    } = validation.data as any;

    const supabase = await getSupabaseServerClient();
    // educationテーブルを更新（まず更新を試し、存在しなければ挿入）
    const { data: updateData, error: updateError } = await supabase
      .from('education')
      .update({
        final_education: finalEducation || null,
        school_name: schoolName || null,
        department: department || null,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        graduation_month: graduationMonth ? parseInt(graduationMonth) : null,
      })
      .eq('candidate_id', candidateId)
      .select();

    let educationError = null;
    if (updateError) {
      educationError = updateError;
    } else if (!updateData || updateData.length === 0) {
      // 更新された行がない場合は新規挿入
      const { error: insertError } = await supabase.from('education').insert({
        candidate_id: candidateId,
        final_education: finalEducation || null,
        school_name: schoolName || null,
        department: department || null,
        graduation_year: graduationYear ? parseInt(graduationYear) : null,
        graduation_month: graduationMonth ? parseInt(graduationMonth) : null,
      });
      if (insertError) {
        educationError = insertError;
      }
    }
    if (educationError) {
      return {
        success: false,
        errors: {},
        message: '学歴情報の更新に失敗しました',
      };
    }

    // candidatesテーブルのupdated_atのみ更新
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', candidateId);
    if (candidateError) {
      // これはエラーにしない（主要な情報は既に保存済み）
      console.warn(
        '候補者テーブルの更新日時の更新に失敗しましたが、処理を続行します'
      );
    }

    // 業種データの更新（必要に応じて）
    if (industries && industries.length > 0) {
      await supabase
        .from('work_experience')
        .delete()
        .eq('candidate_id', candidateId);
      const industriesData = industries.map((industry: any) => ({
        candidate_id: candidateId,
        industry_id: industry.id,
        industry_name: industry.name,
        experience_years: parseInt(
          industry.experienceYears?.replace('年', '') || '0'
        ),
      }));
      const { error: industriesError } = await supabase
        .from('work_experience')
        .insert(industriesData);
      if (industriesError) {
        console.error('Industries update error:', industriesError);
      }
    }

    // 職種データの更新（必要に応じて）
    if (jobTypes && jobTypes.length > 0) {
      await supabase
        .from('job_type_experience')
        .delete()
        .eq('candidate_id', candidateId);
      const jobTypesData = jobTypes.map((jobType: any) => ({
        candidate_id: candidateId,
        job_type_id: jobType.id,
        job_type_name: jobType.name,
        experience_years: parseInt(
          jobType.experienceYears?.replace('年', '') || '0'
        ),
      }));
      const { error: jobTypesError } = await supabase
        .from('job_type_experience')
        .insert(jobTypesData);
      if (jobTypesError) {
        console.error('Job types update error:', jobTypesError);
      }
    }

    return {
      success: true,
      errors: {},
      message: '学歴情報が更新されました',
    };
  } catch (error) {
    return {
      success: false,
      errors: {},
      message: error instanceof Error ? error.message : '更新に失敗しました',
    };
  }
}
