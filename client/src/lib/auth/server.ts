import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { cache } from 'react';
import { SessionService } from '@/lib/server/core/services/SessionService';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';

// DIコンテナの遅延読み込みをキャッシュ
const getContainer = cache(async () => {
  const { container } = await import('@/lib/server/container/bindings');
  return container;
});

export type UserType = 'candidate' | 'company_user' | 'admin';

interface User {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
}

interface BasicAuthResult {
  isAuthenticated: boolean;
  user: User | null;
  userType: UserType | null;
}

/**
 * サーバーサイドで認証状態を確認
 * React cacheを使用してリクエスト内でキャッシュ
 */
export const getServerAuth = cache(async (): Promise<BasicAuthResult> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }

    // Lazy load DI container only when needed (cached)
    const container = await getContainer();
    const sessionService = container.get<SessionService>(SessionService);
    const sessionResult = await sessionService.validateSession(token);

    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }

    const { sessionInfo } = sessionResult;
    
    // メタデータからユーザー情報を取得
    let userType = sessionInfo.user.user_metadata?.userType;
    let userName = sessionInfo.user.user_metadata?.name || sessionInfo.user.user_metadata?.full_name;
    
    // メタデータに情報がない場合は、デフォルト値を使用（DBクエリは避ける）
    if (!userType) {
      // emailやその他の情報から推測
      if (sessionInfo.user.email?.includes('@company.')) {
        userType = 'company_user';
      } else {
        userType = 'candidate'; // デフォルトはcandidate
      }
    }
    
    if (!userName) {
      // メールアドレスから仮の名前を生成
      userName = sessionInfo.user.email?.split('@')[0] || 'User';
    }

    const user: User = {
      id: sessionInfo.user.id,
      email: sessionInfo.user.email || '',
      userType: userType,
      name: userName,
      emailConfirmed: !!sessionInfo.user.email_confirmed_at,
      lastSignIn: sessionInfo.user.last_sign_in_at,
    };

    return {
      isAuthenticated: true,
      user,
      userType: userType,
    };
  } catch (error) {
    console.error('Server auth error:', error);
    return {
      isAuthenticated: false,
      user: null,
      userType: null,
    };
  }
});

/**
 * 候補者用認証チェック
 */
export async function requireCandidateAuth(): Promise<User | null> {
  const auth = await getServerAuth();
  return auth.isAuthenticated && auth.userType === 'candidate' ? auth.user : null;
}

/**
 * 企業ユーザー用認証チェック
 */
export async function requireCompanyAuth(): Promise<User | null> {
  const auth = await getServerAuth();
  return auth.isAuthenticated && auth.userType === 'company_user' ? auth.user : null;
}

/**
 * 管理者用認証チェック
 */
export async function requireAdminAuth(): Promise<User | null> {
  const auth = await getServerAuth();
  return auth.isAuthenticated && auth.userType === 'admin' ? auth.user : null;
}

/**
 * 統一的な認証エラーレスポンス
 */
export interface AuthErrorResult {
  success: false;
  error: string;
}

export interface AuthSuccessResult<T = any> {
  success: true;
  data: T;
}

export type AuthResult<T = any> = AuthErrorResult | AuthSuccessResult<T>;

/**
 * 候補者認証を要求するヘルパー関数 (Server Actions用)
 */
export async function requireCandidateAuthForAction(): Promise<AuthResult<{ candidateId: string }>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;
    
    if (!token) {
      return {
        success: false,
        error: '認証トークンが見つかりません'
      };
    }

    // モックリクエストオブジェクトを作成
    const mockRequest = {
      headers: new Headers([['authorization', `Bearer ${token}`]]),
      cookies: cookieStore,
      nextUrl: { pathname: '/candidate' },
      get: (name: string) => {
        if (name === 'authorization') return `Bearer ${token}`;
        return null;
      }
    } as any;

    const authResult = await validateJWT(mockRequest);
    if (!authResult.isValid || !authResult.candidateId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    return {
      success: true,
      data: { candidateId: authResult.candidateId }
    };
  } catch (error) {
    console.error('Candidate auth error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 企業ユーザー認証を要求するヘルパー関数 (Server Actions用)
 */
export async function requireCompanyAuthForAction(): Promise<AuthResult<{ companyUserId: string }>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;
    
    if (!token) {
      return {
        success: false,
        error: '認証トークンがありません'
      };
    }

    // モックリクエストオブジェクトを作成
    const mockRequest = {
      headers: new Headers([['authorization', `Bearer ${token}`]]),
      cookies: cookieStore,
      nextUrl: { pathname: '/company' },
      get: (name: string) => {
        if (name === 'authorization') return `Bearer ${token}`;
        return null;
      }
    } as any;

    const authResult = await validateJWT(mockRequest);
    if (!authResult.isValid || !authResult.companyUserId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    return {
      success: true,
      data: { companyUserId: authResult.companyUserId }
    };
  } catch (error) {
    console.error('Company auth error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 候補者認証（SessionService使用）
 */
export const requireCandidateAuthWithSession = cache(async (): Promise<AuthResult<{ 
  candidateId: string; 
  email: string; 
  fullName: string; 
}>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return {
        success: false,
        error: '認証トークンがありません'
      };
    }

    // Lazy load DI container only when needed (cached)
    const container = await getContainer();
    const sessionService = container.get<SessionService>(SessionService);
    const sessionResult = await sessionService.validateSession(token);
    
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        success: false,
        error: '認証エラー'
      };
    }

    // セッション情報から直接ユーザー情報を取得（DBクエリを避ける）
    const { sessionInfo } = sessionResult;
    const userMetadata = sessionInfo.user.user_metadata || {};
    
    // candidateIdはuser_metadataまたはセッションのユーザーIDを使用
    const candidateId = userMetadata.candidateId || sessionInfo.user.id;
    const email = sessionInfo.user.email || '';
    const fullName = userMetadata.full_name || userMetadata.name || 
      `${userMetadata.last_name || ''} ${userMetadata.first_name || ''}`.trim() ||
      email.split('@')[0]; // フォールバック

    return {
      success: true,
      data: {
        candidateId,
        email,
        fullName
      }
    };
  } catch (error) {
    console.error('Candidate auth with session error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
});

/**
 * 企業ユーザー認証（SessionService使用）
 */
export const requireCompanyAuthWithSession = cache(async (): Promise<AuthResult<{ 
  companyUserId: string; 
  companyAccountId: string; 
  email: string; 
  fullName: string; 
}>> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return {
        success: false,
        error: '認証トークンがありません'
      };
    }

    // Lazy load DI container only when needed (cached)
    const container = await getContainer();
    const sessionService = container.get<SessionService>(SessionService);
    const sessionResult = await sessionService.validateSession(token);
    
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        success: false,
        error: '認証エラー'
      };
    }

    // セッション情報から直接ユーザー情報を取得（DBクエリを避ける）
    const { sessionInfo } = sessionResult;
    const userMetadata = sessionInfo.user.user_metadata || {};
    
    // companyUserIdはuser_metadataまたはセッションのユーザーIDを使用
    const companyUserId = userMetadata.companyUserId || sessionInfo.user.id;
    const companyAccountId = userMetadata.companyAccountId || userMetadata.company_account_id || companyUserId;
    const email = sessionInfo.user.email || '';
    const fullName = userMetadata.full_name || userMetadata.name || 
      email.split('@')[0]; // フォールバック

    return {
      success: true,
      data: {
        companyUserId,
        companyAccountId,
        email,
        fullName
      }
    };
  } catch (error) {
    console.error('Company auth with session error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
});

/**
 * API Routes用: 候補者認証を要求するヘルパー関数
 */
export async function requireCandidateAuthForAPI(request: NextRequest): Promise<AuthResult<{ candidateId: string }>> {
  try {
    const authResult = await validateJWT(request);
    if (!authResult.isValid || !authResult.candidateId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    return {
      success: true,
      data: { candidateId: authResult.candidateId }
    };
  } catch (error) {
    console.error('API candidate auth error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * API Routes用: 企業ユーザー認証を要求するヘルパー関数
 */
export async function requireCompanyAuthForAPI(request: NextRequest): Promise<AuthResult<{ companyUserId: string }>> {
  try {
    const authResult = await validateJWT(request);
    if (!authResult.isValid || !authResult.companyUserId) {
      return {
        success: false,
        error: '認証トークンが無効です'
      };
    }

    return {
      success: true,
      data: { companyUserId: authResult.companyUserId }
    };
  } catch (error) {
    console.error('API company auth error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}