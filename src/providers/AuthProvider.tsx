'use client';

import React, { createContext, useContext, useEffect, useState, startTransition } from 'react';
import { type User } from '@supabase/supabase-js';

// Supabaseクライアントを遅延インポート
const createClientLazy = () => import('@/lib/supabase/client').then(mod => mod.createClient);

interface AuthContextType {
  user: User | null;
  loading: boolean;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, accessToken: null });

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
          console.error('🔍 [AUTH PROVIDER] Failed to load Supabase client');
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
          console.error('🔍 [AUTH PROVIDER] Failed to create Supabase instance');
          startTransition(() => {
            setUser(null);
            setAccessToken(null);
            setLoading(false);
          });
          return;
        }
        
        // リスナー設定を先に行う
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
              console.error('🔍 [AUTH PROVIDER] Auth listener setup error:', error);
            }
          }
        };

        // セッション取得とリスナー設定を並列実行
        const [sessionResult] = await Promise.all([
          supabase.auth.getSession(),
          setupListener()
        ]);
        
        if (!mounted) return;
        
        const { data: { session }, error } = sessionResult;
        
        // 状態更新
        startTransition(() => {
          if (error) {
            console.error('🔍 [AUTH PROVIDER] Session error:', error);
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
        console.error('🔍 [AUTH PROVIDER] Auth initialization error:', error);
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
          console.error('🔍 [AUTH PROVIDER] Cleanup error:', error);
        }
      }
    };
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, loading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}