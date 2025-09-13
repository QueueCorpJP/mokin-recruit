'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getOrCreateCandidateId } from '@/lib/signup/candidateId';

interface SummaryFormData {
  jobSummary?: string;
  selfPR?: string;
}

export async function saveSummaryData(formData: SummaryFormData) {
  if (process.env.NODE_ENV === 'development') console.log('=== Start saveSummaryData ===');
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
    if (process.env.NODE_ENV === 'development') console.log('Using candidate ID for summary data:', candidateId);

    // Update candidates table with summary data
    const { error: summaryError } = await supabase
      .from('candidates')
      .update({
        job_summary: formData.jobSummary || null,
        self_pr: formData.selfPR || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (summaryError) {
      throw new Error(`Summary data save failed: ${summaryError.message}`);
    }

    if (process.env.NODE_ENV === 'development') console.log('Summary data saved successfully');
    redirect('/signup/complete');

  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Summary data save error:', error);
    throw error;
  }
}