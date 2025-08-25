
import MessageClient from './MessageClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// DTO型定義
export type RoomListItem = {
  id: string;
  created_at: string;
  updated_at: string;
  candidate_id: string;
  candidates: {
    first_name: string;
    last_name: string;
  } | null;
  related_job_posting_id: string;
  job_postings: {
    title: string;
  } | null;
  company_group_id: string;
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
  latest_messages: {
    id: string;
    content: string;
    sent_at: string;
    sender_type: string;
  }[];
};

async function fetchAdminRoomList(
  page: number = 1,
  pageSize: number = 10
): Promise<RoomListItem[]> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = getSupabaseAdminClient();
  
  // ルーム一覧を取得
  const { data: rooms, error } = await supabase
    .from('rooms')
    .select(
      `
      id,
      created_at,
      updated_at,
      candidate_id,
      related_job_posting_id,
      company_group_id,
      candidates:candidate_id (
        first_name,
        last_name
      ),
      job_postings:related_job_posting_id (
        title
      ),
      company_groups:company_group_id (
        group_name,
        company_account_id,
        company_accounts:company_account_id (
          id,
          company_name
        )
      )
    `
    )
    .order('updated_at', { ascending: false })
    .range(from, to);
    
  if (error) {
    throw new Error(error.message);
  }

  if (!rooms || rooms.length === 0) {
    return [];
  }

  // 各ルームの最新メッセージ10件とアプリケーション状況を取得
  const roomsWithMessages = await Promise.all(
    rooms.map(async (room) => {
      // 最新のメッセージ10件を取得
      const { data: messages } = await supabase
        .from('messages')
        .select('id, content, sent_at, sender_type')
        .eq('room_id', room.id)
        .order('sent_at', { ascending: false })
        .limit(10);

      // アプリケーション状況を取得
      let applicationStatus = null;
      if (room.candidate_id && room.related_job_posting_id) {
        try {
          const { data: appData } = await supabase
            .from('application')
            .select('status')
            .eq('candidate_id', room.candidate_id)
            .eq('job_posting_id', room.related_job_posting_id)
            .maybeSingle();
          
          applicationStatus = appData?.status || null;
        } catch (appError) {
          console.warn('Application lookup failed:', appError);
          applicationStatus = null;
        }
      }

      return {
        ...room,
        latest_messages: messages || [],
        application: { status: applicationStatus }
      };
    })
  );

  return roomsWithMessages as RoomListItem[];
}

export default async function MessagePage() {
  const rooms = await fetchAdminRoomList(1, 10);
  return <MessageClient messages={rooms} />;
}
