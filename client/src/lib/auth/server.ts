import { cookies, headers } from 'next/headers';
import { cache } from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { createServerClient } from '@supabase/ssr';

export type UserType = 'candidate' | 'company_user' | 'admin';

interface User {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
  user_metadata?: {
    user_type?: string;
    company_account_id?: string;
    company_user_id?: string;
    [key: string]: any;
  };
}

interface BasicAuthResult {
  isAuthenticated: boolean;
  user: User | null;
  userType: UserType | null;
}

/**
 * Supabase サーバークライアントを作成 (読み取り専用 - サーバーコンポーネント用)
 */
async function createSupabaseServerClientReadOnly() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // サーバーコンポーネントではクッキーを設定しない（読み取り専用）
        },
      },
    }
  );
}

/**
 * Supabase サーバークライアントを作成 (書き込み可能 - Server Actions用)
 */
async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
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
            console.warn('Cookie setting error:', error);
          }
        },
      },
    }
  );
}

/**
 * Supabase認証を使用したサーバー認証チェック
 */
export const getServerAuth = cache(async (): Promise<BasicAuthResult> => {
  try {
    const supabase = await createSupabaseServerClientReadOnly();
    
    // Supabase セッションを取得
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }

    // user_metadataからユーザータイプを取得
    const userType = (user.user_metadata?.user_type || 'candidate') as UserType;
    
    const authUser: User = {
      id: user.id,
      email: user.email || '',
      userType,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      emailConfirmed: user.email_confirmed_at != null,
      lastSignIn: user.last_sign_in_at || undefined,
      user_metadata: user.user_metadata,
    };

    return {
      isAuthenticated: true,
      user: authUser,
      userType,
    };
  } catch (error) {
    console.error('❌ [AUTH] Server auth error:', error);
    return {
      isAuthenticated: false,
      user: null,
      userType: null,
    };
  }
});

/**
 * 候補者認証チェック
 */
export async function requireCandidateAuth(): Promise<User | null> {
  const auth = await getServerAuth();
  return auth.isAuthenticated && auth.userType === 'candidate'
    ? auth.user
    : null;
}

/**
 * 企業ユーザー認証チェック
 */
export async function requireCompanyAuth(): Promise<User | null> {
  const auth = await getServerAuth();
  return auth.isAuthenticated && auth.userType === 'company_user'
    ? auth.user
    : null;
}

/**
 * 管理者認証チェック
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
export async function requireCandidateAuthForAction(): Promise<
  AuthResult<{ candidateId: string }>
> {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証が必要です',
    };
  }

  if (auth.userType !== 'candidate') {
    return {
      success: false,
      error: '候補者としての認証が必要です',
    };
  }

  return {
    success: true,
    data: {
      candidateId: auth.user!.id,
    },
  };
}

/**
 * 企業認証を要求するヘルパー関数 (Server Actions用)
 */
export async function requireCompanyAuthForAction(): Promise<
  AuthResult<{ companyUserId: string; companyAccountId: string }>
> {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証が必要です',
    };
  }

  if (auth.userType !== 'company_user') {
    return {
      success: false,
      error: '企業ユーザーとしての認証が必要です',
    };
  }

  const user = auth.user!;
  const companyAccountId = user.user_metadata?.company_account_id;
  const companyUserId = user.user_metadata?.company_user_id || user.id;

  if (!companyAccountId) {
    return {
      success: false,
      error: '企業アカウント情報が見つかりません。再ログインしてください。',
    };
  }

  return {
    success: true,
    data: {
      companyUserId,
      companyAccountId,
    },
  };
}

/**
 * Supabaseユーザー認証を要求するヘルパー関数 (API用)
 */
export async function requireCandidateAuthForAPI(request?: Request): Promise<
  AuthResult<{ candidateId: string }>
> {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証が必要です',
    };
  }

  if (auth.userType !== 'candidate') {
    return {
      success: false,
      error: '候補者としての認証が必要です',
    };
  }

  return {
    success: true,
    data: {
      candidateId: auth.user!.id,
    },
  };
}

/**
 * 企業認証を要求するヘルパー関数 (API用)
 */
export async function requireCompanyAuthForAPI(request?: Request): Promise<
  AuthResult<{ companyUserId: string; companyAccountId: string }>
> {
  const auth = await getServerAuth();

  if (!auth.isAuthenticated) {
    return {
      success: false,
      error: '認証が必要です',
    };
  }

  if (auth.userType !== 'company_user') {
    return {
      success: false,
      error: '企業ユーザーとしての認証が必要です',
    };
  }

  const user = auth.user!;
  const companyAccountId = user.user_metadata?.company_account_id;
  const companyUserId = user.user_metadata?.company_user_id || user.id;

  if (!companyAccountId) {
    return {
      success: false,
      error: '企業アカウント情報が見つかりません。再ログインしてください。',
    };
  }

  return {
    success: true,
    data: {
      companyUserId,
      companyAccountId,
    },
  };
}