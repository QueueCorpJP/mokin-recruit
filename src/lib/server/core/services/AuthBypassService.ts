import 'reflect-metadata';
import { injectable } from 'inversify';
import { logger } from '@/lib/server/utils/logger';
import { AuthResult } from '@/lib/server/core/interfaces/IAuthService';

/**
 * 認証バイパスサービス
 * 開発・テスト環境でのみ使用可能
 * 認証を簡単にバイパスしてテストを実行できる
 */
@injectable()
export class AuthBypassService {
  private readonly isTestMode: boolean;

  constructor() {
    this.isTestMode =
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test' ||
      process.env.ENABLE_AUTH_BYPASS === 'true';
  }

  /**
   * 認証バイパスが有効かチェック
   */
  isEnabled(): boolean {
    return this.isTestMode;
  }

  /**
   * バイパス用の仮想ユーザーを作成
   */
  createBypassUser(
    userType: 'candidate' | 'company_user' | 'admin',
    customData?: any
  ): AuthResult {
    if (!this.isEnabled()) {
      logger.warn('🚫 Auth bypass attempted in production environment');
      return {
        success: false,
        error: 'Auth bypass is not available in production',
      };
    }

    const baseUser = {
      id: `bypass-${userType}-${Date.now()}`,
      email: `test-${userType}@bypass.local`,
      userType,
      profile: {},
      ...customData,
    };

    switch (userType) {
      case 'candidate':
        baseUser.profile = {
          lastName: 'テスト',
          firstName: '候補者',
          lastNameKana: 'テスト',
          firstNameKana: 'コウホシャ',
          gender: 'OTHER',
          ...customData?.profile,
        };
        break;

      case 'company_user':
        baseUser.profile = {
          fullName: 'テスト企業ユーザー',
          companyAccountId: 'test-company-001',
          ...customData?.profile,
        };
        break;

      case 'admin':
        baseUser.profile = {
          fullName: 'テスト管理者',
          permissions: ['all'],
          ...customData?.profile,
        };
        break;
    }

    logger.info(`🔓 Auth bypass user created: ${userType} - ${baseUser.email}`);

    return {
      success: true,
      user: baseUser,
      token: this.generateBypassToken(baseUser),
    };
  }

  /**
   * バイパス用の簡易トークンを生成
   */
  private generateBypassToken(user: any): string {
    const payload = {
      bypass: true,
      userId: user.id,
      userType: user.userType,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24時間
    };

    return `bypass.${Buffer.from(JSON.stringify(payload)).toString('base64')}`;
  }

  /**
   * バイパストークンの検証
   */
  verifyBypassToken(token: string): AuthResult {
    if (!this.isEnabled()) {
      return {
        success: false,
        error: 'Auth bypass is not available',
      };
    }

    try {
      if (!token.startsWith('bypass.')) {
        return {
          success: false,
          error: 'Invalid bypass token format',
        };
      }

      const payload = JSON.parse(
        Buffer.from(token.replace('bypass.', ''), 'base64').toString()
      );

      if (!payload.bypass || payload.exp < Math.floor(Date.now() / 1000)) {
        return {
          success: false,
          error: 'Invalid or expired bypass token',
        };
      }

      return {
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
          userType: payload.userType,
        },
        token,
      };
    } catch (error) {
      logger.error('Bypass token verification failed:', error);
      return {
        success: false,
        error: 'Token verification failed',
      };
    }
  }

  /**
   * 定義済みのテストユーザーを取得
   */
  getPredefinedTestUsers(): Array<{
    type: string;
    email: string;
    description: string;
    data: any;
  }> {
    return [
      {
        type: 'candidate',
        email: 'test-candidate@bypass.local',
        description: '基本的な候補者ユーザー',
        data: {
          profile: {
            lastName: '山田',
            firstName: '太郎',
            lastNameKana: 'ヤマダ',
            firstNameKana: 'タロウ',
            gender: 'MALE',
          },
        },
      },
      {
        type: 'company_user',
        email: 'test-company@bypass.local',
        description: '企業ユーザー',
        data: {
          profile: {
            fullName: '鈴木花子',
            companyAccountId: 'test-company-001',
          },
        },
      },
      {
        type: 'admin',
        email: 'test-admin@bypass.local',
        description: '管理者ユーザー',
        data: {
          profile: {
            fullName: '管理者',
            permissions: ['all'],
          },
        },
      },
    ];
  }
}

export default AuthBypassService;
