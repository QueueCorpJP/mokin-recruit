import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/server/auth/supabaseAuth';
import { logger } from '@/lib/server/utils/logger';
import { z } from 'zod';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';

// リクエストボディのバリデーションスキーマ
const ForgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export async function POST(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    const body = await request.json();

    // バリデーション
    const validationResult = ForgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.errors[0]?.message || 'Invalid input',
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;

    logger.info(`Password reset requested for email: ${email}`);

    // Supabase Authを使用してパスワードリセットメールを送信
    const result = await requestPasswordReset(email);

    if (result.success) {
      logger.info(`Password reset email sent successfully to: ${email}`);

      // セキュリティ上、メールアドレスの存在に関係なく成功レスポンスを返す
      return NextResponse.json({
        success: true,
        message:
          'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
      });
    } else {
      logger.warn(
        `Password reset request failed for email: ${email}, error: ${result.error}`
      );

      // エラーの詳細は返さず、一般的なメッセージを返す（セキュリティ考慮）
      return NextResponse.json({
        success: true,
        message:
          'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
      });
    }
  } catch (error) {
    logger.error('Forgot password API error:', error);

    return NextResponse.json(
      {
        success: false,
        message:
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
      },
      { status: 500 }
    );
  }
}
