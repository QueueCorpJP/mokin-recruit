import MessageClient from '../MessageClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import type { RoomListItem } from '../page';

async function fetchPendingMessages(
  page: number = 1,
  pageSize: number = 50
): Promise<RoomListItem[]> {
  // モックデータを返す（実際のバックエンドデータのような構造）
  const mockPendingMessage: RoomListItem = {
    id: 'room_001',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:45:00Z',
    candidate_id: 'candidate_001',
    candidates: {
      first_name: '太郎',
      last_name: '田中'
    },
    related_job_posting_id: 'job_001',
    job_postings: {
      title: 'フルスタックエンジニア募集'
    },
    company_group_id: 'group_001',
    company_groups: {
      group_name: '株式会社テクノサービス',
      company_account_id: 'company_001',
      company_accounts: {
        id: 'COMP001',
        company_name: '株式会社テクノサービス'
      }
    },
    latest_messages: [
      {
        id: 'msg_001',
        content: '面接の件で確認したいことがあります。不適切な内容が含まれている可能性があります。',
        sent_at: '2024-01-15T14:45:00Z',
        sender_type: 'company'
      }
    ],
    application: {
      status: 'RESPONDED'
    },
    // 新しく追加: 対応確認依頼日時
    confirmation_requested_at: '2024-01-15T14:45:00Z'
  };

  return [mockPendingMessage];
}

export default async function PendingMessagePage() {
  const messages = await fetchPendingMessages(1, 50);
  return <MessageClient messages={messages} isPending={true} />;
}