'use server';

import { createClient } from '@/lib/supabase/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCandidateAuth } from '@/lib/auth/server';
import { revalidatePath } from 'next/cache';

export interface SendMessageData {
  room_id: string;
  content: string;
  subject?: string; // 件名（オプション）
  message_type?: 'SCOUT' | 'APPLICATION' | 'GENERAL'; // メッセージタイプ
  file_urls?: string[]; // アップロードされたファイルのURL配列
}

export async function sendMessage(data: SendMessageData) {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    // RLS問題を解決するためAdmin clientを使用
    const supabase = getSupabaseAdminClient();
    console.log('🔧 [SEND MESSAGE] Using Supabase Admin client (RLS bypassed)');

    // 候補者がルームに参加しているかチェック（roomsテーブルのcandidate_idで確認）
    console.log('🔍 [SEND MESSAGE] Room validation check:', {
      room_id: data.room_id,
      user_id: user.id
    });

    // まず、ルームが存在するかチェック
    const { data: roomExists, error: roomExistsError } = await supabase
      .from('rooms')
      .select('id, candidate_id, company_group_id')
      .eq('id', data.room_id)
      .single();

    console.log('🔍 [SEND MESSAGE] Room exists check:', {
      roomExists,
      roomExistsError
    });

    if (roomExistsError || !roomExists) {
      console.error('Room does not exist:', roomExistsError);
      return { error: 'Room not found' };
    }

    // 候補者IDが一致するかチェック
    if (roomExists.candidate_id !== user.id) {
      console.error('Candidate ID mismatch:', {
        roomCandidateId: roomExists.candidate_id,
        userId: user.id
      });
      return { error: 'Unauthorized access to room' };
    }

    const room = roomExists;

    // メッセージを挿入
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        room_id: data.room_id,
        content: data.content,
        subject: data.subject || null,
        message_type: data.message_type || 'GENERAL',
        sender_type: 'CANDIDATE',
        sender_candidate_id: user.id,
        status: 'SENT',
        file_urls: data.file_urls || [],
      })
      .select('*')
      .single();

    if (messageError) {
      console.error('Message insert error:', messageError);
      return { error: 'Failed to send message' };
    }

    // roomのupdated_atを更新
    await supabase
      .from('rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', data.room_id);

    // キャッシュを再検証
    revalidatePath('/candidate/message');

    return { message };
  } catch (error) {
    console.error('Send message error:', error);
    return { error: 'Internal server error' };
  }
}

// 特定のルームのメッセージを取得
export async function getRoomMessages(roomId: string) {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    // RLS問題を解決するためAdmin clientを使用
    const supabase = getSupabaseAdminClient();
    console.log('🔧 [GET MESSAGES] Using Supabase Admin client (RLS bypassed)');

    // roomが候補者のものかチェック
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, candidate_id')
      .eq('id', roomId)
      .eq('candidate_id', user.id)
      .single();

    if (roomError || !room) {
      console.error('Room access error:', roomError);
      return { error: 'Room not found or unauthorized' };
    }

    // メッセージを取得（送信者の名前情報も含める）
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        *,
        sender_candidate:candidates!messages_sender_candidate_id_fkey(
          first_name,
          last_name
        ),
        sender_company_group:company_groups!messages_sender_company_group_id_fkey(
          group_name,
          company_account:company_accounts!company_groups_company_account_id_fkey(
            company_name
          )
        )
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });

    if (messagesError) {
      console.error('Messages fetch error:', messagesError);
      return { error: 'Failed to fetch messages' };
    }

    // 候補者宛ての未読メッセージ（企業から送信された'SENT'ステータスのメッセージ）を既読にする
    const { error: readUpdateError } = await supabase
      .from('messages')
      .update({
        status: 'READ',
        read_at: new Date().toISOString()
      })
      .eq('room_id', roomId)
      .eq('status', 'SENT')
      .eq('sender_type', 'COMPANY_USER'); // 企業からのメッセージのみ

    if (readUpdateError) {
      console.warn('Failed to update read status:', readUpdateError);
    }

    return { messages };
  } catch (error) {
    console.error('Get room messages error:', error);
    return { error: 'Internal server error' };
  }
}

// 候補者用: ルームのメッセージを既読にする専用関数
export async function markCandidateRoomMessagesAsRead(roomId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      return { success: false, error: 'Unauthorized' };
    }

    const supabase = getSupabaseAdminClient();
    console.log('🔧 [markCandidateRoomMessagesAsRead] Using Supabase Admin client (RLS bypassed)');

    // roomが候補者のものかチェック
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, candidate_id')
      .eq('id', roomId)
      .eq('candidate_id', user.id)
      .single();

    if (roomError || !room) {
      console.error('Room access error:', roomError);
      return { success: false, error: 'Room not found or unauthorized' };
    }

    // 候補者宛ての未読メッセージ（企業から送信された'SENT'ステータスのメッセージ）を既読にする
    const { error: readUpdateError } = await supabase
      .from('messages')
      .update({
        status: 'READ',
        read_at: new Date().toISOString()
      })
      .eq('room_id', roomId)
      .eq('status', 'SENT')
      .eq('sender_type', 'COMPANY_USER'); // 企業からのメッセージのみ

    if (readUpdateError) {
      console.error('Failed to update read status:', readUpdateError);
      return { success: false, error: readUpdateError.message };
    }

    console.log('✅ [markCandidateRoomMessagesAsRead] Successfully updated read status for room:', roomId);
    return { success: true };

  } catch (error) {
    console.error('Mark candidate room messages as read error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

// ファイルアップロード用のサーバーアクション
export async function uploadMessageFile(formData: FormData) {
  try {
    const user = await requireCandidateAuth();
    if (!user) {
      return { error: 'ユーザーが認証されていません' };
    }

    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return { error: 'ファイルが指定されていません' };
    }

    if (!userId) {
      return { error: 'ユーザーIDが指定されていません' };
    }

    // 認証されたユーザーIDと一致することを確認
    if (user.id !== userId) {
      console.error('User ID mismatch:', {
        authUserId: user.id,
        providedUserId: userId
      });
      return { error: 'ユーザーIDが一致しません' };
    }

    // ファイルサイズチェック（10MB）
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return { error: 'ファイルサイズは10MB以下にしてください' };
    }

    // ファイル形式チェック
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg', // 一部のシステムでjpegがjpgとして認識される場合に対応
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
      'text/plain'
    ];
    
    // デバッグ用：実際のファイル形式をログ出力
    console.log('🔍 [UPLOAD DEBUG] File info:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });
    
    if (!allowedTypes.includes(file.type)) {
      return { error: 'PDF、Word、画像ファイル、テキストファイルのみアップロード可能です' };
    }

    // ファイル名の生成（タイムスタンプ + オリジナルファイル名）
    const timestamp = new Date().getTime();
    
    // より堅牢なファイル名生成：特殊文字や日本語にも対応
    const sanitizeFileName = (name: string): string => {
      // 拡張子を分離
      const lastDotIndex = name.lastIndexOf('.');
      const extension = lastDotIndex !== -1 ? name.substring(lastDotIndex) : '';
      const nameWithoutExt = lastDotIndex !== -1 ? name.substring(0, lastDotIndex) : name;
      
      // 危険な文字を置換（ファイルシステムで問題となる文字）
      let sanitized = nameWithoutExt
        .replace(/[\\/:*?"<>|]/g, '_') // ファイルシステムで危険な文字
        .replace(/[\u0000-\u001f\u007f-\u009f]/g, '_') // 制御文字
        .replace(/\s+/g, '_') // 空白をアンダースコアに
        .replace(/_+/g, '_') // 連続するアンダースコアを1つに
        .replace(/^_|_$/g, ''); // 先頭と末尾のアンダースコアを削除
      
      // 空になった場合やドットのみの場合のフォールバック
      if (!sanitized || sanitized === '.' || sanitized === '..') {
        sanitized = 'file';
      }
      
      // 長すぎる場合は短縮（拡張子込みで100文字以内）
      const maxLength = 100 - extension.length - `${timestamp}_`.length;
      if (sanitized.length > maxLength) {
        sanitized = sanitized.substring(0, maxLength);
      }
      
      return sanitized + extension;
    };
    
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${timestamp}_${sanitizedFileName}`;
    const filePath = `${user.id}/messages/${fileName}`;
    
    console.log('🔍 [UPLOAD DEBUG] File path generation:', {
      original: file.name,
      sanitized: sanitizedFileName,
      final: fileName,
      filePath: filePath
    });

    console.log('🔍 [SERVER ACTION] Uploading message file:', filePath);

    // Supabase Admin Client を使用してアップロード（RLS をバイパス）
    const supabase = getSupabaseAdminClient();
    const fileBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('message-files')
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error('Supabase message file upload error:', error);
      // より詳細なエラーメッセージを提供
      let errorMessage = 'ファイルのアップロードに失敗しました';
      
      if (error.message) {
        console.error('Detailed error:', error.message);
        
        // 一般的なSupabaseエラーを分類
        if (error.message.includes('Payload too large') || error.message.includes('Request entity too large')) {
          errorMessage = 'ファイルサイズが大きすぎます。10MB以下にしてください。';
        } else if (error.message.includes('Invalid file type') || error.message.includes('content-type')) {
          errorMessage = 'サポートされていないファイル形式です。';
        } else if (error.message.includes('Duplicate') || error.message.includes('already exists')) {
          errorMessage = '同じファイルが既に存在します。しばらく待ってから再試行してください。';
        } else if (error.message.includes('Permission') || error.message.includes('Unauthorized')) {
          errorMessage = 'ファイルのアップロード権限がありません。';
        } else if (error.message.includes('Network') || error.message.includes('timeout')) {
          errorMessage = 'ネットワークエラーです。インターネット接続を確認してください。';
        }
      }
      
      return { error: errorMessage };
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('message-files')
      .getPublicUrl(filePath);

    console.log('🔍 [SERVER ACTION] Message file uploaded successfully:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filePath,
      success: true
    };

  } catch (error) {
    console.error('Upload message file error:', error);
    return { error: 'ファイルのアップロード中にエラーが発生しました' };
  }
}