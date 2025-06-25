import { NextRequest, NextResponse } from 'next/server';
import 'reflect-metadata';

// サーバーサイドロジックのインポート（移行対象）
import { AuthController } from '@/lib/server/controllers/AuthController';
import { initializeDI, resolve } from '@/lib/server/container';
import { logger } from '@/lib/server/utils/logger';

// リクエストボディの型定義
interface CandidateRegistrationRequestBody {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  lastNameKana?: string;
  firstNameKana?: string;
  gender?: string;
}

/**
 * 候補者新規登録 API Route
 * POST /api/auth/register/candidate
 */
export async function POST(request: NextRequest) {
  try {
    // DIコンテナ初期化（必要に応じて）
    await initializeDI();

    // リクエストボディの取得と型安全性の確保
    const body: unknown = await request.json();

    // 基本的なバリデーション
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const {
      email,
      password,
      lastName,
      firstName,
      lastNameKana,
      firstNameKana,
      gender,
    } = body as CandidateRegistrationRequestBody;

    // 必須フィールドの確認
    if (!email || !password || !lastName || !firstName) {
      return NextResponse.json(
        { error: 'Email, password, lastName, and firstName are required' },
        { status: 400 }
      );
    }

    // AuthControllerの取得
    const authController = resolve<AuthController>('AuthController');

    // Express.jsのReq/Resオブジェクトを模擬
    const mockReq = {
      body: {
        email,
        password,
        lastName,
        firstName,
        lastNameKana,
        firstNameKana,
        gender,
      },
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
    await authController.registerCandidate(mockReq, mockRes);

    // Next.js Response形式で返却
    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    logger.error('API Route error - candidate registration:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
