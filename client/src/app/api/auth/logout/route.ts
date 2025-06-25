import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';

// サーバーサイドロジックのインポート（移行対象）
import { AuthController } from '@/lib/server/controllers/AuthController';
import { initializeDI, resolve } from '@/lib/server/container';
import { logger } from '@/lib/server/utils/logger';

/**
 * ログアウト API Route
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    // DIコンテナ初期化（必要に応じて）
    await initializeDI();

    // AuthControllerの取得
    const authController = resolve<AuthController>('AuthController');

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

    // Next.js Response形式で返却
    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    logger.error('API Route error - logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
