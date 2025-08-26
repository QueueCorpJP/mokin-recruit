import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { ValidationService } from '@/lib/server/core/services/ValidationService';
import { container, TYPES } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';

/**
 * ログアウト API Route
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // AuthControllerの取得
    const authController = container.get<AuthController>(TYPES.AuthController);

    // Express.jsのReq/Resオブジェクトを模擬
    const mockReq = {
      headers: Object.fromEntries(request.headers.entries()),
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

    // クッキーを削除してレスポンスを返却
    const response = NextResponse.json(responseData, { status: statusCode });
    
    // 認証関連のクッキーをすべて削除
    const cookiesToDelete = [
      'supabase-auth-token',
      'supabase-refresh-token',
      'sb-access-token',
      'sb-refresh-token',
      // その他のSupabase関連クッキー
      'supabase.auth.token'
    ];
    
    for (const cookieName of cookiesToDelete) {
      // 複数の方法でクッキーを削除して確実性を高める
      response.cookies.delete(cookieName);
      
      // 明示的な削除設定
      response.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0)
      });
    }
    
    // Supabase セッションの完全無効化
    try {
      const { getSupabaseClient } = await import('@/lib/server/database/supabase');
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      logger.info('Supabase session invalidated');
    } catch (error) {
      logger.warn('Failed to invalidate Supabase session:', error);
    }

    logger.info('Logout completed - cookies cleared and session invalidated');
    return response;
  } catch (error) {
    logger.error('API Route error - logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
