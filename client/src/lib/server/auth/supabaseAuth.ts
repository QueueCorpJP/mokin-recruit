import {
  getSupabaseClient,
  getSupabaseAdminClient,
} from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import { User } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import { SessionService } from '@/lib/server/core/services/SessionService';
import { NextRequest } from 'next/server';

// 認証結果の型定義
export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
  token?: string;
}

// JWT検証結果の型定義
export interface JWTValidationResult {
  isValid: boolean;
  candidateId?: string;
  companyUserId?: string;
  user?: User;
  error?: string;
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

    // カスタムJWTトークンを生成（既存のJWT設定と互換性のため）
    const customToken = generateCustomJWT(data.user);

    logger.info(`User signed in successfully: ${email}`);
    return {
      success: true,
      user: data.user,
      token: customToken,
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

/**
 * カスタムJWTトークンを生成（既存システムとの互換性のため）
 */
function generateCustomJWT(user: User): string {
  const payload = {
    sub: user.id,
    email: user.email,
    user_metadata: user.user_metadata,
    aud: 'authenticated',
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7日間
  };

  return jwt.sign(payload, process.env.JWT_SECRET!);
}

/**
 * カスタムJWTトークンを検証
 */
export function verifyCustomJWT(token: string): {
  valid: boolean;
  payload?: any;
} {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return { valid: true, payload };
  } catch (error) {
    logger.error('Custom JWT verification failed:', error);
    return { valid: false };
  }
}

/**
 * Next.js Request から JWT を検証し、候補者情報を取得（最適化版）
 * - DB検索を完全に削除
 * - JWTのmetadataのみを使用
 * - SessionServiceを使わず直接JWT検証
 */
export async function validateJWT(request: NextRequest): Promise<JWTValidationResult> {
  try {
    // まずMiddlewareで検証済みかチェック
    const isValidated = request.headers.get('x-auth-validated') === 'true';
    const userType = request.headers.get('x-user-type');
    
    if (isValidated) {
      const userId = request.headers.get('x-user-id');
      const email = request.headers.get('x-user-email');
      
      if (userId && email) {
        // Middlewareで検証済みの場合はそのまま使用
        const user: User = {
          id: userId,
          email: email,
          user_metadata: { userType },
          app_metadata: {},
          aud: 'authenticated',
          created_at: '',
          updated_at: '',
          email_confirmed_at: '',
          phone_confirmed_at: '',
          confirmed_at: '',
          last_sign_in_at: '',
          role: '',
        };
        
        // userTypeに基づいて適切なIDを返す
        if (userType === 'candidate') {
          return {
            isValid: true,
            candidateId: userId,
            user: user
          };
        } else if (userType === 'company_user') {
          return {
            isValid: true,
            companyUserId: userId,
            user: user
          };
        }
      }
    }
    
    // Middlewareで検証されていない場合のみトークン検証
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return {
        isValid: false,
        error: 'No authentication token provided'
      };
    }

    // JWTを直接検証（SessionService不使用）
    const jwtSecret = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';
    let payload: any;
    
    try {
      payload = jwt.verify(token, jwtSecret);
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid JWT token'
      };
    }
    
    // トークンの有効期限チェック
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return {
        isValid: false,
        error: 'Token expired'
      };
    }
    
    // ユーザー情報をJWTペイロードから取得
    const user: User = {
      id: payload.sub,
      email: payload.email || '',
      user_metadata: payload.user_metadata || {},
      app_metadata: payload.app_metadata || {},
      aud: payload.aud || 'authenticated',
      created_at: '',
      updated_at: '',
      email_confirmed_at: '',
      phone_confirmed_at: '',
      confirmed_at: '',
      last_sign_in_at: '',
      role: '',
    };
    
    // ユーザータイプに基づいて返値を決定（DB検索なし）
    const detectedUserType = payload.user_metadata?.userType || 
      (payload.email?.includes('@company.') ? 'company_user' : 'candidate');
    
    if (request.nextUrl.pathname.startsWith('/api/candidate/') || detectedUserType === 'candidate') {
      // 候補者APIの場合
      if (detectedUserType !== 'candidate') {
        return {
          isValid: false,
          error: 'This endpoint is for candidates only. Please use the company interface.'
        };
      }
      return {
        isValid: true,
        candidateId: payload.sub,
        user: user
      };
    } else if (request.nextUrl.pathname.startsWith('/api/company/') || detectedUserType === 'company_user') {
      // 企業ユーザーAPIの場合
      if (detectedUserType !== 'company_user') {
        return {
          isValid: false,
          error: 'This endpoint is for company users only. Please use the candidate interface.'
        };
      }
      return {
        isValid: true,
        companyUserId: payload.sub,
        user: user
      };
    }
    
    // デフォルトはcandidateとして扱う
    return {
      isValid: true,
      candidateId: payload.sub,
      user: user
    };
  } catch (error) {
    logger.error('JWT validation error:', error);
    return {
      isValid: false,
      error: `JWT validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
