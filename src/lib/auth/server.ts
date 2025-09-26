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
 * RLS対応: anon keyを使用してセッション情報を含める
 */
async function createSupabaseServerClientReadOnly(useCookies: boolean = true) {
  if (!useCookies) {
    // Static rendering用: anon keyのみ使用（認証なし）
    return createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      }
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll();
          console.log(
            '🍪 [READ_ONLY_CLIENT] Available cookies:',
            allCookies.map(c => ({ name: c.name, hasValue: !!c.value }))
          );
          return allCookies;
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
 * RLS対応: anon keyを使用してセッション情報を含める
 */
async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const allCookies = cookieStore.getAll();
          console.log(
            '🍪 [WRITABLE_CLIENT] Available cookies:',
            allCookies.map(c => ({ name: c.name, hasValue: !!c.value }))
          );
          return allCookies;
        },
        setAll(cookiesToSet) {
          try {
            console.log(
              '🍪 [WRITABLE_CLIENT] Setting cookies:',
              cookiesToSet.map(c => ({ name: c.name, hasValue: !!c.value }))
            );
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error('❌ [WRITABLE_CLIENT] Cookie setting error:', error);
          }
        },
      },
    }
  );
}

/**
 * 管理者権限用のSupabase サーバークライアントを作成 (Service Role Key使用)
 * RLSをバイパスして全データにアクセス可能
 */
async function createSupabaseAdminClient() {
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
 * 静的レンダリング対応版 - ログイン状態チェック時はキャッシュなし
 * 自動セッション復活機能付き
 */
export async function getServerAuth(
  allowStatic: boolean = false,
  enableCache: boolean = false
): Promise<BasicAuthResult> {
  try {
    console.log('🔍 [GET_SERVER_AUTH] Starting auth check...', {
      allowStatic,
      enableCache,
    });

    // 静的レンダリングモードの場合は認証なしを返す
    if (allowStatic) {
      console.log(
        '📄 [GET_SERVER_AUTH] Static mode, returning unauthenticated'
      );
      return {
        isAuthenticated: false,
        user: null,
        userType: null,
      };
    }

    console.log('🔧 [GET_SERVER_AUTH] Creating Supabase client...');
    const supabase = await createSupabaseServerClientReadOnly(true);

    // Supabase セッションを取得
    console.log('🔍 [GET_SERVER_AUTH] Getting user session...');
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log('🔍 [GET_SERVER_AUTH] Supabase auth result:', {
      hasUser: !!user,
      hasError: !!error,
      userId: user?.id,
      email: user?.email,
      user_metadata: user?.user_metadata,
      errorMessage: error?.message,
    });

    if (error || !user) {
      console.log(
        '❌ [GET_SERVER_AUTH] No valid user session, attempting session refresh...'
      );

      // セッション復活のために書き込み可能なクライアントを作成
      const writableSupabase = await createSupabaseServerClient();

      // セッション復活を試行
      try {
        const {
          data: { session },
          error: sessionError,
        } = await writableSupabase.auth.refreshSession();

        if (sessionError || !session?.user) {
          console.log(
            '❌ [GET_SERVER_AUTH] Session refresh failed:',
            sessionError?.message
          );
          return {
            isAuthenticated: false,
            user: null,
            userType: null,
          };
        }

        console.log('✅ [GET_SERVER_AUTH] Session refreshed successfully');

        // 復活したセッションを新しいクライアントで再確認
        const refreshedSupabase =
          await createSupabaseServerClientReadOnly(true);
        const {
          data: { user: verifiedUser },
          error: verifyError,
        } = await refreshedSupabase.auth.getUser();

        if (verifyError || !verifiedUser) {
          console.log(
            '⚠️ [GET_SERVER_AUTH] Session verification failed after refresh'
          );
          // 復活したセッションのユーザーを直接使用
        }

        // 復活したセッションのユーザーを使用
        const refreshedUser = verifiedUser || session.user;

        // user_metadataからユーザータイプを取得
        const meta = refreshedUser.user_metadata || {};
        console.log('🔍 [GET_SERVER_AUTH] Refreshed user metadata:', meta);

        let userType: UserType =
          (meta.user_type as UserType) ||
          (meta.userType as UserType) ||
          'candidate';

        if (userType !== 'company_user') {
          if (meta.company_account_id || (meta as any).companyAccountId) {
            console.log(
              '🔄 [GET_SERVER_AUTH] Found company_account_id, changing to company_user'
            );
            userType = 'company_user';
          }
        }

        const authUser: User = {
          id: refreshedUser.id,
          email: refreshedUser.email || '',
          userType,
          name:
            refreshedUser.user_metadata?.full_name ||
            refreshedUser.user_metadata?.name,
          emailConfirmed: refreshedUser.email_confirmed_at != null,
          lastSignIn: refreshedUser.last_sign_in_at || undefined,
          user_metadata: refreshedUser.user_metadata,
        };

        console.log(
          '✅ [GET_SERVER_AUTH] Authentication successful after refresh:',
          {
            isAuthenticated: true,
            userType: userType,
            userId: authUser.id,
            email: authUser.email,
          }
        );

        return {
          isAuthenticated: true,
          user: authUser,
          userType,
        };
      } catch (refreshError) {
        console.error(
          '❌ [GET_SERVER_AUTH] Session refresh error:',
          refreshError
        );
        return {
          isAuthenticated: false,
          user: null,
          userType: null,
        };
      }
    }

    // user_metadataからユーザータイプを取得
    // フォールバック: company_account_id があれば company_user とみなす
    const meta = user.user_metadata || {};
    console.log('🔍 [GET_SERVER_AUTH] User metadata:', meta);

    let userType: UserType =
      (meta.user_type as UserType) ||
      (meta.userType as UserType) ||
      'candidate';
    console.log('🔍 [GET_SERVER_AUTH] Initial userType:', userType);

    if (userType !== 'company_user') {
      if (meta.company_account_id || (meta as any).companyAccountId) {
        console.log(
          '🔄 [GET_SERVER_AUTH] Found company_account_id, changing to company_user'
        );
        userType = 'company_user';
      }
    }

    console.log('✅ [GET_SERVER_AUTH] Final userType:', userType);

    const authUser: User = {
      id: user.id,
      email: user.email || '',
      userType,
      name: user.user_metadata?.full_name || user.user_metadata?.name,
      emailConfirmed: user.email_confirmed_at != null,
      lastSignIn: user.last_sign_in_at || undefined,
      user_metadata: user.user_metadata,
    };

    const result = {
      isAuthenticated: true,
      user: authUser,
      userType,
    };

    console.log('✅ [GET_SERVER_AUTH] Authentication successful:', {
      isAuthenticated: result.isAuthenticated,
      userType: result.userType,
      userId: result.user?.id,
      email: result.user?.email,
    });

    return result;
  } catch (error) {
    console.error('❌ [AUTH] Server auth error:', error);
    return {
      isAuthenticated: false,
      user: null,
      userType: null,
    };
  }
}

// リクエスト単位でのキャッシュを有効にして重複チェックを避ける
export const getCachedServerAuth = cache(getServerAuth);

/**
 * 静的レンダリング用の認証チェック（cookiesを使わない）
 */
export const getStaticAuth = cache(async (): Promise<BasicAuthResult> => {
  return {
    isAuthenticated: false,
    user: null,
    userType: null,
  };
});

/**
 * 候補者認証チェック
 */
export async function requireCandidateAuth(): Promise<User | null> {
  const auth = await getServerAuth(false, false); // キャッシュなし
  return auth.isAuthenticated && auth.userType === 'candidate'
    ? auth.user
    : null;
}

/**
 * 軽量版: すでにキャッシュされた認証結果を再利用
 * レイアウトで認証済みの場合に使用（リダイレクトなし）
 */
export async function getCachedCandidateUser(): Promise<User | null> {
  const auth = await getServerAuth(false, false); // 非キャッシュ
  return auth.isAuthenticated && auth.userType === 'candidate'
    ? auth.user
    : null;
}

/**
 * 軽量版: すでにキャッシュされた認証結果を再利用（企業ユーザー版）
 * レイアウトで認証済みの場合に使用（リダイレクトなし）
 */
export async function getCachedCompanyUser(): Promise<User | null> {
  const auth = await getServerAuth(false, false); // 非キャッシュ
  return auth.isAuthenticated && auth.userType === 'company_user'
    ? auth.user
    : null;
}

/**
 * 軽量版: すでにキャッシュされた認証結果を再利用（管理者版）
 * レイアウトで認証済みの場合に使用（リダイレクトなし）
 */
export async function getCachedAdminUser(): Promise<User | null> {
  const auth = await getCachedServerAuth(false, false); // キャッシュ使用
  return auth.isAuthenticated && auth.userType === 'admin' ? auth.user : null;
}

/**
 * 企業ユーザー認証チェック
 */
export async function requireCompanyAuth(): Promise<User | null> {
  const auth = await getServerAuth(false, false); // キャッシュなし
  return auth.isAuthenticated && auth.userType === 'company_user'
    ? auth.user
    : null;
}

/**
 * 管理者認証チェック
 */
export async function requireAdminAuth(): Promise<User | null> {
  const auth = await getCachedServerAuth(false, false); // キャッシュ使用
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
  const auth = await getServerAuth(false, false); // キャッシュなし

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
  const auth = await getServerAuth(false, false); // キャッシュなし

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
  let companyAccountId = user.user_metadata?.company_account_id;
  let companyUserId = user.user_metadata?.company_user_id || user.id;

  // Supabase Auth IDからCompany User IDへの変換が必要な場合
  try {
    const supabase = await createSupabaseServerClientReadOnly(true);

    // 直接company_usersテーブルで確認
    const { data: directUser } = await supabase
      .from('company_users')
      .select('id, company_account_id')
      .eq('id', companyUserId)
      .single();

    if (!directUser) {
      // Auth IDの場合、メールで検索
      const { data: authUser } = await supabase.auth.admin.getUserById(user.id);
      if (authUser.user) {
        const { data: companyUser } = await supabase
          .from('company_users')
          .select('id, company_account_id')
          .eq('email', authUser.user.email)
          .single();

        if (companyUser) {
          companyUserId = companyUser.id;
          companyAccountId = companyUser.company_account_id;
        }
      }
    } else {
      companyAccountId = directUser.company_account_id;
    }
  } catch (error) {
    console.warn('ID mapping failed, using original:', error);
  }

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
 * RLS対応のSupabaseクライアントを取得（サーバーコンポーネント用）
 * 認証されたユーザーのクライアントを返すため、RLSポリシーが適用される
 */
export async function getAuthenticatedSupabaseClient() {
  const auth = await getServerAuth(false, false);
  if (!auth.isAuthenticated) {
    throw new Error('認証が必要です');
  }
  return await createSupabaseServerClientReadOnly(true);
}

/**
 * 候補者専用の認証済みSupabaseクライアントを取得
 */
export async function getCandidateSupabaseClient() {
  const user = await getCachedCandidateUser();

  if (!user) {
    throw new Error('候補者としての認証が必要です');
  }

  return await createSupabaseServerClientReadOnly(true);
}

/**
 * 企業ユーザー専用の認証済みSupabaseクライアントを取得
 */
export async function getCompanySupabaseClient() {
  const user = await getCachedCompanyUser();

  if (!user) {
    throw new Error('企業ユーザーとしての認証が必要です');
  }

  return await createSupabaseServerClientReadOnly(true);
}

/**
 * 管理者権限が必要な操作用のSupabaseクライアントを取得
 * RLSをバイパスしてすべてのデータにアクセス可能
 * 注意: この関数は管理者権限が必要な操作でのみ使用すること
 */
export async function getAdminSupabaseClient() {
  // 管理者認証チェックは呼び出し側で行う
  return await createSupabaseAdminClient();
}

/**
 * Supabaseユーザー認証を要求するヘルパー関数 (API用)
 */
export async function requireCandidateAuthForAPI(
  request?: Request
): Promise<AuthResult<{ candidateId: string }>> {
  const auth = await getServerAuth(false, false); // キャッシュなし

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
export async function requireCompanyAuthForAPI(
  request?: Request
): Promise<AuthResult<{ companyUserId: string; companyAccountId: string }>> {
  const auth = await getServerAuth(false, false); // キャッシュなし

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
