import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { getSupabaseClient } from '@/lib/server/database/supabase';

// リクエストボディの型定義
const verifyCodeSchema = z.object({
  email: z.string().email('Invalid email format'),
  code: z.string().min(6, 'Code must be at least 6 characters').max(6, 'Code must be exactly 6 characters'),
});

type VerifyCodeRequestBody = z.infer<typeof verifyCodeSchema>;

/**
 * 候補者登録用認証コード確認 API Route
 * POST /api/auth/register/candidate/verify-code
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = verifyCodeSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Verify code validation failed:',
        validationResult.error.errors
      );
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, code } = validationResult.data;

    // Supabaseクライアントを取得
    const supabase = getSupabaseClient();

    // SupabaseのOTP確認機能を使用
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: code,
      type: 'email',
    });

    if (error) {
      logger.warn(`OTP verification failed for ${email}:`, error.message);
      
      // エラーメッセージを日本語でユーザーフレンドリーに
      let message = '認証コードの確認に失敗しました';
      if (error.message.includes('expired')) {
        message = '認証コードが期限切れです。新しいコードを請求してください';
      } else if (error.message.includes('invalid') || error.message.includes('wrong')) {
        message = '認証コードが正しくありません';
      } else if (error.message.includes('too many')) {
        message = '試行回数が上限に達しました。しばらく待ってから再度お試しください';
      }

      return NextResponse.json(
        {
          success: false,
          message: message,
          code: 'VERIFICATION_FAILED',
        },
        { status: 400 }
      );
    }

    // 認証成功
    if (!data.user || !data.session) {
      logger.error(`OTP verification succeeded but no user/session returned for ${email}`);
      return NextResponse.json(
        {
          success: false,
          message: '認証処理中にエラーが発生しました',
        },
        { status: 500 }
      );
    }

    logger.info(`OTP verification successful for: ${email}`);

    // 一時的なセッショントークンを返す（パスワード設定まで有効）
    return NextResponse.json({
      success: true,
      message: '認証コードが確認されました。続いてパスワードを設定してください。',
      data: {
        email: email,
        userId: data.user.id,
        tempToken: data.session.access_token, // パスワード設定時に必要
        expiresAt: data.session.expires_at,
      },
    });
  } catch (error) {
    logger.error('API Route error - verify code:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 