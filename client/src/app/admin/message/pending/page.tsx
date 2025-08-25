import MessageClient from '../MessageClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export type MessageListItem = {
  id: string;
  sent_at: string;
  rooms: {
    candidate_id: string;
    candidates: {
      first_name: string;
      last_name: string;
    } | null;
    related_job_posting_id: string;
    job_postings: {
      title: string;
    } | null;
  } | null;
  sender_company_group_id: string;
  company_groups: {
    group_name: string;
    company_account_id: string;
    company_accounts: {
      id: string;
      company_name: string;
    } | null;
  } | null;
  application: {
    status: string;
  } | null;
};

async function fetchPendingMessages(
  page: number = 1,
  pageSize: number = 50
): Promise<MessageListItem[]> {
  const supabase = getSupabaseAdminClient();
  
  // まずアクティブなNGキーワードを取得
  const { data: ngKeywords, error: ngError } = await supabase
    .from('ng_keywords')
    .select('keyword')
    .eq('is_active', true);
    
  if (ngError) {
    throw new Error(ngError.message);
  }

  if (!ngKeywords || ngKeywords.length === 0) {
    return [];
  }

  // NGキーワードを含むメッセージを検索するためのクエリを構築
  let query = supabase
    .from('messages')
    .select(
      `
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
    `
    );

  // NGキーワードを含むメッセージをフィルタリング
  const keywords = ngKeywords.map(k => k.keyword);
  const orConditions = keywords.flatMap(keyword => [
    `content.ilike.%${keyword}%`,
    `subject.ilike.%${keyword}%`
  ]);
  
  query = query.or(orConditions.join(','));
  
  const { data, error } = await query
    .order('sent_at', { ascending: false })
    .limit(pageSize);
    
  if (error) {
    throw new Error(error.message);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // アプリケーションステータスを取得
  const messagesWithApplication = await Promise.all(
    data.map(async (message) => {
      let applicationStatus = null;
      
      if (message.rooms?.candidate_id && message.rooms?.related_job_posting_id) {
        try {
          const { data: appData } = await supabase
            .from('application')
            .select('status')
            .eq('candidate_id', message.rooms.candidate_id)
            .eq('job_posting_id', message.rooms.related_job_posting_id)
            .maybeSingle();
          
          applicationStatus = appData?.status || null;
        } catch (appError) {
          console.warn('Application lookup failed:', appError);
          applicationStatus = null;
        }
      }

      return {
        ...message,
        application: { status: applicationStatus }
      };
    })
  );

  return messagesWithApplication as MessageListItem[];
}

export default async function PendingMessagePage() {
  const messages = await fetchPendingMessages(1, 50);
  return <MessageClient messages={messages} />;
}