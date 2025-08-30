import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import CandidateEditClient from './CandidateEditClient';
import { CandidateDetailData } from '../page';

async function fetchCandidateDetail(candidateId: string): Promise<CandidateDetailData> {
  const supabase = getSupabaseAdminClient();
  
  // 基本情報
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select(`
      id, email, password_hash, last_name, first_name, last_name_kana, first_name_kana,
      gender, birth_date, prefecture, phone_number, current_income, current_salary, desired_salary,
      last_login_at, has_career_change, job_change_timing, current_activity_status,
      recent_job_company_name, recent_job_department_position, recent_job_start_year,
      recent_job_start_month, recent_job_end_year, recent_job_end_month,
      recent_job_is_currently_working, recent_job_industries, recent_job_types,
      recent_job_description, job_summary, self_pr, current_company, current_position,
      current_residence, skills, desired_industries, desired_job_types, desired_locations,
      management_experience_count, interested_work_styles
    `)
    .eq('id', candidateId)
    .single();

  if (candidateError || !candidate) {
    throw new Error('候補者が見つかりません');
  }

  // 学歴
  const { data: education } = await supabase
    .from('education')
    .select('final_education, school_name, department, graduation_year, graduation_month')
    .eq('candidate_id', candidateId);

  // 業種経験
  const { data: workExperience } = await supabase
    .from('work_experience')
    .select('industry_name, experience_years')
    .eq('candidate_id', candidateId);

  // 職種経験
  const { data: jobTypeExperience } = await supabase
    .from('job_type_experience')
    .select('job_type_name, experience_years')
    .eq('candidate_id', candidateId);

  // スキル・語学
  const { data: skills } = await supabase
    .from('skills')
    .select('english_level, other_languages, skills_list, qualifications')
    .eq('candidate_id', candidateId);

  // 希望条件
  const { data: expectations } = await supabase
    .from('expectations')
    .select('desired_income, desired_industries, desired_job_types, desired_work_locations, desired_work_styles')
    .eq('candidate_id', candidateId);

  // スカウト統計は編集では不要なので空のオブジェクトを返す
  const scoutStats = {
    scout_received_7days: 0,
    scout_opened_7days: 0,
    scout_replied_7days: 0,
    applications_7days: 0,
    scout_received_30days: 0,
    scout_opened_30days: 0,
    scout_replied_30days: 0,
    applications_30days: 0,
    scout_received_total: 0,
    scout_opened_total: 0,
    scout_replied_total: 0,
    applications_total: 0,
  };

  return {
    ...candidate,
    education: education || [],
    work_experience: workExperience || [],
    job_type_experience: jobTypeExperience || [],
    skills: skills || [],
    expectations: expectations || [],
    scout_stats: scoutStats
  } as CandidateDetailData;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateEditPage({ params }: PageProps) {
  const { id } = await params;
  const candidateData = await fetchCandidateDetail(id);
  
  return <CandidateEditClient candidate={candidateData} />;
}