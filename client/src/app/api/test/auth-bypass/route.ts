import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/server/utils/logger';
import { AuthBypassService } from '@/lib/server/core/services/AuthBypassService';
import { TestDataService } from '@/lib/server/core/services/TestDataService';

/**
 * 認証バイパス機能API
 * 開発・テスト環境でのみ利用可能
 */

/**
 * GET: 認証バイパス情報とテストユーザー一覧を取得
 */
export async function GET(request: NextRequest) {
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

    const authBypassService = new AuthBypassService();
    const testDataService = new TestDataService();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // アクション別処理
    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          authBypass: {
            enabled: authBypassService.isEnabled(),
            environment: process.env.NODE_ENV,
          },
          testData: {
            enabled: testDataService.isEnabled(),
          },
          predefinedUsers: authBypassService.getPredefinedTestUsers(),
        });

      case 'test-users':
        const testUsersResult = await testDataService.getAvailableTestUsers();
        return NextResponse.json(testUsersResult);

      default:
        // デフォルト: 全体の状況を返す
        const testUsers = await testDataService.getAvailableTestUsers();

        return NextResponse.json({
          success: true,
          message: '認証バイパス機能が利用可能です',
          authBypass: {
            enabled: authBypassService.isEnabled(),
            environment: process.env.NODE_ENV,
            predefinedUsers: authBypassService.getPredefinedTestUsers(),
          },
          testData: {
            enabled: testDataService.isEnabled(),
            availableUsers: testUsers.success ? testUsers.users : [],
          },
          instructions: {
            bypassLogin: 'POST /api/test/auth-bypass with userType parameter',
            generateTestData: 'POST /api/test/auth-bypass with action=generate',
            cleanupTestData: 'DELETE /api/test/auth-bypass',
          },
        });
    }
  } catch (error) {
    logger.error('❌ Auth bypass GET API error:', error);
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
 * POST: 認証バイパスログインまたはテストデータ生成
 */
export async function POST(request: NextRequest) {
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
    const { action, userType, customData } = body;

    const authBypassService = new AuthBypassService();
    const testDataService = new TestDataService();

    switch (action) {
      case 'generate-test-data':
        logger.info('🧪 Generating comprehensive test data...');
        const generateResult =
          await testDataService.generateCompleteTestDataset();
        return NextResponse.json(generateResult);

      case 'bypass-login':
      default:
        // 認証バイパスログイン
        if (!userType) {
          return NextResponse.json(
            {
              success: false,
              error: 'userType is required (candidate, company_user, admin)',
            },
            { status: 400 }
          );
        }

        logger.info(`🔓 Auth bypass login requested: ${userType}`);

        const bypassResult = authBypassService.createBypassUser(
          userType,
          customData
        );

        if (!bypassResult.success) {
          return NextResponse.json(bypassResult, { status: 400 });
        }

        // セッション情報をレスポンスに含める
        const response = NextResponse.json({
          success: true,
          message: `認証バイパスログインが成功しました (${userType})`,
          user: bypassResult.user,
          token: bypassResult.token,
          instructions: {
            usage: 'このトークンをAuthorizationヘッダーに設定してください',
            header: `Authorization: Bearer ${bypassResult.token}`,
            expires: '24時間後',
          },
        });

        // クッキーにもトークンを設定
        response.cookies.set('auth-bypass-token', bypassResult.token!, {
          httpOnly: true,
          secure: false, // 開発環境のため常にfalse
          sameSite: 'lax',
          maxAge: 24 * 60 * 60, // 24時間
        });

        return response;
    }
  } catch (error) {
    logger.error('❌ Auth bypass POST API error:', error);
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
 * DELETE: テストデータのクリーンアップ
 */
export async function DELETE(request: NextRequest) {
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

    logger.info('🧹 Test data cleanup requested...');

    const testDataService = new TestDataService();
    const cleanupResult = await testDataService.cleanupTestData();

    return NextResponse.json(cleanupResult);
  } catch (error) {
    logger.error('❌ Auth bypass DELETE API error:', error);
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
