'use server'

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { logger } from '@/lib/server/utils/logger';
import { container, TYPES } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';

export interface LogoutResult {
  success: boolean;
  error?: string;
  message?: string;
}

export async function logoutAction(): Promise<LogoutResult> {
  try {
    // AuthControllerの取得
    const authController = container.get<AuthController>(TYPES.AuthController);

    // Express.jsのReq/Resオブジェクトを模擬
    const mockReq = {
      headers: {},
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
    await authController.logout(mockReq, mockRes);

    // クッキーの削除
    const cookieStore = await cookies();
    cookieStore.delete('supabase-auth-token');

    if (statusCode !== 200) {
      return {
        success: false,
        error: responseData?.error || 'ログアウトに失敗しました',
        message: responseData?.message || 'ログアウトに失敗しました'
      };
    }

    return {
      success: true,
      message: responseData?.message || 'ログアウトしました'
    };
    
  } catch (error) {
    logger.error('Logout action error:', error);
    
    return {
      success: false,
      error: 'システムエラーが発生しました',
      message: 'システムエラーが発生しました。しばらくしてから再度お試しください'
    };
  }
}