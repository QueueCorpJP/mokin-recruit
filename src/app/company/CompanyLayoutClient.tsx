'use client';

import { UserProvider } from '@/contexts/UserContext';
import { AccessRestricted } from '@/components/AccessRestricted';
import { usePathname, useRouter } from 'next/navigation';
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
  const pathname = usePathname();
  const router = useRouter();
  
  // サーバーから渡された初期認証情報を使用（クライアントサイドでのAPI呼び出しなし）
  const [authState, setAuthState] = useState({
    isAuthenticated: initialAuth.isAuthenticated,
    companyUser: initialAuth.user,
    loading: false, // サーバーサイドで既に確定済み
  });

  // 認証状態の変化を監視（ログイン・ログアウト時のみ）
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
        const userType = (user.user_metadata?.user_type || 'candidate') as 'candidate' | 'company_user' | 'admin';
        
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

  // 認証が必要なページのパス
  const protectedPaths = [
    '/company/dashboard',
    '/company/message',
    '/company/job',
    '/company/task',
    '/company/mypage'
  ];

  // 認証が必要なページでリダイレクト処理
  useEffect(() => {
    const { isAuthenticated, companyUser } = authState;
    
    if (!isAuthenticated) {
      const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
      if (isProtectedPath) {
        router.push('/company/auth/login');
      }
    }
    
    // 認証済みで企業ユーザーでない場合は候補者ページへリダイレクト
    if (isAuthenticated && companyUser?.userType !== 'company_user') {
      router.push('/candidate');
    }
  }, [authState.isAuthenticated, pathname, authState.companyUser, router]);

  const { isAuthenticated, companyUser } = authState;
  
  // 認証情報を整理
  const userInfo = isAuthenticated && companyUser ? {
    name: companyUser.name || companyUser.email || '',
    email: companyUser.email || '',
    userType: companyUser.userType
  } : undefined;

  // UserContext用のユーザー情報
  const contextUser = isAuthenticated && companyUser ? {
    id: companyUser.id,
    email: companyUser.email || '',
    role: 'company' as const,
    profile: companyUser
  } : null;

  // 認証が必要なページでアクセス制限の表示
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtectedPath && !isAuthenticated) {
    return <AccessRestricted userType="company" />;
  }

  return (
    <UserProvider user={contextUser}>
      {children}
    </UserProvider>
  );
}