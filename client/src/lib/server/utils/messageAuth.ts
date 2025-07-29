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
    
    // Authorizationヘッダーまたはクッキーからトークンを取得
    const authHeader = request.headers.get('authorization');
    const cookieToken = request.cookies.get('supabase-auth-token')?.value;
    const token = authHeader?.replace('Bearer ', '') || cookieToken;

    if (!token) {
      return {
        success: false,
        error: 'No authentication token provided'
      };
    }

    // セッションを検証
    const sessionResult = await sessionService.validateSession(token);

    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return {
        success: false,
        error: sessionResult.error || 'Session validation failed'
      };
    }

    const user = sessionResult.sessionInfo.user;
    const userType = user.user_metadata?.userType;

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