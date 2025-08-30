
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
  confirmation_requested_at?: string;
};

async function fetchAdminRoomList(
  page: number = 1,
  pageSize: number = 10
): Promise<RoomListItem[]> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = getSupabaseAdminClient();
  
  // ルーム一覧を取得（パフォーマンス向上のため上限設定）
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

  // メッセージとアプリケーション状況を効率的に取得
  const [messagesResultsMap, applicationStatusMap] = await Promise.all([
    // 全ルームのメッセージを一度に取得
    (async () => {
      const { data: allMessages } = await supabase
        .from('messages')
        .select('id, content, sent_at, sender_type, room_id')
        .in('room_id', rooms.map(r => r.id))
        .order('sent_at', { ascending: false })
        .limit(rooms.length * 10);
      
      // ルームIDごとにグループ化して上位10件を取得
      const messageMap = new Map<string, any[]>();
      allMessages?.forEach(msg => {
        if (!messageMap.has(msg.room_id)) {
          messageMap.set(msg.room_id, []);
        }
        const roomMessages = messageMap.get(msg.room_id)!;
        if (roomMessages.length < 10) {
          roomMessages.push(msg);
        }
      });
      return messageMap;
    })(),
    // 全ルームのアプリケーション状況を一度に取得
    (async () => {
      const validPairs = rooms.filter(r => r.candidate_id && r.related_job_posting_id);
      if (validPairs.length === 0) return new Map();
      
      try {
        const { data: applications } = await supabase
          .from('application')
          .select('candidate_id, job_posting_id, status')
          .in('candidate_id', validPairs.map(r => r.candidate_id))
          .in('job_posting_id', validPairs.map(r => r.related_job_posting_id));
        
        const statusMap = new Map<string, string>();
        applications?.forEach(app => {
          statusMap.set(`${app.candidate_id}|${app.job_posting_id}`, app.status);
        });
        return statusMap;
      } catch (error) {
        console.warn('Application lookup failed:', error);
        return new Map();
      }
    })()
  ]);
  
  const roomsWithMessages = rooms.map((room) => {
    const messages = messagesResultsMap.get(room.id) || [];
    const applicationKey = room.candidate_id && room.related_job_posting_id 
      ? `${room.candidate_id}|${room.related_job_posting_id}`
      : null;
    const applicationStatus = applicationKey ? applicationStatusMap.get(applicationKey) || null : null;

    return {
      id: room.id,
      created_at: room.created_at,
      updated_at: room.updated_at,
      candidate_id: room.candidate_id,
      candidates: Array.isArray(room.candidates) ? room.candidates[0] || null : room.candidates,
      related_job_posting_id: room.related_job_posting_id,
      job_postings: Array.isArray(room.job_postings) ? room.job_postings[0] || null : room.job_postings,
      company_group_id: room.company_group_id,
      company_groups: Array.isArray(room.company_groups) 
        ? (room.company_groups[0] 
            ? {
                ...room.company_groups[0],
                company_accounts: Array.isArray(room.company_groups[0].company_accounts)
                  ? room.company_groups[0].company_accounts[0] || null
                  : room.company_groups[0].company_accounts
              }
            : null)
        : room.company_groups,
      latest_messages: messages,
      application: { status: applicationStatus }
    } as RoomListItem;
  });

  return roomsWithMessages;
}

export default async function MessagePage() {
  const rooms = await fetchAdminRoomList(1, 10);
  return <MessageClient messages={rooms} />;
}
