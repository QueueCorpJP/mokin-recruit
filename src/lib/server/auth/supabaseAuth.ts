import {
  getSupabaseClient,
  getSupabaseAdminClient,
} from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import { User } from '@supabase/supabase-js';

/**
 * ユーザーのmetadataにユーザータイプを設定（1回のみ実行）
 */
async function updateUserMetadataWithType(user: User): Promise<void> {
  if (!user.email) return;

  try {
    const supabase = getSupabaseAdminClient();
    
    // company_usersテーブルでユーザーを検索
    const { data: companyUser, error } = await supabase
      .from('company_users')
      .select('id, company_account_id')
      .eq('email', user.email)
      .single();

    let userType: 'candidate' | 'company_user' | 'admin' = 'candidate';
    let companyAccountId: string | undefined = undefined;
    let companyUserId: string | undefined = undefined;

    if (!error && companyUser) {
      userType = 'company_user';
      companyAccountId = companyUser.company_account_id;
      companyUserId = companyUser.id;
    }
    
    // user_metadataにユーザータイプとcompany情報を設定
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        user_type: userType,
        company_account_id: companyAccountId,
        company_user_id: companyUserId,
      }
    });
    
    logger.info(`User metadata updated: ${user.email} -> ${userType} (company_account_id: ${companyAccountId})`);
  } catch (error) {
    logger.error('Error updating user metadata:', error);
  }
}


// 認証結果の型定義
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}


// ユーザー登録データの型
export interface UserRegistrationData {
  email: string;
  password: string;
  metadata?: {
    firstName?: string;
    lastName?: string;
    userType?: 'candidate' | 'company_user' | 'admin';
    [key: string]: any;
  };
}

/**
 * Supabase Authを使用してユーザーを登録
 */
export async function registerUserWithSupabase(
  userData: UserRegistrationData
): Promise<AuthResult> {
  try {
    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: userData.metadata || {},
      email_confirm: process.env.NODE_ENV === 'development', // 開発環境では自動確認
    });

    if (error) {
      logger.error('Supabase user registration failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    logger.info(`User registered successfully: ${userData.email}`);
    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    logger.error('User registration error:', error);
    return {
      success: false,
      error: 'Registration failed',
    };
  }
}

/**
 * Supabase Authを使用してユーザーログイン
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      logger.error('Supabase sign in failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // ユーザータイプをuser_metadataに設定（DB検索を1回だけ実行）
    await updateUserMetadataWithType(data.user);

    logger.info(`User signed in successfully: ${email}`);
    return {
      success: true,
      user: data.user,
      token: data.session?.access_token, // Supabase標準JWTを使用
    };
  } catch (error) {
    logger.error('Sign in error:', error);
    return {
      success: false,
      error: 'Sign in failed',
    };
  }
}

/**
 * Supabase JWTトークンを検証
 */
export async function verifySupabaseToken(token: string): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
      logger.error('Token verification failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    logger.error('Token verification error:', error);
    return {
      success: false,
      error: 'Token verification failed',
    };
  }
}

/**
 * パスワードリセット要求
 */
export async function requestPasswordReset(email: string): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient();

    // 動的URL取得機能を使用
    const { getPasswordResetRedirectUrl } = await import(
      '@/lib/server/utils/url'
    );
    const redirectUrl = getPasswordResetRedirectUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      logger.error('Password reset request failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    logger.info(
      `Password reset requested for: ${email}, redirect: ${redirectUrl}`
    );
    return {
      success: true,
    };
  } catch (error) {
    logger.error('Password reset request error:', error);
    return {
      success: false,
      error: 'Password reset request failed',
    };
  }
}

/**
 * パスワード更新
 */
export async function updatePassword(
  accessToken: string,
  newPassword: string
): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient();

    // アクセストークンを設定
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '', // リフレッシュトークンは必要に応じて設定
    });

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      logger.error('Password update failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    logger.info('Password updated successfully');
    return {
      success: true,
      user: data.user,
    };
  } catch (error) {
    logger.error('Password update error:', error);
    return {
      success: false,
      error: 'Password update failed',
    };
  }
}

/**
 * ユーザーサインアウト
 */
export async function signOutUser(): Promise<AuthResult> {
  try {
    const supabase = getSupabaseClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      logger.error('Sign out failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    logger.info('User signed out successfully');
    return {
      success: true,
    };
  } catch (error) {
    logger.error('Sign out error:', error);
    return {
      success: false,
      error: 'Sign out failed',
    };
  }
}



