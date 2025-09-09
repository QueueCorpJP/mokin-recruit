'use server'

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export interface DeclineReasonSubmission {
  reason: string;
  companyUserId?: string;
  jobPostingId?: string;
  roomId?: string;
}

export async function submitDeclineReason(data: DeclineReasonSubmission) {
  try {
    const supabase = await getSupabaseServerClient();

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        error: 'ユーザー認証に失敗しました'
      };
    }

    const { error: insertError } = await supabase
      .from('decline_reasons')
      .insert({
        candidate_id: user.id,
        company_user_id: data.companyUserId,
        job_posting_id: data.jobPostingId,
        room_id: data.roomId,
        reason: data.reason,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Failed to insert decline reason:', insertError);
      return {
        success: false,
        error: '辞退理由の保存に失敗しました'
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error submitting decline reason:', error);
    return {
      success: false,
      error: '辞退理由の送信に失敗しました'
    };
  }
}