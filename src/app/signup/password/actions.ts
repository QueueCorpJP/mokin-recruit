'use server';

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { cookies } from 'next/headers';

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

// パスワード設定のバリデーションスキーマ
const SetPasswordSchema = z
  .object({
    password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
    confirmPassword: z.string(),
    userId: z.string().min(1, 'ユーザーIDが必要です'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

export async function setPasswordAction(
  formData: SetPasswordFormData
): Promise<SetPasswordResult> {
  try {
    logger.info(
      'Password setting request received at:',
      new Date().toISOString()
    );

    // ステップ1: 環境変数の確認
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      logger.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasServiceRoleKey: !!serviceRoleKey,
      });
      return {
        success: false,
        message: 'サーバー設定エラーが発生しました。',
      };
    }

    // ステップ2: バリデーション
    const validationResult = SetPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Password validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { password, userId } = validationResult.data;

    logger.info('Password setting request details:', {
      userId: userId.substring(0, 8) + '***',
    });

    // ステップ3: Supabaseクライアントの動的インポート
    let createClient;
    try {
      const supabaseModule = await import('@supabase/supabase-js');
      createClient = supabaseModule.createClient;
    } catch (importError) {
      logger.error('Failed to import Supabase module:', importError);
      return {
        success: false,
        message: 'サーバーライブラリの読み込みに失敗しました。',
      };
    }

    // ステップ4: 管理者クライアントでパスワード設定
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'mokin-recruit-server-admin',
        },
      },
    });

    try {
      // まずユーザー情報を取得してメールアドレスを確認
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.getUserById(userId);

      if (userError || !userData.user) {
        logger.error('Failed to get user data:', userError);
        return {
          success: false,
          message: 'ユーザー情報の取得に失敗しました。',
        };
      }

      const userEmail = userData.user.email;
      if (!userEmail) {
        logger.error('User email not found');
        return {
          success: false,
          message: 'ユーザーのメールアドレスが見つかりません。',
        };
      }

      // ユーザーのパスワードを更新
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: password,
          user_metadata: {
            signup_step: 'completed',
            password_set_at: new Date().toISOString(),
          },
        });

      if (updateError) {
        logger.error('Failed to set user password:', updateError);
        return {
          success: false,
          message: 'パスワードの設定に失敗しました。',
        };
      }

      // candidatesテーブルにレコードを作成（既存チェック付き）
      const { data: existingCandidate } = await supabaseAdmin
        .from('candidates')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingCandidate) {
        const { error: candidateError } = await supabaseAdmin
          .from('candidates')
          .insert({
            id: userId,
            email: userEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (candidateError) {
          logger.error('Failed to create candidate record:', candidateError);
          return {
            success: false,
            message: '候補者レコードの作成に失敗しました。',
          };
        }
        logger.info(`New candidate record created for user: ${userId}`);
      } else {
        logger.info(`Candidate record already exists for user: ${userId}`);
      }

      // クッキーにユーザーIDを保存（クライアントサイドからも読み取り可能にする）
      const cookieStore = await cookies();
      cookieStore.set('signup_user_id', userId, {
        httpOnly: false, // クライアントサイドから読み取り可能にする
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7日間
      });

      logger.info(
        `Password set and candidate record created successfully for user: ${userId}`
      );

      return {
        success: true,
        message: 'パスワードが設定されました。会員登録が完了しました。',
      };
    } catch (passwordError) {
      logger.error('Password setting operation failed:', passwordError);
      return {
        success: false,
        message: 'パスワード設定中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in password setting action:', error);

    return {
      success: false,
      message:
        'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}
