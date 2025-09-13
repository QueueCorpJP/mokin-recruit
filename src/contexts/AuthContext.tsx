'use client';

import React, { createContext, useContext, useEffect, useState, startTransition } from 'react';
import { type User } from '@supabase/supabase-js';
import { safeLog, maskEmail } from '@/lib/utils/pii-safe-logger';

const createClientLazy = () => import('@/lib/supabase/client').then(mod => mod.createClient);

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
  signIn: (email: string, password: string, userType?: 'candidate' | 'company' | 'admin') => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
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
          safeLog('error', '[AUTH CONTEXT] Failed to load Supabase client');
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
          safeLog('error', '[AUTH CONTEXT] Failed to create Supabase instance');
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

            const { data: { subscription: authSubscription } } = supabaseForListener.auth.onAuthStateChange((event, session) => {
              if (!mounted) return;
              
              startTransition(() => {
                if (session?.user) {
                  setUser(session.user);
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
              safeLog('error', '[AUTH CONTEXT] Auth listener setup error', { error: error instanceof Error ? error.message : String(error) });
            }
          }
        };

        const [sessionResult] = await Promise.all([
          supabase.auth.getSession(),
          setupListener()
        ]);
        
        if (!mounted) return;
        
        const { data: { session }, error } = sessionResult;
        
        startTransition(() => {
          if (error) {
            safeLog('error', '[AUTH CONTEXT] Session error', { error: error instanceof Error ? error.message : String(error) });
            setUser(null);
            setAccessToken(null);
          } else if (session?.user) {
            setUser(session.user);
            setAccessToken(session.access_token);
          } else {
            setUser(null);
            setAccessToken(null);
          }
          setLoading(false);
        });
      } catch (error) {
        if (!mounted) return;
        safeLog('error', '[AUTH CONTEXT] Auth initialization error', { error: error instanceof Error ? error.message : String(error) });
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
          safeLog('error', '[AUTH CONTEXT] Cleanup error', { error: error instanceof Error ? error.message : String(error) });
        }
      }
    };
  }, []);

  const signIn = async (email: string, password: string, userType?: 'candidate' | 'company' | 'admin') => {
    try {
      // Server Actionを動的インポート
      const { signInAction } = await import('@/lib/auth/actions');
      const result = await signInAction(email, password, userType);

      if (result.success) {
        await refreshAuth();
        return { success: true };
      }

      return { success: false, error: result.error || 'ログインに失敗しました' };
    } catch (error) {
      safeLog('error', 'Sign in error', { error: error instanceof Error ? error.message : String(error) });
      return { success: false, error: 'ネットワークエラーが発生しました' };
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
      safeLog('error', 'Sign out error', { error: error instanceof Error ? error.message : String(error) });
    }
  };

  const refreshAuth = async () => {
    try {
      const createClient = await createClientLazy();
      if (createClient) {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          setAccessToken(session.access_token);
        } else {
          setUser(null);
          setAccessToken(null);
        }
      }
    } catch (error) {
      safeLog('error', 'Refresh auth error', { error: error instanceof Error ? error.message : String(error) });
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, loading, accessToken, signIn, signOut, refreshAuth }}>
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