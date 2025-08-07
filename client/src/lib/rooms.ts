'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export interface Room {
  id: string;
  companyName: string;
  candidateName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isUnread?: boolean;
  jobTitle: string;
  groupName?: string;
  currentCompany?: string;
  unreadCount?: number; // 未読メッセージ数を追加
}

export async function getRooms(userId: string, userType: 'candidate' | 'company'): Promise<Room[]> {
  console.log('🚀 [STEP A] getRooms called:', { userId, userType });
  
  // RLS問題を解決するためAdmin clientを使用
  const supabase = getSupabaseAdminClient();
  console.log('🔧 [STEP B] Using Supabase Admin client (RLS bypassed)');

  try {
    if (userType === 'candidate') {
      // 候補者の場合: 自分のcandidate_idが入っているroomを取得
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          type,
          related_job_posting_id,
          company_group_id,
          candidate_id,
          created_at,
          company_groups!inner(
            id,
            group_name,
            company_account_id,
            company_accounts(
              company_name
            )
          )
        `)
        .eq('candidate_id', userId);

      if (roomsError) {
        console.error('Error fetching candidate rooms:', roomsError);
        return [];
      }

      return await buildRoomsData(supabase, rooms || [], userId, userType);
      
    } else {
      // 企業ユーザーの場合: 企業ユーザーが権限を持つグループのroomを取得
      console.log('🏢 [STEP C] Company user - fetching user groups for:', userId);
      
      const { data: userGroups, error: userGroupsError } = await supabase
        .from('company_user_group_permissions')
        .select('company_group_id')
        .eq('company_user_id', userId);

      console.log('📊 [STEP D] User groups query result:', {
        userGroups,
        userGroupsError,
        count: userGroups?.length || 0
      });

      if (userGroupsError) {
        console.error('❌ [ERROR] Error fetching user groups:', userGroupsError);
        return [];
      }

      const groupIds = userGroups?.map(g => g.company_group_id) || [];
      console.log('🎯 [STEP E] Group IDs extracted:', groupIds);
      
      if (groupIds.length === 0) {
        console.error('❌ [ERROR] No groups found for user:', userId);
        return [];
      }
      console.log('🔍 [STEP F] Fetching rooms for group IDs:', groupIds);
      
      // 複雑なJOINを避けて、基本データのみ取得
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          type,
          related_job_posting_id,
          company_group_id,
          candidate_id,
          created_at
        `)
        .in('company_group_id', groupIds);

      console.log('📋 [STEP G] Rooms query result:', {
        rooms,
        roomsError,
        roomsCount: rooms?.length || 0,
        rawData: JSON.stringify(rooms, null, 2)
      });

      if (roomsError) {
        console.error('❌ [ERROR] Error fetching company rooms:', roomsError);
        return [];
      }

      console.log('🔨 [STEP H] Building rooms data with:', {
        roomsLength: rooms?.length || 0,
        userId,
        userType
      });

      const result = await buildRoomsData(supabase, rooms || [], userId, userType);
      
      console.log('✅ [STEP I] Final result:', {
        resultCount: result.length,
        finalRooms: result.map(r => ({
          id: r.id,
          candidateName: r.candidateName,
          companyName: r.companyName,
          groupName: r.groupName,
          jobTitle: r.jobTitle
        }))
      });
      
      return result;
    }

  } catch (error) {
    console.error('Error in getRooms:', error);
    return [];
  }
}

async function buildRoomsData(
  supabase: any, 
  rooms: any[], 
  userId: string, 
  userType: 'candidate' | 'company'
): Promise<Room[]> {
  console.log('🏗️ [BUILD] buildRoomsData called with:', {
    roomsLength: rooms.length,
    userId,
    userType
  });

  if (!rooms.length) {
    console.log('⚠️ [BUILD] No rooms provided, returning empty array');
    return [];
  }

  const roomIds = rooms.map((room: any) => room.id);
  console.log('🆔 [BUILD] Room IDs extracted:', roomIds);

  // 各ルームの最新メッセージを取得
  console.log('📨 [BUILD] Fetching latest messages for rooms...');
  const { data: latestMessages, error: messagesError } = await supabase
    .from('messages')
    .select(`
      room_id,
      content,
      sent_at,
      status,
      sender_type
    `)
    .in('room_id', roomIds)
    .order('sent_at', { ascending: false });
  
  console.log('📨 [BUILD] Messages query result:', {
    latestMessages,
    messagesError,
    messagesCount: latestMessages?.length || 0
  });
  
  // message.md要件: 候補者送信のメッセージの日時を優先表示
  const candidateMessages = latestMessages?.filter((m: any) => m.sender_type === 'CANDIDATE') || [];

  if (messagesError) {
    console.error('Error fetching latest messages:', messagesError);
  }

  // 関連する求人情報を取得
  const jobPostingIds = rooms
    .map((room: any) => room.related_job_posting_id)
    .filter(Boolean);

  let jobPostings: any[] = [];
  if (jobPostingIds.length > 0) {
    const { data: jobData, error: jobError } = await supabase
      .from('job_postings')
      .select('id, title')
      .in('id', jobPostingIds);

    if (!jobError) {
      jobPostings = jobData || [];
    }
  }

  // 候補者情報を取得
  const candidateIds = rooms
    .map((room: any) => room.candidate_id)
    .filter(Boolean);

  let candidates: any[] = [];
  if (candidateIds.length > 0) {
    const { data: candidateData, error: candidateError } = await supabase
      .from('candidates')
      .select('id, first_name, last_name, current_company')
      .in('id', candidateIds);

    if (!candidateError) {
      candidates = candidateData || [];
    }
  }

  // グループ情報を取得
  const groupIds = rooms
    .map((room: any) => room.company_group_id)
    .filter(Boolean);

  let groupsWithCompany: any[] = [];
  if (groupIds.length > 0) {
    const { data: groupData, error: groupError } = await supabase
      .from('company_groups')
      .select(`
        id,
        group_name,
        company_account_id,
        company_accounts(company_name)
      `)
      .in('id', groupIds);

    if (!groupError) {
      groupsWithCompany = groupData || [];
    }
  }

  console.log('📋 [BUILD] Building final rooms data...');
  
  // データを組み立て
  const roomsData: Room[] = rooms.map((room: any, index: number) => {
    console.log(`🏗️ [BUILD] Processing room ${index + 1}/${rooms.length}:`, {
      roomId: room.id,
      companyGroupId: room.company_group_id,
      candidateId: room.candidate_id,
      relatedJobPostingId: room.related_job_posting_id
    });
    const roomId = room.id;

    // このルームの最新メッセージを取得
    const roomMessages = latestMessages?.filter((m: any) => m.room_id === roomId) || [];
    const latestMessage = roomMessages[0];
    
    // message.md要件: 候補者送信メッセージの日時を優先表示
    const roomCandidateMessages = candidateMessages?.filter((m: any) => m.room_id === roomId) || [];
    const candidateLatestMessage = roomCandidateMessages[0];
    
    // 表示用の日時は候補者送信メッセージがあればそれを、なければ最新メッセージの日時を使用
    const displayTime = candidateLatestMessage ? candidateLatestMessage.sent_at : latestMessage?.sent_at;

    // 求人タイトルを取得
    const jobPosting = jobPostings.find((jp: any) => jp.id === room.related_job_posting_id);
    const jobTitle = jobPosting?.title || '求人情報なし';

    // 未読メッセージ数の計算（送信者によって分ける）
    let unreadCount = 0;
    if (userType === 'candidate') {
      // 候補者側: 企業からのメッセージ（COMPANY_USER）で'SENT'ステータスのものをカウント
      unreadCount = roomMessages.filter((m: any) => 
        m.sender_type === 'COMPANY_USER' && m.status === 'SENT'
      ).length;
    } else {
      // 企業側: 候補者からのメッセージ（CANDIDATE）で'SENT'ステータスのものをカウント
      unreadCount = roomMessages.filter((m: any) => 
        m.sender_type === 'CANDIDATE' && m.status === 'SENT'
      ).length;
    }

    // 未読判定（後方互換性のため）
    const hasUnread = unreadCount > 0;

    // 会社名と候補者名を設定
    let companyName = '';
    let candidateName = '';
    let groupName = '';
    let currentCompany = '';

    if (userType === 'candidate') {
      // 候補者画面の場合
      const groupInfo = groupsWithCompany.find((g: any) => g.id === room.company_group_id);
      groupName = groupInfo?.company_accounts?.company_name || '';
      companyName = groupInfo?.group_name || '';
      // 候補者自身の名前を取得
      // TODO: 候補者の名前を取得する処理を追加
    } else {
      // 企業画面の場合
      const candidate = candidates.find((c: any) => c.id === room.candidate_id);
      if (candidate) {
        candidateName = `${candidate.last_name} ${candidate.first_name}`;
        currentCompany = candidate.current_company || '現職企業名テキスト';
      }
      
      const groupInfo = groupsWithCompany.find((g: any) => g.id === room.company_group_id);
      if (groupInfo) {
        groupName = groupInfo.company_accounts?.company_name || '';
        companyName = groupInfo.group_name || '';
      }
    }

    const finalRoom = {
      id: roomId,
      companyName,
      candidateName,
      lastMessage: latestMessage?.content || '',
      lastMessageTime: displayTime ? new Date(displayTime).toLocaleString('ja-JP') : '',
      isUnread: hasUnread,
      jobTitle,
      groupName,
      currentCompany,
      unreadCount,
    };

    console.log(`✅ [BUILD] Room ${index + 1} processed:`, finalRoom);
    
    return finalRoom;
  });

  console.log('🎉 [BUILD] Final rooms data completed:', {
    totalRooms: roomsData.length,
    roomIds: roomsData.map(r => r.id)
  });

  return roomsData;
}