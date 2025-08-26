import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import PendingMessageClient from './PendingMessageClient';
// MessageListItem型をこのファイル内で定義
export type MessageListItem = {
  id: string;
  sent_at?: string;
  content?: string;
  subject?: string;
  rooms?: {
    candidate_id?: string;
    candidates?: { first_name?: string; last_name?: string };
    related_job_posting_id?: string;
    job_postings?: { title?: string };
  };
  sender_company_group_id?: string;
  company_groups?: {
    group_name?: string;
    company_account_id?: string;
    company_accounts?: { id?: string; company_name?: string };
  };
  application?: { status?: string };
  detected_ng_keywords?: string[];
};

async function fetchNgKeywords(): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('ng_keywords')
    .select('keyword')
    .eq('is_active', true)
    .order('keyword');

  if (error) {
    console.error('Error fetching NG keywords:', error);
    return [];
  }

  return data.map(item => item.keyword);
}

async function fetchMessagesWithNgKeywords(): Promise<MessageListItem[]> {
  const supabase = getSupabaseAdminClient();
  const ngKeywords = await fetchNgKeywords();

  if (ngKeywords.length === 0) {
    return [];
  }

  // NGキーワードを含むメッセージを検索
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      sent_at,
      content,
      subject,
      rooms:room_id (
        candidate_id,
        candidates:candidate_id (
          first_name,
          last_name
        ),
        related_job_posting_id,
        job_postings:related_job_posting_id (
          title
        )
      ),
      sender_company_group_id,
      company_groups:sender_company_group_id (
        group_name,
        company_account_id,
        company_accounts:company_account_id (
          id,
          company_name
        )
      )
    `)
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // メッセージ内容からNGキーワードを含むものをフィルタリング
  const messagesWithNgKeywords = data.filter(message => {
    const messageContent = (message.content || '').toLowerCase();
    const messageSubject = (message.subject || '').toLowerCase();
    const fullText = `${messageContent} ${messageSubject}`;
    return ngKeywords.some(keyword => fullText.includes(keyword.toLowerCase()));
  });

  // application情報を一括取得
  const appPairs = messagesWithNgKeywords
    .map(m => {
      const room = Array.isArray(m.rooms) ? m.rooms[0] : m.rooms;
      return room;
    })
    .filter(r => r?.candidate_id && r?.related_job_posting_id)
    .map(r => ({ candidate_id: r.candidate_id, job_posting_id: r.related_job_posting_id }));
  // 重複排除
  const uniquePairs = Array.from(new Set(appPairs.map(p => `${p.candidate_id}|${p.job_posting_id}`)))
    .map(key => {
      const [candidate_id, job_posting_id] = key.split('|');
      return { candidate_id, job_posting_id };
    });
  let applicationMap = new Map();
  if (uniquePairs.length > 0) {
    const { data: appData } = await supabase
      .from('application')
      .select('candidate_id, job_posting_id, status')
      .in('candidate_id', uniquePairs.map(p => p.candidate_id))
      .in('job_posting_id', uniquePairs.map(p => p.job_posting_id));
    if (appData) {
      appData.forEach(app => {
        applicationMap.set(`${app.candidate_id}|${app.job_posting_id}`, app.status);
      });
    }
  }

  // 各メッセージに検出されたNGキーワードとapplication情報を付与
  const messagesWithDetails = messagesWithNgKeywords.map((message) => {
    const messageContent = (message.content || '').toLowerCase();
    const messageSubject = (message.subject || '').toLowerCase();
    const fullText = `${messageContent} ${messageSubject}`;
    const detectedKeywords = ngKeywords.filter(keyword => fullText.includes(keyword.toLowerCase()));
    let applicationStatus = null;
    const room = Array.isArray(message.rooms) ? message.rooms[0] : message.rooms;
    const candidate_id = room?.candidate_id;
    const job_posting_id = room?.related_job_posting_id;
    if (candidate_id && job_posting_id) {
      applicationStatus = applicationMap.get(`${candidate_id}|${job_posting_id}`) || null;
    }
    return {
      ...message,
      application: { status: applicationStatus },
      detected_ng_keywords: detectedKeywords
    };
  });

  return messagesWithDetails as MessageListItem[];
}

export default async function NgKeywordMessagePage() {
  const messages = await fetchMessagesWithNgKeywords();
  return <PendingMessageClient messages={messages} />;
}