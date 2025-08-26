import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { getSupabaseAdminClient, getSupabaseClient } from '@/lib/server/database/supabase';

// リクエストボディの型定義
const sendCodeSchema = z.object({
  email: z.string().email('Invalid email format'),
});

type SendCodeRequestBody = z.infer<typeof sendCodeSchema>;

/**
 * 候補者登録用認証コード送信 API Route
 * POST /api/auth/register/candidate/send-code
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = sendCodeSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Send code validation failed:',
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

    const { email } = validationResult.data;

    // Supabase管理者クライアントを取得
    const supabaseAdmin = getSupabaseAdminClient();

    // 既存ユーザーチェック（管理者権限で直接確認）
    try {
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) {
        logger.error('Error listing users:', listError);
        return NextResponse.json(
          { success: false, message: 'Internal server error' },
          { status: 500 }
        );
      }

      // メールアドレスが既に登録されているかチェック
      const existingUser = existingUsers.users.find(user => user.email === email);
      
      if (existingUser) {
        logger.warn(`Registration attempt with existing email: ${email}`);
        return NextResponse.json(
          {
            success: false,
            message: 'このメールアドレスは既に登録されています',
          },
          { status: 409 }
        );
      }
    } catch (error) {
      logger.error('Error checking existing users:', error);
      return NextResponse.json(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }

    // 通常のクライアントでOTP送信（新規登録用）
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true, // 新規ユーザーを作成する
        data: {
          registration_flow: true, // カスタムメタデータで登録フローであることを示す
        },
      },
    });

    if (error) {
      logger.error('Supabase OTP sending failed:', error);
      return NextResponse.json(
        {
          success: false,
          message: '認証コードの送信に失敗しました',
          error: error.message,
        },
        { status: 500 }
      );
    }

    logger.info(`OTP sent successfully to: ${email}`);

    return NextResponse.json({
      success: true,
      message: '認証コードをメールアドレスに送信しました。メールをご確認ください。',
      data: {
        email: email,
        // セキュリティのため、詳細なレスポンスは含めない
      },
    });
  } catch (error) {
    logger.error('API Route error - send verification code:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 