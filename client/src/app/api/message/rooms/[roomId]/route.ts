import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { authenticateMessageUser, MessageAuthResult } from '@/lib/server/utils/messageAuth';
import { logger } from '@/lib/server/utils/logger';

/**
 * 特定ルームの詳細情報取得 (GET)
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

    // ルーム詳細情報を取得
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select(`
        id,
        type,
        related_job_posting_id,
        company_group_id,
        created_at,
        updated_at,
        job_postings (
          id,
          title,
          position_summary,
          job_description,
          employment_type,
          work_location,
          salary_min,
          salary_max,
          company_accounts (
            id,
            company_name,
            industry
          )
        ),
        company_groups (
          id,
          group_name,
          description
        )
      `)
      .eq('id', roomId)
      .single();

    if (roomError) {
      logger.error('Failed to fetch room details:', roomError);
      return NextResponse.json(
        { success: false, error: 'ルーム情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // 参加者情報を取得
    const { data: participants, error: participantsError } = await supabase
      .from('room_participants')
      .select(`
        participant_type,
        candidate_id,
        company_user_id,
        joined_at,
        candidates (
          id,
          email,
          first_name,
          last_name,
          current_residence,
          experience_years,
          skills,
          desired_industries,
          desired_job_types
        ),
        company_users (
          id,
          email,
          full_name,
          position_title,
          company_account_id,
          company_accounts (
            company_name,
            industry
          )
        )
      `)
      .eq('room_id', roomId);

    if (participantsError) {
      logger.error('Failed to fetch participants:', participantsError);
      return NextResponse.json(
        { success: false, error: '参加者情報の取得に失敗しました' },
        { status: 500 }
      );
    }

    // メッセージ統計を取得
    const { data: messageStats } = await supabase
      .from('messages')
      .select('id, status, sender_type')
      .eq('room_id', roomId);

    const totalMessages = messageStats?.length || 0;
    const unreadMessages = messageStats?.filter(
      msg => msg.status === 'SENT' && 
      msg.sender_type !== authResult.userType
    ).length || 0;

    // 最新メッセージを取得
    const { data: latestMessage } = await supabase
      .from('messages')
      .select(`
        id,
        sender_type,
        content,
        message_type,
        status,
        sent_at,
        candidates!messages_sender_candidate_id_fkey (
          first_name,
          last_name
        ),
        company_users!messages_sender_company_user_id_fkey (
          full_name
        )
      `)
      .eq('room_id', roomId)
      .order('sent_at', { ascending: false })
      .limit(1)
      .single();

    // レスポンス用にデータを整形
    const formattedParticipants = (participants || []).map(p => ({
      type: p.participant_type,
      joinedAt: p.joined_at,
      user: p.participant_type === 'CANDIDATE' && p.candidates ? {
        id: p.candidates.id,
        email: p.candidates.email,
        name: `${p.candidates.last_name} ${p.candidates.first_name}`,
        residence: p.candidates.current_residence,
        experienceYears: p.candidates.experience_years,
        skills: p.candidates.skills,
        desiredIndustries: p.candidates.desired_industries,
        desiredJobTypes: p.candidates.desired_job_types
      } : p.participant_type === 'COMPANY_USER' && p.company_users ? {
        id: p.company_users.id,
        email: p.company_users.email,
        name: p.company_users.full_name,
        position: p.company_users.position_title,
        companyName: p.company_users.company_accounts?.company_name,
        industry: p.company_users.company_accounts?.industry
      } : null
    })).filter(p => p.user !== null);

    const roomDetails = {
      id: room.id,
      type: room.type,
      relatedJobPostingId: room.related_job_posting_id,
      companyGroupId: room.company_group_id,
      createdAt: room.created_at,
      updatedAt: room.updated_at,
      jobPosting: room.job_postings ? {
        id: room.job_postings.id,
        title: room.job_postings.title,
        positionSummary: room.job_postings.position_summary,
        jobDescription: room.job_postings.job_description,
        employmentType: room.job_postings.employment_type,
        workLocation: room.job_postings.work_location,
        salaryMin: room.job_postings.salary_min,
        salaryMax: room.job_postings.salary_max,
        company: room.job_postings.company_accounts ? {
          id: room.job_postings.company_accounts.id,
          name: room.job_postings.company_accounts.company_name,
          industry: room.job_postings.company_accounts.industry
        } : null
      } : null,
      companyGroup: room.company_groups ? {
        id: room.company_groups.id,
        name: room.company_groups.group_name,
        description: room.company_groups.description
      } : null,
      participants: formattedParticipants,
      stats: {
        totalMessages,
        unreadMessages
      },
      latestMessage: latestMessage ? {
        id: latestMessage.id,
        senderType: latestMessage.sender_type,
        senderName: latestMessage.sender_type === 'CANDIDATE'
          ? `${latestMessage.candidates?.last_name} ${latestMessage.candidates?.first_name}`
          : latestMessage.company_users?.full_name,
        content: latestMessage.content,
        messageType: latestMessage.message_type,
        status: latestMessage.status,
        sentAt: latestMessage.sent_at
      } : null
    };

    return NextResponse.json({
      success: true,
      room: roomDetails
    });

  } catch (error) {
    logger.error(`GET /api/message/rooms/${params.roomId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * ルーム情報の更新 (PATCH)
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
    const { type, relatedJobPostingId, companyGroupId } = body;

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
        { success: false, error: 'このルームを編集する権限がありません' },
        { status: 403 }
      );
    }

    // 更新するフィールドを構築
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (type && ['direct', 'group'].includes(type)) {
      updateData.type = type;
    }

    if (relatedJobPostingId !== undefined) {
      updateData.related_job_posting_id = relatedJobPostingId;
    }

    if (companyGroupId !== undefined) {
      updateData.company_group_id = companyGroupId;
    }

    // ルーム情報を更新
    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update(updateData)
      .eq('id', roomId)
      .select()
      .single();

    if (updateError) {
      logger.error('Failed to update room:', updateError);
      return NextResponse.json(
        { success: false, error: 'ルーム情報の更新に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ルーム情報が更新されました',
      room: {
        id: updatedRoom.id,
        type: updatedRoom.type,
        relatedJobPostingId: updatedRoom.related_job_posting_id,
        companyGroupId: updatedRoom.company_group_id,
        updatedAt: updatedRoom.updated_at
      }
    });

  } catch (error) {
    logger.error(`PATCH /api/message/rooms/${params.roomId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

/**
 * ルーム削除 (DELETE)
 */
export async function DELETE(
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
        { success: false, error: 'このルームを削除する権限がありません' },
        { status: 403 }
      );
    }

    // ルームを削除（CASCADE設定により関連データも自動削除される）
    const { error: deleteError } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (deleteError) {
      logger.error('Failed to delete room:', deleteError);
      return NextResponse.json(
        { success: false, error: 'ルームの削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ルームが削除されました'
    });

  } catch (error) {
    logger.error(`DELETE /api/message/rooms/${params.roomId} error:`, error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
} 