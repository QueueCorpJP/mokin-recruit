import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';

// サーバーサイドロジックのインポート（移行対象）
import { AuthController } from '@/lib/server/controllers/AuthController';
import { initializeDI, resolve } from '@/lib/server/container';
import { logger } from '@/lib/server/utils/logger';

/**
 * 企業ユーザー新規登録 API Route
 * POST /api/auth/register/company
 */
export async function POST(request: NextRequest) {
  try {
    // DIコンテナ初期化（必要に応じて）
    await initializeDI();

    // リクエストボディの取得
    const body = await request.json();
    const { email, password, fullName, companyAccountId } = body;

    // AuthControllerの取得
    const authController = resolve<AuthController>('AuthController');

    // Express.jsのReq/Resオブジェクトを模擬
    const mockReq = {
      body: { email, password, fullName, companyAccountId },
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
    await authController.registerCompanyUser(mockReq, mockRes);

    // Next.js Response形式で返却
    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    logger.error('API Route error - company user registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
