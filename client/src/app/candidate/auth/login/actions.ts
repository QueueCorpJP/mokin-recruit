'use server'

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface CandidateLoginFormData {
  email: string;
  password: string;
}

export interface CandidateLoginResult {
  success: boolean;
  message?: string;
  error?: string;
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

export async function candidateLoginAction(formData: CandidateLoginFormData): Promise<CandidateLoginResult> {
  try {
    // バリデーション
    if (!formData.email?.trim()) {
      return {
        success: false,
        error: 'メールアドレスは必須です'
      };
    }

    if (!formData.password || formData.password.length < 8) {
      return {
        success: false,
        error: '正しいメールアドレスと8文字以上のパスワードを入力してください'
      };
    }

    if (!formData.email.includes('@')) {
      return {
        success: false,
        error: '正しいメールアドレスと8文字以上のパスワードを入力してください'
      };
    }

    // Supabase認証
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error) {
      console.error('Supabase login error:', error);
      return {
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません'
      };
    }

    if (!data.user) {
      return {
        success: false,
        error: 'ログインに失敗しました'
      };
    }

    // ユーザータイプをチェック
    const userType = data.user.user_metadata?.user_type || 'candidate';
    if (userType !== 'candidate') {
      return {
        success: false,
        error: '候補者アカウントでログインしてください'
      };
    }

    console.log('✅ [CANDIDATE LOGIN] Success:', {
      userId: data.user.id,
      email: data.user.email || '',
      userType
    });

    // 候補者ダッシュボードにリダイレクト
    redirect('/candidate');

  } catch (error) {
    console.error('Candidate login error:', error);
    
    // エラーメッセージを適切に処理
    if (error instanceof Error) {
      // リダイレクトエラーは正常な処理として扱う（Next.jsが内部的に使用）
      if (error.message === 'NEXT_REDIRECT' || (error as any).digest?.includes('NEXT_REDIRECT')) {
        throw error; // リダイレクトを実行
      }
      
      return {
        success: false,
        error: error.message || 'ログインに失敗しました'
      };
    }

    return {
      success: false,
      error: 'ログインに失敗しました'
    };
  }
}