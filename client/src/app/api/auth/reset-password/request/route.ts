import { NextRequest, NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/server/auth/supabaseAuth';
import { z } from 'zod';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';

// リクエストボディのバリデーションスキーマ
const ForgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export async function POST(request: NextRequest) {
  console.log('🔄 Password reset request received');

  try {
    // Supabase初期化を確実に実行
    console.log('🔧 Initializing Supabase...');
    ensureSupabaseInitialized();
    console.log('✅ Supabase initialized successfully');

    // リクエストボディの解析
    console.log('📥 Parsing request body...');
    const body = await request.json();
    console.log('📥 Request body parsed successfully');

    // バリデーション
    console.log('🔍 Validating email format...');
    const validationResult = ForgotPasswordSchema.safeParse(body);
    if (!validationResult.success) {
      console.log('❌ Email validation failed:', validationResult.error.errors);
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.errors[0]?.message || 'Invalid input',
        },
        { status: 400 }
      );
    }

    const { email } = validationResult.data;
    console.log(
      `📧 Processing password reset for email: ${email.substring(0, 3)}***`
    );

    // Supabase Authを使用してパスワードリセットメールを送信
    console.log('📤 Calling Supabase password reset...');
    const result = await requestPasswordReset(email);
    console.log('📤 Supabase password reset call completed:', {
      success: result.success,
    });

    if (result.success) {
      console.log(
        `✅ Password reset email sent successfully to: ${email.substring(0, 3)}***`
      );

      // セキュリティ上、メールアドレスの存在に関係なく成功レスポンスを返す
      return NextResponse.json({
        success: true,
        message:
          'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
      });
    } else {
      console.log(
        `⚠️ Password reset request failed for email: ${email.substring(0, 3)}***, error:`,
        result.error
      );

      // 本番環境でも詳細なエラー情報をログに記録
      if (process.env.NODE_ENV === 'production') {
        console.error('Production password reset error details:', {
          email: email.substring(0, 3) + '***',
          error: result.error,
          timestamp: new Date().toISOString(),
        });
      }

      // エラーの詳細は返さず、一般的なメッセージを返す（セキュリティ考慮）
      return NextResponse.json({
        success: true,
        message:
          'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
      });
    }
  } catch (error) {
    console.error('💥 Critical error in password reset API:', error);

    // 本番環境での詳細エラー情報
    if (process.env.NODE_ENV === 'production') {
      console.error('Production API error details:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString(),
        url: request.url,
        method: request.method,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
        ...(process.env.NODE_ENV === 'development' && {
          debug: {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace',
          },
        }),
      },
      { status: 500 }
    );
  }
}
