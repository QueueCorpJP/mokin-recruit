'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { logger } from '@/lib/server/utils/logger';

export interface SetPasswordFormData {
  password: string;
  confirmPassword: string;
  userId: string;
}

export interface SetPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

export interface ResetPasswordFormData {
  tokenHash?: string;
  type?: string;
  accessToken?: string;
  refreshToken?: string;
  code?: string;
  state?: string;
  password: string;
  confirmPassword: string;
}

// リクエストボディのバリデーションスキーマ（サインアップ用）
const SetPasswordSchema = z
  .object({
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください'),
    userId: z.string().min(1, 'ユーザーIDが必要です'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// リクエストボディのバリデーションスキーマ（パスワードリセット用）
const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください'),
    tokenHash: z.string().optional(),
    type: z.string().optional(),
    accessToken: z.string().optional(),
    refreshToken: z.string().optional(),
    code: z.string().optional(),
    state: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export async function setPasswordAction(
  formData: SetPasswordFormData
): Promise<SetPasswordResult> {
  try {
    logger.info('Set password request received at:', new Date().toISOString());

    // 管理者クライアントを使用
    const { getSupabaseAdminClient } = await import(
      '@/lib/supabase/server-client'
    );

    // ステップ2: バリデーション
    const validationResult = SetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Set password validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { password, userId } = validationResult.data;
    logger.info('Set password request details:', {
      userId: userId?.substring(0, 8) + '***',
      passwordLength: password.length,
    });

    // 管理者クライアントを取得
    const supabaseAdmin = getSupabaseAdminClient();

    // ステップ5: ユーザーの検証
    try {
      const { data: user, error: getUserError } =
        await supabaseAdmin.auth.admin.getUserById(userId);

      if (getUserError) {
        logger.error('Failed to get user:', getUserError);
        return {
          success: false,
          error: 'ユーザーが見つかりません。',
        };
      }

      if (!user.user) {
        logger.error('User not found:', userId);
        return {
          success: false,
          error: 'ユーザーが見つかりません。',
        };
      }

      // 認証ステップの確認
      if (
        user.user.user_metadata?.signup_step !== 'password_setting_required'
      ) {
        logger.warn('User verification not completed:', {
          userId,
          currentStep: user.user.user_metadata?.signup_step,
        });
        return {
          success: false,
          error: 'メール認証が完了していません。',
        };
      }

      // ステップ6: パスワードの更新
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: password,
          user_metadata: {
            ...user.user.user_metadata,
            signup_step: 'password_set',
            password_set_at: new Date().toISOString(),
          },
        });

      if (updateError) {
        logger.error('Failed to update user password:', updateError);
        return {
          success: false,
          error: 'パスワードの設定に失敗しました。',
        };
      }

      logger.info(`Password set successfully for user: ${userId}`);

      // パスワード設定完了後、即座にログインセッションを確立
      const { createServerClient } = await import('@supabase/ssr');
      const cookieStore = await cookies();

      const supabaseUrl = process.env.SUPABASE_URL!;
      const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

      const supabaseAuth = createServerClient(supabaseUrl, supabaseAnonKey, {
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

      // ユーザーのメールアドレスを取得
      const userEmail = user.user.email;
      if (!userEmail) {
        logger.error('User email not found for login');
        return {
          success: false,
          error: 'ユーザー情報の取得に失敗しました。',
        };
      }

      // 即座にログインセッションを確立
      const { data: loginData, error: loginError } =
        await supabaseAuth.auth.signInWithPassword({
          email: userEmail,
          password: password,
        });

      if (loginError || !loginData.session) {
        logger.error('Failed to create login session:', loginError);
        // セッション作成に失敗しても、パスワード設定は成功しているので完了ページへ
      } else {
        logger.info('Login session created successfully for user:', userId);
      }

      // 成功時は会員登録完了ページにリダイレクト
      redirect('/signup/complete');
    } catch (setPasswordError) {
      logger.error('Set password operation failed:', setPasswordError);
      return {
        success: false,
        error: 'パスワード設定中にエラーが発生しました。',
      };
    }
  } catch (error) {
    // Next.jsのredirectエラーは正常な動作なので再スロー
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    logger.error('Critical error in set password action:', error);

    return {
      success: false,
      error:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}

export async function resetNewPasswordAction(
  formData: ResetPasswordFormData,
  userType: 'candidate' | 'company' = 'candidate'
): Promise<SetPasswordResult> {
  try {
    logger.info(
      'Reset password request received at:',
      new Date().toISOString()
    );

    // RLS対応のSupabaseクライアントを使用
    const { getSupabaseActionClient } = await import(
      '@/lib/supabase/server-client'
    );
    const supabase = getSupabaseActionClient();

    // ステップ2: バリデーション
    const validationResult = ResetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Reset password validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const {
      password,
      tokenHash,
      type,
      accessToken,
      refreshToken,
      code,
      state,
    } = validationResult.data;

    // ステップ5: トークンハッシュまたはアクセストークンを使用してセッション確立
    try {
      let sessionError = null;

      if (accessToken && refreshToken) {
        // アクセストークンを使用してセッションを設定
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        sessionError = error;
      } else if (tokenHash && type) {
        // トークンハッシュを使用してOTP検証
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });
        sessionError = error;
      } else if (code) {
        // 認証コードを使用してユーザーを取得
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        sessionError = error;
      } else {
        return {
          success: false,
          error: '認証情報が不足しています。',
        };
      }

      if (sessionError) {
        logger.error('Failed to verify session:', sessionError);
        return {
          success: false,
          error:
            'リンクが無効または期限切れです。新しいリンクを要求してください。',
        };
      }

      // ステップ6: パスワードの更新
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        logger.error('Failed to update password:', updateError);
        return {
          success: false,
          error: 'パスワードの更新に失敗しました。',
        };
      }

      logger.info('Password reset completed successfully');

      // 成功時のリダイレクト
      if (userType === 'candidate') {
        redirect('/candidate/auth/login');
      } else {
        redirect('/company/auth/login');
      }
    } catch (resetError) {
      logger.error('Reset password operation failed:', resetError);
      return {
        success: false,
        error: 'パスワードリセット中にエラーが発生しました。',
      };
    }
  } catch (error) {
    // Next.jsのredirectエラーは正常な動作なので再スロー
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    logger.error('Critical error in reset password action:', error);

    return {
      success: false,
      error:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
