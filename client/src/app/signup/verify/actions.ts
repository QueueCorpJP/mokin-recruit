'use server'

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

export interface VerifyFormData {
  verificationCode: string;
  email?: string;
}

export interface VerifyResult {
  success: boolean;
  error?: string;
  message?: string;
  userId?: string;
}

// リクエストボディのバリデーションスキーマ
const VerifySchema = z.object({
  verificationCode: z.string().min(6, '認証コードは6桁で入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください').optional(),
});

export async function signupVerifyAction(formData: VerifyFormData): Promise<VerifyResult> {
  try {
    logger.info('Signup verification request received at:', new Date().toISOString());

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
    const validationResult = VerifySchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Verification validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { verificationCode, email } = validationResult.data;
    if (!email) {
      return {
        success: false,
        error: 'メールアドレスが必要です。',
      };
    }

    logger.info('Verification request details:', {
      email: email.substring(0, 3) + '***',
      codeLength: verificationCode.length,
    });

    // ステップ3: Supabaseクライアントの動的インポートと初期化
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

    // ステップ4: Supabaseクライアントの作成
    let supabase;
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'X-Client-Info': 'mokin-recruit-server',
          },
        },
      });
    } catch (clientError) {
      logger.error('Failed to create Supabase client:', clientError);
      return {
        success: false,
        message: 'データベース接続の初期化に失敗しました。',
      };
    }

    // ステップ5: Supabase標準OTPの検証
    try {
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: verificationCode,
        type: 'email',
      });

      if (verifyError) {
        logger.warn('OTP verification failed:', { 
          email: email.substring(0, 3) + '***',
          code: verificationCode,
          error: verifyError.message 
        });
        return {
          success: false,
          error: '認証コードが正しくないか、期限切れです。',
        };
      }

      if (!verifyData.user) {
        logger.error('No user returned from OTP verification');
        return {
          success: false,
          error: '認証に失敗しました。',
        };
      }

      // 管理者クライアントでユーザーメタデータを更新
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (!serviceRoleKey) {
        logger.error('Service role key not found');
        return {
          success: false,
          message: '管理者権限の設定に問題があります。',
        };
      }

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

      // ユーザーメタデータを更新してパスワード設定段階に進む
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        verifyData.user.id,
        {
          user_metadata: {
            ...verifyData.user.user_metadata,
            signup_step: 'password_setting_required',
            verified_at: new Date().toISOString(),
            email_verification_required: false
          }
        }
      );

      if (updateError) {
        logger.error('Failed to update user verification status:', updateError);
        return {
          success: false,
          message: 'ユーザー情報の更新に失敗しました。',
        };
      }

      logger.info(`OTP verification completed successfully for user: ${verifyData.user.id}`);

      return {
        success: true,
        message: '認証が完了しました。パスワード設定ページに進みます。',
        userId: verifyData.user.id,
      };
    } catch (verificationError) {
      logger.error('Verification operation failed:', verificationError);
      return {
        success: false,
        message: '認証処理中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in verification action:', error);

    return {
      success: false,
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}

export async function resendVerificationCodeAction(email: string): Promise<VerifyResult> {
  try {
    logger.info('Resend verification code request received for:', email?.substring(0, 3) + '***');

    // ステップ1: 環境変数の確認
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      logger.error('Missing Supabase environment variables');
      return {
        success: false,
        message: 'サーバー設定エラーが発生しました。',
      };
    }

    // ステップ2: Supabaseクライアントの作成
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'X-Client-Info': 'mokin-recruit-server',
        },
      },
    });

    // ステップ3: リダイレクトURL設定
    const redirectUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/signup/verify`
      : process.env.NODE_ENV === 'production'
      ? 'https://mokin-recruit-client.vercel.app/signup/verify'
      : 'http://localhost:3000/signup/verify';

    // ステップ4: Supabase標準OTPを使用して再送信
    const { error: resendError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false, // 既存ユーザーのみ
        emailRedirectTo: redirectUrl,
        data: {
          user_type: 'candidate',
          signup_step: 'verification_pending',
          email_verification_required: true
        }
      }
    });

    if (resendError) {
      logger.error('Failed to resend OTP:', resendError);
      
      // ユーザーが存在しない場合のエラーハンドリング
      if (resendError.message?.includes('not found') || resendError.message?.includes('no user')) {
        return {
          success: false,
          message: 'このメールアドレスは登録されていません。',
        };
      }

      return {
        success: false,
        message: 'メールの再送信に失敗しました。',
      };
    }

    logger.info(`Verification code resent successfully for email: ${email.substring(0, 3)}***`);

    return {
      success: true,
      message: '新しい認証コードをメールで送信しました。',
    };
  } catch (error) {
    logger.error('Critical error in resend verification action:', error);
    return {
      success: false,
      message: 'サーバーエラーが発生しました。',
    };
  }
}

