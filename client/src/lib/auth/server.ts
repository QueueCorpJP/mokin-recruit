import { cookies, headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { cache } from 'react';
import jwt from 'jsonwebtoken';

// JWT検証用の設定
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';

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
 * サーバーサイドで認証状態を確認（最適化版）
 * - Middlewareで事前検証されたヘッダーを優先的に使用
 * - ヘッダーがない場合のみJWT検証を実行
 * - SessionServiceとDIコンテナを完全に削除
 */
export const getServerAuth = cache(async (): Promise<BasicAuthResult> => {
  try {
    // まずMiddlewareが設定したヘッダーをチェック
    const headerStore = await headers();
    const isValidated = headerStore.get('x-auth-validated') === 'true';
    
    if (isValidated) {
      // Middlewareで既に検証済み
      const userId = headerStore.get('x-user-id');
      const email = headerStore.get('x-user-email');
      const userType = headerStore.get('x-user-type') as UserType;
      
      if (userId && email) {
        const user: User = {
          id: userId,
          email: email,
          userType: userType || 'candidate',
          name: email.split('@')[0],
          emailConfirmed: true,
          lastSignIn: new Date().toISOString(),
        };
        
        return {
          isAuthenticated: true,
          user,
          userType: userType || 'candidate',
        };
      }
    }
    
    // ヘッダーがない場合のみトークンを検証
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }

    // JWT直接検証（SessionService不使用）
    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;
      
      // トークンの有効期限チェック
      if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
        return {
          isAuthenticated: false,
          user: null,
          userType: null,
        };
      }
      
      // メタデータからユーザー情報を取得
      const userMetadata = payload.user_metadata || {};
      const userType = userMetadata.userType || (payload.email?.includes('@company.') ? 'company_user' : 'candidate');
      const userName = userMetadata.name || userMetadata.full_name || payload.email?.split('@')[0] || 'User';
      
      const user: User = {
        id: payload.sub,
        email: payload.email || '',
        userType: userType,
        name: userName,
        emailConfirmed: true,
        lastSignIn: new Date().toISOString(),
      };

      return {
        isAuthenticated: true,
        user,
        userType: userType,
      };
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }
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
 * 最適化: validateJWTを使わず、getServerAuth()の結果を再利用
 */
export async function requireCandidateAuthForAction(): Promise<AuthResult<{ candidateId: string }>> {
  const auth = await getServerAuth();
  
  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証トークンが見つかりません'
    };
  }
  
  if (auth.userType !== 'candidate') {
    return {
      success: false,
      error: '候補者としての認証が必要です'
    };
  }
  
  return {
    success: true,
    data: { candidateId: auth.user!.id }
  };
}

/**
 * 企業ユーザー認証を要求するヘルパー関数 (Server Actions用)
 * 最適化: validateJWTを使わず、getServerAuth()の結果を再利用
 */
export async function requireCompanyAuthForAction(): Promise<AuthResult<{ companyUserId: string }>> {
  const auth = await getServerAuth();
  
  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証トークンがありません'
    };
  }
  
  if (auth.userType !== 'company_user') {
    return {
      success: false,
      error: '企業ユーザーとしての認証が必要です'
    };
  }
  
  return {
    success: true,
    data: { companyUserId: auth.user!.id }
  };
}

/**
 * 候補者認証（最適化版）
 * getServerAuth()の結果を再利用してパフォーマンス向上
 */
export const requireCandidateAuthWithSession = cache(async (): Promise<AuthResult<{ 
  candidateId: string; 
  email: string; 
  fullName: string; 
}>> => {
  const auth = await getServerAuth();
  
  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証トークンがありません'
    };
  }
  
  if (auth.userType !== 'candidate') {
    return {
      success: false,
      error: '候補者としての認証が必要です'
    };
  }
  
  const user = auth.user!;
  return {
    success: true,
    data: {
      candidateId: user.id,
      email: user.email,
      fullName: user.name || user.email.split('@')[0]
    }
  };
});

/**
 * 企業ユーザー認証（最適化版）
 * getServerAuth()の結果を再利用してパフォーマンス向上
 */
export const requireCompanyAuthWithSession = cache(async (): Promise<AuthResult<{ 
  companyUserId: string; 
  companyAccountId: string; 
  email: string; 
  fullName: string; 
}>> => {
  const auth = await getServerAuth();
  
  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証トークンがありません'
    };
  }
  
  if (auth.userType !== 'company_user') {
    return {
      success: false,
      error: '企業ユーザーとしての認証が必要です'
    };
  }
  
  const user = auth.user!;
  // 注: companyAccountIdは本来JWTのmetadataに含めるべきだが、ここでは仮にuserIdを使用
  return {
    success: true,
    data: {
      companyUserId: user.id,
      companyAccountId: user.id, // TODO: 実際のcompanyAccountIdはログイン時にmetadataに追加する
      email: user.email,
      fullName: user.name || user.email.split('@')[0]
    }
  };
});

/**
 * API Routes用: 候補者認証を要求するヘルパー関数（最適化版）
 * - validateJWTを使用（既に最適化済み）
 * - Middlewareでの事前検証を活用
 */
export async function requireCandidateAuthForAPI(request: NextRequest): Promise<AuthResult<{ candidateId: string }>> {
  // validateJWTは既に最適化されており、Middlewareのヘッダーを活用する
  const { validateJWT } = await import('@/lib/server/auth/supabaseAuth');
  const authResult = await validateJWT(request);
  
  if (!authResult.isValid || !authResult.candidateId) {
    return {
      success: false,
      error: authResult.error || '認証トークンが無効です'
    };
  }

  return {
    success: true,
    data: { candidateId: authResult.candidateId }
  };
}

/**
 * API Routes用: 企業ユーザー認証を要求するヘルパー関数（最適化版）
 * - validateJWTを使用（既に最適化済み）
 * - Middlewareでの事前検証を活用
 */
export async function requireCompanyAuthForAPI(request: NextRequest): Promise<AuthResult<{ companyUserId: string }>> {
  // validateJWTは既に最適化されており、Middlewareのヘッダーを活用する
  const { validateJWT } = await import('@/lib/server/auth/supabaseAuth');
  const authResult = await validateJWT(request);
  
  if (!authResult.isValid || !authResult.companyUserId) {
    return {
      success: false,
      error: authResult.error || '認証トークンが無効です'
    };
  }

  return {
    success: true,
    data: { companyUserId: authResult.companyUserId }
  };
}