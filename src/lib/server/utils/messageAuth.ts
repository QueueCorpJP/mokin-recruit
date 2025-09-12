import { NextRequest } from 'next/server';
import { SessionService } from '@/lib/server/core/services/SessionService';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { logger } from '@/lib/server/utils/logger';

/**
 * メッセージAPI用の認証結果の型定義
 */
export interface MessageAuthResult {
  success: boolean;
  userType?: 'CANDIDATE' | 'COMPANY_USER';
  userId?: string; // candidateId または companyUserId
  userEmail?: string;
  userName?: string;
  companyAccountId?: string; // 企業ユーザーの場合のみ
  error?: string;
}

/**
 * 候補者と企業ユーザー両方に対応した認証関数
 */
export async function authenticateMessageUser(request: NextRequest): Promise<MessageAuthResult> {
  try {
    const sessionService = new SessionService();
    
    // まずはSSRクッキー経由のセッション解決を試みる（@supabase/ssr の仕組みに委ねる）
    // フォールバックとして Authorization: Bearer <token> を許可
    const authHeader = request.headers.get('authorization');
    const bearer = authHeader?.replace('Bearer ', '').trim();
    const token = bearer || undefined;

    if (!token) {
      return {
        success: false,
        error: 'No authentication token provided'
      };
    }

    // セッションを検証（Bearer があれば使用。なければ SSR クッキーに依存した getUser() を内部で使用）
    const sessionResult = token
      ? await sessionService.validateSession(token)
      : await (async () => {
          try {
            const supabase = getSupabaseAdminClient();
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) {
              return { success: false, error: 'No active session' } as const;
            }
            const { data: sessionData } = await supabase.auth.getSession();
            if (!sessionData.session) {
              return { success: false, error: 'No active session' } as const;
            }
            return {
              success: true,
              sessionInfo: {
                user: data.user,
                session: sessionData.session,
                expiresAt: new Date((sessionData.session.expires_at || 0) * 1000)
              }
            } as const;
          } catch (e) {
            return { success: false, error: 'Session validation failed' } as const;
          }
        })();

    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        success: false,
        error: sessionResult.error || 'Session validation failed'
      };
    }

    const user = sessionResult.sessionInfo.user;
    const userType = user.user_metadata?.user_type || user.user_metadata?.userType;

    if (!userType || !['candidate', 'company_user'].includes(userType)) {
      return {
        success: false,
        error: 'Invalid user type for messaging'
      };
    }

    const supabase = getSupabaseAdminClient();

    if (userType === 'candidate') {
      // 候補者の情報を取得
      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .select('id, email, first_name, last_name')
        .eq('email', user.email)
        .single();

      if (candidateError || !candidate) {
        logger.error('Candidate lookup failed:', candidateError);
        return {
          success: false,
          error: 'Candidate information not found'
        };
      }

      return {
        success: true,
        userType: 'CANDIDATE',
        userId: candidate.id,
        userEmail: candidate.email,
        userName: `${candidate.last_name} ${candidate.first_name}`
      };

    } else if (userType === 'company_user') {
      // 企業ユーザーの情報を取得
      const { data: companyUser, error: companyUserError } = await supabase
        .from('company_users')
        .select('id, email, full_name, company_account_id')
        .eq('email', user.email)
        .single();

      if (companyUserError || !companyUser) {
        logger.error('Company user lookup failed:', companyUserError);
        return {
          success: false,
          error: 'Company user information not found'
        };
      }

      return {
        success: true,
        userType: 'COMPANY_USER',
        userId: companyUser.id,
        userEmail: companyUser.email,
        userName: companyUser.full_name,
        companyAccountId: companyUser.company_account_id
      };
    }

    return {
      success: false,
      error: 'Unsupported user type'
    };

  } catch (error) {
    logger.error('Message authentication error:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
} 