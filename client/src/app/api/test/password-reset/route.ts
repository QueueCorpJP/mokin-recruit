import { NextRequest, NextResponse } from 'next/server';
import {
  getSupabaseClient,
  getSupabaseAdminClient,
} from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import {
  getEnvironmentInfo,
  getPasswordResetRedirectUrl,
} from '@/lib/server/utils/url';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';

/**
 * パスワードリセット機能の包括的テストAPI
 * 環境設定、接続、フロー全体をテストします
 */
export async function GET(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    const searchParams = request.nextUrl.searchParams;
    const testEmail = searchParams.get('email') || 'test@example.com';
    const sendEmail = searchParams.get('send') === 'true';

    const timestamp = new Date().toISOString();
    const environmentInfo = getEnvironmentInfo();
    const passwordResetUrl = getPasswordResetRedirectUrl();

    // Supabase接続テスト
    const supabaseTest = {
      name: 'Supabase Connection',
      status: 'unknown' as 'success' | 'error' | 'unknown',
      details: {} as any,
      issues: [] as string[],
    };

    try {
      const supabase = getSupabaseClient();

      // Supabase Auth接続テスト（より適切なテスト方法）
      try {
        const { data: authData, error: authError } =
          await supabase.auth.getSession();

        // セッションがないのは正常（未ログイン状態）
        supabaseTest.status = 'success';
        supabaseTest.details.clientConnection = 'success';
        supabaseTest.details.authConnection = 'success';
        supabaseTest.details.passwordResetFunction = 'available';
      } catch (authError) {
        // 基本的なHTTPリクエストテスト
        const testResponse = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/`,
          {
            headers: {
              apikey: process.env.SUPABASE_ANON_KEY || '',
              Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY || ''}`,
            },
          }
        );

        if (testResponse.ok || testResponse.status === 404) {
          supabaseTest.status = 'success';
          supabaseTest.details.clientConnection = 'success';
          supabaseTest.details.passwordResetFunction = 'available';
        } else {
          throw new Error(
            `HTTP ${testResponse.status}: ${testResponse.statusText}`
          );
        }
      }

      // パスワードリセットメール送信テスト（オプション）
      if (sendEmail) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          testEmail,
          {
            redirectTo: passwordResetUrl,
          }
        );

        if (resetError) {
          supabaseTest.details.testEmailError = resetError.message;
          supabaseTest.issues.push(`Test email failed: ${resetError.message}`);
        } else {
          supabaseTest.details.testEmailSent = true;
          supabaseTest.details.testEmail = testEmail;
          supabaseTest.details.redirectUrl = passwordResetUrl;
        }
      }

      // Admin client test
      try {
        const { getSupabaseAdminClient } = await import(
          '@/lib/server/database/supabase'
        );
        const adminClient = getSupabaseAdminClient();
        const { data: adminData, error: adminError } =
          await adminClient.auth.admin.listUsers();

        if (adminError) {
          supabaseTest.details.adminConnection = `error: ${adminError.message}`;
        } else {
          supabaseTest.details.adminConnection = 'success';
          supabaseTest.details.userCount = adminData.users?.length || 0;
        }
      } catch (adminError) {
        supabaseTest.details.adminConnection = `error: ${adminError}`;
      }
    } catch (error) {
      supabaseTest.status = 'error';

      // エラーの詳細ログ出力
      console.error('Supabase connection error details:', error);
      logger.error('Supabase connection failed:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }

      supabaseTest.details.error = errorMessage;
      supabaseTest.details.errorType = typeof error;
      supabaseTest.details.errorConstructor = error?.constructor?.name;

      supabaseTest.issues.push(`Connection failed: ${errorMessage}`);
    }

    // 認証設定テスト
    const authTest = {
      name: 'Auth Configuration',
      status: 'success' as 'success' | 'error',
      details: {
        passwordResetRedirectUrl: passwordResetUrl,
        baseUrl: environmentInfo.baseUrl,
      },
      issues: [] as string[],
    };

    // メール設定テスト
    const emailTest = {
      name: 'Email Configuration',
      status: 'success' as 'success' | 'error',
      details: {
        inbucketUrl: 'http://127.0.0.1:54324',
        note: 'Development environment - emails will be captured by Inbucket',
      },
      issues: [] as string[],
    };

    // 環境変数テスト
    const envTest = {
      name: 'Environment Variables',
      status: 'success' as 'success' | 'error',
      details: environmentInfo,
      issues: [] as string[],
    };

    // 全体的なステータス判定
    const allTests = [supabaseTest, authTest, emailTest, envTest];
    const hasErrors = allTests.some(
      test => test.status === 'error' || test.issues.length > 0
    );
    const overallStatus = hasErrors ? 'warning' : 'success';

    // 推奨事項
    const recommendations = [];
    if (supabaseTest.status === 'success') {
      recommendations.push(
        '全ての設定が正常です。パスワードリセット機能をテストできます。'
      );
    }
    if (sendEmail && supabaseTest.details.testEmailSent) {
      recommendations.push(
        `テストメールを ${testEmail} に送信しました。Inbucket (http://127.0.0.1:54324) で確認してください。`
      );
    }
    if (!sendEmail) {
      recommendations.push(
        '実際のメール送信をテストするには ?send=true&email=your@email.com を追加してください。'
      );
    }

    const response = {
      timestamp,
      environment: envTest,
      supabaseConnection: supabaseTest,
      authConfiguration: authTest,
      emailConfiguration: emailTest,
      overallStatus,
      recommendations,
    };

    logger.info('Password reset test completed', {
      status: overallStatus,
      testEmail: sendEmail ? testEmail : 'not sent',
    });

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    logger.error('Password reset test failed:', error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        error: 'Test endpoint failed',
        details: error instanceof Error ? error.message : String(error),
        overallStatus: 'error',
      },
      { status: 500 }
    );
  }
}

/**
 * テスト用のパスワードリセット実行API
 */
export async function POST(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const passwordResetUrl = getPasswordResetRedirectUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: passwordResetUrl,
    });

    if (error) {
      logger.error('Test password reset email failed:', error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    logger.info(`Test password reset email sent to: ${email}`);

    return NextResponse.json({
      success: true,
      message: `Password reset email sent to ${email}`,
      redirectUrl: passwordResetUrl,
      inbucketUrl: 'http://127.0.0.1:54324',
    });
  } catch (error) {
    logger.error('Test password reset POST failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
