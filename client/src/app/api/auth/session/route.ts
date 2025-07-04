import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/server/utils/logger';
import { SessionService } from '@/lib/server/core/services/SessionService';
import { ensureSupabaseInitialized } from '@/lib/server/utils/api-init';

/**
 * セッション管理API
 * GET /api/auth/session - セッション情報の取得
 * POST /api/auth/session - セッションの更新/リフレッシュ
 * DELETE /api/auth/session - セッションの削除
 */

// Supabase初期化
ensureSupabaseInitialized();

/**
 * セッション情報の取得
 */
export async function GET(request: NextRequest) {
  try {
    const sessionService = new SessionService();

    // Authorizationヘッダーまたはクッキーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;

    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // セッションを検証
    const sessionResult = await sessionService.validateSession(token);

    if (!sessionResult.success) {
      return NextResponse.json(
        { success: false, error: sessionResult.error },
        { status: 401 }
      );
    }

    // セッション情報を返す（機密情報は除外）
    const { sessionInfo } = sessionResult;
    const responseData = {
      success: true,
      user: {
        id: sessionInfo!.user.id,
        email: sessionInfo!.user.email,
        userType: sessionInfo!.user.user_metadata?.userType,
        name: sessionInfo!.user.user_metadata?.name,
        emailConfirmed: !!sessionInfo!.user.email_confirmed_at,
        lastSignIn: sessionInfo!.user.last_sign_in_at,
      },
      session: {
        expiresAt: sessionInfo!.expiresAt,
        needsRefresh: sessionResult.needsRefresh,
      },
    };

    logger.info(`Session retrieved for user: ${sessionInfo!.user.id}`);

    return NextResponse.json(responseData);
  } catch (error) {
    logger.error('Session GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * セッションの更新/リフレッシュ
 */
export async function POST(request: NextRequest) {
  try {
    const sessionService = new SessionService();
    const body = await request.json();

    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // セッションをリフレッシュ
    const refreshResult = await sessionService.refreshSession(refreshToken);

    if (!refreshResult.success) {
      return NextResponse.json(
        { success: false, error: refreshResult.error },
        { status: 401 }
      );
    }

    const { sessionInfo } = refreshResult;

    // 新しいセッション情報を返す
    const responseData = {
      success: true,
      message: 'Session refreshed successfully',
      token: sessionInfo!.customToken,
      user: {
        id: sessionInfo!.user.id,
        email: sessionInfo!.user.email,
        userType: sessionInfo!.user.user_metadata?.userType,
        name: sessionInfo!.user.user_metadata?.name,
      },
      session: {
        expiresAt: sessionInfo!.expiresAt,
        refreshToken: sessionInfo!.refreshToken,
      },
    };

    // レスポンスにクッキーを設定
    const response = NextResponse.json(responseData);
    const cookieOptions = sessionService.generateCookieOptions(sessionInfo!);

    response.cookies.set(
      'supabase-auth-token',
      sessionInfo!.customToken,
      cookieOptions
    );
    response.cookies.set('supabase-refresh-token', sessionInfo!.refreshToken, {
      ...cookieOptions,
      httpOnly: true,
    });

    logger.info(`Session refreshed for user: ${sessionInfo!.user.id}`);

    return response;
  } catch (error) {
    logger.error('Session POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * セッションの削除（ログアウト）
 */
export async function DELETE(request: NextRequest) {
  try {
    const sessionService = new SessionService();

    // Authorizationヘッダーまたはクッキーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;

    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // セッションを無効化
    const invalidated = await sessionService.invalidateSession(token);

    if (!invalidated) {
      return NextResponse.json(
        { success: false, error: 'Failed to invalidate session' },
        { status: 500 }
      );
    }

    // クッキーをクリア
    const response = NextResponse.json({
      success: true,
      message: 'Session invalidated successfully',
    });

    response.cookies.delete('supabase-auth-token');
    response.cookies.delete('supabase-refresh-token');

    logger.info('Session invalidated successfully');

    return response;
  } catch (error) {
    logger.error('Session DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * CORS対応
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin':
        process.env.CORS_ORIGIN || 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
