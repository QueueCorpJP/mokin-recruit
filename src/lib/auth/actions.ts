'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';

export interface AuthResult {
  success: boolean;
  error?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    userType: 'candidate' | 'company' | 'admin';
    name?: string;
    profile?: any;
  };
}

export interface LogoutResult {
  success: boolean;
  error?: string;
  message?: string;
}

async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch (error) {
            // Server component context where cookies cannot be set
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete(name);
          } catch (error) {
            // Server component context where cookies cannot be removed
          }
        },
      },
    }
  );
}

export async function signInAction(
  email: string,
  password: string,
  userType?: 'candidate' | 'company' | 'admin'
): Promise<AuthResult> {
  try {
    if (!email || !password) {
      return {
        success: false,
        error: 'メールアドレスとパスワードは必須です',
      };
    }

    const supabase = await createSupabaseServerClient();

    // Supabaseでサインイン
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      let errorMessage = 'ログインに失敗しました';

      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'メールアドレスが確認されていません';
      } else if (error.message.includes('Too many requests')) {
        errorMessage =
          'ログイン試行回数が上限に達しました。しばらくしてから再度お試しください';
      }

      return { success: false, error: errorMessage };
    }

    if (!data.user) {
      return { success: false, error: '認証に失敗しました' };
    }

    // ユーザー情報の構築
    let userInfo: {
      id: string;
      email: string;
      userType: 'candidate' | 'company' | 'admin';
      name?: string;
      profile?: any;
    } = {
      id: data.user.id,
      email: data.user.email!,
      userType: userType || ('candidate' as const),
      name: data.user.email,
    };

    // ユーザータイプに基づいて追加情報を取得
    try {
      if (userType === 'candidate') {
        const { data: candidateData } = await supabase
          .from('candidates')
          .select('*')
          .eq('email', email)
          .single();

        if (candidateData) {
          userInfo = {
            ...userInfo,
            userType: 'candidate',
            name: `${candidateData.last_name} ${candidateData.first_name}`,
            profile: candidateData,
          };
        }
      } else if (userType === 'company') {
        const { data: companyData } = await supabase
          .from('company_users')
          .select('*')
          .eq('email', email)
          .single();

        if (companyData) {
          userInfo = {
            ...userInfo,
            userType: 'company',
            name: companyData.full_name || companyData.email,
            profile: companyData,
          };
        }
      } else if (userType === 'admin') {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();

        if (adminData) {
          userInfo = {
            ...userInfo,
            userType: 'admin',
            name: adminData.name || adminData.email,
            profile: adminData,
          };
        }
      }
    } catch (dbError) {
      // データベースエラーはログイン成功を妨げない
      console.warn('Failed to fetch user profile:', dbError);
    }

    // パスの再検証
    revalidatePath('/', 'layout');

    return {
      success: true,
      user: userInfo,
    };
  } catch (error) {
    console.error('Sign in action error:', error);
    return {
      success: false,
      error: 'システムエラーが発生しました',
    };
  }
}

export async function getServerAuth() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      user,
      isAuthenticated: true,
    };
  } catch (error) {
    console.error('Get server auth error:', error);
    return null;
  }
}

export async function logoutAction(): Promise<LogoutResult> {
  try {
    // Supabase ログアウト
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Supabase logout error:', error);
      return {
        success: false,
        error: 'ログアウトに失敗しました',
        message: 'ログアウトに失敗しました',
      };
    }

    // サインアップ関連のクッキーも削除
    const cookieStore = await cookies();
    cookieStore.delete('signup_user_id');
    cookieStore.delete('signup_email');
    cookieStore.delete('signup_step');

    console.log('✅ [LOGOUT] Success');

    // すべてのページのキャッシュをクリア
    revalidatePath('/', 'layout');

    // candidateの主要ページのキャッシュも明示的にクリア
    const candidatePaths = [
      '/candidate',
      '/candidate/dashboard',
      '/candidate/messages',
      '/candidate/scouts',
      '/candidate/jobs',
      '/candidate/favorites',
      '/candidate/profile',
      '/candidate/setting',
      '/auth/login',
    ];

    for (const path of candidatePaths) {
      try {
        revalidatePath(path);
      } catch (e) {
        console.warn('revalidatePath failed:', path, e);
      }
    }

    return {
      success: true,
      message: 'ログアウトしました',
    };
  } catch (error) {
    console.error('Logout action error:', error);

    return {
      success: false,
      error: 'システムエラーが発生しました',
      message:
        'システムエラーが発生しました。しばらくしてから再度お試しください',
    };
  }
}
