import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { ValidationService } from '@/lib/server/core/services/ValidationService';
import { container, TYPES } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';

// リクエストボディの型定義（ロール別認証対応）
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
  userType: z.enum(['candidate', 'company', 'admin']).optional(),
});

type LoginRequestBody = z.infer<typeof loginSchema>;

/**
 * ログイン API Route（ロール別認証対応）
 * POST /api/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Login request validation failed:',
        validationResult.error.errors
      );
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, password, userType } = validationResult.data;

    // ログイン試行のロギング
    logger.info('Login attempt:', {
      email,
      userType: userType || 'default',
      timestamp: new Date().toISOString(),
    });

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

    // Next.js Response形式で返却
    return NextResponse.json(responseData, { status: statusCode });
  } catch (error) {
    logger.error('API Route error - login:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
