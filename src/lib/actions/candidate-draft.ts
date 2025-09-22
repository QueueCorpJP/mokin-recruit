'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

type DraftCandidateData = {
  // Basic form data (CandidateFormData)
  email: string;
  password?: string | null;
  passwordConfirm?: string | null;
  lastName?: string | null;
  firstName?: string | null;
  lastNameKana?: string | null;
  firstNameKana?: string | null;
  gender?: string | null;
  birthYear?: string | null;
  birthMonth?: string | null;
  birthDay?: string | null;
  prefecture?: string | null;
  phoneNumber?: string | null;
  currentIncome?: string | null;
  hasCareerChange?: string | null;
  jobChangeTiming?: string | null;
  currentActivityStatus?: string | null;
  recentJobCompanyName?: string | null;
  recentJobDepartmentPosition?: string | null;
  recentJobStartYear?: string | null;
  recentJobStartMonth?: string | null;
  recentJobEndYear?: string | null;
  recentJobEndMonth?: string | null;
  recentJobIsCurrentlyWorking?: boolean;
  recentJobDescription?: string | null;
  recentJobIndustries?: string[];
  recentJobTypes?: string[];
  jobSummary?: string | null;
  selfPr?: string | null;
  desiredWorkStyles?: string[];
  desiredSalary?: string | null;
  desiredIndustries?: string[];
  desiredJobTypes?: string[];
  desiredLocations?: string[];

  // Education data
  education?: {
    final_education?: string;
    school_name?: string;
    department?: string;
    graduation_year?: number | null;
    graduation_month?: number | null;
  };

  // Skills data
  skills?: {
    english_level?: string;
    other_languages?: Array<{ language: string; level: string }>;
    qualifications?: string;
    skills_tags?: string[];
  };

  // Selection entries and work history
  careerStatusEntries?: any[];
  workHistoryEntries?: any[];

  // Admin memo
  memo?: string | null;
};

export async function saveCandidateDraft(data: DraftCandidateData) {
  try {
    console.log('🔍 [DRAFT SAVE] Starting draft save...');

    // 管理画面の他のServer Actionと同様にAdminClientを使用（認証チェックなし）
    const supabase = getSupabaseAdminClient();

    if (!data.email) {
      return { success: false, error: 'メールアドレスは必須です' };
    }

    // Create birth_date from birthYear, birthMonth, birthDay if available
    let birth_date: string | null = null;
    if (data.birthYear && data.birthMonth && data.birthDay) {
      birth_date = `${data.birthYear}-${data.birthMonth.padStart(2, '0')}-${data.birthDay.padStart(2, '0')}`;
    }

    // Convert formData camelCase to database snake_case
    const dataToSave = {
      email: data.email,
      status: 'DRAFT',
      last_name: data.lastName || null,
      first_name: data.firstName || null,
      last_name_kana: data.lastNameKana || null,
      first_name_kana: data.firstNameKana || null,
      gender: data.gender || null,
      birth_date: birth_date,
      phone_number: data.phoneNumber || null,
      prefecture: data.prefecture || null,
      current_income: data.currentIncome || null,
      has_career_change: data.hasCareerChange || null,
      job_change_timing: data.jobChangeTiming || null,
      current_activity_status: data.currentActivityStatus || null,
      recent_job_company_name: data.recentJobCompanyName || null,
      recent_job_department_position: data.recentJobDepartmentPosition || null,
      recent_job_start_year: data.recentJobStartYear || null,
      recent_job_start_month: data.recentJobStartMonth || null,
      recent_job_end_year: data.recentJobEndYear || null,
      recent_job_end_month: data.recentJobEndMonth || null,
      recent_job_is_currently_working:
        data.recentJobIsCurrentlyWorking || false,
      recent_job_description: data.recentJobDescription || null,
      recent_job_industries: data.recentJobIndustries || null,
      recent_job_types: data.recentJobTypes || null,
      job_summary: data.jobSummary || null,
      self_pr: data.selfPr || null,
      desired_salary: data.desiredSalary || null,
      desired_industries: data.desiredIndustries || null,
      desired_job_types: data.desiredJobTypes || null,
      desired_locations: data.desiredLocations || null,
      interested_work_styles: data.desiredWorkStyles || null,
      admin_memo: data.memo || null,
      updated_at: new Date().toISOString(),
    };

    // Add password hash if password is provided (for draft save)
    if (data.password && data.password.trim()) {
      try {
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(data.password, 10);
        (dataToSave as any).password_hash = hashedPassword;
      } catch (error) {
        console.warn('Failed to hash password for draft save:', error);
      }
    }

    const { data: existingCandidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', data.email)
      .single();

    let result;
    if (existingCandidate) {
      result = await supabase
        .from('candidates')
        .update(dataToSave)
        .eq('id', existingCandidate.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('candidates')
        .insert([dataToSave])
        .select()
        .single();
    }

    if (result.error) {
      console.error('下書き保存エラー:', result.error);
      return { success: false, error: '下書きの保存に失敗しました' };
    }

    return {
      success: true,
      message: '下書きを保存しました',
      candidate: result.data,
    };
  } catch (error) {
    console.error('下書き保存エラー:', error);
    return { success: false, error: '下書きの保存に失敗しました' };
  }
}
