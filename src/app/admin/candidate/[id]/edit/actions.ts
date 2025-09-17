'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';
import type {
  UpdateCandidateData,
  AdminEducationData as EducationData,
  AdminWorkExperienceData as WorkExperienceData,
  AdminJobTypeExperienceData as JobTypeExperienceData,
  AdminSkillsData as SkillsData,
  AdminExpectationsData as ExpectationsData,
} from '@/types/admin';

export async function checkEmailDuplication(
  email: string,
  excludeCandidateId?: string
) {
  try {
    const supabase = getSupabaseAdminClient();

    let query = supabase.from('candidates').select('id').eq('email', email);

    // 編集時は自分のIDを除外
    if (excludeCandidateId) {
      query = query.neq('id', excludeCandidateId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return { isDuplicate: data && data.length > 0 };
  } catch (error) {
    console.error('Error checking email duplication:', error);
    return {
      isDuplicate: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

interface UpdateCandidateRequest {
  candidateId: string;
  formData: UpdateCandidateData;
  education: EducationData;
  workExperience: WorkExperienceData[];
  jobTypeExperience: JobTypeExperienceData[];
  skills: SkillsData;
  expectations: ExpectationsData;
  memo?: string;
  selectionEntries?: any[];
}

export async function updateCandidateData(request: UpdateCandidateRequest) {
  const {
    candidateId,
    formData,
    education,
    workExperience,
    jobTypeExperience,
    skills,
    expectations,
    memo: _memo,
    selectionEntries,
  } = request;
  try {
    const supabase = getSupabaseAdminClient();

    // Create birth_date from year, month, day
    let birth_date: string | null = null;
    if (formData.birth_date) {
      birth_date = formData.birth_date;
    }

    // Handle password update - use columns that exist in candidates table (confirmed from page.tsx)
    const updateData: any = {
      email: formData.email,
      last_name: formData.last_name,
      first_name: formData.first_name,
      last_name_kana: formData.last_name_kana,
      first_name_kana: formData.first_name_kana,
      gender: formData.gender,
      birth_date: birth_date,
      prefecture: formData.prefecture,
      phone_number: formData.phone_number,
      current_income: formData.current_income,
      current_salary: formData.current_salary || null,
      desired_salary: formData.desired_salary || null,
      current_company: formData.current_company || null,
      current_position: formData.current_position || null,
      current_residence: formData.current_residence || null,
      has_career_change: formData.has_career_change,
      job_change_timing: formData.job_change_timing,
      current_activity_status: formData.current_activity_status,
      recent_job_company_name: formData.recent_job_company_name,
      recent_job_department_position: formData.recent_job_department_position,
      recent_job_start_year: formData.recent_job_start_year,
      recent_job_start_month: formData.recent_job_start_month,
      recent_job_end_year: formData.recent_job_end_year,
      recent_job_end_month: formData.recent_job_end_month,
      recent_job_is_currently_working: formData.recent_job_is_currently_working,
      recent_job_description: formData.recent_job_description,
      recent_job_industries: formData.recent_job_industries,
      recent_job_types: formData.recent_job_types,
      job_summary: formData.job_summary,
      self_pr: formData.self_pr,
      skills: formData.skills || null,
      desired_industries: formData.desired_industries || null,
      desired_job_types: formData.desired_job_types || null,
      desired_locations: formData.desired_locations || null,
      management_experience_count: formData.management_experience_count || 0,
      interested_work_styles: formData.desired_work_styles || null,
    };

    // Add password hash if password is provided
    if (formData.password && formData.password.trim()) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      updateData.password_hash = hashedPassword;
    }

    // Update main candidate record
    const { error: candidateError } = await supabase
      .from('candidates')
      .update(updateData)
      .eq('id', candidateId);

    if (candidateError) {
      throw new Error(`Candidate update failed: ${candidateError.message}`);
    }

    // Update education
    await supabase.from('education').delete().eq('candidate_id', candidateId);

    if (education.final_education || education.school_name) {
      const { error: educationError } = await supabase
        .from('education')
        .insert({
          candidate_id: candidateId,
          final_education: education.final_education,
          school_name: education.school_name,
          department: education.department,
          graduation_year: education.graduation_year,
          graduation_month: education.graduation_month,
        });

      if (educationError) {
        throw educationError;
      }
    }

    // Update work experience
    await supabase
      .from('work_experience')
      .delete()
      .eq('candidate_id', candidateId);

    if (workExperience.length > 0) {
      const workExpData = workExperience
        .filter(exp => exp.industry_name && exp.industry_name.trim())
        .map(exp => ({
          candidate_id: candidateId,
          industry_id: exp.industry_name,
          industry_name: exp.industry_name,
          experience_years: exp.experience_years || 0,
        }));

      if (workExpData.length > 0) {
        const { error: workExpError } = await supabase
          .from('work_experience')
          .insert(workExpData);

        if (workExpError) {
          console.error('Work experience error:', workExpError);
        }
      }
    }

    // Update job type experience
    await supabase
      .from('job_type_experience')
      .delete()
      .eq('candidate_id', candidateId);

    if (jobTypeExperience.length > 0) {
      const jobTypeExpData = jobTypeExperience
        .filter(exp => exp.job_type_name && exp.job_type_name.trim())
        .map(exp => ({
          candidate_id: candidateId,
          job_type_id: exp.job_type_name,
          job_type_name: exp.job_type_name,
          experience_years: exp.experience_years || 0,
        }));

      if (jobTypeExpData.length > 0) {
        const { error: jobTypeExpError } = await supabase
          .from('job_type_experience')
          .insert(jobTypeExpData);

        if (jobTypeExpError) {
          console.error('Job type experience error:', jobTypeExpError);
        }
      }
    }

    // Update skills
    await supabase.from('skills').delete().eq('candidate_id', candidateId);

    if (
      skills.english_level ||
      skills.qualifications ||
      skills.skills_list?.length
    ) {
      const { error: skillsError } = await supabase.from('skills').insert({
        candidate_id: candidateId,
        english_level: skills.english_level,
        other_languages: skills.other_languages,
        skills_list: skills.skills_list,
        qualifications: skills.qualifications,
      });

      if (skillsError) {
        throw skillsError;
      }
    }

    // Update expectations
    await supabase
      .from('expectations')
      .delete()
      .eq('candidate_id', candidateId);

    if (
      expectations &&
      (expectations.desired_income ||
        expectations.desired_industries?.length ||
        expectations.desired_job_types?.length ||
        expectations.desired_work_locations?.length ||
        expectations.desired_work_styles?.length)
    ) {
      const { error: expectationsError } = await supabase
        .from('expectations')
        .insert({
          candidate_id: candidateId,
          desired_income: expectations.desired_income || null,
          desired_industries: expectations.desired_industries || null,
          desired_job_types: expectations.desired_job_types || null,
          desired_work_locations: expectations.desired_work_locations || null,
          desired_work_styles: expectations.desired_work_styles || null,
        });

      if (expectationsError) {
        throw expectationsError;
      }
    }

    // Note: admin_memo column does not exist in database, skipping memo update

    // Update selection entries (career status) if provided
    if (selectionEntries && selectionEntries.length > 0) {
      // Delete existing career status entries
      await supabase
        .from('career_status_entries')
        .delete()
        .eq('candidate_id', candidateId);

      // Insert new career status entries with only columns that exist in the database
      const careerStatusData = selectionEntries.map(entry => ({
        candidate_id: candidateId,
        company_name: entry.companyName || '',
        department: entry.department || '',
        industries: entry.industries || [],
        is_private: entry.isPrivate || false,
        progress_status: entry.progressStatus || null,
      }));

      const { error: careerStatusError } = await supabase
        .from('career_status_entries')
        .insert(careerStatusData);

      if (careerStatusError) {
        console.error('Career status entries error:', careerStatusError);
      }
    }

    // Revalidate the candidate detail page
    revalidatePath(`/admin/candidate/${candidateId}`);
    revalidatePath(`/admin/candidate/${candidateId}/edit`);

    return { success: true };
  } catch (error) {
    console.error('Update error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: `Update failed: ${JSON.stringify(error)}` };
  }
}
