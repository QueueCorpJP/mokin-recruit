'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { CandidateRoom, CandidateMessage } from '@/types/candidate-message';

// 候補者用のSupabaseクライアント取得
async function getCandidateSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignore cookie setting errors
          }
        },
      },
    }
  );
}

/**
 * 候補者のルーム一覧を取得（簡素化版）
 */
export async function getCandidateRooms(candidateId: string): Promise<CandidateRoom[]> {
  try {
    const supabase = await getCandidateSupabase();

    // 候補者が参加しているルーム一覧を取得
    const { data: participantRooms, error: participantError } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        rooms!inner(
          id,
          related_job_posting_id,
          job_postings(
            id,
            title
          )
        )
      `)
      .eq('candidate_id', candidateId)
      .eq('participant_type', 'CANDIDATE');

    if (participantError) {
      console.error('Error fetching candidate rooms:', participantError);
      return [];
    }

    if (!participantRooms || participantRooms.length === 0) {
      return [];
    }

    const roomIds = participantRooms.map((pr: any) => pr.room_id);

    // 各ルームの企業担当者情報を取得
    const { data: companyParticipants, error: companyError } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        company_users(
          id,
          first_name,
          last_name,
          company_groups(
            company_accounts(
              company_name
            )
          )
        )
      `)
      .in('room_id', roomIds)
      .eq('participant_type', 'COMPANY_USER');

    if (companyError) {
      console.error('Error fetching company participants:', companyError);
    }

    // 各ルームの最新メッセージを取得
    const { data: latestMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        room_id,
        content,
        created_at,
        status
      `)
      .in('room_id', roomIds)
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Error fetching latest messages:', messagesError);
    }

    // 未読メッセージ数を取得（企業からのメッセージで'SENT'ステータスのもの）
    const { data: unreadCounts, error: unreadError } = await supabase
      .from('messages')
      .select('room_id')
      .in('room_id', roomIds)
      .eq('sender_type', 'COMPANY_USER')
      .eq('status', 'SENT');

    if (unreadError) {
      console.error('Error fetching unread counts:', unreadError);
    }

    // データを組み立て
    const rooms: CandidateRoom[] = participantRooms.map((pr: any) => {
      const roomId = pr.room_id;
      const room = pr.rooms;

      // 企業情報を取得
      const companyParticipant = companyParticipants?.find((cp: any) => cp.room_id === roomId);
      const companyUser = Array.isArray(companyParticipant?.company_users) ? companyParticipant?.company_users[0] : companyParticipant?.company_users;
      const companyName = companyUser?.company_groups?.[0]?.company_accounts?.[0]?.company_name || 
                         `${companyUser?.last_name || ''} ${companyUser?.first_name || ''}`.trim() || 
                         '企業担当者';

      // 最新メッセージ
      const roomMessages = latestMessages?.filter((m: any) => m.room_id === roomId) || [];
      const latestMessage = roomMessages[0];

      // 未読数
      const unreadCount = unreadCounts?.filter((uc: any) => uc.room_id === roomId).length || 0;

      return {
        id: roomId,
        companyGroupId: (companyUser?.company_groups?.[0] as any)?.id || '',
        companyName,
        groupName: (companyUser?.company_groups?.[0] as any)?.group_name || 'グループ未設定',
        jobTitle: room?.job_postings?.title || '求人情報なし',
        jobPostingId: room?.job_postings?.id || '',
        lastMessage: latestMessage?.content || '',
        lastMessageTime: latestMessage ? new Date(latestMessage.created_at).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }) : '',
        unreadCount,
        isUnread: unreadCount > 0,
      };
    });

    return rooms;
  } catch (error) {
    console.error('Error in getCandidateRooms:', error);
    return [];
  }
}

/**
 * 特定のルームのメッセージ一覧を取得（候補者用簡素化版）
 */
export async function getCandidateRoomMessages(roomId: string, candidateId: string): Promise<CandidateMessage[]> {
  try {
    const supabase = await getCandidateSupabase();

    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        sender_type,
        sender_candidate_id,
        sender_company_user_id,
        content,
        created_at,
        candidates:sender_candidate_id(
          first_name,
          last_name
        ),
        company_users:sender_company_user_id(
          first_name,
          last_name
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching room messages:', messagesError);
      return [];
    }

    const messages: CandidateMessage[] = (messagesData || []).map((msg: any) => {
      const isCandidate = msg.sender_type === 'CANDIDATE';
      const isOwnMessage = isCandidate && msg.sender_candidate_id === candidateId;
      
      let senderName = '';
      if (isCandidate) {
        const candidate = msg.candidates;
        senderName = candidate ? `${candidate.last_name} ${candidate.first_name}`.trim() : '候補者';
      } else {
        const companyUser = msg.company_users;
        senderName = companyUser ? `${companyUser.last_name} ${companyUser.first_name}`.trim() : '企業担当者';
      }

      return {
        id: String(msg.id),
        roomId,
        content: msg.content || '',
        senderType: msg.sender_type === 'CANDIDATE' ? 'CANDIDATE' : 'COMPANY',
        senderName,
        isOwnMessage,
        createdAt: new Date(msg.created_at).toLocaleString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
      };
    });

    return messages;
  } catch (error) {
    console.error('Error in getCandidateRoomMessages:', error);
    return [];
  }
}

/**
 * 候補者がメッセージを送信
 */
export async function sendCandidateMessage(
  roomId: string,
  candidateId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await getCandidateSupabase();

    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_type: 'CANDIDATE',
        sender_candidate_id: candidateId,
        message_type: 'GENERAL',
        content,
        status: 'SENT',
      });

    if (messageError) {
      console.error('Error sending candidate message:', messageError);
      return { success: false, error: 'メッセージの送信に失敗しました' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in sendCandidateMessage:', error);
    return { success: false, error: 'メッセージの送信に失敗しました' };
  }
}