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
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
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
      userIdLength: userId.length,
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

    // ステップ4: 通常のSupabaseクライアントでパスワード更新
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    try {
      // まず候補者テーブルからユーザー情報を取得
      logger.info('Attempting to get candidate by ID:', {
        userId: userId.substring(0, 8) + '***',
      });

      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('id, email')
        .eq('id', userId)
        .single();

      if (candidateError || !candidateData) {
        logger.error('Failed to get candidate data:', candidateError);
        return {
          success: false,
          message: '候補者情報の取得に失敗しました。',
        };
      }

      logger.info('Candidate found:', {
        userId: userId.substring(0, 8) + '***',
        email: candidateData.email.substring(0, 3) + '***',
      });

      // サーバーサイドではバリデーションのみ行い、
      // 実際のパスワード設定はクライアントサイドで実行

      // 候補者レコードの状態を更新（パスワード設定準備完了）
      const { error: updateCandidateError } = await supabase
        .from('candidates')
        .update({
          status: 'password_setting_ready',
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateCandidateError) {
        logger.error(
          'Failed to update candidate status:',
          updateCandidateError
        );
        return {
          success: false,
          message: '候補者情報の更新に失敗しました。',
        };
      }

      logger.info('Candidate ready for password setting:', {
        userId: userId.substring(0, 8) + '***',
      });

      // クッキーにユーザーIDを保存（クライアントサイドからも読み取り可能にする）
      const cookieStore = await cookies();
      cookieStore.set('signup_user_id', userId, {
        httpOnly: false, // クライアントサイドから読み取り可能にする
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7日間
      });

      logger.info(`Password setting prepared successfully for user: ${userId}`);

      return {
        success: true,
        message: 'パスワード設定の準備が完了しました。',
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
