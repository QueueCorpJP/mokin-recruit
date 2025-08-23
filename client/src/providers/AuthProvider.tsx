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
    
    async function initializeAuth() {
      try {
        const createClient = await createClientLazy();
        const supabase = createClient();
        
        // 並列でセッション取得とリスナー設定
        const [sessionResult] = await Promise.all([
          supabase.auth.getSession(),
          // リスナー設定も並列で実行（遅延初期化）
          new Promise<void>(async (resolve) => {
            const createClient = await createClientLazy();
            const supabaseForListener = createClient();
            const { data: { subscription } } = supabaseForListener.auth.onAuthStateChange((event, session) => {
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
            
            // クリーンアップ関数を設定
            if (mounted) {
              const cleanup = () => subscription.unsubscribe();
              // コンポーネントがアンマウントされたときにクリーンアップ
              return cleanup;
            }
            resolve();
          })
        ]);
        
        if (!mounted) return;
        
        const { data: { session }, error } = sessionResult;
        
        // 状態更新を並列で実行（React 18のstartTransition使用）
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