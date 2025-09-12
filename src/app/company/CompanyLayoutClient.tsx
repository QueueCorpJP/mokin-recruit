'use client';

import { UserProvider } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface InitialAuth {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    userType: 'candidate' | 'company_user' | 'admin';
    name?: string;
    emailConfirmed: boolean;
    lastSignIn?: string;
    user_metadata?: {
      user_type?: string;
      company_account_id?: string;
      company_user_id?: string;
      [key: string]: any;
    };
  } | null;
  userType: 'candidate' | 'company_user' | 'admin' | null;
}

export default function CompanyLayoutClient({
  children,
  initialAuth,
}: {
  children: React.ReactNode;
  initialAuth: InitialAuth;
}) {
  // ルート保護はmiddlewareで実施済み

  // サーバーから渡された初期認証情報を使用（クライアントサイドでのAPI呼び出しなし）
  const [authState, setAuthState] = useState({
    isAuthenticated: initialAuth.isAuthenticated,
    companyUser: initialAuth.user,
    loading: false, // サーバーサイドで既に確定済み
  });

  // 認証状態の変化を監視（ヘッダー表示のための軽量同期）
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAuthState({
          isAuthenticated: false,
          companyUser: null,
          loading: false,
        });
      } else if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        const userType = (user.user_metadata?.user_type || 'candidate') as
          | 'candidate'
          | 'company_user'
          | 'admin';

        setAuthState({
          isAuthenticated: true,
          companyUser: {
            id: user.id,
            email: user.email || '',
            userType,
            name: user.user_metadata?.full_name || user.user_metadata?.name,
            emailConfirmed: user.email_confirmed_at != null,
            lastSignIn: user.last_sign_in_at || undefined,
            user_metadata: user.user_metadata,
          },
          loading: false,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ルート保護/リダイレクトはmiddlewareへ集約済み

  const { isAuthenticated, companyUser } = authState;

  // 認証情報を整理
  const userInfo =
    isAuthenticated && companyUser
      ? {
          name: companyUser.name || companyUser.email || '',
          email: companyUser.email || '',
          userType: companyUser.userType,
        }
      : undefined;

  // UserContext用のユーザー情報
  const contextUser =
    isAuthenticated && companyUser
      ? {
          id: companyUser.id,
          email: companyUser.email || '',
          role: 'company' as const,
          profile: companyUser,
        }
      : null;

  // ページ保護表示は不要（middlewareがリダイレクト済み）

  return <UserProvider user={contextUser}>{children}</UserProvider>;
}
