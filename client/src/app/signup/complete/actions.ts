'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { container } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';
import { TYPES } from '@/lib/server/container/types';
import { logger } from '@/lib/server/utils/logger';

export interface AutoLoginResult {
  success: boolean;
  error?: string;
}

export async function autoLoginAction(): Promise<AutoLoginResult> {
  try {
    // Cookie から signup_user_id を取得
    const cookieStore = await cookies();
    const userId = cookieStore.get('signup_user_id')?.value;

    if (!userId) {
      logger.error('No signup_user_id found in cookies');
      return {
        success: false,
        error: 'ユーザー情報が見つかりません'
      };
    }

    // Supabase admin client でユーザー情報を取得
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      logger.error('Missing Supabase environment variables');
      return {
        success: false,
        error: 'サーバー設定エラー'
      };
    }

    // Supabase admin client を使用してユーザー情報を取得
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // ユーザー情報を取得
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData.user || !userData.user.email) {
      logger.error('Failed to get user data:', userError);
      return {
        success: false,
        error: 'ユーザー情報の取得に失敗しました'
      };
    }

    // ユーザー用のサインインセッションを作成
    const { data: sessionData, error: sessionError } = await (supabaseAdmin.auth.admin as any).createSession({
      user_id: userId
    });
    
    if (sessionError || !sessionData) {
      logger.error('Failed to create session:', sessionError);
      return {
        success: false,
        error: 'ログインセッションの作成に失敗しました'
      };
    }

    // 認証クッキーを設定
    if (sessionData.access_token) {
      cookieStore.set('supabase-auth-token', sessionData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7日間
      });
    }

    // signup_user_id クッキーを削除（もう不要）
    cookieStore.delete('signup_user_id');

    logger.info(`Auto-login successful for user: ${userId}`);

    // マイページにリダイレクト
    redirect('/candidate/mypage');

  } catch (error) {
    logger.error('Auto-login error:', error);
    
    // リダイレクトエラーは正常な処理として扱う
    if (error instanceof Error && (error.message === 'NEXT_REDIRECT' || (error as any).digest?.includes('NEXT_REDIRECT'))) {
      throw error; // リダイレクトを実行
    }
    
    return {
      success: false,
      error: 'ログインに失敗しました'
    };
  }
}