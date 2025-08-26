import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// リクエストボディの型定義
const completeRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  tempToken: z.string().min(1, 'Temporary token is required'),
});

type CompleteRegistrationRequestBody = z.infer<typeof completeRegistrationSchema>;

/**
 * 候補者登録完了 API Route
 * POST /api/auth/register/candidate/complete-registration
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得と型安全性の確保
    const body = await request.json();

    // バリデーション
    const validationResult = completeRegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      logger.warn(
        'Complete registration validation failed:',
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

    const { email, password, tempToken } = validationResult.data;

    // Supabase管理者クライアントを取得
    const supabaseAdmin = getSupabaseAdminClient();

    // 一時トークンを使用してユーザーの存在を確認
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(tempToken);
    
    if (userError || !userData.user) {
      logger.warn(`Invalid temporary token for email: ${email}`);
      return NextResponse.json(
        {
          success: false,
          message: '一時トークンが無効です。認証コードの確認からやり直してください。',
          code: 'INVALID_TEMP_TOKEN',
        },
        { status: 401 }
      );
    }

    // メールアドレスが一致するかチェック
    if (userData.user.email !== email) {
      logger.warn(`Email mismatch - token: ${userData.user.email}, request: ${email}`);
      return NextResponse.json(
        {
          success: false,
          message: 'トークンとメールアドレスが一致しません',
        },
        { status: 400 }
      );
    }

    // パスワードを設定してユーザーを更新
    const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.user.id,
      {
        password: password,
        email_confirm: true, // メール確認済みとしてマーク
        user_metadata: {
          registration_completed: true,
          registered_at: new Date().toISOString(),
        },
      }
    );

    if (updateError) {
      logger.error(`Failed to update user password for ${email}:`, updateError);
      return NextResponse.json(
        {
          success: false,
          message: 'パスワードの設定に失敗しました',
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    // candidatesテーブルに基本レコードを作成
    const { error: candidateError } = await supabaseAdmin
      .from('candidates')
      .insert({
        id: userData.user.id,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // プロフィール情報は別途設定されるまでnull
        last_name: null,
        first_name: null,
        last_name_kana: null,
        first_name_kana: null,
        gender: null,
        birth_date: null,
        phone_number: null,
        address: null,
        education_level: null,
        school_name: null,
        major: null,
        graduation_year: null,
        job_preferences: null,
      });

    if (candidateError) {
      logger.error(`Failed to create candidate record for ${email}:`, candidateError);
      // ユーザーレコードが作成されているが候補者レコードの作成に失敗
      // この場合はログを残すが、成功として扱う（後でプロフィール設定時に再試行可能）
      logger.warn(`Candidate record creation failed but user exists: ${userData.user.id}`);
    }

    logger.info(`Registration completed successfully for: ${email}`);

    return NextResponse.json({
      success: true,
      message: '登録が完了しました。ログインしてください。',
      data: {
        userId: userData.user.id,
        email: email,
        registrationCompleted: true,
      },
    });
  } catch (error) {
    logger.error('API Route error - complete registration:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 