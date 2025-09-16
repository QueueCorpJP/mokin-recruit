'use server';

import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';
import type {
  CreateCandidateData,
  AdminEducationData as EducationData,
  AdminWorkExperienceData as WorkExperienceData,
  AdminJobTypeExperienceData as JobTypeExperienceData,
  AdminSkillsData as SkillsData,
  AdminExpectationsData as ExpectationsData,
  AdminSelectionEntryData as SelectionEntryData,
} from '@/types/admin';

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
  last_name_kana: z.string().min(1, '姓（カナ）を入力してください'),
  first_name_kana: z.string().min(1, '名（カナ）を入力してください'),
  gender: z.enum(['male', 'female', 'unspecified'], {
    errorMap: () => ({ message: '性別を選択してください' }),
  }),
  birth_date: z.string().nullable(),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  phone_number: z.string().min(1, '電話番号を入力してください'),
  current_income: z.string().min(1, '現在の年収を入力してください'),
});

export async function validateCandidateData(formData: CreateCandidateData) {
  const validationResult = CreateCandidateSchema.safeParse(formData);
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
    // Step 0: Validate input data
    const validation = await validateCandidateData(formData);
    if (!validation.success) {
      return {
        success: false,
        error:
          validation.errors?.[0]?.message || '入力データが正しくありません',
        validationErrors: validation.errors,
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
    const candidateInsertData: any = {
      email: formData.email,
      last_name: formData.last_name,
      first_name: formData.first_name,
      last_name_kana: formData.last_name_kana,
      first_name_kana: formData.first_name_kana,
      gender: formData.gender,
      birth_date: formData.birth_date,
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
      interested_work_styles: formData.interested_work_styles || null,
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

    // Insert work experience
    if (workExperience.length > 0) {
      const workExpData = workExperience
        .filter(exp => exp.industry_name && exp.industry_name.trim())
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

    // Insert job type experience
    if (jobTypeExperience.length > 0) {
      const jobTypeExpData = jobTypeExperience
        .filter(exp => exp.job_type_name && exp.job_type_name.trim())
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

    // Insert skills
    if (
      skills.english_level ||
      skills.qualifications ||
      (skills.skills_tags && skills.skills_tags.length > 0)
    ) {
      const { error: skillsError } = await supabase.from('skills').insert({
        candidate_id: candidateId,
        english_level: skills.english_level,
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
        .filter(entry => entry.companyName.trim())
        .map(entry => ({
          candidate_id: candidateId,
          company_name: entry.companyName,
          industries: entry.industries,
          job_types: entry.jobTypes,
        }));

      if (entriesData.length > 0) {
        const { error: entriesError } = await supabase
          .from('candidate_selection_entries')
          .insert(entriesData);

        if (entriesError && entriesError.code !== '42P01') {
          // Ignore table doesn't exist error for now
          console.warn('Selection entries table may not exist:', entriesError);
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
