import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { authenticateMessageUser, MessageAuthResult } from '@/lib/server/utils/messageAuth';
import { logger } from '@/lib/server/utils/logger';

/**
 * 特定ルームのメッセージ一覧取得 (GET)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    // 認証チェック
    const authResult: MessageAuthResult = await authenticateMessageUser(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { roomId } = params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdminClient();

    // ユーザーがそのルームに参加しているかチェック
    const { data: participation, error: participationError } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('participant_type', authResult.userType)
      .eq(
        authResult.userType === 'CANDIDATE' ? 'candidate_id' : 'company_user_id',
        authResult.userId
      )
      .single();

    if (participationError || !participation) {
      return NextResponse.json(
        { success: false, error: 'このルームにアクセスする権限がありません' },
        { status: 403 }
      );
    }

    // メッセージ一覧を取得
    const { data: messages, error: messagesError, count } = await supabase
      .from('messages')
      .select(`
        id,
        sender_type,
        sender_candidate_id,
        sender_company_user_id,
        message_type,
        subject,
        content,
        status,
        sent_at,
        read_at,
        replied_at,
        created_at,
        updated_at,
        candidates!messages_sender_candidate_id_fkey (
          id,
          first_name,
          last_name
        ),
        company_users!messages_sender_company_user_id_fkey (
          id,
          full_name
        )
      `, { count: 'exact' })
      .eq('room_id', roomId)
      .order('sent_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (messagesError) {
      logger.error('Failed to fetch messages:', messagesError);
      return NextResponse.json(
        { success: false, error: 'メッセージの取得に失敗しました' },
        { status: 500 }
      );
    }

    // 自分宛ての未読メッセージを既読にする
    const { error: readUpdateError } = await supabase
      .from('messages')
      .update({
        status: 'READ',
        read_at: new Date().toISOString()
      })
      .eq('room_id', roomId)
      .eq('status', 'SENT')
      .neq(
        authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
        authResult.userId
      );

    if (readUpdateError) {
      logger.warn('Failed to update read status:', readUpdateError);
    }

    // レスポンス用にメッセージを整形
    const formattedMessages = (messages || []).map(message => ({
      id: message.id,
      senderType: message.sender_type,
      senderId: message.sender_type === 'CANDIDATE' 
        ? message.sender_candidate_id 
        : message.sender_company_user_id,
      senderName: message.sender_type === 'CANDIDATE'
        ? `${message.candidates?.last_name || ''} ${message.candidates?.first_name || ''}`.trim()
        : message.company_users?.full_name,
      messageType: message.message_type,
      subject: message.subject,
      content: message.content,
      status: message.status,
      sentAt: message.sent_at,
      readAt: message.read_at,
      repliedAt: message.replied_at,
      createdAt: message.created_at,
      updatedAt: message.updated_at,
      isOwnMessage: message.sender_type === authResult.userType &&
        (message.sender_type === 'CANDIDATE' 
          ? message.sender_candidate_id === authResult.userId
          : message.sender_company_user_id === authResult.userId)
    }));

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    logger.error(`GET /api/message/rooms/${params.roomId}/messages error:`, error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * メッセージ送信 (POST)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    // 認証チェック
    const authResult: MessageAuthResult = await authenticateMessageUser(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { roomId } = params;
    const body = await request.json();
    const { messageType, subject, content } = body;

    // バリデーション
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'メッセージ内容は必須です' },
        { status: 400 }
      );
    }

    if (!messageType || !['SCOUT', 'APPLICATION', 'GENERAL'].includes(messageType)) {
      return NextResponse.json(
        { success: false, error: '無効なメッセージタイプです' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // ユーザーがそのルームに参加しているかチェック
    const { data: participation, error: participationError } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('participant_type', authResult.userType)
      .eq(
        authResult.userType === 'CANDIDATE' ? 'candidate_id' : 'company_user_id',
        authResult.userId
      )
      .single();

    if (participationError || !participation) {
      return NextResponse.json(
        { success: false, error: 'このルームにメッセージを送信する権限がありません' },
        { status: 403 }
      );
    }

    // メッセージを挿入
    const messageData = {
      room_id: roomId,
      sender_type: authResult.userType,
      sender_candidate_id: authResult.userType === 'CANDIDATE' ? authResult.userId : null,
      sender_company_user_id: authResult.userType === 'COMPANY_USER' ? authResult.userId : null,
      message_type: messageType,
      subject: subject || null,
      content: content.trim(),
      status: 'SENT'
    };

    const { data: newMessage, error: messageError } = await supabase
      .from('messages')
      .insert(messageData)
      .select(`
        id,
        sender_type,
        sender_candidate_id,
        sender_company_user_id,
        message_type,
        subject,
        content,
        status,
        sent_at,
        created_at,
        candidates!messages_sender_candidate_id_fkey (
          id,
          first_name,
          last_name
        ),
        company_users!messages_sender_company_user_id_fkey (
          id,
          full_name
        )
      `)
      .single();

    if (messageError) {
      logger.error('Failed to send message:', messageError);
      return NextResponse.json(
        { success: false, error: 'メッセージの送信に失敗しました' },
        { status: 500 }
      );
    }

    // ルームの updated_at を更新
    await supabase
      .from('rooms')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', roomId);

    // レスポンス用にメッセージを整形
    const formattedMessage = {
      id: newMessage.id,
      senderType: newMessage.sender_type,
      senderId: newMessage.sender_type === 'CANDIDATE' 
        ? newMessage.sender_candidate_id 
        : newMessage.sender_company_user_id,
      senderName: newMessage.sender_type === 'CANDIDATE'
        ? `${newMessage.candidates?.last_name || ''} ${newMessage.candidates?.first_name || ''}`.trim()
        : newMessage.company_users?.full_name,
      messageType: newMessage.message_type,
      subject: newMessage.subject,
      content: newMessage.content,
      status: newMessage.status,
      sentAt: newMessage.sent_at,
      createdAt: newMessage.created_at,
      isOwnMessage: true
    };

    return NextResponse.json({
      success: true,
      message: 'メッセージが送信されました',
      data: formattedMessage
    }, { status: 201 });

  } catch (error) {
    logger.error(`POST /api/message/rooms/${params.roomId}/messages error:`, error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * メッセージのステータス更新 (PATCH)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    // 認証チェック
    const authResult: MessageAuthResult = await authenticateMessageUser(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const { roomId } = params;
    const body = await request.json();
    const { messageIds, status } = body;

    // バリデーション
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'メッセージIDが必要です' },
        { status: 400 }
      );
    }

    if (!status || !['READ', 'replied'].includes(status)) {
      return NextResponse.json(
        { success: false, error: '無効なステータスです' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // ユーザーがそのルームに参加しているかチェック
    const { data: participation, error: participationError } = await supabase
      .from('room_participants')
      .select('*')
      .eq('room_id', roomId)
      .eq('participant_type', authResult.userType)
      .eq(
        authResult.userType === 'CANDIDATE' ? 'candidate_id' : 'company_user_id',
        authResult.userId
      )
      .single();

    if (participationError || !participation) {
      return NextResponse.json(
        { success: false, error: 'このルームへのアクセス権限がありません' },
        { status: 403 }
      );
    }

    // メッセージのステータスを更新
    const updateData: any = {
      status: status.toUpperCase(),
      updated_at: new Date().toISOString()
    };

    if (status === 'read') {
      updateData.read_at = new Date().toISOString();
    } else if (status === 'replied') {
      updateData.replied_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('messages')
      .update(updateData)
      .eq('room_id', roomId)
      .in('id', messageIds)
      // 自分が送信したメッセージ以外のもののみ更新
      .neq(
        authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
        authResult.userId
      );

    if (updateError) {
      logger.error('Failed to update message status:', updateError);
      return NextResponse.json(
        { success: false, error: 'メッセージステータスの更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `メッセージが${status === 'read' ? '既読' : '返信済み'}に更新されました`
    });

  } catch (error) {
    logger.error(`PATCH /api/message/rooms/${params.roomId}/messages error:`, error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 