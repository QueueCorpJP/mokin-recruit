import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Message } from '@/components/message/MessageList';

export async function getMessages(userId: string, userType: 'candidate' | 'company'): Promise<Message[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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
            // Ignore cookie setting errors in Server Components
          }
        },
      },
    }
  );
  
  try {
    // ユーザーが参加しているルームを取得
    // まず単純なクエリでroom_participantsを取得
    const { data: participantData, error: participantError } = await supabase
      .from('room_participants')
      .select(`
        id,
        room_id,
        participant_type,
        candidate_id,
        company_user_id,
        joined_at
      `)
      .eq(
        userType === 'candidate' ? 'candidate_id' : 'company_user_id',
        userId
      )
      .eq('participant_type', userType === 'candidate' ? 'CANDIDATE' : 'COMPANY_USER');

    if (participantError) {
      console.error('Error fetching room participants:', {
        error: participantError,
        message: participantError.message,
        code: participantError.code,
        details: participantError.details,
        hint: participantError.hint,
        userId,
        userType
      });
      return [];
    }

    if (!participantData || participantData.length === 0) {
      console.log('No room participants found for user:', userId, userType);
      return [];
    }

    // 参加しているルームのIDを抽出
    const roomIds = participantData.map(p => p.room_id);

    // 各ルームの最新メッセージを取得
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        room_id,
        sender_type,
        sender_candidate_id,
        sender_company_user_id,
        subject,
        content,
        status,
        created_at,
        candidates:sender_candidate_id (
          first_name,
          last_name,
          email
        ),
        company_users:sender_company_user_id (
          full_name,
          email
        )
      `)
      .in('room_id', roomIds)
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return [];
    }

    // メッセージデータをMessage型に変換
    const messages: Message[] = (messagesData || []).map(msg => {
      const senderName = msg.sender_type === 'CANDIDATE' 
        ? (msg.candidates ? `${msg.candidates.first_name} ${msg.candidates.last_name}` : '候補者')
        : msg.company_users?.full_name || '企業担当者';
      
      return {
        id: String(msg.id),
        roomId: String(msg.room_id), // room_idを追加
        timestamp: String(new Date(msg.created_at).toLocaleString('ja-JP')),
        isUnread: Boolean(msg.status !== 'READ'),
        companyName: String('企業名'), // TODO: room情報から取得
        candidateName: String(msg.sender_type === 'CANDIDATE' ? senderName : '候補者名'),
        messagePreview: String(msg.content || msg.subject || 'メッセージ'),
        groupName: String('グループ'), // TODO: room情報から取得
        jobTitle: String('求人タイトル'), // TODO: room情報から取得
      };
    });

    return messages;
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
}

export async function getMessagesByRoomId(roomId: string): Promise<Message[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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
            // Ignore cookie setting errors in Server Components
          }
        },
      },
    }
  );
  
  try {
    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(`
        id,
        room_id,
        sender_type,
        sender_candidate_id,
        sender_company_user_id,
        subject,
        content,
        status,
        created_at,
        candidates:sender_candidate_id (
          first_name,
          last_name,
          email
        ),
        company_users:sender_company_user_id (
          full_name,
          email
        ),
        rooms:room_id (
          job_postings:related_job_posting_id (
            title,
            company_groups:company_group_id (
              group_name,
              company_accounts:company_account_id (
                company_name
              )
            )
          )
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages by room:', messagesError);
      return [];
    }

    const messages: Message[] = (messagesData || []).map(msg => {
      const senderName = msg.sender_type === 'CANDIDATE' 
        ? (msg.candidates ? `${msg.candidates.first_name} ${msg.candidates.last_name}` : '候補者')
        : msg.company_users?.full_name || '企業担当者';
      
      return {
        id: String(msg.id),
        roomId: String(msg.room_id), // room_idを追加
        timestamp: String(new Date(msg.created_at).toLocaleString('ja-JP')),
        isUnread: Boolean(msg.status !== 'READ'),
        companyName: String(msg.rooms?.job_postings?.company_groups?.company_accounts?.company_name || '企業名'),
        candidateName: String(msg.sender_type === 'CANDIDATE' ? senderName : '候補者名'),
        messagePreview: String(msg.content || msg.subject || 'メッセージ'),
        groupName: String(msg.rooms?.job_postings?.company_groups?.group_name || 'グループ'),
        jobTitle: String(msg.rooms?.job_postings?.title || '求人タイトル'),
      };
    });

    return messages;
  } catch (error) {
    console.error('Error in getMessagesByRoomId:', error);
    return [];
  }
}