'use server'

import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

export interface SignupFormData {
  email: string;
}

export interface SignupResult {
  success: boolean;
  error?: string;
  message?: string;
}

// リクエストボディのバリデーションスキーマ
const SignupSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export async function signupRequestAction(formData: SignupFormData): Promise<SignupResult> {
  try {
    logger.info('Signup request received at:', new Date().toISOString());

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
    const validationResult = SignupSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('Signup validation failed:', firstError);

      return {
        success: false,
        error: firstError?.message || 'Invalid input',
      };
    }

    const { email } = validationResult.data;
    logger.info('Signup request details:', {
      email: email.substring(0, 3) + '***',
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

    // ステップ5: リダイレクトURL設定
    let redirectUrl;
    try {
      // 本番環境とVercelでの動的URL取得
      if (process.env.VERCEL_URL) {
        redirectUrl = `https://${process.env.VERCEL_URL}/signup/verify`;
      } else if (process.env.NODE_ENV === 'production') {
        redirectUrl = `https://mokin-recruit-client.vercel.app/signup/verify`;
      } else {
        redirectUrl = `http://localhost:3000/signup/verify`;
      }
    } catch (urlError) {
      logger.error('Failed to configure redirect URL:', urlError);
      return {
        success: false,
        message: 'リダイレクトURL設定に失敗しました。',
      };
    }

    // ステップ6: 通常のsignUpでConfirmation emailを送信
    try {
      logger.info('Creating user with signUp for confirmation email');
      
      // 一時パスワードを生成
      const tempPassword = 'temp_signup_' + Math.random().toString(36).substring(2, 15);
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: tempPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            user_type: 'candidate',
            signup_step: 'verification_pending',
            email_verification_required: true,
            temp_password: true
          }
        }
      });

      if (signupError) {
        if (signupError.message?.includes('already registered') || signupError.message?.includes('User already registered')) {
          return {
            success: false,
            error: 'このメールアドレスは既に登録されています。',
          };
        }
        
        logger.error('Failed to signup:', signupError);
        return {
          success: false,
          error: `会員登録に失敗しました: ${signupError.message}`,
        };
      }

      logger.info(`Signup confirmation email sent to: ${email.substring(0, 3)}***`);

      return {
        success: true,
        message: '認証コードをメールで送信しました。メールをご確認いただき、認証を完了してください。',
      };
    } catch (signupError) {
      logger.error('Signup operation failed:', signupError);
      return {
        success: false,
        message: '会員登録処理中にエラーが発生しました。',
      };
    }
  } catch (error) {
    logger.error('Critical error in signup action:', error);

    return {
      success: false,
      message: 'サーバーエラーが発生しました。しばらく時間をおいてから再度お試しください。',
    };
  }
}