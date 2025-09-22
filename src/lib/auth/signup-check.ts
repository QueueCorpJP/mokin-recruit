'use server';

import { cookies } from 'next/headers';

/**
 * サインアップ途中のユーザーかどうかをチェック
 * サインアップ途中のユーザーは認証が必要なページにアクセスできない
 */
export async function isSignupInProgress(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const signupUserId = cookieStore.get('signup_user_id')?.value;
    return !!signupUserId;
  } catch {
    return false;
  }
}

/**
 * 完全に認証済みのユーザーかどうかをチェック
 * Supabaseの認証状態 AND サインアップ途中でない
 */
export async function isFullyAuthenticated(): Promise<boolean> {
  try {
    const { createServerClient } = await import('@supabase/ssr');
    const cookieStore = await cookies();

    // Supabaseクライアントを作成
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          async get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Supabaseの認証状態をチェック
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // サインアップ途中かどうかをチェック
    const signupInProgress = await isSignupInProgress();

    // Supabaseで認証済み AND サインアップ途中でない
    return !!session?.user && !signupInProgress;
  } catch {
    return false;
  }
}
