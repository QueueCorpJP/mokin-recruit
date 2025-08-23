'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

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

    // ユーザータイプの検証
    const actualUserType = data.user.user_metadata?.user_type || 'candidate';
    if (userType === 'company' && actualUserType !== 'company_user') {
      return {
        success: false,
        error: '企業ユーザーアカウントではありません',
        message: '企業ユーザーアカウントでログインしてください',
        code: 'INVALID_USER_TYPE'
      };
    }

    console.log('✅ [COMPANY LOGIN] Success:', {
      userId: data.user.id,
      email: data.user.email,
      userType: actualUserType
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