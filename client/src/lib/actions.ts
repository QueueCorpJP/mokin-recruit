'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function sendMessage(
  roomId: string,
  content: string,
  senderType: 'candidate' | 'company',
  senderId: string,
  subject?: string
) {
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
            // Ignore cookie setting errors in Server Actions
          }
        },
      },
    }
  );
  
  try {
    // メッセージを送信
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_type: senderType === 'candidate' ? 'CANDIDATE' : 'COMPANY_USER',
        ...(senderType === 'candidate' 
          ? { sender_candidate_id: senderId }
          : { sender_company_user_id: senderId }
        ),
        message_type: 'GENERAL',
        subject: subject || null,
        content,
        status: 'SENT',
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error sending message:', messageError);
      throw new Error('メッセージの送信に失敗しました');
    }

    // 関連ページを再検証
    revalidatePath('/candidate/message');
    revalidatePath('/company/message');

    return { success: true, message: messageData };
  } catch (error) {
    console.error('Error in sendMessage:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'メッセージの送信に失敗しました'
    };
  }
}

export async function createOrGetRoom(
  candidateId: string,
  companyUserId: string,
  jobPostingId?: string
) {
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
            // Ignore cookie setting errors in Server Actions
          }
        },
      },
    }
  );
  
  try {
    // 既存のルームを検索（候補者と企業ユーザーが両方参加しているルーム）
    const { data: candidateRooms, error: candidateRoomsError } = await supabase
      .from('room_participants')
      .select('room_id')
      .eq('candidate_id', candidateId)
      .eq('participant_type', 'CANDIDATE');

    if (candidateRoomsError) {
      console.error('Error searching candidate rooms:', candidateRoomsError);
    }

    if (candidateRooms && candidateRooms.length > 0) {
      const roomIds = candidateRooms.map(r => r.room_id);
      
      const { data: companyRooms, error: companyRoomsError } = await supabase
        .from('room_participants')
        .select('room_id')
        .eq('company_user_id', companyUserId)
        .eq('participant_type', 'COMPANY_USER')
        .in('room_id', roomIds);

      if (!companyRoomsError && companyRooms && companyRooms.length > 0) {
        // 既存のルームを返す
        return { success: true, roomId: companyRooms[0].room_id };
      }
    }


    // 新しいルームを作成
    const { data: newRoom, error: roomError } = await supabase
      .from('rooms')
      .insert({
        type: 'direct',
        related_job_posting_id: jobPostingId || null,
      })
      .select('id')
      .single();

    if (roomError) {
      console.error('Error creating room:', roomError);
      throw new Error('ルームの作成に失敗しました');
    }

    // 参加者を追加
    const participantsToAdd = [
      {
        room_id: newRoom.id,
        participant_type: 'CANDIDATE',
        candidate_id: candidateId,
      },
      {
        room_id: newRoom.id,
        participant_type: 'COMPANY_USER',
        company_user_id: companyUserId,
      }
    ];

    const { error: participantsError } = await supabase
      .from('room_participants')
      .insert(participantsToAdd);

    if (participantsError) {
      console.error('Error adding room participants:', participantsError);
      throw new Error('ルーム参加者の追加に失敗しました');
    }

    return { success: true, roomId: newRoom.id };
  } catch (error) {
    console.error('Error in createOrGetRoom:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ルームの作成・取得に失敗しました'
    };
  }
}

export async function getRoomMessages(roomId: string, currentUserId?: string, currentUserType?: string) {
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
            // Ignore cookie setting errors in Server Actions
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
        sender_type,
        sender_candidate_id,
        sender_company_user_id,
        subject,
        content,
        sent_at,
        created_at,
        candidates:sender_candidate_id (
          id,
          first_name,
          last_name
        ),
        company_users:sender_company_user_id (
          id,
          first_name,
          last_name
        )
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching room messages:', messagesError);
      return [];
    }

    const messages = (messagesData || []).map((msg: any) => {
      const isCandidate = msg.sender_type === 'CANDIDATE';
      const senderName = isCandidate
        ? (msg.candidates ? `${msg.candidates.last_name} ${msg.candidates.first_name}`.trim() : '候補者')
        : (msg.company_users ? `${msg.company_users.last_name} ${msg.company_users.first_name}`.trim() : '企業担当者');

      return {
        id: String(msg.id),
        senderType: msg.sender_type as 'CANDIDATE' | 'COMPANY_USER',
        senderName,
        subject: msg.subject,
        content: msg.content || '',
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
    console.error('Error in getRoomMessages:', error);
    return [];
  }
}

export async function markMessageAsRead(messageId: string) {
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
            // Ignore cookie setting errors in Server Actions
          }
        },
      },
    }
  );
  
  try {
    const { error } = await supabase
      .from('messages')
      .update({ status: 'READ' })
      .eq('id', messageId);

    if (error) {
      console.error('Error marking message as read:', error);
      throw new Error('メッセージの既読処理に失敗しました');
    }

    // 関連ページを再検証
    revalidatePath('/candidate/message');
    revalidatePath('/company/message');

    return { success: true };
  } catch (error) {
    console.error('Error in markMessageAsRead:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '既読処理に失敗しました'
    };
  }
}