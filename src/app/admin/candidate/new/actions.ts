'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';
import type {
  CandidateFormData,
  EducationFormData as EducationData,
  SkillsFormData as SkillsData,
  SelectionEntry as SelectionEntryData,
} from '@/types/forms';

// Admin-specific types
interface CreateCandidateData extends CandidateFormData {
  memo?: string;
}

interface AdminWorkExperienceData {
  industry_name: string;
  experience_years: number;
}

interface AdminJobTypeExperienceData {
  job_type_name: string;
  experience_years: number;
}

interface AdminExpectationsData {
  desired_income?: string;
  desired_industries?: string[];
  desired_job_types?: string[];
  desired_work_locations?: string[];
  desired_work_styles?: string[];
}

export async function checkEmailDuplication(email: string) {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('candidates')
      .select('id')
      .eq('email', email);

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

// Validation schema for candidate creation
const CreateCandidateSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .optional()
    .refine(
      password => {
        if (!password || password.trim() === '') return true; // Optional
        return password.length >= 8;
      },
      {
        message: 'パスワードは8文字以上で入力してください',
      }
    ),
  last_name: z.string().min(1, '姓を入力してください'),
  first_name: z.string().min(1, '名を入力してください'),
  last_name_kana: z.string().optional(),
  first_name_kana: z.string().optional(),
  gender: z.enum(['male', 'female', 'unspecified']).optional(),
  birth_date: z.string().nullable(),
  prefecture: z.string().optional(),
  phone_number: z.string().optional(),
  current_income: z.string().optional(),
});

export async function validateCandidateData(formData: CreateCandidateData) {
  // Convert camelCase form data to snake_case for validation
  const validationData = {
    email: formData.email,
    password: formData.password,
    last_name: formData.lastName,
    first_name: formData.firstName,
    last_name_kana: formData.lastNameKana,
    first_name_kana: formData.firstNameKana,
    gender: formData.gender,
    birth_date:
      formData.birthYear && formData.birthMonth && formData.birthDay
        ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
        : null,
    prefecture: formData.prefecture,
    phone_number: formData.phoneNumber,
    current_income: formData.currentIncome,
  };

  console.log('Validation data:', JSON.stringify(validationData, null, 2));
  const validationResult = CreateCandidateSchema.safeParse(validationData);
  if (!validationResult.success) {
    const errors = validationResult.error.errors.map(error => ({
      field: error.path.join('.'),
      message: error.message,
    }));
    return { success: false, errors };
  }
  return { success: true, data: validationResult.data };
}

export async function createCandidateData(
  formData: CreateCandidateData,
  education: EducationData,
  workExperience: WorkExperienceData[],
  jobTypeExperience: JobTypeExperienceData[],
  skills: SkillsData,
  expectations: ExpectationsData,
  selectionEntries: SelectionEntryData[],
  memo?: string
) {
  try {
    // Debug: Log the received form data
    console.log('Received formData:', JSON.stringify(formData, null, 2));

    // Step 0: Validate input data
    const validation = await validateCandidateData(formData);
    console.log('Validation result:', validation);
    if (!validation.success) {
      console.log('Validation errors:', validation.errors);
      return {
        success: false,
        error:
          validation.errors?.[0]?.message || '入力データが正しくありません',
        validationErrors: validation.errors,
      };
    }

    // Additional validation for skills and work styles
    if (!skills.skills_tags || skills.skills_tags.length < 3) {
      return {
        success: false,
        error: 'スキルは最低3つ以上入力してください',
      };
    }

    // Only validate work styles if the field exists and is not empty array
    if (
      formData.desiredWorkStyles !== undefined &&
      formData.desiredWorkStyles.length === 0
    ) {
      return {
        success: false,
        error: '興味のある働き方を選択してください',
      };
    }

    // Check email duplication
    const emailCheck = await checkEmailDuplication(formData.email);
    if (emailCheck.error) {
      return {
        success: false,
        error: emailCheck.error,
      };
    }
    if (emailCheck.isDuplicate) {
      return {
        success: false,
        error: 'このメールアドレスは既に登録されています。',
      };
    }

    const supabase = getSupabaseAdminClient();

    // Step 1: Create auth user if password is provided
    let authUserId: string | null = null;
    if (formData.password && formData.password.trim()) {
      try {
        const { data: authData, error: authError } =
          await supabase.auth.admin.createUser({
            email: formData.email,
            password: formData.password,
            email_confirm: true, // Skip email verification for admin-created users
            user_metadata: {
              user_type: 'candidate',
              created_by: 'admin',
              signup_step: 'completed',
              email_verification_required: false,
            },
          });

        if (authError) {
          if (
            authError.message?.includes('already registered') ||
            authError.message?.includes('User already registered')
          ) {
            return {
              success: false,
              error: 'このメールアドレスは既に登録されています。',
            };
          }
          console.error('Auth user creation error:', authError);
          return {
            success: false,
            error: `ユーザー認証の作成に失敗しました: ${authError.message}`,
          };
        }

        authUserId = authData.user?.id || null;
        console.log('Auth user created:', authUserId);
      } catch (authCreateError) {
        console.error('Auth creation failed:', authCreateError);
        return {
          success: false,
          error: 'ユーザー認証の作成に失敗しました。',
        };
      }
    }

    // Step 2: Create main candidate record
    // Map camelCase form data to snake_case database fields
    const candidateInsertData: any = {
      email: formData.email,
      last_name: formData.lastName,
      first_name: formData.firstName,
      last_name_kana: formData.lastNameKana,
      first_name_kana: formData.firstNameKana,
      gender: formData.gender,
      birth_date:
        formData.birthYear && formData.birthMonth && formData.birthDay
          ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
          : null,
      prefecture: formData.prefecture,
      phone_number: formData.phoneNumber,
      current_income: formData.currentIncome,
      current_salary: formData.currentSalary || null,
      desired_salary: formData.desiredSalary || null,
      current_company: formData.currentCompany || null,
      current_position: formData.currentPosition || null,
      current_residence: formData.currentResidence || null,
      has_career_change: formData.hasCareerChange,
      job_change_timing: formData.jobChangeTiming,
      current_activity_status: formData.currentActivityStatus,
      recent_job_company_name: formData.recentJobCompanyName,
      recent_job_department_position: formData.recentJobDepartmentPosition,
      recent_job_start_year: formData.recentJobStartYear,
      recent_job_start_month: formData.recentJobStartMonth,
      recent_job_end_year: formData.recentJobEndYear,
      recent_job_end_month: formData.recentJobEndMonth,
      recent_job_is_currently_working: formData.recentJobIsCurrentlyWorking,
      recent_job_description: formData.recentJobDescription,
      recent_job_industries: formData.recentJobIndustries,
      recent_job_types: formData.recentJobTypes,
      job_summary: formData.jobSummary,
      self_pr: formData.selfPr,
      skills: formData.skills || null,
      desired_industries: formData.desiredIndustries || null,
      desired_job_types: formData.desiredJobTypes || null,
      desired_locations: formData.desiredLocations || null,
      management_experience_count: formData.managementExperienceCount || 0,
      interested_work_styles: formData.desiredWorkStyles || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Add password hash if password is provided
    if (formData.password && formData.password.trim()) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.hash(formData.password, 10);
      candidateInsertData.password_hash = hashedPassword;
    }

    // Link to auth user if created
    if (authUserId) {
      candidateInsertData.auth_user_id = authUserId;
    }

    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .insert(candidateInsertData)
      .select('id')
      .single();

    if (candidateError) {
      // If candidate creation fails but auth user was created, clean up auth user
      if (authUserId) {
        try {
          await supabase.auth.admin.deleteUser(authUserId);
          console.log('Cleaned up auth user after candidate creation failure');
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }
      }
      console.error('Candidate creation error:', candidateError);
      throw candidateError;
    }

    console.log('Created candidate:', candidate);
    const candidateId = String(candidate.id);
    console.log('Candidate ID:', candidateId, typeof candidateId);

    // Insert education
    if (education.final_education) {
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

    // Insert work experience
    if (workExperience.length > 0) {
      const workExpData = workExperience
        .filter(exp => exp.industry_name && exp.industry_name.trim())
        .map(exp => ({
          candidate_id: candidateId,
          industry_id: exp.industry_name,
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

    // Insert job type experience
    if (jobTypeExperience.length > 0) {
      const jobTypeExpData = jobTypeExperience
        .filter(exp => exp.job_type_name && exp.job_type_name.trim())
        .map(exp => ({
          candidate_id: candidateId,
          job_type_id: exp.job_type_name,
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

    // Insert skills
    if (
      (skills.english_level ?? 'none') ||
      skills.qualifications ||
      (skills.skills_tags && skills.skills_tags.length > 0)
    ) {
      const { error: skillsError } = await supabase.from('skills').insert({
        candidate_id: candidateId,
        english_level: skills.english_level ?? 'none',
        other_languages: skills.other_languages || null,
        skills_list: skills.skills_tags || [],
        qualifications: skills.qualifications,
      });

      if (skillsError) {
        throw skillsError;
      }
    }

    // Insert expectations
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

    // Insert selection entries if provided
    if (selectionEntries && selectionEntries.length > 0) {
      const entriesData = selectionEntries
        .filter(entry => (entry.companyName || '').trim())
        .map(entry => ({
          candidate_id: candidateId,
          is_private: entry.isPrivate || false,
          company_name: entry.companyName || '',
          department: entry.department || null,
          industries: entry.industries || [],
          progress_status: entry.progressStatus || null,
          decline_reason: entry.declineReason || null,
        }));

      if (entriesData.length > 0) {
        const { error: careerStatusError } = await supabase
          .from('career_status_entries')
          .insert(entriesData);

        if (careerStatusError) {
          console.warn(
            'Career status entries insert error:',
            careerStatusError
          );
        }
      }
    }

    // Update memo if provided
    if (memo !== undefined) {
      const { error: memoError } = await supabase
        .from('candidates')
        .update({ admin_memo: memo })
        .eq('id', candidateId);

      if (memoError) {
        console.warn('Error updating memo:', memoError);
      }
    }

    // Revalidate the candidate list page
    revalidatePath('/admin/candidate');

    console.log('About to return success with candidateId:', candidateId);
    return { success: true, candidateId };
  } catch (error) {
    console.error('Error creating candidate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
