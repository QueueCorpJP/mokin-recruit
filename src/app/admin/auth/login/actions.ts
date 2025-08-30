'use server';

import { cookies as nextCookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';

async function createSupabaseServerClient() {
  const cookieStore = await nextCookies();
  
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

function encodeQuery(obj: Record<string, string | null | undefined>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? '')}`)
    .join('&');
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const userType = formData.get('userType') as string;

  try {
    // Supabase認証
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Admin Supabase login error:', error);
      const query = encodeQuery({
        error: 'メールアドレスまたはパスワードが正しくありません',
        email,
      });
      redirect(`/admin/auth/login?${query}`);
    }

    if (!data.user) {
      const query = encodeQuery({
        error: 'ログインに失敗しました',
        email,
      });
      redirect(`/admin/auth/login?${query}`);
    }

    // ユーザータイプの検証
    const actualUserType = data.user.user_metadata?.user_type || 'candidate';
    if (actualUserType !== 'admin') {
      const query = encodeQuery({
        error: '管理者アカウントでログインしてください',
        email,
      });
      redirect(`/admin/auth/login?${query}`);
    }

    console.log('✅ [ADMIN LOGIN] Success:', {
      userId: data.user.id,
      email: data.user.email || '',
      userType: actualUserType
    });

    // すべてのページのキャッシュをクリア
    revalidatePath('/', 'layout');
    
    // ログイン成功時は /admin へリダイレクト
    redirect('/admin');

  } catch (error) {
    console.error('Admin login action error:', error);
    
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Next.jsのredirectは内部的にエラーを投げるため、これは正常な動作
      throw error;
    }

    // 失敗時はエラー内容をURLパラメータに載せてリダイレクト
    const query = encodeQuery({
      error: 'システムエラーが発生しました',
      email,
    });
    redirect(`/admin/auth/login?${query}`);
  }
}