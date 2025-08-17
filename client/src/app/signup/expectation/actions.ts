'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getOrCreateCandidateId } from '@/lib/signup/candidateId';

interface ExpectationFormData {
  desiredIncome: string;
  industries: Array<{ id: string; name: string }>;
  jobTypes: Array<{ id: string; name: string }>;
  workLocations: Array<{ id: string; name: string }>;
  workStyles: Array<{ id: string; name: string }>;
}

export async function saveExpectationData(formData: ExpectationFormData) {
  console.log('=== Start saveExpectationData ===');
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

    // Get or create candidate ID using the centralized function
    const candidateId = await getOrCreateCandidateId();
    console.log('Using candidate ID for expectation data:', candidateId);

    // Save expectation data - use insert with manual conflict handling since no unique constraint on candidate_id
    const { data: existingExpectation } = await supabase
      .from('expectations')
      .select('id')
      .eq('candidate_id', candidateId)
      .single();

    let expectationError;
    if (existingExpectation) {
      // Update existing record
      const { error } = await supabase
        .from('expectations')
        .update({
          desired_income: formData.desiredIncome,
          desired_industries: JSON.stringify(formData.industries),
          desired_job_types: JSON.stringify(formData.jobTypes),
          desired_work_locations: JSON.stringify(formData.workLocations),
          desired_work_styles: JSON.stringify(formData.workStyles),
          updated_at: new Date().toISOString(),
        })
        .eq('candidate_id', candidateId);
      expectationError = error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('expectations')
        .insert({
          candidate_id: candidateId,
          desired_income: formData.desiredIncome,
          desired_industries: JSON.stringify(formData.industries),
          desired_job_types: JSON.stringify(formData.jobTypes),
          desired_work_locations: JSON.stringify(formData.workLocations),
          desired_work_styles: JSON.stringify(formData.workStyles),
        });
      expectationError = error;
    }

    if (expectationError) {
      throw new Error(`Expectation data save failed: ${expectationError.message}`);
    }

    console.log('Expectation data saved successfully');
    redirect('/signup/summary');

  } catch (error) {
    console.error('Expectation data save error:', error);
    throw error;
  }
}