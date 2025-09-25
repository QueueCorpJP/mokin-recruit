'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';
import { sendEmailViaSendGrid } from '@/lib/email/sender';
import { createServerClient } from '@supabase/ssr';

export interface AutoLoginResult {
  success: boolean;
  error?: string;
}

/**
 * 本登録完了メールのHTML生成
 */
function generateRegistrationCompleteEmailHtml(
  userName: string,
  profileUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>【CuePoint】本登録が完了しました</title>
    </head>
    <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #fff;">
        <div style="padding: 20px 0;">
          <p>${userName} 様</p>

          <p>CuePointへの本登録が完了しました。<br>
          ご登録ありがとうございます。</p>

          <p><strong>【次のステップ】</strong><br>
          プロフィールの詳細を充実させることで、スカウトが届きやすくなります。<br>
          気になる求人があれば、ぜひご応募ください。</p>

          <div style="border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; margin: 20px 0; padding: 20px 0;">
            <p style="margin: 0; font-weight: bold;">■ プロフィール編集ページ：${profileUrl}</p>
          </div>

          <div style="border-top: 1px solid #ccc; margin-top: 40px; padding-top: 20px;">
            <p><strong>CuePoint</strong><br>
            <a href="https://cuepoint.jp/candidate" style="color: #0066cc;">https://cuepoint.jp/candidate</a></p>

            <p><strong>【お問い合わせ先】</strong><br>
            ${process.env.SENDGRID_FROM_EMAIL || 'support@cuepoint.jp'}</p>

            <p>運営会社：メルセネール株式会社<br>
            東京都千代田区神田須田町１丁目32番地 クレス不動産神田ビル</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function autoLoginAction(): Promise<AutoLoginResult> {
  try {
    logger.info('Auto-login action called - checking existing session');

    // RLS対応のSupabaseクライアントを使用
    const { getSupabaseServerClient } = await import(
      '@/lib/supabase/server-client'
    );

    const supabaseUrl = process.env.SUPABASE_URL!;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

    const cookieStore = await cookies();

    // Supabase SSRクライアントを作成
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server component では ignore
          }
        },
      },
    });

    // 既存のセッションを確認
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      logger.info('User already logged in, redirecting to mypage');
      redirect('/candidate/mypage');
    } else {
      // セッションが無い場合、サインアップ中のユーザーIDをチェック
      const signupUserId = cookieStore.get('signup_user_id')?.value;

      if (signupUserId) {
        logger.info('Found signup user ID, attempting auto-login');

        // ユーザー情報を取得
        const { data: candidateData } = await supabase
          .from('candidates')
          .select('email')
          .eq('id', signupUserId)
          .single();

        if (candidateData?.email) {
          logger.info('Found candidate email, creating authenticated session');

          // 管理者権限でユーザー情報を取得してセッションを作成
          const { getSupabaseAdminClient } = await import(
            '@/lib/supabase/server-client'
          );
          const supabaseAdmin = getSupabaseAdminClient();

          if (supabaseAdmin) {
            // ユーザーの認証情報を取得
            const { data: userData, error: userError } =
              await supabaseAdmin.auth.admin.listUsers();

            if (!userError && userData.users) {
              const user = userData.users.find(
                u => u.email === candidateData.email
              );

              if (user) {
                // 管理者権限でアクセストークンを生成
                const { data: tokenData, error: tokenError } =
                  await supabaseAdmin.auth.admin.generateAccessToken(user.id);

                if (!tokenError && tokenData) {
                  // セッションを手動で設定
                  const { error: setSessionError } =
                    await supabase.auth.setSession({
                      access_token: tokenData.access_token,
                      refresh_token: tokenData.refresh_token || '',
                    });

                  if (!setSessionError) {
                    logger.info('Auto-login session created successfully');

                    // 本登録完了メールを送信
                    try {
                      const userName = candidateData.email.split('@')[0]; // メールアドレスの@より前を名前として使用
                      const profileUrl = 'https://cuepoint.jp/candidate/mypage'; // プロフィール確認ページのURL

                      const emailResult = await sendEmailViaSendGrid({
                        to: candidateData.email,
                        subject: '【CuePoint】本登録が完了しました',
                        html: generateRegistrationCompleteEmailHtml(
                          userName,
                          profileUrl
                        ),
                      });

                      if (emailResult.success) {
                        logger.info(
                          `Registration complete email sent successfully to: ${candidateData.email.substring(0, 3)}***`,
                          { messageId: emailResult.messageId }
                        );
                      } else {
                        logger.error(
                          'Failed to send registration complete email:',
                          emailResult.error
                        );
                      }
                    } catch (emailError) {
                      logger.error(
                        'Error sending registration complete email:',
                        emailError
                      );
                    }

                    // サインアップ用クッキーを削除
                    cookieStore.delete('signup_user_id');
                    redirect('/candidate/mypage');
                  } else {
                    logger.error('Failed to set session:', setSessionError);
                  }
                } else {
                  logger.error('Failed to generate access token:', tokenError);
                }
              } else {
                logger.error('User not found in auth system');
              }
            } else {
              logger.error('Failed to list users:', userError);
            }
          }

          logger.warn('Failed to create auto-login session');
          return {
            success: false,
            error:
              'セッション作成に失敗しました。ログインページからログインしてください。',
          };
        }
      }

      logger.info('No active session and no signup user ID found');
      return {
        success: false,
        error: 'ログインが必要です。ログインページからログインしてください。',
      };
    }
  } catch (error) {
    // Next.js の redirect エラーは正常な動作
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    logger.error('Auto-login error:', error);
    return {
      success: false,
      error: 'ログインに失敗しました',
    };
  }
}
