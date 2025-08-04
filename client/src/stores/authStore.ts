import { createStore } from 'zustand/vanilla';
import { subscribeWithSelector, persist, createJSONStorage } from 'zustand/middleware';
import { useStore } from 'zustand';
import { useMemo } from 'react';

export type UserType = 'candidate' | 'company_user' | 'admin';

interface User {
  id: string;
  email: string;
  userType: UserType;
  name?: string;
  emailConfirmed: boolean;
  lastSignIn?: string;
}

interface Session {
  expiresAt: string;
  needsRefresh: boolean;
}

interface SessionResponse {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

interface AuthState {
  // State
  user: User | null;
  userType: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: Session | null;
  lastFetchTime: number;
  initialized: boolean;
  
  // Actions
  setUser: (_user: User | null) => void;
  setLoading: (_loading: boolean) => void;
  setAuthenticated: (_authenticated: boolean) => void;
  setSession: (_session: Session | null) => void;
  setInitialized: (_initialized: boolean) => void;
  
  // API Actions
  fetchUserSession: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Helper methods
  reset: () => void;
}

const initialState = {
  user: null,
  userType: null,
  isLoading: false,
  isAuthenticated: false,
  session: null,
  lastFetchTime: 0,
  initialized: false,
};

// 🔥 Vanilla Store: SSR/CSR両対応の共有インスタンス
export const authStore = createStore<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      ...initialState,
      
      // Actions
      setUser: (_user) => {
        set({ 
          user: _user, 
          userType: _user?.userType || null,
          isAuthenticated: !!_user 
        });
      },
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setSession: (session) => set({ session }),
      
      setInitialized: (initialized) => {
        set({ initialized });
      },
      
      // API Actions
      fetchUserSession: async () => {
        const currentTime = Date.now();
        const { lastFetchTime, initialized, isAuthenticated, isLoading } = get();
        
        // 既にローディング中の場合はスキップ（重複実行防止）
        if (isLoading) {
          return;
        }
        
        // 初期化済みで認証済み、かつ直近でAPI呼び出し済みの場合のみスキップ
        if (initialized && isAuthenticated && currentTime - lastFetchTime < 3000) {
          return;
        }

        try {
          set({ isLoading: true, lastFetchTime: currentTime });
          
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data: SessionResponse = await response.json();
            
            if (data.success && data.user) {
              get().setUser(data.user);
              get().setSession(data.session || null);
            } else {
              get().reset();
            }
          } else {
            get().reset();
          }
        } catch (error) {
          console.error('Failed to fetch user session:', error);
          get().reset();
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },
      
      refreshAuth: async () => {
        // 強制的に認証状態を再取得（ログイン後の状態更新用）
        const currentTime = Date.now();
        
        try {
          set({ isLoading: true, lastFetchTime: currentTime });
          
          // eslint-disable-next-line no-console
          console.log('🔄 refreshAuth: Forcefully refreshing auth state...');
          
          const response = await fetch('/api/auth/session', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data: SessionResponse = await response.json();
            
            if (data.success && data.user) {
              get().setUser(data.user);
              get().setSession(data.session || null);
              // eslint-disable-next-line no-console
              console.log('🔄 refreshAuth: Successfully updated auth state', { 
                user: data.user.email, 
                userType: data.user.userType,
                isAuthenticated: true 
              });
              
            } else {
              get().reset();
              // eslint-disable-next-line no-console
              console.log('🔄 refreshAuth: No valid session found, reset auth state');
            }
          } else {
            get().reset();
            // eslint-disable-next-line no-console
            console.log('🔄 refreshAuth: Session API failed, reset auth state');
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('🔄 refreshAuth failed:', error);
          get().reset();
        } finally {
          set({ isLoading: false, initialized: true });
        }
      },
      
      logout: async () => {
        const { userType } = get();
        try {
          // サーバーアクションを動的インポート
          const { logoutAction } = await import('@/lib/auth/actions');
          await logoutAction();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Logout error:', error);
        } finally {
          get().reset();
          
          // ユーザータイプに応じてリダイレクト
          const loginPath = userType === 'candidate' 
            ? '/candidate/auth/login' 
            : '/company/auth/login';
          
          // クライアントサイドでのリダイレクト
          if (typeof window !== 'undefined') {
            window.location.href = loginPath;
          }
        }
      },
      
      // Helper methods
      reset: () => {
        // eslint-disable-next-line no-console
        console.log('🔄 reset: Clearing auth state');
        
        set({
          user: null,
          userType: null,
          isAuthenticated: false,
          session: null,
          isLoading: false,
          lastFetchTime: 0,
          initialized: true, // リセット後も初期化済みとする
        });
        
      }
      }),
      {
        // SSR対応の設定
        name: 'auth-storage',
        storage: createJSONStorage(() => 
          typeof window !== 'undefined' ? sessionStorage : {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          }
        ),
        partialize: (state) => ({
          // 認証情報のみ永続化（isLoadingは除く）
          user: state.user,
          userType: state.userType,
          isAuthenticated: state.isAuthenticated,
          session: state.session,
        }),
        // 🔥 SSR対応: サーバーサイドでは常に初期状態を返す
        skipHydration: true,
      }
    )
  )
);

// 🔥 Selectors（Vanilla Store用）
export const selectUser = (state: AuthState) => state.user;
export const selectUserType = (state: AuthState) => state.userType;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectSession = (state: AuthState) => state.session;
export const selectInitialized = (state: AuthState) => state.initialized;
export const selectFetchUserSession = (state: AuthState) => state.fetchUserSession;

// 🔥 根本修正: useAuthフックを完全削除
// オブジェクト返却による useSyncExternalStore 無限ループを根本解決
// 以下の個別フックのみ使用すること

// アクション用フック（関数を取得）
export const useAuthRefresh = () => useStore(authStore, (state) => state.refreshAuth);
export const useAuthLogout = () => useStore(authStore, (state) => state.logout);
export const useAuthFetchSession = () => useStore(authStore, (state) => state.fetchUserSession);

// 🔥 個別のHooks（Vanilla Store用）
export const useAuthUser = () => useStore(authStore, selectUser);
export const useAuthUserType = () => useStore(authStore, selectUserType);
export const useAuthIsAuthenticated = () => useStore(authStore, selectIsAuthenticated);
export const useAuthIsLoading = () => useStore(authStore, selectIsLoading);
export const useAuthSession = () => useStore(authStore, selectSession);
export const useAuthInitialized = () => useStore(authStore, selectInitialized);