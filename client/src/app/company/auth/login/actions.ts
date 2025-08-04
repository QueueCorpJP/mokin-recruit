'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';
import { container, TYPES } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';

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

export async function loginAction(formData: LoginFormData): Promise<LoginResult> {
  try {
    const { email, password, userType } = formData;

    // AuthControllerの取得
    const authController = container.get<AuthController>(TYPES.AuthController);

    // Express.jsのReq/Resオブジェクトを模擬（ロール情報を含む）
    const mockReq = {
      body: { email, password, userType },
    } as any;

    let responseData: any = null;
    let statusCode = 200;

    const mockRes = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
      },
    } as any;

    // AuthControllerの処理実行
    await authController.login(mockReq, mockRes);

    // エラーハンドリング
    if (!responseData?.success) {
      return {
        success: false,
        error: responseData?.error || 'ログインに失敗しました',
        message: responseData?.message || 'ログインに失敗しました',
        code: responseData?.code || 'AUTH_FAILED'
      };
    }

    // ログイン成功時にクッキーを設定
    if (responseData?.token) {
      const cookieStore = await cookies();
      cookieStore.set('supabase-auth-token', responseData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 // 7日間
      });
    }

    // 成功時は適切なダッシュボードにリダイレクト
    const redirectPath = userType === 'company' ? '/company/dashboard' : '/candidate/dashboard';
    redirect(redirectPath);

  } catch (error) {
    logger.error('Login action error:', error);
    
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Next.jsのredirectは内部的にエラーを投げるため、これは正常な動作
      throw error;
    }
    
    return {
      success: false,
      error: 'システムエラーが発生しました',
      message: 'システムエラーが発生しました。しばらくしてから再度お試しください'
    };
  }
}