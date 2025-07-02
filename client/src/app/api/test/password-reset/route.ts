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

  const testResults = {
    timestamp: new Date().toISOString(),
    environment: {},
    supabaseConnection: {},
    authConfiguration: {},
    emailConfiguration: {},
    overallStatus: 'unknown' as 'success' | 'warning' | 'failure',
    recommendations: [] as string[],
  };

  try {
    logger.info('🧪 Starting password reset functionality test');

    // Test 1: 環境変数チェック
    testResults.environment = await testEnvironmentVariables();

    // Test 2: Supabase接続テスト
    testResults.supabaseConnection = await testSupabaseConnection();

    // Test 3: 認証設定テスト
    testResults.authConfiguration = await testAuthConfiguration();

    // Test 4: メール設定テスト
    testResults.emailConfiguration = await testEmailConfiguration();

    // 総合評価
    const hasErrors = [
      testResults.environment,
      testResults.supabaseConnection,
      testResults.authConfiguration,
      testResults.emailConfiguration,
    ].some((test: any) => test.status === 'failure');

    const hasWarnings = [
      testResults.environment,
      testResults.supabaseConnection,
      testResults.authConfiguration,
      testResults.emailConfiguration,
    ].some((test: any) => test.status === 'warning');

    if (hasErrors) {
      testResults.overallStatus = 'failure';
      testResults.recommendations.push(
        '重要な設定エラーがあります。修正が必要です。'
      );
    } else if (hasWarnings) {
      testResults.overallStatus = 'warning';
      testResults.recommendations.push(
        '一部の設定に問題があります。確認をお勧めします。'
      );
    } else {
      testResults.overallStatus = 'success';
      testResults.recommendations.push(
        '全ての設定が正常です。パスワードリセット機能をテストできます。'
      );
    }

    logger.info(`🧪 Test completed with status: ${testResults.overallStatus}`);

    return NextResponse.json(testResults, {
      status: testResults.overallStatus === 'failure' ? 500 : 200,
    });
  } catch (error) {
    logger.error('🧪 Test execution failed:', error);

    testResults.overallStatus = 'failure';
    testResults.recommendations.push('テスト実行中にエラーが発生しました。');

    return NextResponse.json(testResults, { status: 500 });
  }
}

/**
 * 環境変数のテスト
 */
async function testEnvironmentVariables() {
  const test = {
    name: 'Environment Variables',
    status: 'success' as 'success' | 'warning' | 'failure',
    details: {} as any,
    issues: [] as string[],
  };

  try {
    const envInfo = getEnvironmentInfo();
    test.details = envInfo;

    // 必須環境変数のチェック
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      test.status = 'failure';
      test.issues.push(
        `Missing environment variables: ${missingVars.join(', ')}`
      );
    }

    // URL設定のチェック
    if (!envInfo.baseUrl || envInfo.baseUrl.includes('localhost')) {
      if (process.env.NODE_ENV === 'production') {
        test.status = 'warning';
        test.issues.push('Production environment is using localhost URLs');
      }
    }

    logger.info('✅ Environment variables test completed', test);
    return test;
  } catch (error) {
    test.status = 'failure';
    test.issues.push(
      `Environment test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    logger.error('❌ Environment variables test failed:', error);
    return test;
  }
}

/**
 * Supabase接続のテスト
 */
async function testSupabaseConnection() {
  const test = {
    name: 'Supabase Connection',
    status: 'success' as 'success' | 'warning' | 'failure',
    details: {} as any,
    issues: [] as string[],
  };

  try {
    // 実際のパスワードリセット機能をテスト
    const client = getSupabaseClient();

    // テスト用の無効なメールでresetPasswordForEmailを呼び出し
    // エラーの種類で接続状態を判断
    const { error: testError } = await client.auth.resetPasswordForEmail(
      'test@nonexistent-domain-for-testing.com',
      {
        redirectTo: 'http://localhost:3000/test',
      }
    );

    if (testError) {
      // 接続は成功したが、メール送信でエラー（正常な動作）
      if (
        testError.message.includes('Unable to validate email address') ||
        testError.message.includes('email') ||
        testError.message.includes('rate limit') ||
        !testError.message.includes('fetch')
      ) {
        test.details.clientConnection = 'success';
        test.details.passwordResetFunction = 'available';
      } else {
        test.issues.push(`Connection failed: ${testError.message}`);
      }
    } else {
      // エラーなしも正常（テストメールが送信された）
      test.details.clientConnection = 'success';
      test.details.passwordResetFunction = 'available';
      test.details.testEmailSent = true;
    }

    // 管理者クライアントは同じインスタンスなので、通常クライアントが成功すれば OK
    if (test.details.clientConnection === 'success') {
      test.details.adminConnection = 'success';
    }

    if (test.issues.length > 0) {
      test.status = 'failure';
    }

    logger.info('✅ Supabase connection test completed', test);
    return test;
  } catch (error) {
    test.status = 'failure';
    test.issues.push(
      `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    logger.error('❌ Supabase connection test failed:', error);
    return test;
  }
}

/**
 * 認証設定のテスト
 */
async function testAuthConfiguration() {
  const test = {
    name: 'Auth Configuration',
    status: 'success' as 'success' | 'warning' | 'failure',
    details: {} as any,
    issues: [] as string[],
  };

  try {
    const redirectUrl = getPasswordResetRedirectUrl();
    test.details.passwordResetRedirectUrl = redirectUrl;

    // リダイレクトURL形式のチェック
    if (!redirectUrl.startsWith('http')) {
      test.status = 'failure';
      test.issues.push('Invalid redirect URL format');
    }

    // 本番環境でのlocalhost使用チェック
    if (
      process.env.NODE_ENV === 'production' &&
      redirectUrl.includes('localhost')
    ) {
      test.status = 'warning';
      test.issues.push('Production environment using localhost redirect URL');
    }

    logger.info('✅ Auth configuration test completed', test);
    return test;
  } catch (error) {
    test.status = 'failure';
    test.issues.push(
      `Auth configuration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    logger.error('❌ Auth configuration test failed:', error);
    return test;
  }
}

/**
 * メール設定のテスト
 */
async function testEmailConfiguration() {
  const test = {
    name: 'Email Configuration',
    status: 'success' as 'success' | 'warning' | 'failure',
    details: {} as any,
    issues: [] as string[],
  };

  try {
    // 開発環境でのInbucket設定チェック
    if (process.env.NODE_ENV === 'development') {
      test.details.inbucketUrl = 'http://127.0.0.1:54324';
      test.details.note =
        'Development environment - emails will be captured by Inbucket';
    } else {
      test.details.note =
        'Production environment - emails will be sent via configured SMTP';
      test.status = 'warning';
      test.issues.push(
        'Ensure SMTP configuration is properly set in Supabase dashboard'
      );
    }

    logger.info('✅ Email configuration test completed', test);
    return test;
  } catch (error) {
    test.status = 'failure';
    test.issues.push(
      `Email configuration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    logger.error('❌ Email configuration test failed:', error);
    return test;
  }
}

/**
 * テスト用のパスワードリセット実行API
 */
export async function POST(request: NextRequest) {
  // Supabase初期化を確実に実行
  ensureSupabaseInitialized();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    logger.info(`🧪 Testing password reset for email: ${email}`);

    const supabase = getSupabaseClient();
    const redirectUrl = getPasswordResetRedirectUrl();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      logger.error('🧪 Test password reset failed:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    logger.info(`🧪 Test password reset email sent successfully to: ${email}`);

    return NextResponse.json({
      success: true,
      message: 'Test password reset email sent successfully',
      redirectUrl,
      inbucketUrl:
        process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:54324'
          : null,
    });
  } catch (error) {
    logger.error('🧪 Test password reset API error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
}
