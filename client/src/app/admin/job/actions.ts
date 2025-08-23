'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function approveJob(jobId: string) {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .update({ status: 'PUBLISHED' })
      .eq('id', jobId);

    if (error) {
      console.error('Job approval error:', error);
      return { success: false, error: '承認に失敗しました' };
    }

    // ページを再検証して最新データを反映
    revalidatePath('/admin/job');
    
    return { success: true };
  } catch (error) {
    console.error('Job approval error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '承認に失敗しました' 
    };
  }
}