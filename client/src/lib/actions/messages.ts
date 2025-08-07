'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCompanyAuthWithSession } from '@/lib/auth/server';
import { ChatMessage } from '@/types/message';
import { revalidatePath } from 'next/cache';

export async function getRoomMessages(roomId: string): Promise<ChatMessage[]> {
  console.log('🔍 [getRoomMessages] Fetching messages for room:', roomId);
  
  const supabase = getSupabaseAdminClient();

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        id,
        room_id,
        content,
        sender_type,
        sender_candidate_id,
        sender_company_group_id,
        message_type,
        subject,
        status,
        sent_at,
        read_at,
        replied_at,
        file_urls,
        created_at,
        updated_at,
        sender_candidate:candidates(first_name, last_name),
        sender_company_group:company_groups(
          group_name,
          company_account:company_accounts(company_name)
        )
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: true });

    if (error) {
      console.error('❌ [getRoomMessages] Error:', error);
      return [];
    }

    console.log('✅ [getRoomMessages] Messages fetched:', {
      roomId,
      messageCount: messages?.length || 0
    });

    // 企業側宛ての未読メッセージ（候補者から送信された'SENT'ステータスのメッセージ）を既読にする
    const { error: readUpdateError } = await supabase
      .from('messages')
      .update({
        status: 'READ',
        read_at: new Date().toISOString()
      })
      .eq('room_id', roomId)
      .eq('status', 'SENT')
      .eq('sender_type', 'CANDIDATE'); // 候補者からのメッセージのみ

    if (readUpdateError) {
      console.warn('❌ [getRoomMessages] Failed to update read status:', readUpdateError);
    } else {
      console.log('✅ [getRoomMessages] Updated read status for candidate messages in room:', roomId);
    }

    // file_urlsをJSONB形式からstring[]に変換
    const formattedMessages: ChatMessage[] = (messages || []).map((msg: any) => ({
      id: msg.id,
      room_id: msg.room_id,
      content: msg.content,
      sender_type: msg.sender_type,
      sender_candidate_id: msg.sender_candidate_id,
      sender_company_group_id: msg.sender_company_group_id,
      message_type: msg.message_type,
      subject: msg.subject,
      status: msg.status,
      sent_at: msg.sent_at,
      read_at: msg.read_at,
      replied_at: msg.replied_at,
      file_urls: Array.isArray(msg.file_urls) ? msg.file_urls : [],
      created_at: msg.created_at,
      updated_at: msg.updated_at,
      sender_candidate: msg.sender_candidate,
      sender_company_group: msg.sender_company_group
    }));

    return formattedMessages;

  } catch (error) {
    console.error('❌ [getRoomMessages] Unexpected error:', error);
    return [];
  }
}

// 企業ユーザー用: ルームのメッセージを既読にする専用関数
export async function markRoomMessagesAsRead(roomId: string): Promise<{ success: boolean; error?: string }> {
  console.log('🔍 [markRoomMessagesAsRead] Marking messages as read for room:', roomId);
  
  const supabase = getSupabaseAdminClient();

  try {
    // 企業側宛ての未読メッセージ（候補者から送信された'SENT'ステータスのメッセージ）を既読にする
    const { error: readUpdateError } = await supabase
      .from('messages')
      .update({
        status: 'READ',
        read_at: new Date().toISOString()
      })
      .eq('room_id', roomId)
      .eq('status', 'SENT')
      .eq('sender_type', 'CANDIDATE'); // 候補者からのメッセージのみ

    if (readUpdateError) {
      console.error('❌ [markRoomMessagesAsRead] Failed to update read status:', readUpdateError);
      return { success: false, error: readUpdateError.message };
    }

    console.log('✅ [markRoomMessagesAsRead] Successfully updated read status for room:', roomId);
    return { success: true };

  } catch (error) {
    console.error('❌ [markRoomMessagesAsRead] Unexpected error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export interface SendCompanyMessageData {
  room_id: string;
  content: string;
  subject?: string;
  message_type?: 'SCOUT' | 'APPLICATION' | 'GENERAL';
  file_urls?: string[];
}

export async function sendCompanyMessage(data: SendCompanyMessageData) {
  try {
    console.log('🚀 [sendCompanyMessage] Starting send process:', data);

    // 企業ユーザー認証
    const authResult = await requireCompanyAuthWithSession();
    if (!authResult.success) {
      console.error('❌ [sendCompanyMessage] Auth failed:', authResult.error);
      return { error: 'Unauthorized' };
    }

    const { companyUserId } = authResult.data;
    const supabase = getSupabaseAdminClient();

    console.log('🔍 [sendCompanyMessage] Validating room access for user:', companyUserId);

    // ルームのアクセス権限を確認（企業ユーザーが権限を持つグループのルームかチェック）
    const { data: userGroups, error: userGroupsError } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id')
      .eq('company_user_id', companyUserId);

    if (userGroupsError || !userGroups || userGroups.length === 0) {
      console.error('❌ [sendCompanyMessage] User groups error:', userGroupsError);
      return { error: 'No group permissions found' };
    }

    const groupIds = userGroups.map(g => g.company_group_id);
    console.log('📋 [sendCompanyMessage] User group IDs:', groupIds);

    // ルームが企業ユーザーのグループに属するかチェック
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('id, company_group_id, candidate_id')
      .eq('id', data.room_id)
      .in('company_group_id', groupIds)
      .single();

    if (roomError || !room) {
      console.error('❌ [sendCompanyMessage] Room validation error:', roomError);
      return { error: 'Room not found or unauthorized' };
    }

    console.log('✅ [sendCompanyMessage] Room validation passed:', room);

    // メッセージを挿入
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        room_id: data.room_id,
        content: data.content,
        subject: data.subject || null,
        message_type: data.message_type || 'GENERAL',
        sender_type: 'COMPANY_USER',
        sender_company_group_id: room.company_group_id,
        status: 'SENT',
        file_urls: data.file_urls || [],
      })
      .select('*')
      .single();

    if (messageError) {
      console.error('❌ [sendCompanyMessage] Message insert error:', messageError);
      return { error: 'Failed to send message' };
    }

    console.log('✅ [sendCompanyMessage] Message inserted:', message.id);

    // roomのupdated_atを更新
    await supabase
      .from('rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', data.room_id);

    // キャッシュを再検証
    revalidatePath('/company/message');

    return { message };
  } catch (error) {
    console.error('❌ [sendCompanyMessage] Unexpected error:', error);
    return { error: 'Internal server error' };
  }
}

// 企業側のファイルアップロード用のサーバーアクション
export async function uploadCompanyMessageFile(formData: FormData) {
  try {
    const authResult = await requireCompanyAuthWithSession();
    if (!authResult.success) {
      return { error: 'ユーザーが認証されていません' };
    }

    const { companyUserId } = authResult.data;
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file) {
      return { error: 'ファイルが指定されていません' };
    }

    if (!userId) {
      return { error: 'ユーザーIDが指定されていません' };
    }

    // 認証されたユーザーIDと一致することを確認
    if (companyUserId !== userId) {
      console.error('User ID mismatch:', {
        authUserId: companyUserId,
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
    console.log('🔍 [COMPANY UPLOAD DEBUG] File info:', {
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
    const filePath = `company/${companyUserId}/messages/${fileName}`;
    
    console.log('🔍 [COMPANY UPLOAD DEBUG] File path generation:', {
      original: file.name,
      sanitized: sanitizedFileName,
      final: fileName,
      filePath: filePath
    });

    console.log('🔍 [SERVER ACTION] Uploading company message file:', filePath);

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
      console.error('Supabase company message file upload error:', error);
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

    console.log('✅ [SERVER ACTION] Company message file uploaded successfully:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: filePath,
      success: true
    };

  } catch (error) {
    console.error('Upload company message file error:', error);
    return { error: 'ファイルのアップロード中にエラーが発生しました' };
  }
}