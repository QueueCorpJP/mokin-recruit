import { createClient } from '@supabase/supabase-js';

class PasswordResetManager {
  private static instance: PasswordResetManager;
  private supabase: any;
  private activeResetSessions = new Map<string, string>(); // email -> sessionId
  private listeners = new Set<(event: string, data: any) => void>();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      this.setupAuthListener();
    }
  }

  static getInstance(): PasswordResetManager {
    if (!PasswordResetManager.instance) {
      PasswordResetManager.instance = new PasswordResetManager();
    }
    return PasswordResetManager.instance;
  }

  private setupAuthListener() {
    this.supabase.auth.onAuthStateChange((event: string, session: any) => {
      console.log('🔐 Auth state change:', event, session?.user?.email);

      switch (event) {
        case 'PASSWORD_RECOVERY':
          this.handlePasswordRecovery(session);
          break;
        case 'SIGNED_OUT':
          this.handleSignOut();
          break;
        case 'TOKEN_REFRESHED':
          this.handleTokenRefresh(session);
          break;
      }

      // リスナーに通知
      this.listeners.forEach(listener => {
        try {
          listener(event, session);
        } catch (error) {
          console.error('Auth listener error:', error);
        }
      });
    });
  }

  private handlePasswordRecovery(session: any) {
    if (!session?.user?.email) return;

    const email = session.user.email;
    const sessionId = session.access_token?.substring(0, 10) || Date.now().toString();

    console.log('🔄 Password recovery initiated for:', email.substring(0, 3) + '***');

    // 既存のセッションがある場合は無効化
    if (this.activeResetSessions.has(email)) {
      const oldSessionId = this.activeResetSessions.get(email);
      console.log('⚠️ Invalidating previous reset session:', oldSessionId);
      
      // 前のセッションを無効化する通知
      if (oldSessionId) {
        this.notifySessionInvalidated(email, oldSessionId);
      }
    }

    // 新しいセッションを記録
    this.activeResetSessions.set(email, sessionId);
    
    // セッション情報をローカルストレージに保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('active_password_reset', JSON.stringify({
        email,
        sessionId,
        timestamp: Date.now()
      }));
    }

    console.log('✅ New password reset session registered:', sessionId);
  }

  private handleSignOut() {
    // サインアウト時にリセットセッションをクリア
    this.activeResetSessions.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('active_password_reset');
    }
    console.log('🚪 Password reset sessions cleared on sign out');
  }

  private handleTokenRefresh(session: any) {
    // トークンリフレッシュ時の処理
    if (session?.user?.email && this.activeResetSessions.has(session.user.email)) {
      console.log('🔄 Token refreshed for active reset session');
    }
  }

  private notifySessionInvalidated(email: string, sessionId: string) {
    // 無効化された旨をリスナーに通知
    this.listeners.forEach(listener => {
      try {
        listener('PASSWORD_RESET_INVALIDATED', { email, sessionId });
      } catch (error) {
        console.error('Session invalidation notification error:', error);
      }
    });
  }

  // パブリックメソッド
  addListener(callback: (event: string, data: any) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  isValidResetSession(email: string, sessionId?: string): boolean {
    if (!this.activeResetSessions.has(email)) return false;
    
    if (sessionId) {
      return this.activeResetSessions.get(email) === sessionId;
    }
    
    return true; // セッションIDが指定されていない場合は、メールアドレスのみで判定
  }

  getCurrentResetSession(email: string): string | null {
    return this.activeResetSessions.get(email) || null;
  }

  // 期限切れセッションのクリーンアップ
  cleanupExpiredSessions() {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    const expirationTime = 60 * 60 * 1000; // 1時間

    try {
      const stored = localStorage.getItem('active_password_reset');
      if (stored) {
        const data = JSON.parse(stored);
        if (now - data.timestamp > expirationTime) {
          this.activeResetSessions.delete(data.email);
          localStorage.removeItem('active_password_reset');
          console.log('🧹 Expired password reset session cleaned up');
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
    }
  }

  // リセット要求の重複チェック
  async requestPasswordReset(email: string, userType?: string): Promise<{
    success: boolean;
    message: string;
    isDuplicate?: boolean;
  }> {
    // 既存のアクティブセッションをチェック
    if (this.isValidResetSession(email)) {
      const currentSession = this.getCurrentResetSession(email);
      console.log('⚠️ Duplicate password reset request blocked:', email.substring(0, 3) + '***');
      
      return {
        success: false,
        message: 'パスワードリセット用のメールを既に送信しています。メールをご確認ください。',
        isDuplicate: true
      };
    }

    // 新しいリセット要求を実行
    try {
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          userType,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // 成功時は自動的にonAuthStateChangeでPASSWORD_RECOVERYイベントが発火される
        return {
          success: true,
          message: result.message || 'パスワード再設定のご案内のメールをお送りいたします。'
        };
      } else {
        return {
          success: false,
          message: result.error || 'パスワードリセット要求の送信に失敗しました。'
        };
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        message: 'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
      };
    }
  }
}

export default PasswordResetManager; 