import {
  createJSONStorage,
  persist,
  subscribeWithSelector,
} from 'zustand/middleware';
import { create } from 'zustand';

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

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
      ...initialState,
      
      // Actions
      setUser: (_user) => {
        // eslint-disable-next-line no-console
        console.log('🔄 setUser called:', { 
          user: _user ? { id: _user.id, email: _user.email, userType: _user.userType } : null,
          isAuthenticated: !!_user 
        });
        
        set({ 
          user: _user, 
          userType: _user?.userType || null,
          isAuthenticated: !!_user 
        });
        
        // キャッシュを無効化
        cachedAuthData = null;
        cachedAuthActions = null;
        cachedFullAuth = null;
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      setSession: (session) => set({ session }),
      
      setInitialized: (initialized) => set({ initialized }),
      
      // API Actions
      fetchUserSession: async () => {
        const currentTime = Date.now();
        const { lastFetchTime, initialized, isAuthenticated, isLoading } = get();
        
        // eslint-disable-next-line no-console
        console.log('🔍 fetchUserSession called:', { initialized, isAuthenticated, isLoading, lastFetchTime, currentTime });
        
        // 既にローディング中の場合はスキップ（重複実行防止）
        if (isLoading) {
          // eslint-disable-next-line no-console
          console.log('🔍 fetchUserSession: Skipped (already loading)');
          return;
        }
        
        // 初期化済みで認証済み、かつ直近でAPI呼び出し済みの場合のみスキップ
        if (initialized && isAuthenticated && currentTime - lastFetchTime < 3000) {
          // eslint-disable-next-line no-console
          console.log('🔍 fetchUserSession: Skipped (already initialized, authenticated, and recently fetched)');
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
            
            // eslint-disable-next-line no-console
            console.log('🔍 fetchUserSession response:', { success: data.success, hasUser: !!data.user });
            
            if (data.success && data.user) {
              get().setUser(data.user);
              get().setSession(data.session || null);
            } else {
              get().reset();
            }
          } else {
            // eslint-disable-next-line no-console
            console.log('🔍 fetchUserSession: API response not ok', response.status);
            get().reset();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('🔍 Failed to fetch user session:', error);
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
              
              // キャッシュを無効化
              cachedAuthData = null;
              cachedAuthActions = null;
              cachedFullAuth = null;
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
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          });
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
        
        // キャッシュを無効化
        cachedAuthData = null;
        cachedAuthActions = null;
        cachedFullAuth = null;
      }
      }),
      {
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
      }
    )
  )
);

// Selectors（パフォーマンス最適化用）
export const selectUser = (state: AuthState) => state.user;
export const selectUserType = (state: AuthState) => state.userType;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectSession = (state: AuthState) => state.session;
export const selectInitialized = (state: AuthState) => state.initialized;
export const selectFetchUserSession = (state: AuthState) => state.fetchUserSession;

// キャッシュされたセレクター関数（安定した参照を保つ）
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedAuthData: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedAuthActions: any = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedFullAuth: any = null;

const selectAuthData = (state: AuthState) => {
  const newData = {
    user: state.user,
    userType: state.userType,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    session: state.session,
    initialized: state.initialized,
  };
  
  // 浅い比較でキャッシュの有効性をチェック
  if (!cachedAuthData || 
      cachedAuthData.user !== newData.user ||
      cachedAuthData.userType !== newData.userType ||
      cachedAuthData.isLoading !== newData.isLoading ||
      cachedAuthData.isAuthenticated !== newData.isAuthenticated ||
      cachedAuthData.session !== newData.session ||
      cachedAuthData.initialized !== newData.initialized) {
    cachedAuthData = newData;
    cachedFullAuth = null; // フルオブジェクトのキャッシュを無効化
  }
  
  return cachedAuthData;
};

const selectAuthActions = (state: AuthState) => {
  const newActions = {
    refreshAuth: state.refreshAuth,
    logout: state.logout,
    fetchUserSession: state.fetchUserSession,
  };
  
  // アクションの参照が変わった場合のみ新しいオブジェクトを作成
  if (!cachedAuthActions ||
      cachedAuthActions.refreshAuth !== newActions.refreshAuth ||
      cachedAuthActions.logout !== newActions.logout ||
      cachedAuthActions.fetchUserSession !== newActions.fetchUserSession) {
    cachedAuthActions = newActions;
    cachedFullAuth = null; // フルオブジェクトのキャッシュを無効化
  }
  
  return cachedAuthActions;
};

const selectFullAuth = (state: AuthState) => {
  if (!cachedFullAuth) {
    const authData = selectAuthData(state);
    const authActions = selectAuthActions(state);
    cachedFullAuth = {
      ...authData,
      ...authActions,
    };
  }
  return cachedFullAuth;
};

// 最適化されたHooks
export const useAuth = () => useAuthStore(selectFullAuth);

// 個別のHooks（さらなるパフォーマンス最適化用）
export const useAuthUser = () => useAuthStore(selectUser);
export const useAuthUserType = () => useAuthStore(selectUserType);
export const useAuthIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
export const useAuthIsLoading = () => useAuthStore(selectIsLoading);
export const useAuthSession = () => useAuthStore(selectSession);
export const useAuthInitialized = () => useAuthStore(selectInitialized);
export const useAuthActions = () => useAuthStore(selectAuthActions);