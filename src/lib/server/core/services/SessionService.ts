import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';

/**
 * セッション情報の型定義 - Supabase専用
 */
export interface SessionInfo {
  user: User;
  session: Session;
  expiresAt: Date;
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
 * Supabase専用セッション管理サービス
 */
export class SessionService {
  private readonly REFRESH_THRESHOLD = 3 * 24 * 60 * 60 * 1000; // 3日前にリフレッシュ

  constructor() {
    // Supabaseのセッション管理のみを使用
  }

  /**
   * セッションを作成する
   */
  async createSession(
    user: User,
    supabaseSession: Session
  ): Promise<SessionResult> {
    try {
      // セッション情報を構築（Supabase JWTのみ使用）
      const sessionInfo: SessionInfo = {
        user,
        session: supabaseSession,
        expiresAt: new Date(supabaseSession.expires_at! * 1000),
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
   * セッションを検証する（Supabase JWTトークンを使用）
   */
  async validateSession(token: string): Promise<SessionResult> {
    try {
      const supabase = getSupabaseClient();

      // Supabase JWTトークンを検証
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        logger.warn('Supabase token validation failed:', error?.message);
        return {
          success: false,
          error: 'Invalid or expired token',
        };
      }

      // 現在のセッションを取得
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        return {
          success: false,
          error: 'No active session',
        };
      }

      // セッション期限をチェック
      const now = new Date();
      const expiresAt = new Date(sessionData.session.expires_at! * 1000);
      const needsRefresh =
        expiresAt.getTime() - now.getTime() < this.REFRESH_THRESHOLD;

      const sessionInfo: SessionInfo = {
        user: data.user,
        session: sessionData.session,
        expiresAt,
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
  async invalidateSession(): Promise<boolean> {
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
  invalidateSession(): Promise<boolean>;
  getUserFromSession(token: string): Promise<User | null>;
  shouldRefreshSession(sessionInfo: SessionInfo): boolean;
}
