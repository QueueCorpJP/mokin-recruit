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
  
  // 並列処理でパフォーマンスを改善
  const [ngKeywords, allMessages] = await Promise.all([
    fetchNgKeywords(),
    supabase
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
      .order('sent_at', { ascending: false })
      .limit(1000) // パフォーマンス向上のため上限設定
  ]);

  if (ngKeywords.length === 0) {
    return [];
  }

  const { data, error } = allMessages;
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

  // application情報の準備を効率化
  const candidateJobPairs = new Set<string>();
  messagesWithNgKeywords.forEach(m => {
    const room = Array.isArray(m.rooms) ? m.rooms[0] : m.rooms;
    if (room?.candidate_id && room?.related_job_posting_id) {
      candidateJobPairs.add(`${room.candidate_id}|${room.related_job_posting_id}`);
    }
  });
  
  // application情報を効率的に取得
  const applicationMap = new Map<string, string>();
  if (candidateJobPairs.size > 0) {
    const uniquePairs = Array.from(candidateJobPairs).map(key => {
      const [candidate_id, job_posting_id] = key.split('|');
      return { candidate_id, job_posting_id };
    });
    
    try {
      const { data: appData } = await supabase
        .from('application')
        .select('candidate_id, job_posting_id, status')
        .in('candidate_id', uniquePairs.map(p => p.candidate_id))
        .in('job_posting_id', uniquePairs.map(p => p.job_posting_id));
      
      appData?.forEach(app => {
        applicationMap.set(`${app.candidate_id}|${app.job_posting_id}`, app.status);
      });
    } catch (error) {
      console.warn('Application lookup failed:', error);
    }
  }

  // NGキーワード検索を事前に小文字化して最適化
  const lowerCaseNgKeywords = ngKeywords.map(keyword => keyword.toLowerCase());
  
  // 各メッセージに検出されたNGキーワードとapplication情報を効率的に付与
  const messagesWithDetails = messagesWithNgKeywords.map((message) => {
    const messageContent = (message.content || '').toLowerCase();
    const messageSubject = (message.subject || '').toLowerCase();
    const fullText = `${messageContent} ${messageSubject}`;
    
    // より効率的なキーワード検索
    const detectedKeywords = ngKeywords.filter((keyword, index) => 
      fullText.includes(lowerCaseNgKeywords[index])
    );
    
    const room = Array.isArray(message.rooms) ? message.rooms[0] : message.rooms;
    const applicationKey = room?.candidate_id && room?.related_job_posting_id 
      ? `${room.candidate_id}|${room.related_job_posting_id}`
      : null;
    
    return {
      ...message,
      application: { status: applicationKey ? applicationMap.get(applicationKey) || null : null },
      detected_ng_keywords: detectedKeywords
    };
  });

  return messagesWithDetails as MessageListItem[];
}

export default async function NgKeywordMessagePage() {
  const messages = await fetchMessagesWithNgKeywords();
  return <PendingMessageClient messages={messages} />;
}