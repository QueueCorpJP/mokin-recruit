'use client';

import { useCandidateAuth } from '@/hooks/useClientAuth';
import { AuthAwareNavigationServer } from '@/components/layout/AuthAwareNavigationServer';
import { AuthAwareFooterServer } from '@/components/layout/AuthAwareFooterServer';
import { UserProvider } from '@/contexts/UserContext';
import { AccessRestricted } from '@/components/AccessRestricted';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function CandidateLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const pathname = usePathname();

  // 認証が必要なパス（候補者用）
  const protectedPaths = [
    '/candidate/mypage',
    '/candidate/message',
    '/candidate/task',
    '/candidate/account',
    '/candidate/setting',
    '/candidate/search'
  ];

  // 対象パスで未ログインならログイン画面へ。別ユーザー種別なら企業側へ退避
  useEffect(() => {
    if (loading) return;

    const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));

    // 未ログインで保護パスに来ている場合はログインへ誘導
    if (!isAuthenticated && isProtectedPath) {
      router.push('/candidate/auth/login');
      return;
    }

    // ログイン済みだが候補者ユーザーでない場合は企業側トップへ退避
    if (isAuthenticated && !candidateUser) {
      router.push('/company');
    }
  }, [loading, isAuthenticated, candidateUser, pathname, router]);

  // 認証情報を整理
  const userInfo = isAuthenticated && candidateUser ? {
    name: candidateUser.name || candidateUser.email || '',
    email: candidateUser.email || '',
    userType: candidateUser.userType
  } : undefined;

  // UserContext用のユーザー情報
  const contextUser = isAuthenticated && candidateUser ? {
    id: candidateUser.id,
    email: candidateUser.email || '',
    role: 'candidate' as const,
    profile: candidateUser
  } : null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="h-[80px] bg-white border-b border-gray-200" />
        <div className="animate-pulse bg-gray-100 h-4 w-full" />
        <div className="min-h-[200px] bg-[#323232]" />
      </div>
    );
  }

  // 認証が必要なページに未ログインでアクセスした場合のフォールバック
  const isProtectedPath = protectedPaths.some((p) => pathname.startsWith(p));
  if (isProtectedPath && !isAuthenticated) {
    return <AccessRestricted userType="candidate" />;
  }

  return (
    <UserProvider user={contextUser}>
      <AuthAwareNavigationServer 
        variant="candidate" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
      />
      {children}
      <AuthAwareFooterServer 
        variant="candidate" 
        isLoggedIn={isAuthenticated}
        userInfo={userInfo}
      />
    </UserProvider>
  );
}
