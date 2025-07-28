'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // URLフラグメントをチェックしてパスワードリセットトークンを処理
    const handlePasswordResetToken = () => {
      const hash = window.location.hash;
      if (hash.includes('access_token=')) {
        try {
          // URLフラグメントからパラメータを解析
          const hashParams = new URLSearchParams(hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          const tokenType = hashParams.get('token_type');
          
          if (accessToken) {
            // トークンをセッションストレージに保存
            sessionStorage.setItem('reset_access_token', accessToken);
            if (refreshToken) {
              sessionStorage.setItem('reset_refresh_token', refreshToken);
            }
            if (tokenType) {
              sessionStorage.setItem('reset_token_type', tokenType);
            }
            
            // URLを整理してパスワード変更画面にリダイレクト
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // ユーザータイプを決定（デフォルトは candidate）
            // TODO: 将来的にはメールから送信されたリンクにユーザータイプ情報を含める可能性がある
            router.push('/auth/reset-password/new?userType=candidate');
          }
        } catch (error) {
          console.error('パスワードリセットトークンの処理中にエラーが発生しました:', error);
        }
      }
    };

    handlePasswordResetToken();
  }, [router]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden'>
      {/* 背景アニメーション */}
      <div className='absolute inset-0'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gray-200/30 rounded-full blur-3xl animate-slow-pulse'></div>
        <div className='absolute top-1/3 right-1/4 w-80 h-80 bg-gray-300/30 rounded-full blur-3xl animate-slow-pulse animation-delay-1000'></div>
        <div className='absolute bottom-1/4 left-1/3 w-72 h-72 bg-gray-100/40 rounded-full blur-3xl animate-slow-pulse animation-delay-2000'></div>
      </div>
      
      {/* 動く線のアニメーション */}
      <div className='absolute inset-0'>
        <div className='absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300/40 to-transparent animate-slow-scan'></div>
        <div className='absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-gray-300/40 to-transparent animate-slow-scan-reverse'></div>
      </div>

      <div className='flex flex-col items-center z-10'>
        <h1 className='text-7xl font-light text-gray-800 mb-6 tracking-wider animate-subtle-glow mb-22'>
          トップ画面は開発中です
        </h1>
        <div className='flex items-center space-x-2 mb-12'>
          <div className='w-2 h-2 bg-gray-800 rounded-full animate-loading-scale'></div>
          <div className='w-2 h-2 bg-gray-800 rounded-full animate-loading-scale animation-delay-200'></div>
          <div className='w-2 h-2 bg-gray-800 rounded-full animate-loading-scale animation-delay-400'></div>
        </div>
        <Link
          href='/candidate'
          className='group relative px-8 py-4 bg-transparent rounded-full border border-gray-300 text-gray-700 font-light tracking-wide hover:border-gray-500 hover:text-gray-900 transition-all duration-500 overflow-hidden flex items-center space-x-2'
        >
          <svg
            className='w-6 h-6 animate-spin-slow'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
            />
          </svg>
          <span className='relative z-10 ml-4'>候補者LPへ遷移する</span>
          <div className='absolute inset-0 bg-gray-100/20 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-500'></div>
        </Link>
      </div>

      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
          50% { text-shadow: 0 0 20px rgba(0, 0, 0, 0.15); }
        }
        @keyframes slow-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slow-scan-reverse {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes slow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes loading-scale {
          0%, 80%, 100% { transform: scale(1); }
          40% { transform: scale(1.5); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-subtle-glow {
          animation: subtle-glow 4s ease-in-out infinite;
        }
        .animate-slow-scan {
          animation: slow-scan 8s linear infinite;
        }
        .animate-slow-scan-reverse {
          animation: slow-scan-reverse 10s linear infinite;
        }
        .animate-slow-pulse {
          animation: slow-pulse 6s ease-in-out infinite;
        }
        .animate-loading-scale {
          animation: loading-scale 1.4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
