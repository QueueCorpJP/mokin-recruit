
import MessageClient from './MessageClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// DTO型定義
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

async function fetchAdminMessageList(
  page: number = 1,
  pageSize: number = 10
): Promise<MessageListItem[]> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      id,
      sent_at,
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
      ),
      application:room_id (
        applications:candidate_id (
          status
        )
      )
    `
    )
    .order('sent_at', { ascending: false })
    .range(from, to);
  if (error) {
    throw new Error(error.message);
  }
  // DTO整形（必要に応じて）
  // ここではSupabaseの型に合わせて返す
  return data as unknown as MessageListItem[];
}

export default async function MessagePage() {

  const messages = await fetchAdminMessageList(1, 10);
  return <MessageClient messages={messages} />;
}
