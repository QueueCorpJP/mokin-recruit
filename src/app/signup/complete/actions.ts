'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';

export interface AutoLoginResult {
  success: boolean;
  error?: string;
}

export async function autoLoginAction(): Promise<AutoLoginResult> {
  try {
    logger.info('Auto-login action called');
    
    // signup_user_id と signup_password クッキーから情報を取得
    const cookieStore = await cookies();
    const userId = cookieStore.get('signup_user_id')?.value;
    const password = cookieStore.get('signup_password')?.value;
    
    // 詳細なデバッグログ
    const debugInfo = {
      hasUserId: !!userId,
      userIdLength: userId?.length || 0,
      hasPassword: !!password,
      passwordLength: password?.length || 0,
      allCookies: cookieStore.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    };
    
    logger.info('Cookie debugging info:', debugInfo);
    console.log('🔍 AUTO-LOGIN DEBUG:', debugInfo);

    if (!userId) {
      logger.error('No signup_user_id found in cookies for auto-login');
      return {
        success: false,
        error: 'ユーザーID情報が見つかりません'
      };
    }

    if (!password) {
      logger.error('No signup_password found in cookies for auto-login');
      return {
        success: false,
        error: 'パスワード情報が見つかりません'
      };
    }

    // 環境変数の確認
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceRoleKey || !anonKey) {
      logger.error('Missing Supabase environment variables for auto-login');
      return {
        success: false,
        error: 'サーバー設定エラー'
      };
    }

    const { createClient } = await import('@supabase/supabase-js');
    const { createServerClient } = await import('@supabase/ssr');

    // 管理者権限でユーザー情報を取得
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData.user || !userData.user.email) {
      logger.error('Failed to get user data for auto-login:', userError);
      return {
        success: false,
        error: 'ユーザー情報の取得に失敗しました'
      };
    }

    // SSRクライアントを作成してセッション確立
    const supabaseUser = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            logger.warn('Cookie setting error:', error);
          }
        },
      },
    });

    // マイページ遷移時にログイン処理を実行
    logger.info('Attempting sign-in with credentials:', {
      email: userData.user.email?.substring(0, 3) + '***',
      passwordLength: password.length
    });

    const { error: signInError } = await supabaseUser.auth.signInWithPassword({
      email: userData.user.email,
      password: password
    });

    if (signInError) {
      // パスワードでのサインインが失敗した場合、OTPを使用
      logger.warn('Password sign-in failed, trying OTP method:', {
        errorMessage: signInError.message,
        errorCode: (signInError as any).code || 'unknown'
      });
      
      const { error: otpError } = await supabaseUser.auth.signInWithOtp({
        email: userData.user.email,
        options: {
          shouldCreateUser: false
        }
      });

      if (otpError) {
        logger.error('OTP sign-in also failed:', otpError);
        return {
          success: false,
          error: '自動ログインに失敗しました。ログインページからログインしてください。'
        };
      } else {
        logger.info('OTP sign-in initiated, user will need to verify');
        return {
          success: false,
          error: 'メールに認証コードを送信しました。確認してからログインしてください。'
        };
      }
    } else {
      logger.info('User signed in successfully during mypage transition');
    }

    // signup関連のクッキーを削除
    cookieStore.delete('signup_user_id');
    cookieStore.delete('signup_password');

    logger.info('Auto-login successful, redirecting to mypage');
    
    // マイページにリダイレクト
    redirect('/candidate/mypage');

  } catch (error) {
    // リダイレクトエラーは正常な処理として扱う
    if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || (error as any).digest?.includes('NEXT_REDIRECT'))) {
      throw error;
    }
    
    logger.error('Auto-login error:', error);
    return {
      success: false,
      error: 'ログインに失敗しました'
    };
  }
}