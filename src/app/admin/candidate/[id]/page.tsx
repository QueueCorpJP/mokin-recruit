import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import CandidateDetailClient from './CandidateDetailClient';

export interface CandidateDetailData {
  // 基本情報
  id: string;
  email: string;
  password_hash: string | null;
  last_name: string | null;
  first_name: string | null;
  last_name_kana: string | null;
  first_name_kana: string | null;
  gender: 'male' | 'female' | 'unspecified' | null;
  birth_date: string | null;
  prefecture: string | null;
  phone_number: string | null;
  current_income: string | null;
  current_salary: string | null;
  desired_salary: string | null;
  current_company: string | null;
  current_position: string | null;
  current_residence: string | null;
  desired_industries: (string | { name?: string; id?: string; [key: string]: any })[];
  desired_job_types: (string | { name?: string; id?: string; [key: string]: any })[];
  desired_locations: (string | { name?: string; id?: string; [key: string]: any })[];
  management_experience_count: number;
  interested_work_styles: (string | { name?: string; id?: string; [key: string]: any })[];
  last_login_at: string | null;
  
  // 転職活動状況
  has_career_change: string | null;
  job_change_timing: string | null;
  current_activity_status: string | null;
  
  // 職務経歴
  recent_job_company_name: string | null;
  recent_job_department_position: string | null;
  recent_job_start_year: string | null;
  recent_job_start_month: string | null;
  recent_job_end_year: string | null;
  recent_job_end_month: string | null;
  recent_job_is_currently_working: boolean | null;
  recent_job_industries: any;
  recent_job_types: any;
  recent_job_description: string | null;
  
  // 学歴・経験
  education: {
    final_education: string | null;
    school_name: string | null;
    department: string | null;
    graduation_year: number | null;
    graduation_month: number | null;
  }[];
  work_experience: {
    industry_name: string | { name?: string; id?: string; [key: string]: any };
    experience_years: number;
  }[];
  job_type_experience: {
    job_type_name: string | { name?: string; id?: string; [key: string]: any };
    experience_years: number;
  }[];
  
  // スキル・語学
  skills: {
    english_level: string | null;
    other_languages: any;
    skills_list: (string | { name?: string; id?: string; [key: string]: any })[] | null;
    qualifications: string | null;
  }[];
  
  // 希望条件
  expectations: {
    desired_income: string | null;
    desired_industries: any;
    desired_job_types: any;
    desired_work_locations: any;
    desired_work_styles: any;
  }[];
  
  // 職務要約・自己PR
  job_summary: string | null;
  self_pr: string | null;
  
  // 運営メモ
  admin_memo: string | null;
  
  // スカウト統計
  scout_stats: {
    scout_received_7days: number;
    scout_opened_7days: number;
    scout_replied_7days: number;
    applications_7days: number;
    scout_received_30days: number;
    scout_opened_30days: number;
    scout_replied_30days: number;
    applications_30days: number;
    scout_received_total: number;
    scout_opened_total: number;
    scout_replied_total: number;
    applications_total: number;
  };
}

async function fetchCandidateDetail(candidateId: string): Promise<CandidateDetailData> {
  const supabase = getSupabaseAdminClient();
  
  // 並列クエリ実行
  const [candidateResult, educationResult, workExpResult, jobTypeExpResult, skillsResult, expectationsResult, roomsResult] = await Promise.all([
    // 基本情報
    supabase
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
      management_experience_count, interested_work_styles, admin_memo
    `)
      .eq('id', candidateId)
      .single(),
    
    // 学歴
    supabase
      .from('education')
      .select('final_education, school_name, department, graduation_year, graduation_month')
      .eq('candidate_id', candidateId),
    
    // 業種経験
    supabase
      .from('work_experience')
      .select('industry_name, experience_years')
      .eq('candidate_id', candidateId),
    
    // 職種経験
    supabase
      .from('job_type_experience')
      .select('job_type_name, experience_years')
      .eq('candidate_id', candidateId),
    
    // スキル・語学
    supabase
      .from('skills')
      .select('english_level, other_languages, skills_list, qualifications')
      .eq('candidate_id', candidateId),
    
    // 希望条件
    supabase
      .from('expectations')
      .select('desired_income, desired_industries, desired_job_types, desired_work_locations, desired_work_styles')
      .eq('candidate_id', candidateId),
    
    // 候補者が参加しているルーム
    supabase
      .from('rooms')
      .select('id')
      .eq('candidate_id', candidateId)
  ]);

  const { data: candidate, error: candidateError } = candidateResult;
  const { data: education } = educationResult;
  const { data: workExperience } = workExpResult;
  const { data: jobTypeExperience } = jobTypeExpResult;
  const { data: skills } = skillsResult;
  const { data: expectations } = expectationsResult;
  const { data: rooms } = roomsResult;

  if (candidateError || !candidate) {
    throw new Error('候補者が見つかりません');
  }

  // スカウト統計の計算
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const roomIds = rooms ? rooms.map(r => r.id) : [];

  let scoutStats = {
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

  if (roomIds.length > 0) {
    // スカウトと応募の並列取得
    const [scoutResult, appResult] = await Promise.all([
      // スカウト受信数
      supabase
        .from('messages')
        .select('sent_at, read_at, replied_at')
        .in('room_id', roomIds)
        .eq('message_type', 'SCOUT')
        .eq('sender_type', 'COMPANY_USER'),
      
      // 応募数
      supabase
        .from('application')
        .select('created_at')
        .eq('candidate_id', candidateId)
    ]);
    
    const { data: scoutMessages } = scoutResult;
    const { data: applications } = appResult;

    if (scoutMessages) {
      scoutMessages.forEach(msg => {
        const sentDate = new Date(msg.sent_at);
        
        // 受信数
        scoutStats.scout_received_total++;
        if (sentDate >= sevenDaysAgo) scoutStats.scout_received_7days++;
        if (sentDate >= thirtyDaysAgo) scoutStats.scout_received_30days++;
        
        // 開封数
        if (msg.read_at) {
          scoutStats.scout_opened_total++;
          const readDate = new Date(msg.read_at);
          if (readDate >= sevenDaysAgo) scoutStats.scout_opened_7days++;
          if (readDate >= thirtyDaysAgo) scoutStats.scout_opened_30days++;
        }
        
        // 返信数
        if (msg.replied_at) {
          scoutStats.scout_replied_total++;
          const replyDate = new Date(msg.replied_at);
          if (replyDate >= sevenDaysAgo) scoutStats.scout_replied_7days++;
          if (replyDate >= thirtyDaysAgo) scoutStats.scout_replied_30days++;
        }
      });
    }

    if (applications) {
      applications.forEach(app => {
        const appDate = new Date(app.created_at);
        
        scoutStats.applications_total++;
        if (appDate >= sevenDaysAgo) scoutStats.applications_7days++;
        if (appDate >= thirtyDaysAgo) scoutStats.applications_30days++;
      });
    }
  }

  // JSONフィールドの安全なパース
  const safeParseJSON = (value: any, defaultValue: any = null) => {
    if (!value) return defaultValue;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn('JSON parse error for value:', value);
      return defaultValue;
    }
  };

  // candidateオブジェクトのJSONフィールドをパース
  const processedCandidate = {
    ...candidate,
    recent_job_industries: safeParseJSON(candidate.recent_job_industries, []),
    recent_job_types: safeParseJSON(candidate.recent_job_types, []),
    skills: safeParseJSON(candidate.skills, []),
    desired_industries: Array.isArray(candidate.desired_industries) ? candidate.desired_industries : safeParseJSON(candidate.desired_industries, []),
    desired_job_types: Array.isArray(candidate.desired_job_types) ? candidate.desired_job_types : safeParseJSON(candidate.desired_job_types, []),
    desired_locations: Array.isArray(candidate.desired_locations) ? candidate.desired_locations : safeParseJSON(candidate.desired_locations, []),
    interested_work_styles: Array.isArray(candidate.interested_work_styles) ? candidate.interested_work_styles : safeParseJSON(candidate.interested_work_styles, [])
  };

  // skillsデータのJSONフィールドをパース
  const processedSkills = (skills || []).map(skill => ({
    ...skill,
    other_languages: safeParseJSON(skill.other_languages, []),
    skills_list: Array.isArray(skill.skills_list) ? skill.skills_list : safeParseJSON(skill.skills_list, [])
  }));

  // expectationsデータのJSONフィールドをパース
  const processedExpectations = (expectations || []).map(exp => ({
    ...exp,
    desired_industries: safeParseJSON(exp.desired_industries, []),
    desired_job_types: safeParseJSON(exp.desired_job_types, []),
    desired_work_locations: safeParseJSON(exp.desired_work_locations, []),
    desired_work_styles: safeParseJSON(exp.desired_work_styles, [])
  }));

  return {
    ...processedCandidate,
    education: education || [],
    work_experience: workExperience || [],
    job_type_experience: jobTypeExperience || [],
    skills: processedSkills,
    expectations: processedExpectations,
    scout_stats: scoutStats
  } as CandidateDetailData;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateDetailPage({ params }: PageProps) {
  const { id } = await params;
  const candidateData = await fetchCandidateDetail(id);
  
  return <CandidateDetailClient candidate={candidateData} />;
}