'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';

export default function CompanyJobLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    companyName?: string;
    userName?: string;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // localStorage からトークンを確認
      const token = localStorage.getItem('auth-token') || localStorage.getItem('auth_token');
      
      if (!token) {
        setIsLoggedIn(false);
        setLoading(false);
        // 未ログインの場合は企業ログインページにリダイレクト
        router.push('/company/auth/login');
        return;
      }

      // セッション API でトークンを検証
      const response = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setIsLoggedIn(true);
          setUserInfo({
            companyName: data.user.name || '企業名',
            userName: data.user.email || 'ユーザー名',
          });
        } else {
          setIsLoggedIn(false);
          // 無効なトークンは削除
          localStorage.removeItem('auth-token');
          localStorage.removeItem('auth_token');
          // 企業ログインページにリダイレクト
          router.push('/company/auth/login');
        }
      } else {
        setIsLoggedIn(false);
        // 無効なトークンは削除
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth_token');
        // 企業ログインページにリダイレクト
        router.push('/company/auth/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
      // エラーの場合も企業ログインページにリダイレクト
      router.push('/company/auth/login');
    } finally {
      setLoading(false);
    }
  };

  // ローディング中は何も表示しない（またはローディング画面）
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-600'>読み込み中...</div>
      </div>
    );
  }

  // 未ログインの場合はリダイレクト処理中なので何も表示しない
  if (!isLoggedIn) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-gray-600'>ログインページに移動しています...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Navigation 
        variant='company' 
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
      />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
