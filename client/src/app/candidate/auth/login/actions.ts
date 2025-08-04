'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { container } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';
import { TYPES } from '@/lib/server/container/types';

export interface CandidateLoginFormData {
  email: string;
  password: string;
}

export interface CandidateLoginResult {
  success: boolean;
  message?: string;
  error?: string;
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

    // AuthController を使用してログイン処理
    const authController = container.get<AuthController>(TYPES.AuthController);
    
    // リクエストオブジェクトの模擬
    const mockReq = {
      body: {
        email: formData.email.trim(),
        password: formData.password,
        userType: 'candidate'
      }
    } as any;

    // レスポンスオブジェクトの模擬
    let responseData: any = null;
    const mockRes = {
      status: (code: number) => mockRes,
      json: (data: any) => {
        responseData = data;
        return mockRes;
      }
    } as any;

    await authController.login(mockReq, mockRes);

    // レスポンスデータをチェック
    if (!responseData) {
      return {
        success: false,
        error: 'ログインに失敗しました'
      };
    }

    if (!responseData.success) {
      return {
        success: false,
        error: responseData.message || 'ログインに失敗しました'
      };
    }

    // 成功した場合、クッキーにトークンを設定
    if (responseData.token) {
      const cookieStore = await cookies();
      cookieStore.set('supabase-auth-token', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7日間
      });

      // 候補者ダッシュボードにリダイレクト（これは例外を投げるので、この後のコードは実行されない）
      redirect('/candidate/dashboard');
    }

    // redirect()が呼ばれなかった場合のフォールバック
    return {
      success: true,
      message: 'ログインに成功しました'
    };

  } catch (error) {
    console.error('Candidate login error:', error);
    
    // エラーメッセージを適切に処理
    if (error instanceof Error) {
      // リダイレクトエラーは正常な処理として扱う（Next.jsが内部的に使用）
      if (error.message === 'NEXT_REDIRECT' || error.digest?.includes('NEXT_REDIRECT')) {
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