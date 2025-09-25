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
  try {
    // RLS対応のSupabaseクライアントを使用
    const { getSupabaseServerClient } = await import(
      '@/lib/supabase/server-client'
    );
    const supabase = await getSupabaseServerClient();

    // Get or create candidate ID using the centralized function
    const candidateId = await getOrCreateCandidateId();

    // Update candidates table with summary data and change status to official
    const { error: summaryError } = await supabase
      .from('candidates')
      .update({
        job_summary: formData.jobSummary || null,
        self_pr: formData.selfPR || null,
        status: 'official', // 本登録状態に変更
        updated_at: new Date().toISOString(),
      })
      .eq('id', candidateId);

    if (summaryError) {
      throw new Error(`Summary data save failed: ${summaryError.message}`);
    }

    redirect('/signup/complete');
  } catch (error) {
    console.error('Summary data save error:', error);
    throw error;
  }
}
