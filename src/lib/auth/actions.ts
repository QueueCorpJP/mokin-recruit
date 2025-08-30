'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';

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
        message: 'ログアウトに失敗しました'
      };
    }

    console.log('✅ [LOGOUT] Success');

    // すべてのページのキャッシュをクリア
    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'ログアウトしました'
    };
    
  } catch (error) {
    console.error('Logout action error:', error);
    
    return {
      success: false,
      error: 'システムエラーが発生しました',
      message: 'システムエラーが発生しました。しばらくしてから再度お試しください'
    };
  }
}