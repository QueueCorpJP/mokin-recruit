import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import PendingMessageClient from './PendingMessageClient';

// RoomListItemの型定義をここで定義
interface RoomListItem {
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
  application: null;
  latest_messages: Array<{
    id: string;
    content: string;
    subject: string;
    sent_at: string;
    sender_type: string;
  }>;
  confirmation_requested_at: string;
}

async function fetchNGKeywords(): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('ng_keywords')
    .select('keyword')
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching NG keywords:', error);
    return [];
  }
  
  return data?.map(item => item.keyword) || [];
}

function containsNGWord(text: string, ngKeywords: string[]): boolean {
  if (!text || !ngKeywords.length) return false;
  const lowerText = text.toLowerCase();
  return ngKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
}

async function fetchPendingMessages(
  page: number = 1,
  pageSize: number = 50
): Promise<RoomListItem[]> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const supabase = getSupabaseAdminClient();
  
  // 並列処理でパフォーマンスを改善
  const [ngKeywords, roomsResult] = await Promise.all([
    fetchNGKeywords(),
    supabase
      .from('rooms')
      .select(`
        id,
        created_at,
        updated_at,
        candidate_id,
        related_job_posting_id,
        company_group_id,
        candidates (
          first_name,
          last_name
        ),
        job_postings (
          title
        ),
        company_groups (
          group_name,
          company_account_id,
          company_accounts (
            id,
            company_name
          )
        ),
        messages (
          id,
          content,
          subject,
          sent_at,
          sender_type,
          approval_status
        )
      `)
      .order('updated_at', { ascending: false })
      .limit(200) // パフォーマンス向上のため上限設定
  ]);
  
  if (ngKeywords.length === 0) {
    console.log('No NG keywords found');
    return [];
  }
  
  const { data: rooms, error } = roomsResult;

  if (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }

  if (!rooms || rooms.length === 0) {
    return [];
  }

  // NGメッセージがあるルームのみをフィルタリング
  const pendingRooms: RoomListItem[] = [];
  
  for (const room of rooms) {
    const messages = (room as any).messages || [];
    
    // ルーム内のメッセージにNGキーワードが含まれていて、かつ未対応のものをチェック
    const hasNGUnhandledMessage = messages.some((message: any) => 
      (containsNGWord(message.content, ngKeywords) || containsNGWord(message.subject, ngKeywords)) &&
      message.approval_status === '未対応'
    );

    if (hasNGUnhandledMessage) {
      // メッセージを送信日時で並び替え
      const sortedMessages = messages.sort(
        (a: any, b: any) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
      );

      // NGワードを含む未対応メッセージを見つける（最新から順に）
      let ngMessage = null;
      for (const message of sortedMessages) {
        if ((containsNGWord(message.content, ngKeywords) || containsNGWord(message.subject, ngKeywords)) &&
            message.approval_status === '未対応') {
          ngMessage = message;
          break;
        }
      }

      // NGメッセージが見つからない場合は最新メッセージを使用
      const messageForNavigation = ngMessage || sortedMessages[0];

      const roomItem: RoomListItem = {
        id: room.id,
        created_at: room.created_at,
        updated_at: room.updated_at,
        candidate_id: room.candidate_id,
        candidates: (room as any).candidates,
        related_job_posting_id: room.related_job_posting_id,
        job_postings: (room as any).job_postings,
        company_group_id: room.company_group_id,
        company_groups: (room as any).company_groups,
        application: null, // applicationテーブルは使用しない
        latest_messages: messageForNavigation ? [messageForNavigation] : [],
        confirmation_requested_at: room.updated_at // NGメッセージ発見時として更新日時を使用
      };

      pendingRooms.push(roomItem);
    }
  }

  return pendingRooms;
}

export default async function PendingMessagePage() {
  const messages = await fetchPendingMessages(1, 50);
  
  // データのみを渡し、イベントハンドラーは渡さない
  return <PendingMessageClient messages={messages} />;
}