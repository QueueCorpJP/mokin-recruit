'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function sendMessage(
  roomId: string,
  content: string,
  senderType: 'candidate' | 'company',
  senderId: string,
  subject?: string,
  fileUrls?: string[]
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
    // 企業ユーザーの場合、company_group_idを取得
    let companyGroupId = null;
    if (senderType === 'company') {
      const { data: groupPermission, error: groupError } = await supabase
        .from('company_user_group_permissions')
        .select('company_group_id')
        .eq('company_user_id', senderId)
        .single();

      if (groupError) {
        console.error('Error fetching company group ID:', groupError);
      } else {
        companyGroupId = groupPermission?.company_group_id;
      }
    }

    // メッセージを送信
    const { data: messageData, error: messageError } = await supabase
      .from('messages')
      .insert({
        room_id: roomId,
        sender_type: senderType === 'candidate' ? 'CANDIDATE' : 'COMPANY_USER',
        ...(senderType === 'candidate'
          ? { sender_candidate_id: senderId }
          : {
              sender_company_user_id: senderId,
              sender_company_group_id: companyGroupId,
            }),
        message_type: 'GENERAL',
        subject: subject || null,
        content,
        status: 'SENT',
        file_urls: fileUrls || [],
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
      error:
        error instanceof Error
          ? error.message
          : 'メッセージの送信に失敗しました',
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
      },
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
      error:
        error instanceof Error
          ? error.message
          : 'ルームの作成・取得に失敗しました',
    };
  }
}

export async function getRoomMessages(
  roomId: string,
  currentUserId?: string,
  currentUserType?: string
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
    console.log('[DEBUG] Getting messages for room (company):', roomId);

    const { data: messagesData, error: messagesError } = await supabase
      .from('messages')
      .select(
        `
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
      `
      )
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });

    console.log('[DEBUG] Messages query result (company):', {
      roomId,
      messageCount: messagesData?.length || 0,
      error: messagesError,
      sampleMessage: messagesData?.[0],
    });

    if (messagesError) {
      console.error('Error fetching room messages:', messagesError);
      return [];
    }

    const messages = (messagesData || []).map((msg: any) => {
      const isCandidate = msg.sender_type === 'CANDIDATE';
      const senderName = isCandidate
        ? msg.candidates
          ? `${msg.candidates.last_name} ${msg.candidates.first_name}`.trim()
          : '候補者'
        : msg.company_users
          ? `${msg.company_users.last_name} ${msg.company_users.first_name}`.trim()
          : '企業担当者';

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
          minute: '2-digit',
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
      error: error instanceof Error ? error.message : '既読処理に失敗しました',
    };
  }
}

// 候補者用: ルームのメッセージを既読にする専用関数
export async function markCandidateRoomMessagesAsRead(
  roomId: string
): Promise<{ success: boolean; error?: string }> {
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
    // 候補者宛ての未読メッセージ（企業から送信された'SENT'ステータスのメッセージ）を既読にする
    const { error: readUpdateError } = await supabase
      .from('messages')
      .update({
        status: 'read',
        read_at: new Date().toISOString(),
      })
      .eq('room_id', roomId)
      .eq('status', 'SENT')
      .eq('sender_type', 'COMPANY_USER'); // 企業からのメッセージのみ

    if (readUpdateError) {
      console.error('Failed to update read status:', readUpdateError);
      return { success: false, error: readUpdateError.message };
    }

    console.log(
      '✅ [markCandidateRoomMessagesAsRead] Successfully updated read status for room:',
      roomId
    );

    // 関連ページを再検証
    revalidatePath('/candidate/message');
    revalidatePath('/company/message');

    return { success: true };
  } catch (error) {
    console.error('Mark candidate room messages as read error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// ファイルアップロード用のサーバーアクション
export async function uploadMessageFile(formData: FormData) {
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
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return { error: 'ファイルが指定されていません' };
    }

    if (!userId) {
      return { error: 'ユーザーIDが指定されていません' };
    }

    // ファイルサイズチェック（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: 'ファイルサイズは5MB以下にしてください' };
    }

    // ファイル形式チェック
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        error:
          'PDF、Word、画像ファイル、テキストファイルのみアップロード可能です',
      };
    }

    // ファイル名の生成（タイムスタンプ + オリジナルファイル名）
    const timestamp = new Date().getTime();

    // Supabaseストレージ対応のファイル名サニタイズ処理
    const sanitizeFileName = (name: string): string => {
      const lastDotIndex = name.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? name.substring(lastDotIndex) : '';
      const nameWithoutExt =
        lastDotIndex !== -1 ? name.substring(0, lastDotIndex) : name;

      let sanitized = nameWithoutExt
        .replace(/[^a-zA-Z0-9\\-_.]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .replace(/^\\.|\\.$/g, '');

      if (!sanitized || sanitized === '.' || sanitized === '..') {
        sanitized = 'file';
      }

      const maxLength = 100 - extension.length - `${timestamp}_`.length;
      if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
      }

      return sanitized + extension;
    };

    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = `${userId}/messages/${fileName}`;

    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('message-files')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase message file upload error:', error);
      let errorMessage = 'ファイルのアップロードに失敗しました';

      if (error.message) {
        if (
          error.message.includes('Payload too large') ||
          error.message.includes('Request entity too large')
        ) {
          errorMessage =
            'ファイルサイズが大きすぎます。5MB以下にしてください。';
        } else if (
          error.message.includes('Invalid file type') ||
          error.message.includes('content-type')
        ) {
          errorMessage = 'サポートされていないファイル形式です。';
        } else if (
          error.message.includes('Duplicate') ||
          error.message.includes('already exists')
        ) {
          errorMessage =
            '同じファイルが既に存在します。しばらく待ってから再試行してください。';
        } else if (
          error.message.includes('Permission') ||
          error.message.includes('Unauthorized')
        ) {
          errorMessage = 'ファイルのアップロード権限がありません。';
        } else if (
          error.message.includes('Network') ||
          error.message.includes('timeout')
        ) {
          errorMessage =
            'ネットワークエラーです。インターネット接続を確認してください。';
        }
      }

      return { error: errorMessage };
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('message-files')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      success: true,
    };
  } catch (error) {
    console.error('Upload message file error:', error);
    return { error: 'ファイルのアップロード中にエラーが発生しました' };
  }
}
