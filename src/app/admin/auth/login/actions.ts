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
      redirect(`/admin/login?${query}`);
    }

    if (!data.user) {
      const query = encodeQuery({
        error: 'ログインに失敗しました',
        email,
      });
      redirect(`/admin/login?${query}`);
    }

    // ユーザータイプの検証 - adminまたはcompany_userを許可
    const actualUserType = data.user.user_metadata?.user_type || 'candidate';
    const isAdmin = data.user.user_metadata?.is_admin === true;

    // adminフラグがtrueか、user_typeがadminまたはcompany_userの場合は管理者として扱う
    if (
      !isAdmin &&
      actualUserType !== 'admin' &&
      actualUserType !== 'company_user'
    ) {
      const query = encodeQuery({
        error: '管理者アカウントでログインしてください',
        email,
      });
      redirect(`/admin/login?${query}`);
    }

    console.log('✅ [ADMIN LOGIN] Success:', {
      userId: data.user.id,
      email: data.user.email || '',
      userType: actualUserType,
    });

    // 管理者認証用のクッキーを設定
    const { cookies } = await import('next/headers');
    const cookieStore = cookies();

    // セキュアなクッキー設定
    const isProduction = process.env.NODE_ENV === 'production';
    const isHttps =
      process.env.NEXT_PUBLIC_BASE_URL?.startsWith('https://') || false;
    const cookieOptions = {
      httpOnly: true,
      secure: isHttps, // HTTPSの場合のみセキュア
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/',
    };

    console.log('🍪 [ADMIN LOGIN] Setting cookies with options:', {
      ...cookieOptions,
      isProduction,
      isHttps,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    });

    cookieStore.set(
      'auth_token',
      data.session?.access_token || '',
      cookieOptions
    );
    cookieStore.set('admin_user', 'true', cookieOptions);
    cookieStore.set('user_id', data.user.id, cookieOptions);

    // すべてのページのキャッシュをクリア
    revalidatePath('/', 'layout');

    // ログイン成功時は /admin へリダイレクト
    redirect('/admin');
  } catch (error) {
    // Next.jsのredirectは内部的にエラーを投げるため、これをまず確認
    if (
      error instanceof Error &&
      (error.message === 'NEXT_REDIRECT' ||
        error.message.includes('NEXT_REDIRECT') ||
        ('digest' in error && String(error.digest).includes('NEXT_REDIRECT')))
    ) {
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
    redirect(`/admin/login?${query}`);
  }
}
