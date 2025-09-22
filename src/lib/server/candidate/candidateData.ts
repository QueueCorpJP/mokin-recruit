'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// 候補者の基本データの型定義
export interface CandidateData {
  id: string;
  email: string;
  last_name?: string;
  first_name?: string;
  last_name_kana?: string;
  first_name_kana?: string;
  phone_number?: string;
  current_residence?: string;
  prefecture?: string;
  gender?: string;
  birth_date?: string;
  current_income?: string;
  has_career_change?: string;
  job_change_timing?: string;
  current_activity_status?: string;
  recent_job_company_name?: string;
  recent_job_department_position?: string;
  recent_job_start_year?: string;
  recent_job_start_month?: string;
  recent_job_end_year?: string;
  recent_job_end_month?: string;
  recent_job_is_currently_working?: boolean;
  recent_job_industries?: any;
  recent_job_types?: any;
  recent_job_description?: string;
  job_summary?: string;
  self_pr?: string;
  management_experience_count?: number;
  interested_work_styles?: string[];
  skills?: string[];
  experience_years?: number;
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_salary?: string;
  desired_locations?: string[];
  resume_filename?: string;
  resume_uploaded_at?: string;
}

// 学歴データの型定義
export interface EducationData {
  id: string;
  candidate_id: string;
  final_education: string;
  school_name?: string;
  department?: string;
  graduation_year?: number;
  graduation_month?: number;
}

// 候補者の基本データを取得する関数
export async function getCandidateData(
  candidateId: string
): Promise<CandidateData | null> {
  try {
    const supabase = getSupabaseAdminClient();

    // 全ての関連データを並列で取得（N+1問題解決）
    const [candidateResult, industriesResult, jobTypesResult] =
      await Promise.all([
        supabase
          .from('candidates')
          .select(
            `
          id,
          email,
          last_name,
          first_name,
          last_name_kana,
          first_name_kana,
          phone_number,
          current_residence,
          prefecture,
          gender,
          birth_date,
          current_income,
          has_career_change,
          job_change_timing,
          current_activity_status,
          recent_job_company_name,
          recent_job_department_position,
          recent_job_start_year,
          recent_job_start_month,
          recent_job_end_year,
          recent_job_end_month,
          recent_job_is_currently_working,
          recent_job_industries,
          recent_job_types,
          recent_job_description,
          job_summary,
          self_pr,
          management_experience_count,
          interested_work_styles,
          skills,
          experience_years,
          desired_industries,
          desired_job_types,
          desired_salary,
          desired_locations,
          resume_filename,
          resume_uploaded_at
        `
          )
          .eq('id', candidateId)
          .single(),
        supabase
          .from('work_experience')
          .select(
            `
          industry_name,
          experience_years
        `
          )
          .eq('candidate_id', candidateId),
        supabase
          .from('job_type_experience')
          .select(
            `
          job_type_name,
          experience_years
        `
          )
          .eq('candidate_id', candidateId),
      ]);

    if (candidateResult.error) {
      console.error('候補者データの取得に失敗しました:', candidateResult.error);
      return null;
    }

    // 業種・職種の名前を配列として格納
    const candidateData = candidateResult.data as CandidateData;
    candidateData.desired_industries =
      industriesResult.data?.map(item => item.industry_name).filter(Boolean) ||
      [];
    candidateData.desired_job_types =
      jobTypesResult.data?.map(item => item.job_type_name).filter(Boolean) ||
      [];

    return candidateData;
  } catch (error) {
    console.error('データベースエラー:', error);
    return null;
  }
}

// スキルデータの型定義
export interface SkillsData {
  id: string;
  candidate_id: string;
  english_level: string;
  other_languages?: any;
  skills_list?: string[];
  qualifications?: string;
}

// 学歴データを取得する関数
export async function getEducationData(
  candidateId: string
): Promise<EducationData | null> {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('education')
      .select(
        `
        id,
        candidate_id,
        final_education,
        school_name,
        department,
        graduation_year,
        graduation_month
      `
      )
      .eq('candidate_id', candidateId)
      .single();

    if (error) {
      // レコードが存在しない場合はnullを返す
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('学歴データの取得に失敗しました:', error);
      return null;
    }

    return data as EducationData;
  } catch (error) {
    console.error('データベースエラー:', error);
    return null;
  }
}

// スキルデータを取得する関数
export async function getSkillsData(
  candidateId: string
): Promise<SkillsData | null> {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('skills')
      .select(
        `
        id,
        candidate_id,
        english_level,
        other_languages,
        skills_list,
        qualifications
      `
      )
      .eq('candidate_id', candidateId)
      .single();

    if (error) {
      // レコードが存在しない場合はnullを返す
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('スキルデータの取得に失敗しました:', error);
      return null;
    }

    return data as SkillsData;
  } catch (error) {
    console.error('データベースエラー:', error);
    return null;
  }
}
