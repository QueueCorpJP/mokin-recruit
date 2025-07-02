import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import { z } from 'zod';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';

// リクエストボディのバリデーションスキーマ
const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'トークンが必要です'),
  tokenHash: z.string().min(1, 'トークンハッシュが必要です'),
  type: z.literal('recovery', {
    errorMap: () => ({ message: '無効なトークンタイプです' }),
  }),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
      '半角英数字・記号のみ使用できます'
    )
    .regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, '英数字を含めてください'),
  confirmPassword: z.string().min(1, '確認パスワードが必要です'),
});

// パスワード確認のリファインメント
const ResetPasswordSchemaWithConfirm = ResetPasswordSchema.refine(
  data => data.password === data.confirmPassword,
  {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  }
);

export async function POST(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    const body = await request.json();

    // バリデーション
    const validationResult = ResetPasswordSchemaWithConfirm.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Password reset validation failed:', firstError);

      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Invalid input',
          field: firstError?.path?.[0] || 'general',
        },
        { status: 400 }
      );
    }

    const { token, tokenHash, type, password } = validationResult.data;

    logger.info('Processing password reset request', {
      tokenHash: tokenHash.substring(0, 10) + '...',
      type,
    });

    // Supabaseクライアントを取得
    const supabase = getSupabaseClient();

    try {
      // Step 1: トークンを使用してセッションを確認
      const { data: sessionData, error: sessionError } =
        await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        });

      if (sessionError) {
        logger.warn('Token verification failed:', sessionError);

        let errorMessage = 'リセットリンクが無効または期限切れです。';
        if (sessionError.message?.includes('expired')) {
          errorMessage =
            'リセットリンクの有効期限が切れています。再度パスワードリセットを要求してください。';
        } else if (sessionError.message?.includes('invalid')) {
          errorMessage =
            'リセットリンクが無効です。正しいリンクを使用してください。';
        }

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 400 }
        );
      }

      if (!sessionData.session) {
        logger.warn('No session data returned from token verification');
        return NextResponse.json(
          {
            success: false,
            error: 'セッションの作成に失敗しました。再度お試しください。',
          },
          { status: 400 }
        );
      }

      // Step 2: 確認されたセッションを使用してパスワードを更新
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        logger.error('Password update failed:', updateError);

        let errorMessage = 'パスワードの更新に失敗しました。';
        if (updateError.message?.includes('password')) {
          errorMessage =
            'パスワードの要件を満たしていません。8文字以上の英数字を含むパスワードを設定してください。';
        } else if (updateError.message?.includes('session')) {
          errorMessage =
            'セッションが無効です。再度パスワードリセットを要求してください。';
        }

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
          },
          { status: 400 }
        );
      }

      logger.info('Password reset completed successfully');

      return NextResponse.json({
        success: true,
        message: 'パスワードが正常に更新されました。',
      });
    } catch (supabaseError) {
      logger.error('Supabase operation failed:', supabaseError);

      return NextResponse.json(
        {
          success: false,
          error:
            'パスワードリセット処理中にエラーが発生しました。再度お試しください。',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Reset password API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
      },
      { status: 500 }
    );
  }
}

// OPTIONSメソッドのサポート（CORS対応）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin':
        process.env.CORS_ORIGIN || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
