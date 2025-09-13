'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { requireCandidateAuthForAction } from '@/lib/auth/server';

// 簡単なメモリキャッシュ
const candidateTasksCache = new Map<string, { data: any; timestamp: number }>();
const candidateMessagesCache = new Map<string, { data: any; timestamp: number }>();
const TASKS_CACHE_TTL = 30 * 1000; // 30秒
const MESSAGES_CACHE_TTL = 15 * 1000; // 15秒

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

  // キャッシュキーの生成
  const cacheKey = candidateId;
  const cached = candidateTasksCache.get(cacheKey);
  
  // 期限切れキャッシュを即座に削除
  if (cached && Date.now() - cached.timestamp >= TASKS_CACHE_TTL) {
    candidateTasksCache.delete(cacheKey);
  } else if (cached) {
    return cached.data;
  }

  const supabase = await getSupabaseServerClient();
  
  // タスクデータを取得（実際の実装に合わせて調整）
  const { data: tasks, error } = await supabase
    .from('unread_notifications')
    .select('*')
    .eq('candidate_id', candidateId)
    .order('created_at', { ascending: false });

  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching tasks:', error);
    return { tasks: [] };
  }

  const result = { tasks: tasks || [] };

  // 成功した場合のみキャッシュに保存
  candidateTasksCache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  // キャッシュサイズを制限（メモリ使用量対策）
  if (candidateTasksCache.size > 20) {
    const oldestKey = candidateTasksCache.keys().next().value;
    if (oldestKey) {
      candidateTasksCache.delete(oldestKey);
    }
  }

  return result;
}

export async function getCandidateMessages() {
  const candidateId = await getCandidateId();
  if (!candidateId) {
    return { messages: [] };
  }

  // キャッシュキーの生成
  const cacheKey = candidateId;
  const cached = candidateMessagesCache.get(cacheKey);
  
  // 期限切れキャッシュを即座に削除
  if (cached && Date.now() - cached.timestamp >= MESSAGES_CACHE_TTL) {
    candidateMessagesCache.delete(cacheKey);
  } else if (cached) {
    return cached.data;
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
    if (process.env.NODE_ENV === 'development') console.error('Error fetching messages:', messageError);
    return { messages: [] };
  }

  const result = { messages: messages || [] };

  // 成功した場合のみキャッシュに保存
  candidateMessagesCache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  // キャッシュサイズを制限（メモリ使用量対策）
  if (candidateMessagesCache.size > 20) {
    const oldestKey = candidateMessagesCache.keys().next().value;
    if (oldestKey) {
      candidateMessagesCache.delete(oldestKey);
    }
  }

  return result;
}

export async function getCandidateNotices() {
  const supabase = await getSupabaseServerClient();
  
  const { data: notices, error } = await supabase
    .from('notices')
    .select('*')
    .eq('status', 'PUBLISHED')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(2);

  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching notices:', error);
    return { notices: [] };
  }

  return { notices: notices || [] };
}