import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { ValidationService } from '@/lib/server/core/services/ValidationService';
import { container, TYPES } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';

// リクエストボディの型定義
const companyRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(1, 'Full name is required'),
  companyAccountId: z.string().min(1, 'Company account ID is required'),
  positionTitle: z.string().optional(),
});

type CompanyUserRegistrationRequestBody = z.infer<
  typeof companyRegistrationSchema
>;

/**
 * 企業ユーザー新規登録 API Route
 * POST /api/auth/register/company
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = companyRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Company registration validation failed:',
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

    const registrationData = validationResult.data;

    // AuthControllerの取得
    const authController = container.get<AuthController>(TYPES.AuthController);

    // Express.jsのReq/Resオブジェクトを模擬
    const mockReq = {
      body: {
        email: registrationData.email,
        password: registrationData.password,
        fullName: registrationData.fullName,
        companyAccountId: registrationData.companyAccountId,
        positionTitle: registrationData.positionTitle,
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
