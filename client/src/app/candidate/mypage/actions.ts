'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

// TODO: 本番では認証からcandidate IDを取得
async function getCandidateId(): Promise<string | null> {
  const email = 'sekiguchishunya0619@gmail.com';
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('id')
    .eq('email', email)
    .single();
  if (error || !data) return null;
  return data.id;
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
  
  // まず候補者のroom_id一覧を取得
  const { data: rooms, error: roomError } = await supabase
    .from('rooms')
    .select('id, company_group_id')
    .eq('candidate_id', candidateId);

  if (roomError || !rooms) {
    console.error('Error fetching rooms:', roomError);
    return { messages: [] };
  }

  const roomIds = rooms.map(room => room.id);
  
  if (roomIds.length === 0) {
    return { messages: [] };
  }

  // 各ルームの最新メッセージを取得
  const { data: messages, error: messageError } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      sent_at,
      sender_type,
      status,
      room_id,
      rooms:room_id(
        company_group_id,
        company_groups:company_group_id(
          group_name,
          company_account:company_accounts!company_groups_company_account_id_fkey(
            company_name
          )
        )
      )
    `)
    .in('room_id', roomIds)
    .order('sent_at', { ascending: false });

  if (messageError) {
    console.error('Error fetching messages:', messageError);
    return { messages: [] };
  }

  return { messages: messages || [] };
}