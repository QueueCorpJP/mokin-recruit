'use server'

import { container } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';
import { TYPES } from '@/lib/server/container/types';

export interface SignupVerifyFormData {
  password: string;
}

export interface SignupVerifyResult {
  success: boolean;
  message?: string;
  error?: string;
}

export async function signupVerifyAction(formData: SignupVerifyFormData): Promise<SignupVerifyResult> {
  try {
    // バリデーション
    if (!formData.password?.trim()) {
      return {
        success: false,
        error: '認証パスワードは必須です'
      };
    }

    if (formData.password.length < 4) {
      return {
        success: false,
        error: '認証パスワードは4文字以上で入力してください'
      };
    }

    // AuthController を使用してサインアップ認証処理
    const authController = container.get<AuthController>(TYPES.AuthController);
    
    // リクエストオブジェクトの模擬
    const mockReq = {
      body: {
        password: formData.password.trim(),
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

    // TODO: 実際のサインアップ認証ロジックを実装
    // 現在はreset-passwordのロジックを流用していますが、
    // 実際にはサインアップ専用の認証ロジックが必要です
    await authController.resetPassword(mockReq, mockRes);

    // レスポンスデータをチェック
    if (!responseData) {
      return {
        success: false,
        error: '認証に失敗しました。'
      };
    }

    if (statusCode !== 200 || !responseData.success) {
      return {
        success: false,
        error: responseData.error || '認証に失敗しました。'
      };
    }

    return {
      success: true,
      message: responseData.message || 'サインアップの認証が完了しました。'
    };

  } catch (error) {
    console.error('Signup verify error:', error);
    
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