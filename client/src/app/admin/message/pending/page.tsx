import MessageClient from '../MessageClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import type { RoomListItem } from '../page';

async function fetchPendingMessages(
  page: number = 1,
  pageSize: number = 50
): Promise<RoomListItem[]> {
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

  // NGキーワードを含むメッセージを持つルームIDを取得
  const keywords = ngKeywords.map(k => k.keyword);
  const orConditions = keywords.flatMap(keyword => [
    `content.ilike.%${keyword}%`,
    `subject.ilike.%${keyword}%`
  ]);
  
  const { data: messagesWithNg } = await supabase
    .from('messages')
    .select('room_id')
    .or(orConditions.join(','));

  if (!messagesWithNg || messagesWithNg.length === 0) {
    return [];
  }

  // ユニークなルームIDを取得
  const roomIds = [...new Set(messagesWithNg.map(m => m.room_id))];
  
  // 該当するルームの情報を取得
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
    .in('id', roomIds)
    .order('updated_at', { ascending: false })
    .limit(pageSize);

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
        latest_messages: messages || [],
        application: { status: applicationStatus }
      } as RoomListItem;
    })
  );

  return roomsWithMessages;
}

export default async function PendingMessagePage() {
  const messages = await fetchPendingMessages(1, 50);
  return <MessageClient messages={messages} />;
}