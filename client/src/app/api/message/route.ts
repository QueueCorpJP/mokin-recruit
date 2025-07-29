import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { authenticateMessageUser, MessageAuthResult } from '@/lib/server/utils/messageAuth';
import { logger } from '@/lib/server/utils/logger';

/**
 * メッセージ統計情報とダッシュボード情報を取得 (GET)
 */
export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authResult: MessageAuthResult = await authenticateMessageUser(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';
    const includeRecentMessages = searchParams.get('includeRecentMessages') === 'true';

    // ユーザーが参加しているルーム数を取得
    const { count: totalRooms } = await supabase
      .from('room_participants')
      .select('*', { count: 'exact', head: true })
      .or(
        authResult.userType === 'CANDIDATE'
          ? `candidate_id.eq.${authResult.userId}`
          : `company_user_id.eq.${authResult.userId}`
      )
      .eq('participant_type', authResult.userType);

    // ユーザーが参加しているルームIDを取得
    const { data: userRooms } = await supabase
      .from('room_participants')
      .select('room_id')
      .or(
        authResult.userType === 'CANDIDATE'
          ? `candidate_id.eq.${authResult.userId}`
          : `company_user_id.eq.${authResult.userId}`
      )
      .eq('participant_type', authResult.userType);

    const userRoomIds = userRooms?.map(r => r.room_id) || [];

    // 未読メッセージ数を取得
    const { count: unreadMessages } = userRoomIds.length > 0 ? await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'SENT')
      .neq(
        authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
        authResult.userId
      )
      .in('room_id', userRoomIds) : { count: 0 };

    const dashboardData: any = {
      totalRooms: totalRooms || 0,
      unreadMessages: unreadMessages || 0,
      userInfo: {
        type: authResult.userType,
        id: authResult.userId,
        name: authResult.userName,
        email: authResult.userEmail
      }
    };

    // 詳細統計情報を含める場合
    if (includeStats) {
      // 送信メッセージ数
      const { count: sentMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq(
          authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
          authResult.userId
        );

      // 受信メッセージ数
      const { count: receivedMessages } = userRoomIds.length > 0 ? await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .neq(
          authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
          authResult.userId
        )
        .in('room_id', userRoomIds) : { count: 0 };

      // メッセージタイプ別統計
      const { data: messagesByType } = await supabase
        .from('messages')
        .select('message_type')
        .eq(
          authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
          authResult.userId
        );

      const messageTypeStats = messagesByType?.reduce((acc, msg) => {
        acc[msg.message_type] = (acc[msg.message_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      dashboardData.stats = {
        sentMessages: sentMessages || 0,
        receivedMessages: receivedMessages || 0,
        messagesByType: messageTypeStats
      };
    }

    // 最近のメッセージを含める場合
    if (includeRecentMessages && userRoomIds.length > 0) {
      const { data: recentMessages } = await supabase
        .from('messages')
        .select(`
          id,
          room_id,
          sender_type,
          message_type,
          content,
          status,
          sent_at,
          rooms (
            id,
            type,
            job_postings (
              title,
              company_accounts (
                company_name
              )
            )
          ),
          candidates!messages_sender_candidate_id_fkey (
            first_name,
            last_name
          ),
          company_users!messages_sender_company_user_id_fkey (
            full_name
          )
        `)
        .in('room_id', userRoomIds)
        .order('sent_at', { ascending: false })
        .limit(10);

      dashboardData.recentMessages = (recentMessages || []).map((msg: any) => ({
        id: msg.id,
        roomId: msg.room_id,
        roomType: msg.rooms?.type,
        jobTitle: msg.rooms?.job_postings?.title,
        companyName: msg.rooms?.job_postings?.company_accounts?.company_name,
        senderType: msg.sender_type,
        senderName: msg.sender_type === 'CANDIDATE'
          ? `${(msg.candidates as any)?.last_name || ''} ${(msg.candidates as any)?.first_name || ''}`.trim()
          : (msg.company_users as any)?.full_name || '',
        messageType: msg.message_type,
        content: msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content,
        status: msg.status,
        sentAt: msg.sent_at,
        isOwnMessage: msg.sender_type === authResult.userType
      }));
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    logger.error('GET /api/message error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * クイックメッセージ送信 (POST)
 * 既存のルームまたは新規ルームでメッセージを送信
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authResult: MessageAuthResult = await authenticateMessageUser(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      roomId,
      targetUserId,
      targetUserType,
      messageType,
      subject,
      content,
      relatedJobPostingId,
      companyGroupId
    } = body;

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
    let targetRoomId = roomId;

    // ルームIDが指定されていない場合、新規ルームを作成または既存ルームを検索
    if (!targetRoomId) {
      if (!targetUserId || !targetUserType) {
        return NextResponse.json(
          { success: false, error: '送信先ユーザー情報が必要です' },
          { status: 400 }
        );
      }

      // 既存の1対1ルームを検索
      const { data: existingRooms } = await supabase
        .from('room_participants')
        .select(`
          room_id,
          rooms!inner (
            id,
            type
          )
        `)
        .or(
          authResult.userType === 'CANDIDATE'
            ? `candidate_id.eq.${authResult.userId}`
            : `company_user_id.eq.${authResult.userId}`
        )
        .eq('participant_type', authResult.userType);

      if (existingRooms) {
        for (const room of existingRooms) {
          const { data: otherParticipant } = await supabase
            .from('room_participants')
            .select('*')
            .eq('room_id', room.room_id)
            .eq('participant_type', targetUserType)
            .eq(
              targetUserType === 'CANDIDATE' ? 'candidate_id' : 'company_user_id',
              targetUserId
            )
            .single();

          if (otherParticipant) {
            targetRoomId = room.room_id;
            break;
          }
        }
      }

      // 既存ルームが見つからない場合、新規作成
      if (!targetRoomId) {
        const { data: newRoom, error: roomError } = await supabase
          .from('rooms')
          .insert({
            type: 'direct',
            related_job_posting_id: relatedJobPostingId,
            company_group_id: companyGroupId
          })
          .select()
          .single();

        if (roomError) {
          logger.error('Failed to create room:', roomError);
          return NextResponse.json(
            { success: false, error: 'ルームの作成に失敗しました' },
            { status: 500 }
          );
        }

        targetRoomId = newRoom.id;

        // 参加者を追加
        const participants = [
          {
            room_id: targetRoomId,
            participant_type: authResult.userType,
            candidate_id: authResult.userType === 'CANDIDATE' ? authResult.userId : null,
            company_user_id: authResult.userType === 'COMPANY_USER' ? authResult.userId : null
          },
          {
            room_id: targetRoomId,
            participant_type: targetUserType,
            candidate_id: targetUserType === 'CANDIDATE' ? targetUserId : null,
            company_user_id: targetUserType === 'COMPANY_USER' ? targetUserId : null
          }
        ];

        const { error: participantError } = await supabase
          .from('room_participants')
          .insert(participants);

        if (participantError) {
          // ルーム作成を巻き戻し
          await supabase.from('rooms').delete().eq('id', targetRoomId);
          
          logger.error('Failed to add participants:', participantError);
          return NextResponse.json(
            { success: false, error: '参加者の追加に失敗しました' },
            { status: 500 }
          );
        }
      }
    }

    // メッセージを送信
    const messageData = {
      room_id: targetRoomId,
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
        room_id,
        sender_type,
        message_type,
        subject,
        content,
        status,
        sent_at,
        created_at
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
      .eq('id', targetRoomId);

    return NextResponse.json({
      success: true,
      message: 'メッセージが送信されました',
      data: {
        messageId: newMessage.id,
        roomId: newMessage.room_id,
        sentAt: newMessage.sent_at
      }
    }, { status: 201 });

  } catch (error) {
    logger.error('POST /api/message error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
