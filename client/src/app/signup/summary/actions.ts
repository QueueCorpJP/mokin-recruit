'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface SummaryFormData {
  jobSummary?: string;
  selfPR?: string;
}

export async function saveSummaryData(formData: SummaryFormData) {
  console.log('=== Start saveSummaryData ===');
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

    console.log('Candidate ID for summary data:', candidateId);

    // Save summary data
    const { data: summaryData, error: summaryError } = await supabase
      .from('job_summary')
      .upsert({
        candidate_id: candidateId,
        job_summary: formData.jobSummary || null,
        self_pr: formData.selfPR || null,
      }, {
        onConflict: 'candidate_id'
      });

    if (summaryError) {
      throw new Error(`Summary data save failed: ${summaryError.message}`);
    }

    console.log('Summary data saved successfully');
    redirect('/signup/complete');

  } catch (error) {
    console.error('Summary data save error:', error);
    throw error;
  }
}