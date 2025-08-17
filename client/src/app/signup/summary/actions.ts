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

    // Get or create candidate ID using the centralized function
    const candidateId = await getOrCreateCandidateId();
    console.log('Using candidate ID for summary data:', candidateId);

    // Save summary data - use insert with manual conflict handling since no unique constraint on candidate_id
    const { data: existingSummary } = await supabase
      .from('job_summary')
      .select('id')
      .eq('candidate_id', candidateId)
      .single();

    let summaryError;
    if (existingSummary) {
      // Update existing record
      const { error } = await supabase
        .from('job_summary')
        .update({
          job_summary: formData.jobSummary || null,
          self_pr: formData.selfPR || null,
          updated_at: new Date().toISOString(),
        })
        .eq('candidate_id', candidateId);
      summaryError = error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('job_summary')
        .insert({
          candidate_id: candidateId,
          job_summary: formData.jobSummary || null,
          self_pr: formData.selfPR || null,
        });
      summaryError = error;
    }

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