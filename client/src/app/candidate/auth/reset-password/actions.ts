'use server'

import { container } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';
import { TYPES } from '@/lib/server/container/types';

export interface CandidateResetPasswordFormData {
  email: string;
}

export interface CandidateResetPasswordResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function candidateResetPasswordRequestAction(formData: CandidateResetPasswordFormData): Promise<CandidateResetPasswordResult> {
  try {
    // バリデーション
    if (!formData.email?.trim()) {
      return {
        success: false,
        error: 'メールアドレスは必須です'
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return {
        success: false,
        error: '有効なメールアドレスを入力してください'
      };
    }

    // AuthController を使用してパスワードリセット要求処理
    const authController = container.get<AuthController>(TYPES.AuthController);
    
    // リクエストオブジェクトの模擬
    const mockReq = {
      body: {
        email: formData.email.trim(),
        userType: 'candidate'
      }
    } as any;

    // レスポンスオブジェクトの模擬
    let responseData: any = null;
    let statusCode: number = 200;
    const mockRes = {
      status: (code: number) => {
        statusCode = code;
        return mockRes;
      },
      json: (data: any) => {
        responseData = data;
        return mockRes;
      }
    } as any;

    await authController.forgotPassword(mockReq, mockRes);

    // レスポンスデータをチェック
    if (!responseData) {
      return {
        success: false,
        error: 'パスワードリセット要求の送信に失敗しました。'
      };
    }

    if (statusCode !== 200 || !responseData.success) {
      return {
        success: false,
        error: responseData.error || 'パスワードリセット要求の送信に失敗しました。'
      };
    }

    return {
      success: true,
      message: responseData.message || 'パスワード再設定のご案内のメールをお送りいたします。'
    };

  } catch (error) {
    console.error('Candidate reset password request error:', error);
    
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message || 'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
      };
    }

    return {
      success: false,
      error: 'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
    };
  }
}