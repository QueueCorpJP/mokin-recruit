import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { authenticateMessageUser, MessageAuthResult } from '@/lib/server/utils/messageAuth';
import { logger } from '@/lib/server/utils/logger';

/**
 * Save decline reason when candidate declines a scout/job offer (POST)
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
      reason,
      companyUserId,
      jobPostingId,
      roomId
    } = body;

    // バリデーション
    if (!reason || reason.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '辞退理由は必須です' },
        { status: 400 }
      );
    }

    // 候補者のみが辞退理由を送信できる
    if (authResult.userType !== 'CANDIDATE') {
      return NextResponse.json(
        { success: false, error: '候補者のみが辞退理由を送信できます' },
        { status: 403 }
      );
    }

    const supabase = getSupabaseAdminClient();

    // 辞退理由を保存
    const declineReasonData = {
      candidate_id: authResult.userId,
      company_user_id: companyUserId || null,
      job_posting_id: jobPostingId || null,
      room_id: roomId || null,
      reason: reason.trim()
    };

    const { data: declineReason, error: declineError } = await supabase
      .from('decline_reasons')
      .insert(declineReasonData)
      .select()
      .single();

    if (declineError) {
      logger.error('Failed to save decline reason:', declineError);
      return NextResponse.json(
        { success: false, error: '辞退理由の保存に失敗しました' },
        { status: 500 }
      );
    }

    logger.info(`Decline reason saved successfully: ${declineReason.id}`);

    return NextResponse.json({
      success: true,
      message: '辞退理由を保存しました',
      data: {
        id: declineReason.id,
        reason: declineReason.reason,
        createdAt: declineReason.created_at
      }
    }, { status: 201 });

  } catch (error) {
    logger.error('POST /api/message/decline error:', error);
    return NextResponse.json(
      { success: false, error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}