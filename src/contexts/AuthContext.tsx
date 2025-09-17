'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
} from 'react';
import { type User } from '@supabase/supabase-js';
import type { AuthContextType, AuthUser, UserType } from '@/types';

const createClientLazy = () =>
  import('@/lib/supabase/client').then(mod => mod.createClient);

// Convert Supabase User to AuthUser
const convertToAuthUser = (user: User): AuthUser => ({
  id: user.id,
  email: user.email || '',
  userType: (user.user_metadata?.user_type as UserType) || 'candidate',
  name: user.user_metadata?.name,
  emailConfirmed: !!user.email_confirmed_at,
  lastSignIn: user.last_sign_in_at,
  user_metadata: user.user_metadata,
});

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    async function initializeAuth() {
      try {
        const createClient = await createClientLazy();
        if (!createClient) {
          if (!mounted) return;
          console.error('🔍 [AUTH CONTEXT] Failed to load Supabase client');
          startTransition(() => {
            setUser(null);
            setAccessToken(null);
            setLoading(false);
          });
          return;
        }

        const supabase = createClient();
        if (!supabase) {
          if (!mounted) return;
          console.error('🔍 [AUTH CONTEXT] Failed to create Supabase instance');
          startTransition(() => {
            setUser(null);
            setAccessToken(null);
            setLoading(false);
          });
          return;
        }

        const setupListener = async () => {
          try {
            const createClient = await createClientLazy();
            if (!createClient || !mounted) return;

            const supabaseForListener = createClient();
            if (!supabaseForListener || !mounted) return;

            const {
              data: { subscription: authSubscription },
            } = supabaseForListener.auth.onAuthStateChange((event, session) => {
              if (!mounted) return;

              startTransition(() => {
                if (session?.user) {
                  setUser(convertToAuthUser(session.user));
                  setAccessToken(session.access_token);
                } else {
                  setUser(null);
                  setAccessToken(null);
                }
              });
            });

            subscription = authSubscription;
          } catch (error) {
            if (mounted) {
              console.error(
                '🔍 [AUTH CONTEXT] Auth listener setup error:',
                error
              );
            }
          }
        };

        const [sessionResult] = await Promise.all([
          supabase.auth.getSession(),
          setupListener(),
        ]);

        if (!mounted) return;

        const {
          data: { session },
          error,
        } = sessionResult;

        startTransition(() => {
          if (error) {
            console.error('🔍 [AUTH CONTEXT] Session error:', error);
            setUser(null);
            setAccessToken(null);
          } else if (session?.user) {
            setUser(convertToAuthUser(session.user));
            setAccessToken(session.access_token);
          } else {
            setUser(null);
            setAccessToken(null);
          }
          setLoading(false);
        });
      } catch (error) {
        if (!mounted) return;
        console.error('🔍 [AUTH CONTEXT] Auth initialization error:', error);
        startTransition(() => {
          setUser(null);
          setAccessToken(null);
          setLoading(false);
        });
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('🔍 [AUTH CONTEXT] Cleanup error:', error);
        }
      }
    };
  }, []);

  const signIn = async (credentials: {
    email: string;
    password: string;
    userType?: UserType;
  }) => {
    try {
      // Server Actionを動的インポート
      const { signInAction } = await import('@/lib/auth/actions');
      const result = await signInAction(
        credentials.email,
        credentials.password,
        credentials.userType || 'candidate'
      );

      if (result.success) {
        await refreshAuth();
        return {};
      }

      return {
        error: result.error || 'ログインに失敗しました',
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: 'ネットワークエラーが発生しました' };
    }
  };

  const signOut = async () => {
    try {
      // Server Actionを使用
      const { logoutAction } = await import('@/lib/auth/actions');
      await logoutAction();

      // クライアントサイドの状態をクリア
      const createClient = await createClientLazy();
      if (createClient) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }

      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshAuth = async () => {
    try {
      const createClient = await createClientLazy();
      if (createClient) {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(convertToAuthUser(session.user));
          setAccessToken(session.access_token);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      }
    } catch (error) {
      console.error('Refresh auth error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        signIn,
        signOut: signOut as () => Promise<void>,
        signUp: async () => ({ error: 'Not implemented' }),
        resetPassword: async () => ({ error: 'Not implemented' }),
        updatePassword: async () => ({ error: 'Not implemented' }),
        refreshSession: refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type UserType = 'candidate' | 'company' | 'admin';
