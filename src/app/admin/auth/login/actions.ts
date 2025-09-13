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
            if (process.env.NODE_ENV === 'development') console.warn('Cookie setting error:', error);
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
      if (process.env.NODE_ENV === 'development') console.error('Admin Supabase login error:', error);
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

    if (process.env.NODE_ENV === 'development') console.log('✅ [ADMIN LOGIN] Success:', {
      userId: data.user.id,
      email: data.user.email || '',
      userType: actualUserType
    });

    // 管理者認証用のクッキーを設定
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();
    
    // セキュアなクッキー設定
    cookieStore.set('auth_token', data.session?.access_token || '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/'
    });
    
    cookieStore.set('admin_user', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/'
    });

    cookieStore.set('user_id', data.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/'
    });

    // すべてのページのキャッシュをクリア
    revalidatePath('/', 'layout');

    // ログイン成功時は /admin へリダイレクト
    redirect('/admin');

  } catch (error) {
    // Next.jsのredirectは内部的にエラーを投げるため、これをまず確認
    if (error instanceof Error && (
      error.message === 'NEXT_REDIRECT' || 
      error.message.includes('NEXT_REDIRECT') ||
      'digest' in error && String(error.digest).includes('NEXT_REDIRECT')
    )) {
      // これは正常な動作（リダイレクト成功）なので、エラーログを出力せずに再スロー
      throw error;
    }
    
    // 実際のエラーの場合のみログ出力
    console.error('Admin login action error:', error);

    // 失敗時はエラー内容をURLパラメータに載せてリダイレクト
    const query = encodeQuery({
      error: 'システムエラーが発生しました',
      email,
    });
    redirect(`/admin/auth/login?${query}`);
  }
}