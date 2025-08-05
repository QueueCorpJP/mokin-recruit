'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AccessRestrictedProps {
  userType: 'candidate' | 'company';
  message?: string;
}

export function AccessRestricted({ userType, message }: AccessRestrictedProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const loginPath = userType === 'candidate' 
    ? '/candidate/auth/login' 
    : '/company/auth/login';

  const defaultMessage = userType === 'candidate'
    ? 'このページにアクセスするには候補者としてログインが必要です。'
    : 'このページにアクセスするには企業ユーザーとしてログインが必要です。';

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div 
        className={`max-w-md w-full transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
        }`}
      >
        <div className="relative">
          {/* 背景の装飾アニメーション */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-[#0F9058]/10 to-[#26af94]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-[#3a93cb]/10 to-[#26af94]/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          </div>

          {/* アイコンアニメーション */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#0F9058]/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#0F9058] to-[#26af94] rounded-full p-4">
                <svg
                  className="w-12 h-12 text-white animate-lock-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* メッセージ */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fade-in-up animation-delay-200">
              アクセス制限
            </h2>
            <p className="text-gray-600 mb-8 animate-fade-in-up animation-delay-400">
              {message || defaultMessage}
            </p>

            {/* ログインボタン */}
            <Link
              href={loginPath}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0F9058] to-[#26af94] text-white font-medium rounded-full transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600"
            >
              ログインページへ
              <svg
                className="ml-2 w-5 h-5 animate-arrow-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* 追加のリンク */}
            <div className="mt-6 animate-fade-in-up animation-delay-800">
              <p className="text-sm text-gray-500">
                アカウントをお持ちでない方は
                <Link 
                  href={userType === 'candidate' ? '/candidate/auth/register' : '/company/auth/register'}
                  className="ml-1 text-[#0F9058] hover:text-[#26af94] transition-colors duration-200 underline"
                >
                  新規登録
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes lock-bounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-2px) rotate(-2deg);
          }
          75% {
            transform: translateY(2px) rotate(2deg);
          }
        }

        @keyframes arrow-bounce {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-lock-bounce {
          animation: lock-bounce 2s ease-in-out infinite;
        }

        .animate-arrow-bounce {
          animation: arrow-bounce 1.5s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}