'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function DashboardHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ実行
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    try {
      // トークンを削除
      localStorage.removeItem('auth_token');
      console.log('🔓 ログアウトしました');

      // ログインページにリダイレクト
      router.push('/auth/login');
    } catch (error) {
      console.error('❌ ログアウト処理でエラーが発生しました:', error);
      // フォールバック: window.location を使用
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-gray-900'>
              CuePoint Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-700'>
              {isLoggedIn ? 'ログイン中' : 'ログイン状態を確認中...'}
            </span>
            <button
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50'
              onClick={handleLogout}
              disabled={!isLoggedIn}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
