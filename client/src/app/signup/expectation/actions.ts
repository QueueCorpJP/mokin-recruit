'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

    const { data: uuidData, error: uuidError } = await supabase.rpc('gen_random_uuid');
    const candidateId = uuidData || crypto.randomUUID();

    console.log('Candidate ID for expectation data:', candidateId);

    // Save expectation data
    const { data: expectationData, error: expectationError } = await supabase
      .from('expectations')
      .upsert({
        candidate_id: candidateId,
        desired_income: formData.desiredIncome,
        desired_industries: JSON.stringify(formData.industries),
        desired_job_types: JSON.stringify(formData.jobTypes),
        desired_work_locations: JSON.stringify(formData.workLocations),
        desired_work_styles: JSON.stringify(formData.workStyles),
      }, {
        onConflict: 'candidate_id'
      });

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