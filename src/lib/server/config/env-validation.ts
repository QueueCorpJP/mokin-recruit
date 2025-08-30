import { z } from 'zod';
import { logger } from '@/lib/server/utils/logger';

/**
 * 環境変数スキーマ定義（12 Factor App準拠）
 * 型安全性とfail-fast原則を徹底
 */
const envSchema = z.object({
  // ===== 基本設定 =====
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    errorMap: () => ({
      message: 'NODE_ENV must be development, production, or test',
    }),
  }),
  PORT: z
    .string()
    .regex(/^\d+$/, 'PORT must be a number')
    .transform(Number)
    .refine(
      port => port > 0 && port < 65536,
      'PORT must be between 1 and 65535'
    )
    .default('3000'),

  // ===== Supabase設定 =====
  SUPABASE_URL: z
    .string()
    .url('SUPABASE_URL must be a valid URL')
    .refine(
      url => url.includes('.supabase.co') || url.includes('localhost'),
      'SUPABASE_URL must be a valid Supabase URL'
    ),
  SUPABASE_ANON_KEY: z
    .string()
    .min(100, 'SUPABASE_ANON_KEY must be at least 100 characters')
    .regex(/^eyJ/, 'SUPABASE_ANON_KEY must be a valid JWT token'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(100, 'SUPABASE_SERVICE_ROLE_KEY must be at least 100 characters')
    .regex(/^eyJ/, 'SUPABASE_SERVICE_ROLE_KEY must be a valid JWT token'),

  // ===== Next.js パブリック設定 =====
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL')
    .optional()
    .transform(url => url || process.env.SUPABASE_URL),

  // ===== セキュリティ設定 =====
  // JWT設定削除 - Supabase JWTを使用

  // ===== URL・CORS設定 =====
  CORS_ORIGIN: z
    .string()
    .refine(origin => {
      if (origin === '*') return true;
      try {
        new URL(origin);
        return true;
      } catch {
        return false;
      }
    }, 'CORS_ORIGIN must be a valid URL or "*"')
    .optional(),
  NEXT_PUBLIC_BASE_URL: z
    .string()
    .url('NEXT_PUBLIC_BASE_URL must be a valid URL')
    .optional(),

  // ===== Redis設定（オプショナル） =====
  REDIS_URL: z.string().url('REDIS_URL must be a valid URL').optional(),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_DB: z
    .string()
    .regex(/^\d+$/, 'REDIS_DB must be a number')
    .transform(Number)
    .default('0'),

  // ===== メール設定（オプショナル） =====
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .regex(/^\d+$/, 'SMTP_PORT must be a number')
    .transform(Number)
    .optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email('SMTP_FROM must be a valid email').optional(),

  // ===== デバッグ・ログ設定 =====
  DEBUG: z.string().optional(),
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'debug', 'trace'], {
      errorMap: () => ({
        message: 'LOG_LEVEL must be error, warn, info, debug, or trace',
      }),
    })
    .default('info'),

  // ===== レート制限設定 =====
  RATE_LIMIT_WINDOW: z
    .string()
    .regex(/^\d+$/, 'RATE_LIMIT_WINDOW must be a number')
    .transform(Number)
    .default('900000'), // 15分
  RATE_LIMIT_MAX: z
    .string()
    .regex(/^\d+$/, 'RATE_LIMIT_MAX must be a number')
    .transform(Number)
    .default('100'),

  // ===== 監視設定（オプショナル） =====
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),
  NEW_RELIC_LICENSE_KEY: z.string().optional(),

  // ===== Vercel設定（自動設定） =====
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
});

/**
 * 環境変数の型定義
 */
export type EnvVars = z.infer<typeof envSchema>;

/**
 * バリデーション済み環境変数
 */
let validatedEnv: EnvVars | null = null;

/**
 * 環境変数をバリデーションして取得
 */
export function getValidatedEnv(): EnvVars {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    logger.info('🔍 Validating environment variables...');

    // 環境変数のバリデーション実行
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
      const errors = result.error.errors.map(err => {
        const path = err.path.join('.');
        return `${path}: ${err.message}`;
      });

      logger.error('❌ Environment variable validation failed:', {
        errors,
        receivedKeys: Object.keys(process.env).filter(
          key =>
            key.startsWith('SUPABASE_') ||
            key.startsWith('NEXT_PUBLIC_') ||
            key.startsWith('NODE_') ||
            key.startsWith('CORS_')
        ),
      });

      throw new Error(
        `Environment variable validation failed:\n${errors.join('\n')}`
      );
    }

    validatedEnv = result.data;

    // 成功ログ（秘匿情報は除外）
    logger.info('✅ Environment variables validated successfully', {
      NODE_ENV: validatedEnv.NODE_ENV,
      PORT: validatedEnv.PORT,
      SUPABASE_URL: validatedEnv.SUPABASE_URL,
      hasSupabaseKeys: !!(
        validatedEnv.SUPABASE_ANON_KEY && validatedEnv.SUPABASE_SERVICE_ROLE_KEY
      ),
      CORS_ORIGIN: validatedEnv.CORS_ORIGIN,
      LOG_LEVEL: validatedEnv.LOG_LEVEL,
    });

    return validatedEnv;
  } catch (error) {
    logger.error('💥 Critical error during environment validation:', error);

    // fail-fast原則: 環境変数が不正な場合は即座に終了
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }

    throw error;
  }
}

/**
 * 環境別の動的URL取得
 */
export function getDynamicUrls(env: EnvVars) {
  const isProduction = env.NODE_ENV === 'production';
  const isVercel = !!env.VERCEL_URL;

  // ベースURL決定ロジック
  let baseUrl: string;
  if (env.NEXT_PUBLIC_BASE_URL) {
    baseUrl = env.NEXT_PUBLIC_BASE_URL;
  } else if (isVercel && env.VERCEL_URL) {
    baseUrl = `https://${env.VERCEL_URL}`;
  } else if (isProduction) {
    baseUrl = 'https://mokin-recruit.vercel.app'; // フォールバック
  } else {
    baseUrl = `http://localhost:${env.PORT}`;
  }

  // CORS Origin決定ロジック
  const corsOrigin = env.CORS_ORIGIN || baseUrl;

  return {
    baseUrl,
    corsOrigin,
    passwordResetUrl: `${baseUrl}/auth/reset-password/new`,
    loginUrl: `${baseUrl}/auth/login`,
    dashboardUrl: `${baseUrl}/dashboard`,
  };
}

/**
 * 環境変数の監査レポート生成
 */
export function generateEnvAuditReport(): {
  summary: any;
  security: any;
  missing: string[];
  recommendations: string[];
} {
  const env = getValidatedEnv();
  const urls = getDynamicUrls(env);

  const report = {
    summary: {
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
      isProduction: env.NODE_ENV === 'production',
      isVercel: !!env.VERCEL_URL,
      baseUrl: urls.baseUrl,
    },
    security: {
      corsOrigin: urls.corsOrigin,
      isCorsSafe: urls.corsOrigin !== '*',
      supabaseAuth: true, // Supabase JWTを使用
    },
    missing: [] as string[],
    recommendations: [] as string[],
  };

  // セキュリティ推奨事項
  if (env.NODE_ENV === 'production') {
    if (!env.SENTRY_DSN) {
      report.missing.push('SENTRY_DSN');
      report.recommendations.push(
        'Consider adding error monitoring with Sentry'
      );
    }
    if (urls.corsOrigin === '*') {
      report.recommendations.push(
        'CORS_ORIGIN should not be "*" in production'
      );
    }
  }

  // オプショナル設定の確認
  const optionalVars = ['REDIS_URL', 'SMTP_HOST', 'NEW_RELIC_LICENSE_KEY'];
  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      report.missing.push(varName);
    }
  });

  return report;
}

/**
 * 環境変数の安全な表示（秘匿情報をマスク）
 */
export function getSafeEnvDisplay(env: EnvVars) {
  const maskSecret = (value: string) => {
    if (value.length <= 8) return '***';
    return value.substring(0, 4) + '***' + value.substring(value.length - 4);
  };

  return {
    NODE_ENV: env.NODE_ENV,
    PORT: env.PORT,
    SUPABASE_URL: env.SUPABASE_URL,
    SUPABASE_ANON_KEY: maskSecret(env.SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: maskSecret(env.SUPABASE_SERVICE_ROLE_KEY),
    CORS_ORIGIN: env.CORS_ORIGIN,
    NEXT_PUBLIC_BASE_URL: env.NEXT_PUBLIC_BASE_URL,
    LOG_LEVEL: env.LOG_LEVEL,
    REDIS_URL: env.REDIS_URL ? maskSecret(env.REDIS_URL) : undefined,
    SMTP_HOST: env.SMTP_HOST,
    SMTP_FROM: env.SMTP_FROM,
    VERCEL_URL: env.VERCEL_URL,
    VERCEL_ENV: env.VERCEL_ENV,
  };
}

// 起動時に環境変数をバリデーション（fail-fast）
if (typeof window === 'undefined') {
  // サーバーサイドでのみ実行
  try {
    getValidatedEnv();
  } catch (error) {
    console.error('🚨 Environment validation failed on startup:', error);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
