import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/server/utils/logger';

/**
 * 環境変数監査API
 * 管理者向けの環境変数設定状況確認エンドポイント
 */
export async function GET(request: NextRequest) {
  try {
    // セキュリティチェック: 開発環境でのみ利用可能
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: 'Environment audit is not available in production',
          message:
            'This endpoint is disabled for security reasons in production',
        },
        { status: 403 }
      );
    }

    // 基本認証チェック（簡易版）
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isValidAuth(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Basic realm="Environment Audit"',
          },
        }
      );
    }

    logger.info('🔍 Environment audit requested');

    // 環境変数監査の実行
    const auditReport = await generateEnvironmentAudit();

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        audit: auditReport,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    logger.error('❌ Environment audit failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Environment audit failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 簡易認証チェック
 */
function isValidAuth(authHeader: string): boolean {
  // Basic認証のチェック（開発環境用）
  const expectedAuth =
    'Basic ' + Buffer.from('admin:mokin-audit-2024').toString('base64');
  return authHeader === expectedAuth;
}

/**
 * 環境変数監査レポートの生成
 */
async function generateEnvironmentAudit() {
  const report = {
    summary: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      totalVariables: 0,
      requiredVariables: 0,
      optionalVariables: 0,
      missingVariables: 0,
    },
    validation: {
      status: 'unknown' as 'success' | 'warning' | 'error',
      errors: [] as string[],
      warnings: [] as string[],
    },
    security: {
      jwtSecretStrength: 'unknown' as 'weak' | 'medium' | 'strong',
      hasProductionSecrets: false,
      corsConfiguration: 'unknown' as 'safe' | 'permissive' | 'unsafe',
      urlConfiguration: 'unknown' as 'valid' | 'invalid',
    },
    variables: {
      required: {} as Record<string, any>,
      optional: {} as Record<string, any>,
      missing: [] as string[],
    },
    recommendations: [] as string[],
  };

  try {
    // 動的インポートを使用してバリデーションシステムを読み込み
    const envValidation = await import('@/lib/server/config/env-validation');

    const env = envValidation.getValidatedEnv();
    const _auditData = envValidation.generateEnvAuditReport(); // 将来使用予定
    const safeDisplay = envValidation.getSafeEnvDisplay(env);

    // 基本情報の設定
    report.summary.environment = env.NODE_ENV;
    report.summary.totalVariables = Object.keys(safeDisplay).length;

    // バリデーション結果
    report.validation.status = 'success';

    // セキュリティ評価
    if (env.JWT_SECRET.length >= 64) {
      report.security.jwtSecretStrength = 'strong';
    } else if (env.JWT_SECRET.length >= 32) {
      report.security.jwtSecretStrength = 'medium';
    } else {
      report.security.jwtSecretStrength = 'weak';
      report.validation.warnings.push(
        'JWT_SECRET should be at least 32 characters'
      );
    }

    // CORS設定の評価
    const corsOrigin = env.CORS_ORIGIN;
    if (corsOrigin === '*') {
      report.security.corsConfiguration = 'unsafe';
      report.validation.warnings.push(
        'CORS_ORIGIN is set to "*" which is unsafe'
      );
    } else if (
      corsOrigin?.includes('localhost') ||
      corsOrigin?.includes('127.0.0.1')
    ) {
      report.security.corsConfiguration = 'safe';
    } else {
      report.security.corsConfiguration = 'safe';
    }

    // URL設定の評価
    try {
      new URL(env.SUPABASE_URL);
      if (env.NEXT_PUBLIC_BASE_URL) {
        new URL(env.NEXT_PUBLIC_BASE_URL);
      }
      report.security.urlConfiguration = 'valid';
    } catch (_urlError) {
      report.security.urlConfiguration = 'invalid';
      report.validation.errors.push('Invalid URL configuration detected');
    }

    // 変数の分類
    const requiredVars = [
      'NODE_ENV',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'JWT_SECRET',
    ];

    const optionalVars = [
      'PORT',
      'CORS_ORIGIN',
      'NEXT_PUBLIC_BASE_URL',
      'JWT_EXPIRES_IN',
      'REDIS_URL',
      'SMTP_HOST',
      'LOG_LEVEL',
      'DEBUG',
    ];

    // 必須変数のチェック
    requiredVars.forEach(varName => {
      if (safeDisplay[varName as keyof typeof safeDisplay]) {
        report.variables.required[varName] =
          safeDisplay[varName as keyof typeof safeDisplay];
        report.summary.requiredVariables++;
      } else {
        report.variables.missing.push(varName);
        report.summary.missingVariables++;
        report.validation.errors.push(`Missing required variable: ${varName}`);
      }
    });

    // オプショナル変数のチェック
    optionalVars.forEach(varName => {
      const value = safeDisplay[varName as keyof typeof safeDisplay];
      if (value !== undefined && value !== null) {
        report.variables.optional[varName] = value;
        report.summary.optionalVariables++;
      }
    });

    // 推奨事項の生成
    if (env.NODE_ENV === 'production') {
      if (report.security.jwtSecretStrength !== 'strong') {
        report.recommendations.push(
          'Use a stronger JWT_SECRET (64+ characters) in production'
        );
      }
      if (!env.SENTRY_DSN) {
        report.recommendations.push(
          'Consider adding error monitoring with Sentry'
        );
      }
    }

    if (report.validation.errors.length > 0) {
      report.validation.status = 'error';
    } else if (report.validation.warnings.length > 0) {
      report.validation.status = 'warning';
    }

    logger.info('✅ Environment audit completed successfully', {
      environment: env.NODE_ENV,
      totalVariables: report.summary.totalVariables,
      status: report.validation.status,
    });

    return report;
  } catch (error) {
    // フォールバック: 基本的な監査
    logger.warn('⚠️ Using fallback environment audit due to error:', error);

    report.validation.status = 'error';
    report.validation.errors.push('Failed to load advanced validation system');

    // 基本的な環境変数チェック
    const basicVars = {
      NODE_ENV: process.env.NODE_ENV,
      SUPABASE_URL: process.env.SUPABASE_URL ? '***' : undefined,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? '***' : undefined,
      JWT_SECRET: process.env.JWT_SECRET ? '***' : undefined,
    };

    Object.entries(basicVars).forEach(([key, value]) => {
      if (value) {
        report.variables.required[key] = value;
        report.summary.requiredVariables++;
      } else {
        report.variables.missing.push(key);
        report.summary.missingVariables++;
      }
    });

    report.summary.totalVariables =
      report.summary.requiredVariables + report.summary.optionalVariables;

    return report;
  }
}

/**
 * POST: 環境変数の設定テスト
 */
export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Environment testing is not available in production' },
        { status: 403 }
      );
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !isValidAuth(authHeader)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const testType = body.testType || 'connection';

    logger.info('🧪 Environment test requested:', { testType });

    let testResult;
    switch (testType) {
      case 'connection':
        testResult = await testSupabaseConnection();
        break;
      case 'jwt':
        testResult = await testJwtConfiguration();
        break;
      case 'urls':
        testResult = await testUrlConfiguration();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      testType,
      result: testResult,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error('❌ Environment test failed:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Environment test failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Supabase接続テスト
 */
async function testSupabaseConnection() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // 簡単な接続テスト
    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(1);

    return {
      status: 'success',
      message: 'Supabase connection successful',
      url: process.env.SUPABASE_URL,
      hasError: !!error,
      errorMessage: error?.message,
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'Supabase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * JWT設定テスト
 */
async function testJwtConfiguration() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET!;

    // テスト用トークンの生成と検証
    const testPayload = { test: true, timestamp: Date.now() };
    const token = jwt.sign(testPayload, secret, { expiresIn: '1m' });
    const decoded = jwt.verify(token, secret);

    return {
      status: 'success',
      message: 'JWT configuration is working',
      secretLength: secret.length,
      tokenGenerated: !!token,
      tokenVerified: !!decoded,
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'JWT configuration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * URL設定テスト
 */
async function testUrlConfiguration() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getBaseUrl, getCorsOrigin } = require('@/lib/server/utils/url');

    const baseUrl = getBaseUrl();
    const corsOrigin = getCorsOrigin();

    // URL形式の検証
    new URL(baseUrl);
    if (corsOrigin !== '*') {
      new URL(corsOrigin);
    }

    return {
      status: 'success',
      message: 'URL configuration is valid',
      baseUrl,
      corsOrigin,
      isLocalhost: baseUrl.includes('localhost'),
      isHttps: baseUrl.startsWith('https://'),
    };
  } catch (error) {
    return {
      status: 'error',
      message: 'URL configuration failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
