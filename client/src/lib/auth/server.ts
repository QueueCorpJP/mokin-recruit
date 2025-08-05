import { cookies } from 'next/headers';
import { SessionService } from '@/lib/server/core/services/SessionService';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';

export type UserType = 'candidate' | 'company_user' | 'admin';

interface User {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
}

interface AuthResult {
  isAuthenticated: boolean;
  user: User | null;
  userType: UserType | null;
}

/**
 * サーバーサイドで認証状態を確認
 */
export async function getServerAuth(): Promise<AuthResult> {
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

    const sessionService = new SessionService();
    const sessionResult = await sessionService.validateSession(token);

    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }

    const { sessionInfo } = sessionResult;
    
    // データベースからユーザータイプを取得（必要に応じて）
    let userType = sessionInfo.user.user_metadata?.userType;
    let userName = sessionInfo.user.user_metadata?.name;
    
    if (!userType) {
      try {
        const { getSupabaseClient } = await import('@/lib/server/database/supabase');
        const supabase = getSupabaseClient();
        
        const { data: candidate } = await supabase
          .from('candidates')
          .select('id, last_name, first_name, email')
          .eq('email', sessionInfo.user.email)
          .single();
          
        if (candidate) {
          userType = 'candidate';
          userName = `${candidate.last_name} ${candidate.first_name}`;
        } else {
          const { data: companyUser } = await supabase
            .from('company_users')
            .select('id, full_name, email')
            .eq('email', sessionInfo.user.email)
            .single();
            
          if (companyUser) {
            userType = 'company_user';
            userName = companyUser.full_name;
          }
        }
        
        if (!userType) {
          return {
            isAuthenticated: false,
            user: null,
            userType: null,
          };
        }
      } catch (dbError) {
        return {
          isAuthenticated: false,
          user: null,
          userType: null,
        };
      }
    }

    const user: User = {
      id: sessionInfo.user.id,
      email: sessionInfo.user.email,
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
}

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
export async function requireCandidateAuthWithSession(): Promise<AuthResult<{ 
  candidateId: string; 
  email: string; 
  fullName: string; 
}>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return {
        success: false,
        error: '認証トークンがありません'
      };
    }

    const sessionService = new SessionService();
    const sessionResult = await sessionService.validateSession(token);
    
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        success: false,
        error: '認証エラー'
      };
    }

    const { getSupabaseAdminClient } = await import('@/lib/server/database/supabase');
    const supabase = getSupabaseAdminClient();

    // セッション認証のユーザーIDとcandidatesのIDは異なるため、メールアドレスで検索
    const { data: userByEmail, error: emailError } = await supabase
      .from('candidates')
      .select('id, email, last_name, first_name')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();

    if (emailError || !userByEmail) {
      return {
        success: false,
        error: '候補者アカウント情報の取得に失敗しました'
      };
    }

    return {
      success: true,
      data: {
        candidateId: userByEmail.id,
        email: userByEmail.email,
        fullName: `${userByEmail.last_name} ${userByEmail.first_name}`
      }
    };
  } catch (error) {
    console.error('Candidate auth with session error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * 企業ユーザー認証（SessionService使用）
 */
export async function requireCompanyAuthWithSession(): Promise<AuthResult<{ 
  companyUserId: string; 
  companyAccountId: string; 
  email: string; 
  fullName: string; 
}>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return {
        success: false,
        error: '認証トークンがありません'
      };
    }

    const sessionService = new SessionService();
    const sessionResult = await sessionService.validateSession(token);
    
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        success: false,
        error: '認証エラー'
      };
    }

    const { getSupabaseAdminClient } = await import('@/lib/server/database/supabase');
    const supabase = getSupabaseAdminClient();

    // セッション認証のユーザーIDとcompany_usersのIDは異なるため、メールアドレスで検索
    const { data: userByEmail, error: emailError } = await supabase
      .from('company_users')
      .select('id, company_account_id, email, full_name')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();

    if (emailError || !userByEmail) {
      return {
        success: false,
        error: '企業アカウント情報の取得に失敗しました'
      };
    }

    return {
      success: true,
      data: {
        companyUserId: userByEmail.id,
        companyAccountId: userByEmail.company_account_id,
        email: userByEmail.email,
        fullName: userByEmail.full_name
      }
    };
  } catch (error) {
    console.error('Company auth with session error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}

/**
 * API Routes用: 候補者認証を要求するヘルパー関数
 */
export async function requireCandidateAuthForAPI(request: Request): Promise<AuthResult<{ candidateId: string }>> {
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
export async function requireCompanyAuthForAPI(request: Request): Promise<AuthResult<{ companyUserId: string }>> {
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