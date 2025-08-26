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
      // JOINで関連情報もまとめて取得
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          type,
          related_job_posting_id,
          company_group_id,
          candidate_id,
          created_at,
          job_postings(id, title),
          candidates(id, first_name, last_name, current_company),
          company_groups(
            id,
            group_name,
            company_account_id,
            company_accounts(company_name)
          )
        `)
        .eq('candidate_id', userId);

      if (roomsError) {
        console.error('Error fetching candidate rooms:', roomsError);
        return [];
      }

      return await buildRoomsData(rooms || [], userType);
      
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
      
      // JOINで関連情報もまとめて取得
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          type,
          related_job_posting_id,
          company_group_id,
          candidate_id,
          created_at,
          job_postings(id, title),
          candidates(id, first_name, last_name, current_company),
          company_groups(
            id,
            group_name,
            company_account_id,
            company_accounts(company_name)
          )
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

      const result = await buildRoomsData(rooms || [], userType);
      
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
  rooms: any[],
  userType: 'candidate' | 'company'
): Promise<Room[]> {
  if (!rooms.length) return [];
  // 最新メッセージは従来通りRPCで取得
  const roomIds = rooms.map((room: any) => room.id);
  const supabase = getSupabaseAdminClient();
  const { data: latestMessages } = await supabase
    .rpc('get_latest_messages_by_room', { room_ids: roomIds });
  const messagesByRoom = new Map();
  const candidateMessagesByRoom = new Map();
  latestMessages?.forEach((msg: any) => {
    messagesByRoom.set(msg.room_id, msg);
    if (msg.sender_type === 'CANDIDATE') {
      candidateMessagesByRoom.set(msg.room_id, msg);
    }
  });
  // データを組み立て
  return rooms.map((room: any) => {
    const roomId = room.id;
    const latestMessage = messagesByRoom.get(roomId);
    const candidateLatestMessage = candidateMessagesByRoom.get(roomId);
    const displayTime = candidateLatestMessage ? candidateLatestMessage.sent_at : latestMessage?.sent_at;
    const jobTitle = room.job_postings?.title || '求人情報なし';
    let companyName = '';
    let candidateName = '';
    let groupName = '';
    let currentCompany = '';
    if (userType === 'candidate') {
      groupName = room.company_groups?.company_accounts?.company_name || '';
      companyName = room.company_groups?.group_name || '';
    } else {
      if (room.candidates) {
        candidateName = `${room.candidates.last_name} ${room.candidates.first_name}`;
        currentCompany = room.candidates.current_company || '現職企業名テキスト';
      }
      if (room.company_groups) {
        groupName = room.company_groups.company_accounts?.company_name || '';
        companyName = room.company_groups.group_name || '';
      }
    }
    return {
      id: roomId,
      companyName,
      candidateName,
      lastMessage: latestMessage?.content || '',
      lastMessageTime: displayTime ? new Date(displayTime).toLocaleString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      }) : '',
      isUnread: false,
      jobTitle,
      groupName,
      currentCompany,
      unreadCount: 0,
    };
  });
}