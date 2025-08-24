'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';

async function getCandidateId(): Promise<string | null> {
  const authResult = await requireCandidateAuthForAction();
  if (!authResult.success) {
    return null;
  }
  return authResult.data.candidateId;
}

export async function getCandidateTasks() {
  const candidateId = await getCandidateId();
  if (!candidateId) {
    return { tasks: [] };
  }

  const supabase = await getSupabaseServerClient();
  
  // タスクデータを取得（実際の実装に合わせて調整）
  const { data: tasks, error } = await supabase
    .from('candidate_tasks')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks:', error);
    return { tasks: [] };
  }

  return { tasks: tasks || [] };
}

export async function getCandidateMessages() {
  const candidateId = await getCandidateId();
  if (!candidateId) {
    return { messages: [] };
  }

  const supabase = await getSupabaseServerClient();
  
  // 候補者のメッセージを一度のクエリで取得（roomとの関連も含む）
  const { data: messages, error: messageError } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      sent_at,
      sender_type,
      status,
      room_id,
      rooms!inner (
        id,
        candidate_id,
        company_group_id,
        company_groups:company_group_id(
          group_name,
          company_account:company_accounts!company_groups_company_account_id_fkey(
            company_name
          )
        )
      )
    `)
    .eq('rooms.candidate_id', candidateId)
    .order('sent_at', { ascending: false });

  if (messageError) {
    console.error('Error fetching messages:', messageError);
    return { messages: [] };
  }

  return { messages: messages || [] };
}