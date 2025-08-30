'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';

export interface UpdateCandidateData {
  // Basic info
  email: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: 'male' | 'female' | 'unspecified';
  birth_date: string;
  prefecture: string;
  phone_number: string;
  current_income: string;
  
  // Career status
  has_career_change: string;
  job_change_timing: string;
  current_activity_status: string;
  
  // Recent job
  recent_job_company_name: string;
  recent_job_department_position: string;
  recent_job_start_year: string;
  recent_job_start_month: string;
  recent_job_end_year: string;
  recent_job_end_month: string;
  recent_job_is_currently_working: boolean;
  recent_job_description: string;
  
  // Summary
  job_summary: string;
  self_pr: string;
}

export interface EducationData {
  final_education: string;
  school_name: string;
  department: string;
  graduation_year: number | null;
  graduation_month: number | null;
}

export interface WorkExperienceData {
  industry_name: string;
  experience_years: number;
}

export interface JobTypeExperienceData {
  job_type_name: string;
  experience_years: number;
}

export interface SkillsData {
  english_level: string;
  other_languages: any;
  skills_list: string[];
  qualifications: string;
}

export async function updateCandidateData(
  candidateId: string,
  formData: UpdateCandidateData,
  education: EducationData,
  workExperience: WorkExperienceData[],
  jobTypeExperience: JobTypeExperienceData[],
  skills: SkillsData
) {
  try {
    const supabase = getSupabaseAdminClient();

    // Create birth_date from year, month, day
    let birth_date = null;
    if (formData.birth_date) {
      birth_date = formData.birth_date;
    }

    // Update main candidate record
    const { error: candidateError } = await supabase
      .from('candidates')
      .update({
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
        job_summary: formData.job_summary,
        self_pr: formData.self_pr,
      })
      .eq('id', candidateId);

    if (candidateError) {
      throw candidateError;
    }

    // Update education
    await supabase
      .from('education')
      .delete()
      .eq('candidate_id', candidateId);

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
        .filter(exp => exp.industry_name.trim())
        .map(exp => ({
          candidate_id: candidateId,
          industry_name: exp.industry_name,
          experience_years: exp.experience_years,
        }));

      if (workExpData.length > 0) {
        const { error: workExpError } = await supabase
          .from('work_experience')
          .insert(workExpData);

        if (workExpError) {
          throw workExpError;
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
        .filter(exp => exp.job_type_name.trim())
        .map(exp => ({
          candidate_id: candidateId,
          job_type_name: exp.job_type_name,
          experience_years: exp.experience_years,
        }));

      if (jobTypeExpData.length > 0) {
        const { error: jobTypeExpError } = await supabase
          .from('job_type_experience')
          .insert(jobTypeExpData);

        if (jobTypeExpError) {
          throw jobTypeExpError;
        }
      }
    }

    // Update skills
    await supabase
      .from('skills')
      .delete()
      .eq('candidate_id', candidateId);

    if (skills.english_level || skills.qualifications) {
      const { error: skillsError } = await supabase
        .from('skills')
        .insert({
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

    // Revalidate the candidate detail page
    revalidatePath(`/admin/candidate/${candidateId}`);
    revalidatePath(`/admin/candidate/${candidateId}/edit`);

    return { success: true };
  } catch (error) {
    console.error('Error updating candidate:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}