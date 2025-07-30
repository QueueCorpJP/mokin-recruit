'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Footer } from '@/components/ui/footer';
import { useAuth } from '@/contexts/AuthContext';

export default function CompanyJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userType, isAuthenticated, isLoading, initialized } = useAuth();

  // 認証チェックと企業ユーザー制限
  useEffect(() => {
    // 初期化完了後に認証チェック
    if (initialized && !isLoading) {
      if (!isAuthenticated) {
        router.push('/company/auth/login');
        return;
      }
      
      if (userType !== 'company_user') {
        router.push('/company/auth/login');
        return;
      }
    }
  }, [initialized, isLoading, isAuthenticated, userType, router]);

  // 初期化中またはローディング中
  if (!initialized || isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-600'>読み込み中...</div>
      </div>
    );
  }

  // 未認証またはユーザータイプが不適切な場合（リダイレクト処理中）
  if (!isAuthenticated || userType !== 'company_user') {
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
