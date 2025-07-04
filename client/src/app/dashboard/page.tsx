import { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AuthStatus } from '@/components/dashboard/AuthStatus';

export const metadata: Metadata = {
  title: 'ダッシュボード | CuePoint',
  description: 'CuePointのダッシュボード',
};

export default function DashboardPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* ヘッダー - クライアントコンポーネント */}
      <Suspense
        fallback={
          <div className='h-16 bg-white border-b border-gray-200 animate-pulse' />
        }
      >
        <DashboardHeader />
      </Suspense>

      {/* メインコンテンツ - サーバーコンポーネント */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='border-4 border-dashed border-gray-200 rounded-lg p-8'>
            <div className='text-center'>
              <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4'>
                <svg
                  className='h-8 w-8 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                ログイン成功！
              </h2>
              <p className='text-gray-600 mb-6'>
                CuePointへようこそ。ダッシュボードにアクセスできました。
              </p>

              {/* 認証情報表示 - クライアントコンポーネント */}
              <Suspense
                fallback={
                  <div className='bg-gray-100 rounded-lg p-4 mb-6 animate-pulse'>
                    <div className='h-4 bg-gray-300 rounded w-1/4 mb-2'></div>
                    <div className='h-3 bg-gray-300 rounded w-1/2 mb-1'></div>
                    <div className='h-3 bg-gray-300 rounded w-1/3'></div>
                  </div>
                }
              >
                <AuthStatus />
              </Suspense>

              {/* 次のステップ - 静的コンテンツ（サーバーコンポーネント） */}
              <div className='bg-blue-50 rounded-lg p-4'>
                <h3 className='text-lg font-medium text-blue-900 mb-2'>
                  次のステップ
                </h3>
                <ul className='text-sm text-blue-800 text-left space-y-1'>
                  <li>• プロフィール設定</li>
                  <li>• 求人検索機能</li>
                  <li>• メッセージ機能</li>
                  <li>• 応募管理</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
