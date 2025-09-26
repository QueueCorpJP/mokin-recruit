'use server';

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

export async function loginAction(formData: LoginFormData): Promise<never> {
  const { email, password, userType } = formData;

  // Supabase認証
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Supabase login error:', error);
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  if (!data.user) {
    throw new Error('ログインに失敗しました');
  }

  // company_usersテーブルでの企業ユーザー確認
  const { data: companyUser, error: companyUserError } = await supabase
    .from('company_users')
    .select('id, email, full_name, company_account_id, auth_user_id')
    .eq('auth_user_id', data.user.id)
    .single();

  if (companyUserError || !companyUser) {
    throw new Error('企業ユーザーアカウントではありません');
  }

  // ユーザーメタデータを即時更新して企業ユーザー属性を明示
  try {
    await supabase.auth.updateUser({
      data: {
        ...(data.user.user_metadata || {}),
        user_type: 'company_user',
        company_account_id: companyUser.company_account_id,
        company_user_id: companyUser.id,
      },
    });
  } catch (e) {
    console.warn('User metadata update failed (non-fatal):', e);
  }

  // 認証関連のキャッシュを完全にクリア
  revalidatePath('/', 'layout');
  revalidateTag('auth');

  // 成功時は適切なダッシュボードにリダイレクト
  const redirectPath =
    userType === 'company' ? '/company/mypage' : '/candidate';
  redirect(redirectPath);
}
