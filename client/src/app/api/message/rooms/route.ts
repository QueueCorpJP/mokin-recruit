import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { authenticateMessageUser, MessageAuthResult } from '@/lib/server/utils/messageAuth';
import { logger } from '@/lib/server/utils/logger';

/**
 * ルーム一覧取得 (GET)
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    // ユーザーが参加しているルーム一覧を取得
    const { data: participantRooms, error: participantError } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        rooms!inner (
          id,
          type,
          related_job_posting_id,
          company_group_id,
          created_at,
          updated_at,
          job_postings (
            id,
            title,
            company_accounts (
              company_name
            )
          )
        )
      `)
      .or(
        authResult.userType === 'CANDIDATE'
          ? `candidate_id.eq.${authResult.userId}`
          : `company_user_id.eq.${authResult.userId}`
      )
      .eq('participant_type', authResult.userType)
      .range(offset, offset + limit - 1);

    if (participantError) {
      logger.error('Failed to fetch participant rooms:', participantError);
      return NextResponse.json(
        { success: false, error: 'ルーム一覧の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 各ルームのIDリストを作成
    const roomIds = (participantRooms || []).map((p) => p.room_id);

    // 最新メッセージを一括取得
    const { data: latestMessages } = await supabase
      .from('messages')
      .select('id, content, sent_at, sender_type, status, room_id')
      .in('room_id', roomIds)
      .order('sent_at', { ascending: false });
    // room_idごとに最新メッセージをMap化
    const latestMessageMap = new Map();
    latestMessages?.forEach((msg) => {
      if (!latestMessageMap.has(msg.room_id)) {
        latestMessageMap.set(msg.room_id, msg);
      }
    });

    // 参加者一覧を一括取得
    const { data: allParticipants } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        participant_type,
        candidate_id,
        company_user_id,
        candidates (
          id,
          first_name,
          last_name
        ),
        company_users (
          id,
          full_name
        )
      `)
      .in('room_id', roomIds);
    // room_idごとにグループ化
    const participantsMap = new Map();
    allParticipants?.forEach((p) => {
      if (!participantsMap.has(p.room_id)) participantsMap.set(p.room_id, []);
      participantsMap.get(p.room_id).push(p);
    });

    // 未読数を一括取得
    const { data: unreadCounts } = await supabase
      .from('messages')
      .select('room_id, count:id', { groupBy: 'room_id' })
      .in('room_id', roomIds)
      .neq('status', 'READ')
      .neq(
        authResult.userType === 'CANDIDATE' ? 'sender_candidate_id' : 'sender_company_user_id',
        authResult.userId
      );
    // room_idごとに未読数をMap化
    const unreadCountMap = new Map();
    unreadCounts?.forEach((row) => {
      unreadCountMap.set(row.room_id, row.count);
    });

    // roomsWithDetailsを組み立て
    const roomsWithDetails = (participantRooms || []).map((participant) => {
      const room = participant.rooms;
      const latestMessage = latestMessageMap.get(room.id);
      const participants = participantsMap.get(room.id) || [];
      const unreadCount = unreadCountMap.get(room.id) || 0;
      return {
        id: room.id,
        type: room.type,
        relatedJobPostingId: room.related_job_posting_id,
        companyGroupId: room.company_group_id,
        createdAt: room.created_at,
        updatedAt: room.updated_at,
        jobPosting: room.job_postings ? {
          id: room.job_postings.id,
          title: room.job_postings.title,
          companyName: room.job_postings.company_accounts?.company_name
        } : null,
        latestMessage: latestMessage ? {
          id: latestMessage.id,
          content: latestMessage.content,
          sentAt: latestMessage.sent_at,
          senderType: latestMessage.sender_type,
          status: latestMessage.status
        } : null,
        participants: participants.map(p => ({
          type: p.participant_type,
          id: p.participant_type === 'CANDIDATE' ? p.candidate_id : p.company_user_id,
          name: p.participant_type === 'CANDIDATE'
            ? `${p.candidates?.last_name || ''} ${p.candidates?.first_name || ''}`.trim()
            : p.company_users?.full_name
        })),
        unreadCount
      };
    });

    return NextResponse.json({
      success: true,
      rooms: roomsWithDetails,
      pagination: {
        page,
        limit,
        total: roomsWithDetails.length
      }
    });

  } catch (error) {
    logger.error('GET /api/message/rooms error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * ルーム作成 (POST)
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
      type = 'direct', 
      relatedJobPostingId, 
      companyGroupId,
      participantType,
      participantId 
    } = body;

    // バリデーション
    if (!participantType || !participantId) {
      return NextResponse.json(
        { success: false, error: '参加者の情報が必要です' },
        { status: 400 }
      );
    }

    if (!['CANDIDATE', 'COMPANY_USER'].includes(participantType)) {
      return NextResponse.json(
        { success: false, error: '無効な参加者タイプです' },
        { status: 400 }
      );
    }

    // 同一の参加者間でのルームがすでに存在するかチェック
    const supabase = getSupabaseAdminClient();

    // 既存のルームをチェック
    const { data: existingRoom } = await supabase
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

    // 対象参加者のルームもチェック
    if (existingRoom) {
      for (const room of existingRoom) {
        const { data: otherParticipant } = await supabase
          .from('room_participants')
          .select('*')
          .eq('room_id', room.room_id)
          .eq('participant_type', participantType)
          .eq(
            participantType === 'CANDIDATE' ? 'candidate_id' : 'company_user_id',
            participantId
          )
          .single();

        if (otherParticipant) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'この参加者との間には既にルームが存在します',
              existingRoomId: room.room_id
            },
            { status: 409 }
          );
        }
      }
    }

    // 新しいルームを作成
    const { data: newRoom, error: roomError } = await supabase
      .from('rooms')
      .insert({
        type,
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

    // 現在のユーザーを参加者として追加
    const currentUserParticipant = {
      room_id: newRoom.id,
      participant_type: authResult.userType,
      candidate_id: authResult.userType === 'CANDIDATE' ? authResult.userId : null,
      company_user_id: authResult.userType === 'COMPANY_USER' ? authResult.userId : null
    };

    // 対象参加者を追加
    const targetParticipant = {
      room_id: newRoom.id,
      participant_type: participantType,
      candidate_id: participantType === 'CANDIDATE' ? participantId : null,
      company_user_id: participantType === 'COMPANY_USER' ? participantId : null
    };

    const { error: participantError } = await supabase
      .from('room_participants')
      .insert([currentUserParticipant, targetParticipant]);

    if (participantError) {
      // ルーム作成を巻き戻し
      await supabase.from('rooms').delete().eq('id', newRoom.id);
      
      logger.error('Failed to add participants:', participantError);
      return NextResponse.json(
        { success: false, error: '参加者の追加に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ルームが作成されました',
      room: {
        id: newRoom.id,
        type: newRoom.type,
        relatedJobPostingId: newRoom.related_job_posting_id,
        companyGroupId: newRoom.company_group_id,
        createdAt: newRoom.created_at
      }
    }, { status: 201 });

  } catch (error) {
    logger.error('POST /api/message/rooms error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 