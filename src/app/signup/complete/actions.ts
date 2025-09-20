'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';
import { createServerClient } from '@supabase/ssr';

export interface AutoLoginResult {
  success: boolean;
  error?: string;
}

export async function autoLoginAction(): Promise<AutoLoginResult> {
  try {
    logger.info('Auto-login action called - checking existing session');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        success: false,
        error: 'サーバー設定エラー',
      };
    }

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
          const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (supabaseServiceRoleKey) {
            const { createClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createClient(
              supabaseUrl,
              supabaseServiceRoleKey
            );

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
