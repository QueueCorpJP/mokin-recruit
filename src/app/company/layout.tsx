import { Suspense } from 'react';
import CompanyLayoutClient from './CompanyLayoutClient';
import { getServerAuth } from '@/lib/auth/server';
import { CompanyNavigationWrapper } from '@/components/layout/CompanyNavigationWrapper';
import { CompanyFooterWrapper } from '@/components/layout/CompanyFooterWrapper';

export const dynamic = 'force-dynamic';

export default async function CompanyLayout({
  children,
  candidateDetailModal, // 追加: slot for parallel route
}: {
  children: React.ReactNode;
  candidateDetailModal?: React.ReactNode; // 追加
}) {
  // サーバーサイドで初期認証状態を確定
  const initialAuth = await getServerAuth();

  // 初期認証情報からナビゲーション・フッター用の情報を作成
  const userInfo =
    initialAuth.isAuthenticated && initialAuth.user
      ? {
          name: initialAuth.user.name || initialAuth.user.email || '',
          email: initialAuth.user.email || '',
          userType: initialAuth.user.userType,
        }
      : undefined;

  return (
    <div className="company-layout" data-company-section>
      {/* ナビゲーションを先行表示 */}
      <CompanyNavigationWrapper
        isLoggedIn={initialAuth.isAuthenticated}
        userInfo={userInfo}
      />

      {/* メインコンテンツ */}
      <Suspense
        fallback={
          <div className='min-h-screen bg-white'>
            <div className='animate-pulse bg-gray-100 h-4 w-full' />
            <div className='min-h-[200px] bg-[#323232]' />
          </div>
        }
      >
        <CompanyLayoutClient initialAuth={initialAuth}>
          {children}
          {/* ここでモーダルslotを描画 */}
          {candidateDetailModal}
        </CompanyLayoutClient>
      </Suspense>

      {/* フッターを先行表示 */}
      <CompanyFooterWrapper
        isLoggedIn={initialAuth.isAuthenticated}
        userInfo={userInfo}
      />
    </div>
  );
}
