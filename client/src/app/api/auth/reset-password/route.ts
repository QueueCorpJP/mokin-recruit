import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import { z } from 'zod';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';

// リクエストボディのバリデーションスキーマ（柔軟性を向上）
const ResetPasswordSchema = z.object({
  // 従来のパラメータ（token_hashベース）
  tokenHash: z.string().optional(),
  type: z.string().optional(),
  // 新しいパラメータ（access_token + refresh_tokenベース）
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  // OAuth/PKCEパラメータ（codeベース）
  code: z.string().optional(),
  state: z.string().optional(),
  // パスワード情報
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
).refine(data => data.tokenHash || data.code || data.accessToken, {
  message: '認証パラメータ（tokenHash、code、またはaccessToken）が必要です',
  path: ['tokenHash'],
});

export async function POST(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    const body = await request.json();

    logger.info('🔍 Password reset request received:', {
      hasTokenHash: !!body.tokenHash,
      hasCode: !!body.code,
      hasAccessToken: !!body.accessToken,
      hasRefreshToken: !!body.refreshToken,
      type: body.type,
      state: body.state,
    });

    // バリデーション
    const validationResult = ResetPasswordSchemaWithConfirm.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('❌ Password reset validation failed:', firstError);

      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Invalid input',
          field: firstError?.path?.[0] || 'general',
        },
        { status: 400 }
      );
    }

    const {
      tokenHash,
      type,
      accessToken,
      refreshToken,
      code,
      state,
      password,
    } = validationResult.data;

    // Supabaseクライアントを取得
    const supabase = getSupabaseClient();

    try {
      let sessionData: any = null;
      let sessionError: any = null;

      // 方法1: access_token + refresh_tokenを使用した直接セッション設定（最優先）
      if (accessToken && refreshToken) {
        logger.info(
          '🔑 Attempting access_token + refresh_token based authentication...'
        );

        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          sessionData = data;
          sessionError = error;

          if (sessionError) {
            logger.warn(
              '❌ Access token authentication failed:',
              sessionError.message
            );
          } else {
            logger.info('✅ Access token authentication successful');
          }
        } catch (tokenError) {
          logger.warn('❌ Access token processing failed:', tokenError);
          sessionError = tokenError;
        }
      }

      // 方法2: token_hashを使用したOTP検証（従来の方法）
      if (!sessionData && tokenHash) {
        logger.info('🔑 Attempting token_hash based verification...');

        const result = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: (type as any) || 'recovery',
        });

        sessionData = result.data;
        sessionError = result.error;

        if (sessionError) {
          logger.warn(
            '❌ Token hash verification failed:',
            sessionError.message
          );
        } else {
          logger.info('✅ Token hash verification successful');
        }
      }

      // 方法3: codeを使用したOAuth/PKCE検証（新しい方法）
      if (!sessionData && code) {
        logger.info('🔑 Attempting code based verification...');

        try {
          const result = await supabase.auth.exchangeCodeForSession(code);
          sessionData = result.data;
          sessionError = result.error;

          if (sessionError) {
            logger.warn('❌ Code verification failed:', sessionError.message);
          } else {
            logger.info('✅ Code verification successful');
          }
        } catch (codeError) {
          logger.warn('❌ Code exchange failed:', codeError);
          sessionError = codeError;
        }
      }

      // すべての方法が失敗した場合
      if (sessionError || !sessionData?.session || !sessionData?.user) {
        logger.error('❌ All authentication methods failed');

        let errorMessage = 'リセットリンクが無効または期限切れです。';

        if (sessionError?.message) {
          if (sessionError.message.includes('expired')) {
            errorMessage =
              'リセットリンクの有効期限が切れています。再度パスワードリセットを要求してください。';
          } else if (sessionError.message.includes('invalid')) {
            errorMessage =
              'リセットリンクが無効です。正しいリンクを使用してください。';
          } else if (sessionError.message.includes('token')) {
            errorMessage =
              'トークンが無効です。メールから正しいリンクをクリックしてください。';
          } else if (sessionError.message.includes('code')) {
            errorMessage =
              '認証コードが無効です。新しいパスワードリセットを要求してください。';
          } else if (sessionError.message.includes('session')) {
            errorMessage =
              'セッションの設定に失敗しました。新しいパスワードリセットを要求してください。';
          }
        }

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
            debug:
              process.env.NODE_ENV === 'development'
                ? {
                    originalError: sessionError?.message,
                    hasTokenHash: !!tokenHash,
                    hasCode: !!code,
                    hasAccessToken: !!accessToken,
                    hasRefreshToken: !!refreshToken,
                    authenticationMethod: accessToken
                      ? 'access_token'
                      : tokenHash
                        ? 'token_hash'
                        : code
                          ? 'code'
                          : 'none',
                  }
                : undefined,
          },
          { status: 400 }
        );
      }

      logger.info('✅ Authentication successful, updating password for user:', {
        userId: sessionData.user.id,
        email: sessionData.user.email,
        authMethod: accessToken
          ? 'access_token'
          : tokenHash
            ? 'token_hash'
            : 'code',
      });

      // セッションを確実に設定（既にセッションが設定されている場合はスキップ）
      if (!accessToken) {
        await supabase.auth.setSession({
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
        });
      }

      // パスワードを更新
      const { data: updateData, error: updateError } =
        await supabase.auth.updateUser({
          password: password,
        });

      if (updateError) {
        logger.error('❌ Password update failed:', updateError);

        let errorMessage = 'パスワードの更新に失敗しました。';
        if (updateError.message?.includes('password')) {
          errorMessage =
            'パスワードの要件を満たしていません。8文字以上の英数字を含むパスワードを設定してください。';
        } else if (updateError.message?.includes('session')) {
          errorMessage =
            'セッションが無効です。再度パスワードリセットを要求してください。';
        } else if (updateError.message?.includes('weak')) {
          errorMessage =
            'パスワードが弱すぎます。より強力なパスワードを設定してください。';
        }

        return NextResponse.json(
          {
            success: false,
            error: errorMessage,
            debug:
              process.env.NODE_ENV === 'development'
                ? {
                    originalError: updateError.message,
                  }
                : undefined,
          },
          { status: 400 }
        );
      }

      logger.info('🎉 Password reset completed successfully for user:', {
        userId: updateData.user?.id,
        email: updateData.user?.email,
      });

      return NextResponse.json({
        success: true,
        message: 'パスワードが正常に更新されました。',
      });
    } catch (supabaseError) {
      logger.error('❌ Supabase operation failed:', supabaseError);

      return NextResponse.json(
        {
          success: false,
          error:
            'パスワードリセット処理中にエラーが発生しました。再度お試しください。',
          debug:
            process.env.NODE_ENV === 'development'
              ? {
                  originalError:
                    supabaseError instanceof Error
                      ? supabaseError.message
                      : String(supabaseError),
                }
              : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('❌ Reset password API error:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
        debug:
          process.env.NODE_ENV === 'development'
            ? {
                originalError:
                  error instanceof Error ? error.message : String(error),
              }
            : undefined,
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
