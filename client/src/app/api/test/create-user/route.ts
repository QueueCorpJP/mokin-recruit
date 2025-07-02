import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';
import { z } from 'zod';

// リクエストボディのバリデーションスキーマ
const CreateUserSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/,
      '半角英数字・記号のみ使用できます'
    )
    .regex(/(?=.*[a-zA-Z])(?=.*[0-9])/, '英数字を含めてください'),
  fullName: z.string().min(1, '名前を入力してください').optional(),
});

/**
 * テスト用ユーザー作成API
 * 開発環境でのみ使用可能
 */
export async function POST(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    // 開発環境チェック
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'この機能は開発環境でのみ利用可能です',
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // バリデーション
    const validationResult = CreateUserSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      logger.warn('User creation validation failed:', firstError);

      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Invalid input',
          field: firstError?.path?.[0] || 'general',
        },
        { status: 400 }
      );
    }

    const { email, password, fullName } = validationResult.data;

    logger.info(`🧪 Creating test user: ${email}`);

    // Supabase管理者クライアントを使用してユーザー作成
    const supabaseAdmin = getSupabaseAdminClient();

    // ユーザー作成
    const { data: userData, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // メール確認をスキップ
        user_metadata: {
          full_name: fullName || 'テストユーザー',
          created_for_testing: true,
          created_at: new Date().toISOString(),
        },
      });

    if (createError) {
      logger.error('🧪 Test user creation failed:', createError);

      let errorMessage = 'ユーザー作成に失敗しました';
      if (createError.message.includes('already registered')) {
        errorMessage = 'このメールアドレスは既に登録されています';
      } else if (createError.message.includes('password')) {
        errorMessage = 'パスワードの要件を満たしていません';
      }

      return NextResponse.json(
        {
          success: false,
          error: errorMessage,
          details: createError.message,
        },
        { status: 400 }
      );
    }

    if (!userData.user) {
      logger.error('🧪 User creation succeeded but no user data returned');
      return NextResponse.json(
        {
          success: false,
          error: 'ユーザー作成に失敗しました（データなし）',
        },
        { status: 500 }
      );
    }

    logger.info(`🧪 Test user created successfully:`, {
      userId: userData.user.id,
      email: userData.user.email,
      emailConfirmed: userData.user.email_confirmed_at ? true : false,
    });

    return NextResponse.json({
      success: true,
      message: 'テストユーザーが正常に作成されました',
      user: {
        id: userData.user.id,
        email: userData.user.email,
        emailConfirmed: !!userData.user.email_confirmed_at,
        createdAt: userData.user.created_at,
        metadata: userData.user.user_metadata,
      },
      testInstructions: {
        loginUrl: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/login`,
        forgotPasswordUrl: `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/auth/reset-password`,
        credentials: {
          email,
          password: '[HIDDEN FOR SECURITY]',
        },
      },
    });
  } catch (error) {
    logger.error('🧪 Test user creation API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 既存テストユーザーの確認API
 */
export async function GET(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    // 開発環境チェック
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          error: 'この機能は開発環境でのみ利用可能です',
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'メールアドレスが必要です',
        },
        { status: 400 }
      );
    }

    logger.info(`🧪 Checking test user: ${email}`);

    const supabaseAdmin = getSupabaseAdminClient();

    // ユーザー検索
    const { data: users, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      logger.error('🧪 Failed to list users:', listError);
      return NextResponse.json(
        {
          success: false,
          error: 'ユーザー検索に失敗しました',
          details: listError.message,
        },
        { status: 500 }
      );
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({
        success: true,
        exists: false,
        message: 'ユーザーが見つかりません',
        email,
      });
    }

    return NextResponse.json({
      success: true,
      exists: true,
      message: 'ユーザーが見つかりました',
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: !!user.email_confirmed_at,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        metadata: user.user_metadata,
      },
    });
  } catch (error) {
    logger.error('🧪 Test user check API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'サーバーエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
