'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

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
            if (process.env.NODE_ENV === 'development') console.warn('Cookie setting error:', error);
          }
        },
      },
    }
  );
}

export interface CandidateResetPasswordFormData {
  email: string;
}

export interface CandidateResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function candidateResetPasswordRequestAction(
  formData: CandidateResetPasswordFormData
): Promise<CandidateResetPasswordResult> {
  try {
    // バリデーション
    if (!formData.email?.trim()) {
      return {
        success: false,
        error: 'メールアドレスは必須です',
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return {
        success: false,
        error: '有効なメールアドレスを入力してください',
      };
    }

    // Supabase パスワードリセット
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(
      formData.email.trim(),
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/candidate/auth/reset-password/confirm`,
      }
    );

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('Supabase reset password error:', error);
      return {
        success: false,
        error: 'パスワードリセット要求の送信に失敗しました',
      };
    }

    return {
      success: true,
      message: 'パスワード再設定のご案内のメールをお送りいたします。',
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Candidate reset password request error:', error);

    return {
      success: false,
      error:
        'ネットワークエラーが発生しました。しばらくしてから再度お試しください。',
    };
  }
}
