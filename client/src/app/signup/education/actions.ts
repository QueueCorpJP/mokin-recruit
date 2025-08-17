'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface EducationFormData {
  finalEducation: string;
  schoolName?: string;
  department?: string;
  graduationYear?: number;
  graduationMonth?: number;
  industries: Array<{ id: string; name: string; experienceYears: number }>;
  jobTypes: Array<{ id: string; name: string; experienceYears: number }>;
}

export async function saveEducationData(formData: EducationFormData) {
  console.log('=== Start saveEducationData ===');
  try {
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

    const { data: uuidData, error: uuidError } = await supabase.rpc('gen_random_uuid');
    const candidateId = uuidData || crypto.randomUUID();

    console.log('Candidate ID for education data:', candidateId);

    // Save education data
    const { data: educationData, error: educationError } = await supabase
      .from('education')
      .upsert({
        candidate_id: candidateId,
        final_education: formData.finalEducation,
        school_name: formData.schoolName || null,
        department: formData.department || null,
        graduation_year: formData.graduationYear || null,
        graduation_month: formData.graduationMonth || null,
      }, {
        onConflict: 'candidate_id'
      });

    if (educationError) {
      throw new Error(`Education data save failed: ${educationError.message}`);
    }

    // Save work experience data
    if (formData.industries && formData.industries.length > 0) {
      // First delete existing work experience for this candidate
      await supabase
        .from('work_experience')
        .delete()
        .eq('candidate_id', candidateId);

      // Insert new work experience data
      const workExperienceData = formData.industries.map(industry => ({
        candidate_id: candidateId,
        industry_id: industry.id,
        industry_name: industry.name,
        experience_years: industry.experienceYears,
      }));

      const { error: workExperienceError } = await supabase
        .from('work_experience')
        .insert(workExperienceData);

      if (workExperienceError) {
        throw new Error(`Work experience data save failed: ${workExperienceError.message}`);
      }
    }

    // Save job type experience data
    if (formData.jobTypes && formData.jobTypes.length > 0) {
      // First delete existing job type experience for this candidate
      await supabase
        .from('job_type_experience')
        .delete()
        .eq('candidate_id', candidateId);

      // Insert new job type experience data
      const jobTypeExperienceData = formData.jobTypes.map(jobType => ({
        candidate_id: candidateId,
        job_type_id: jobType.id,
        job_type_name: jobType.name,
        experience_years: jobType.experienceYears,
      }));

      const { error: jobTypeExperienceError } = await supabase
        .from('job_type_experience')
        .insert(jobTypeExperienceData);

      if (jobTypeExperienceError) {
        throw new Error(`Job type experience data save failed: ${jobTypeExperienceError.message}`);
      }
    }

    console.log('Education data saved successfully');
    redirect('/signup/skills');

  } catch (error) {
    console.error('Education data save error:', error);
    throw error;
  }
}