'use client';

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { Footer } from '@/components/ui/footer';
import { useAuthInitialized, useAuthIsLoading, useAuthIsAuthenticated, useAuthUserType } from '@/stores/authStore';

export default function CompanyJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  // 🔥 根本修正: 個別フック使用でオブジェクト返却を完全回避
  const initialized = useAuthInitialized();
  const isLoading = useAuthIsLoading();
  const isAuthenticated = useAuthIsAuthenticated();
  const userType = useAuthUserType();

  // 認証状態を計算（メモ化で再計算を抑制）
  const authState = useMemo(() => {
    const isAuthReady = initialized && !isLoading;
    const isValidAuth = isAuthenticated && userType === 'company_user';
    
    return {
      isAuthReady,
      isValidAuth,
      shouldShowLoading: !isAuthReady,
      shouldRedirect: isAuthReady && !isValidAuth
    };
  }, [initialized, isLoading, isAuthenticated, userType]);

  // 認証チェックと企業ユーザー制限
  useEffect(() => {
    if (authState.shouldRedirect) {
      console.log('🔍 CompanyJobLayout - Redirecting to login');
      router.push('/company/auth/login');
    }
  }, [authState.shouldRedirect, router]);

  // ローディング表示
  if (authState.shouldShowLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-600'>読み込み中...</div>
      </div>
    );
  }

  // リダイレクト中表示
  if (authState.shouldRedirect) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-600'>ログインページに移動しています...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
