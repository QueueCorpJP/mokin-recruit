'use server'

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

export interface ResetPasswordFormData {
  email: string;
  userType: 'candidate' | 'company' | 'admin';
}

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
  message?: string;
}

// リクエストボディのバリデーションスキーマ
const ForgotPasswordSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  userType: z.enum(['candidate', 'company']).optional(),
});

export async function resetPasswordRequestAction(formData: ResetPasswordFormData): Promise<ResetPasswordResult> {
  try {
    logger.info('Password reset request received at:', new Date().toISOString());

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
    const validationResult = ForgotPasswordSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Password reset validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { email, userType } = validationResult.data;
    logger.info('Request details:', {
      email: email.substring(0, 3) + '***',
      userType,
      hasUserType: !!userType
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

    // ステップ5: URL設定の動的取得
    let redirectUrl;
    try {
      // userTypeパラメータを含めたリダイレクトURL生成
      const userTypeParam = userType ? `?userType=${userType}` : '';
      
      logger.info('URL generation details:', {
        userType,
        userTypeParam,
        hasUserType: !!userType
      });
      
      // 本番環境とVercelでの動的URL取得
      if (process.env.VERCEL_URL) {
        redirectUrl = `https://${process.env.VERCEL_URL}/auth/reset-password/new${userTypeParam}`;
      } else if (process.env.NODE_ENV === 'production') {
        redirectUrl = `https://mokin-recruit-client.vercel.app/auth/reset-password/new${userTypeParam}`;
      } else {
        redirectUrl = `http://localhost:3000/auth/reset-password/new${userTypeParam}`;
      }
    } catch (urlError) {
      logger.error('Failed to configure redirect URL:', urlError);
      return {
        success: false,
        message: 'リダイレクトURL設定に失敗しました。',
      };
    }

    // ステップ6: パスワードリセットメールの送信
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        logger.warn(`Password reset request failed for email: ${email.substring(0, 3)}***, error:`, error.message);

        // 詳細なエラー情報をログに記録
        logger.error('Detailed password reset error:', {
          email: email.substring(0, 3) + '***',
          error: error.message,
          errorCode: error.code || 'unknown',
          timestamp: new Date().toISOString(),
          redirectUrl,
        });

        // Supabaseのメール制限エラーの特定
        if (error.message?.includes('rate') || error.message?.includes('limit') || error.message?.includes('too many')) {
          logger.error('Supabase email rate limit detected!');
          
          // 管理者向けの詳細情報
          if (process.env.NODE_ENV === 'development') {
            return {
              success: false,
              message: '⚠️ Supabaseのデフォルトメール制限に達しました。カスタムSMTPの設定が必要です。',
            };
          }
        }

        // エラーの詳細は返さず、一般的なメッセージを返す（セキュリティ考慮）
        return {
          success: true,
          message: 'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
        };
      }

      logger.info(`Password reset email sent successfully to: ${email.substring(0, 3)}***`);

      // セキュリティ上、メールアドレスの存在に関係なく成功レスポンスを返す
      return {
        success: true,
        message: 'パスワードリセット用のリンクを送信しました。メールをご確認ください。',
      };
    } catch (resetError) {
      logger.error('Password reset operation failed:', resetError);
      return {
        success: false,
        message: 'パスワードリセット処理中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in password reset action:', error);

    return {
      success: false,
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}