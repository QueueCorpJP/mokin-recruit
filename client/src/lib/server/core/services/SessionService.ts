import { injectable, inject } from 'inversify';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';
import jwt from 'jsonwebtoken';
import { TYPES } from '@/lib/server/container/types';

/**
 * セッション情報の型定義
 */
export interface SessionInfo {
  user: User;
  session: Session;
  customToken: string;
  expiresAt: Date;
  refreshToken: string;
}

/**
 * セッション管理結果の型定義
 */
export interface SessionResult {
  success: boolean;
  sessionInfo?: SessionInfo;
  error?: string;
  needsRefresh?: boolean;
}

/**
 * セッション管理サービス
 * JWTとSupabaseセッションの統合管理を行う
 */
@injectable()
export class SessionService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN = '7d';
  private readonly REFRESH_THRESHOLD = 5 * 60 * 1000; // 5分前にリフレッシュ

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';

    if (!process.env.JWT_SECRET) {
      console.warn('JWT_SECRET not found in environment variables, using default secret for development');
    }
  }

  /**
   * セッションを作成する
   */
  async createSession(
    user: User,
    supabaseSession: Session
  ): Promise<SessionResult> {
    try {
      // カスタムJWTトークンを生成
      const customToken = this.generateCustomJWT(user);

      // セッション情報を構築
      const sessionInfo: SessionInfo = {
        user,
        session: supabaseSession,
        customToken,
        expiresAt: new Date(supabaseSession.expires_at! * 1000),
        refreshToken: supabaseSession.refresh_token,
      };

      logger.info(`Session created for user: ${user.id}`);

      return {
        success: true,
        sessionInfo,
      };
    } catch (error) {
      logger.error('Failed to create session:', error);
      return {
        success: false,
        error: 'Session creation failed',
      };
    }
  }

  /**
   * セッションを検証する
   */
  async validateSession(token: string): Promise<SessionResult> {
    try {
      // カスタムJWTトークンを検証
      const jwtPayload = this.verifyCustomJWT(token);
      if (!jwtPayload) {
        return {
          success: false,
          error: 'Invalid JWT token',
        };
      }

      // JWTペイロードからユーザー情報を構築
      const user: User = {
        id: jwtPayload.sub,
        email: jwtPayload.email,
        user_metadata: jwtPayload.user_metadata || {},
        app_metadata: jwtPayload.app_metadata || {},
        aud: jwtPayload.aud,
        created_at: '',
        updated_at: '',
        email_confirmed_at: '',
        phone_confirmed_at: '',
        confirmed_at: '',
        last_sign_in_at: '',
        role: '',
      };

      // セッション期限をチェック
      const now = new Date();
      const expiresAt = new Date(jwtPayload.exp * 1000);
      const needsRefresh =
        expiresAt.getTime() - now.getTime() < this.REFRESH_THRESHOLD;

      // セッション情報を構築（JWTベース）
      const mockSession: Session = {
        access_token: token,
        refresh_token: '',
        expires_at: jwtPayload.exp,
        expires_in: Math.floor((expiresAt.getTime() - now.getTime()) / 1000),
        token_type: 'bearer',
        user,
      };

      const sessionInfo: SessionInfo = {
        user,
        session: mockSession,
        customToken: token,
        expiresAt,
        refreshToken: '',
      };

      return {
        success: true,
        sessionInfo,
        needsRefresh,
      };
    } catch (error) {
      logger.error('Session validation error:', error);
      return {
        success: false,
        error: 'Session validation failed',
      };
    }
  }

  /**
   * セッションをリフレッシュする
   */
  async refreshSession(refreshToken: string): Promise<SessionResult> {
    try {
      const supabase = getSupabaseClient();

      // Supabaseセッションをリフレッシュ
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session || !data.user) {
        logger.warn('Session refresh failed:', error?.message);
        return {
          success: false,
          error: 'Failed to refresh session',
        };
      }

      // 新しいセッションを作成
      return await this.createSession(data.user, data.session);
    } catch (error) {
      logger.error('Session refresh error:', error);
      return {
        success: false,
        error: 'Session refresh failed',
      };
    }
  }

  /**
   * セッションを無効化する
   */
  async invalidateSession(token: string): Promise<boolean> {
    try {
      const supabase = getSupabaseClient();

      // Supabaseからサインアウト
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.warn('Supabase signout failed:', error.message);
        return false;
      }

      logger.info('Session invalidated successfully');
      return true;
    } catch (error) {
      logger.error('Session invalidation error:', error);
      return false;
    }
  }

  /**
   * ユーザー情報を取得する
   */
  async getUserFromSession(token: string): Promise<User | null> {
    try {
      const result = await this.validateSession(token);
      return result.success ? result.sessionInfo?.user || null : null;
    } catch (error) {
      logger.error('Failed to get user from session:', error);
      return null;
    }
  }

  /**
   * セッションの自動更新が必要かチェックする
   */
  shouldRefreshSession(sessionInfo: SessionInfo): boolean {
    const now = new Date();
    const timeUntilExpiry = sessionInfo.expiresAt.getTime() - now.getTime();
    return timeUntilExpiry < this.REFRESH_THRESHOLD;
  }

  /**
   * カスタムJWTトークンを生成する
   */
  private generateCustomJWT(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      app_metadata: user.app_metadata,
      aud: 'authenticated',
      iss: 'mokin-recruit',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7日間
    };

    return jwt.sign(payload, this.JWT_SECRET, { algorithm: 'HS256' });
  }

  /**
   * カスタムJWTトークンを検証する
   */
  private verifyCustomJWT(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET, { algorithms: ['HS256'] });
    } catch (error) {
      logger.warn('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * セッション情報をクッキーに設定するためのオプションを生成する
   */
  generateCookieOptions(sessionInfo: SessionInfo) {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      expires: sessionInfo.expiresAt,
      path: '/',
    };
  }
}

/**
 * セッション管理サービスのインターフェース
 */
export interface ISessionService {
  createSession(user: User, supabaseSession: Session): Promise<SessionResult>;
  validateSession(token: string): Promise<SessionResult>;
  refreshSession(refreshToken: string): Promise<SessionResult>;
  invalidateSession(token: string): Promise<boolean>;
  getUserFromSession(token: string): Promise<User | null>;
  shouldRefreshSession(sessionInfo: SessionInfo): boolean;
}
