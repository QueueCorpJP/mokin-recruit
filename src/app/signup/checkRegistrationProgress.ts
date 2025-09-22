'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface RegistrationProgress {
  exists: boolean;
  candidateId?: string;
  nextStep: string;
  completedSteps: {
    emailVerified: boolean;
    passwordSet: boolean;
    profileCompleted: boolean;
    careerStatusCompleted: boolean;
    recentJobCompleted: boolean;
    resumeUploaded: boolean;
    educationCompleted: boolean;
    skillsCompleted: boolean;
    expectationCompleted: boolean;
  };
}

export async function checkRegistrationProgress(
  email: string
): Promise<RegistrationProgress> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Check if candidate exists
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select(
      `
      id,
      email,
      password_hash,
      status,
      first_name,
      last_name,
      first_name_kana,
      last_name_kana,
      gender,
      birth_date,
      phone_number,
      prefecture,
      current_income,
      has_career_change,
      job_change_timing,
      current_activity_status,
      recent_job_company_name,
      recent_job_department_position,
      recent_job_start_year,
      recent_job_industries,
      recent_job_types,
      recent_job_description,
      resume_url
    `
    )
    .eq('email', email)
    .single();

  if (!candidate || candidateError) {
    return {
      exists: false,
      nextStep: '/signup',
      completedSteps: {
        emailVerified: false,
        passwordSet: false,
        profileCompleted: false,
        careerStatusCompleted: false,
        recentJobCompleted: false,
        resumeUploaded: false,
        educationCompleted: false,
        skillsCompleted: false,
        expectationCompleted: false,
      },
    };
  }

  const candidateId = candidate.id;

  // Check education
  const { data: education } = await supabase
    .from('education')
    .select('id, final_education, school_name, graduation_year')
    .eq('candidate_id', candidateId)
    .single();

  // Check skills
  const { data: skills } = await supabase
    .from('skills')
    .select('id, english_level, skills_list')
    .eq('candidate_id', candidateId)
    .single();

  // Check expectations
  const { data: expectations } = await supabase
    .from('expectations')
    .select(
      'id, desired_income, desired_industries, desired_job_types, desired_work_locations, desired_work_styles'
    )
    .eq('candidate_id', candidateId)
    .single();

  // Helper function to check if a step is completed based on its data or if later steps are completed
  const isStepCompleted = (
    stepData: boolean,
    laterStepsData: boolean[]
  ): boolean => {
    return stepData || laterStepsData.some(laterStep => laterStep);
  };

  // Define base completion status for each step
  const baseCompletedSteps = {
    emailVerified: candidate.email !== null,
    passwordSet: !!(
      candidate.password_hash !== null &&
      (candidate.status === 'active' ||
        candidate.status === 'password_setting_ready' ||
        candidate.password_hash === 'set')
    ),
    profileCompleted: !!(
      candidate.first_name &&
      candidate.last_name &&
      candidate.first_name_kana &&
      candidate.last_name_kana &&
      candidate.gender &&
      candidate.birth_date &&
      candidate.phone_number &&
      candidate.prefecture
    ),
    careerStatusCompleted: !!(
      candidate.current_income &&
      candidate.has_career_change &&
      candidate.job_change_timing &&
      candidate.current_activity_status
    ),
    recentJobCompleted: !!(
      candidate.recent_job_company_name &&
      candidate.recent_job_department_position &&
      candidate.recent_job_start_year &&
      candidate.recent_job_industries &&
      candidate.recent_job_types &&
      candidate.recent_job_description
    ),
    resumeUploaded: !!candidate.resume_url,
    educationCompleted: !!(
      education?.id &&
      education?.final_education &&
      education?.school_name &&
      education?.graduation_year
    ),
    skillsCompleted: !!(
      skills?.id &&
      skills?.english_level &&
      skills?.skills_list &&
      skills.skills_list.length > 0
    ),
    expectationCompleted: !!(
      expectations?.id &&
      expectations?.desired_income &&
      expectations?.desired_industries &&
      expectations?.desired_job_types &&
      expectations?.desired_work_locations &&
      expectations?.desired_work_styles &&
      (expectations.desired_industries as any[])?.length > 0 &&
      (expectations.desired_job_types as any[])?.length > 0 &&
      (expectations.desired_work_locations as any[])?.length > 0 &&
      (expectations.desired_work_styles as any[])?.length > 0
    ),
  };

  // Apply cascading logic: if a later step is completed, earlier steps are also considered completed
  const completedSteps = {
    emailVerified: isStepCompleted(baseCompletedSteps.emailVerified, [
      baseCompletedSteps.passwordSet,
      baseCompletedSteps.profileCompleted,
      baseCompletedSteps.careerStatusCompleted,
      baseCompletedSteps.recentJobCompleted,
      baseCompletedSteps.resumeUploaded,
      baseCompletedSteps.educationCompleted,
      baseCompletedSteps.skillsCompleted,
      baseCompletedSteps.expectationCompleted,
    ]),
    passwordSet: isStepCompleted(baseCompletedSteps.passwordSet, [
      baseCompletedSteps.profileCompleted,
      baseCompletedSteps.careerStatusCompleted,
      baseCompletedSteps.recentJobCompleted,
      baseCompletedSteps.resumeUploaded,
      baseCompletedSteps.educationCompleted,
      baseCompletedSteps.skillsCompleted,
      baseCompletedSteps.expectationCompleted,
    ]),
    profileCompleted: isStepCompleted(baseCompletedSteps.profileCompleted, [
      baseCompletedSteps.careerStatusCompleted,
      baseCompletedSteps.recentJobCompleted,
      baseCompletedSteps.resumeUploaded,
      baseCompletedSteps.educationCompleted,
      baseCompletedSteps.skillsCompleted,
      baseCompletedSteps.expectationCompleted,
    ]),
    careerStatusCompleted: isStepCompleted(
      baseCompletedSteps.careerStatusCompleted,
      [
        baseCompletedSteps.recentJobCompleted,
        baseCompletedSteps.resumeUploaded,
        baseCompletedSteps.educationCompleted,
        baseCompletedSteps.skillsCompleted,
        baseCompletedSteps.expectationCompleted,
      ]
    ),
    recentJobCompleted: isStepCompleted(baseCompletedSteps.recentJobCompleted, [
      baseCompletedSteps.resumeUploaded,
      baseCompletedSteps.educationCompleted,
      baseCompletedSteps.skillsCompleted,
      baseCompletedSteps.expectationCompleted,
    ]),
    resumeUploaded: isStepCompleted(baseCompletedSteps.resumeUploaded, [
      baseCompletedSteps.educationCompleted,
      baseCompletedSteps.skillsCompleted,
      baseCompletedSteps.expectationCompleted,
    ]),
    educationCompleted: isStepCompleted(baseCompletedSteps.educationCompleted, [
      baseCompletedSteps.skillsCompleted,
      baseCompletedSteps.expectationCompleted,
    ]),
    skillsCompleted: isStepCompleted(baseCompletedSteps.skillsCompleted, [
      baseCompletedSteps.expectationCompleted,
    ]),
    expectationCompleted: baseCompletedSteps.expectationCompleted,
  };

  // Determine next step based on registration flow order
  let nextStep = '/signup/complete'; // Default if all completed

  const registrationSteps = [
    { completed: completedSteps.emailVerified, path: '/signup/verify' },
    { completed: completedSteps.passwordSet, path: '/signup/password' },
    { completed: completedSteps.profileCompleted, path: '/signup/profile' },
    {
      completed: completedSteps.careerStatusCompleted,
      path: '/signup/career-status',
    },
    {
      completed: completedSteps.recentJobCompleted,
      path: '/signup/recent-job',
    },
    { completed: completedSteps.resumeUploaded, path: '/signup/resume' },
    { completed: completedSteps.educationCompleted, path: '/signup/education' },
    { completed: completedSteps.skillsCompleted, path: '/signup/skills' },
    {
      completed: completedSteps.expectationCompleted,
      path: '/signup/expectation',
    },
  ];

  // Find the first incomplete step
  for (const step of registrationSteps) {
    if (!step.completed) {
      nextStep = step.path;
      break;
    }
  }

  // If all steps are completed, go to summary
  if (nextStep === '/signup/complete') {
    nextStep = '/signup/summary';
  }

  return {
    exists: true,
    candidateId,
    nextStep,
    completedSteps,
  };
}
