'use server';

import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function adminLogoutAction() {
  try {
    // Supabaseクライアントを作成
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL']!,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY']!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    );

    // Supabaseからログアウト
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Admin Supabase logout error:', error);
    }

    // 管理者認証用のクッキーを削除（同じcookieStoreを再利用）
    
    cookieStore.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 即座に削除
      path: '/'
    });
    
    cookieStore.set('admin_user', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 即座に削除
      path: '/'
    });

    cookieStore.set('user_id', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // 即座に削除
      path: '/'
    });

    console.log('✅ [ADMIN LOGOUT] Success');

    // すべてのページのキャッシュをクリア
    revalidatePath('/', 'layout');
    
    // ログインページにリダイレクト
    redirect('/admin/login');

  } catch (error) {
    console.error('Admin logout action error:', error);
    
    // エラーが発生してもログインページにリダイレクト
    redirect('/admin/login');
  }
}
