'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface LoginFormData {
  email: string;
  password: string;
  userType: 'candidate' | 'company' | 'admin';
}

export interface LoginResult {
  success: boolean;
  error?: string;
  message?: string;
  code?: string;
}

async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
            // Server component context where cookies cannot be set
            console.warn('Cookie setting error:', error);
          }
        },
      },
    }
  );
}


export async function loginAction(formData: LoginFormData): Promise<LoginResult> {
  try {
    const { email, password, userType } = formData;

    // デバッグ用ログ - パスワードは安全のためマスク
    console.log('🔍 [COMPANY LOGIN DEBUG] Input:', {
      email,
      password: password ? `[${password.length}文字]` : 'undefined',
      userType
    });

    // Supabase認証
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      return {
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません',
        message: 'メールアドレスまたはパスワードが正しくありません',
        code: 'AUTH_FAILED'
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'ログインに失敗しました',
        message: 'ログインに失敗しました',
        code: 'AUTH_FAILED'
      };
    }

    // company_usersテーブルでの企業ユーザー確認
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('id, email, full_name, company_account_id, auth_user_id')
      .eq('auth_user_id', data.user.id)
      .single();

    if (companyUserError || !companyUser) {
      console.log('Company user not found for auth user:', data.user.id);
      return {
        success: false,
        error: '企業ユーザーアカウントではありません',
        message: '企業ユーザーアカウントでログインしてください',
        code: 'INVALID_USER_TYPE'
      };
    }

    console.log('✅ [COMPANY LOGIN] Success:', {
      authUserId: data.user.id,
      email: data.user.email,
      companyUserId: companyUser.id,
      companyUserName: companyUser.full_name,
      companyAccountId: companyUser.company_account_id
    });

    // 認証関連のキャッシュを完全にクリア
    revalidatePath('/', 'layout');
    revalidateTag('auth');
    
    // Next.jsのキャッシュも強制クリア
    const cookieStore = await cookies();
    cookieStore.getAll().forEach(cookie => {
      if (cookie.name.startsWith('__Secure-next-auth') || cookie.name.includes('supabase')) {
        // 認証関連のクッキーを確実に設定
        console.log('Cookie updated:', cookie.name);
      }
    });
    
    // 成功時は適切なダッシュボードにリダイレクト
    const redirectPath = userType === 'company' ? '/company' : '/candidate';
    redirect(redirectPath);

  } catch (error) {
    console.error('Login action error:', error);
    
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Next.jsのredirectは内部的にエラーを投げるため、これは正常な動作
      throw error;
    }
    
    return {
      success: false,
      error: 'システムエラーが発生しました',
      message: 'システムエラーが発生しました。しばらくしてから再度お試しください'
    };
  }
}