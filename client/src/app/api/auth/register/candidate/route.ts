import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { ValidationService } from '@/lib/server/core/services/ValidationService';
import { container, TYPES } from '@/lib/server/container';
import { AuthController } from '@/lib/server/controllers/AuthController';

// リクエストボディの型定義
const candidateRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastNameKana: z.string().optional(),
  firstNameKana: z.string().optional(),
  gender: z.string().optional(),
});

type CandidateRegistrationRequestBody = z.infer<
  typeof candidateRegistrationSchema
>;

/**
 * 候補者新規登録 API Route
 * POST /api/auth/register/candidate
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = candidateRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Candidate registration validation failed:',
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
        lastName: registrationData.lastName,
        firstName: registrationData.firstName,
        lastNameKana: registrationData.lastNameKana,
        firstNameKana: registrationData.firstNameKana,
        gender: registrationData.gender,
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
