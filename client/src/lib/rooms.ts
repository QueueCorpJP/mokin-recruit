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
      // 候補者の場合: Supabase user.idを直接使用
      console.log('🔍 [CANDIDATE] Using Supabase user ID:', userId);
      
      // 候補者の場合: 自分のuser_idが入っているroomを取得
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
      // 企業ユーザーの場合: 権限レベルに応じてアクセス可能なグループを決定
      console.log('🏢 [STEP C] Company user - checking permissions for:', userId);
      
      // userIdはrequireCompanyAuthForActionで正しいcompany_user_idが返される
      const companyUserId = userId;
      
      console.log('🔍 [DEBUG] Using company_user_id for permissions:', companyUserId);
      
      // ユーザーの権限情報を取得
      const { data: userPermissions, error: permissionsError } = await supabase
        .from('company_user_group_permissions')
        .select('company_group_id, permission_level')
        .eq('company_user_id', companyUserId);

      console.log('📊 [STEP D] User permissions query result:', {
        userPermissions,
        permissionsError,
        count: userPermissions?.length || 0
      });

      if (permissionsError) {
        console.error('❌ [ERROR] Error fetching user permissions:', permissionsError);
        return [];
      }

      let groupIds: string[] = [];

      if (!userPermissions || userPermissions.length === 0) {
        console.log('⚠️ [WARNING] No permissions found for user, treating as regular user with no groups');
        return [];
      }

      // ADMINISTRATORの場合は同じcompany_accountの全グループにアクセス可能
      const hasAdminPermission = userPermissions.some(p => p.permission_level === 'ADMINISTRATOR');
      
      if (hasAdminPermission) {
        console.log('👑 [ADMIN ACCESS] User has ADMINISTRATOR permission - fetching all company groups');
        
        // まず企業ユーザーのcompany_account_idを取得
        const { data: companyUser, error: companyUserError } = await supabase
          .from('company_users')
          .select('company_account_id')
          .eq('id', companyUserId)
          .single();

        if (companyUserError || !companyUser) {
          console.error('❌ [ERROR] Company user not found:', companyUserError);
          return [];
        }

        // 同じcompany_accountに属する全グループを取得
        const { data: allGroups, error: allGroupsError } = await supabase
          .from('company_groups')
          .select('id')
          .eq('company_account_id', companyUser.company_account_id);

        if (allGroupsError) {
          console.error('❌ [ERROR] Error fetching all company groups:', allGroupsError);
          return [];
        }

        groupIds = allGroups?.map(g => g.id) || [];
        console.log('🎯 [ADMIN] All group IDs for admin:', groupIds);
      } else {
        // SCOUT_STAFFの場合は所属グループのみ
        console.log('👤 [STAFF ACCESS] User has SCOUT_STAFF permission - fetching assigned groups only');
        groupIds = userPermissions.map(p => p.company_group_id);
        console.log('🎯 [STAFF] Assigned group IDs:', groupIds);
      }
      
      if (groupIds.length === 0) {
        console.error('❌ [ERROR] No accessible groups found for user:', userId);
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

  // Window関数を使用してroom別最新メッセージを効率的に取得
  console.log('📨 [BUILD] Fetching latest messages for rooms...');
  const { data: latestMessages, error: messagesError } = await supabase
    .rpc('get_latest_messages_by_room', { room_ids: roomIds });
  
  console.log('📨 [BUILD] Messages query result:', {
    messagesCount: latestMessages?.length || 0
  });
  
  // room_id別にメッセージをマップ化（filter処理の最適化）
  const messagesByRoom = new Map();
  const candidateMessagesByRoom = new Map();
  
  latestMessages?.forEach((msg: any) => {
    messagesByRoom.set(msg.room_id, msg);
    if (msg.sender_type === 'CANDIDATE') {
      candidateMessagesByRoom.set(msg.room_id, msg);
    }
  });

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

    // Map化したメッセージから取得（O(1)アクセス）
    const latestMessage = messagesByRoom.get(roomId);
    const candidateLatestMessage = candidateMessagesByRoom.get(roomId);
    
    // 表示用の日時は候補者送信メッセージがあればそれを、なければ最新メッセージの日時を使用
    const displayTime = candidateLatestMessage ? candidateLatestMessage.sent_at : latestMessage?.sent_at;

    // 求人タイトルを取得
    const jobPosting = jobPostings.find((jp: any) => jp.id === room.related_job_posting_id);
    const jobTitle = jobPosting?.title || '求人情報なし';

    // 未読メッセージ数は別途効率的に取得（将来的にはRPCで実装）
    // 現在はルーム一覧では未読カウントを0とし、実際のチャット画面で正確に計算
    const unreadCount = 0;

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
      lastMessageTime: displayTime ? new Date(displayTime).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }) : '',
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