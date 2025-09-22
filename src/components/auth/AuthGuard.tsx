'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isSignupInProgressClient } from '@/lib/auth/signup-check-client';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  fallback = null,
  redirectTo = '/candidate/auth/login',
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const signupInProgress = isSignupInProgressClient();

      // サインアップ途中またはログインしていない場合はリダイレクト
      if (!user || signupInProgress) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, loading, router, redirectTo]);

  // ローディング中またはサインアップ途中の場合はfallbackを表示
  if (loading) {
    return (
      fallback || (
        <div className='min-h-screen bg-white'>
          <div className='h-[80px] bg-white border-b border-gray-200' />
          <div className='animate-pulse bg-gray-100 h-4 w-full' />
        </div>
      )
    );
  }

  const signupInProgress = isSignupInProgressClient();

  // 認証されていない、またはサインアップ途中の場合はfallbackを表示
  if (!user || signupInProgress) {
    return fallback || null;
  }

  return <>{children}</>;
}
