import { Suspense } from 'react';
import { CompanyNavigationWrapper } from '@/components/layout/CompanyNavigationWrapper';
import { CompanyFooterWrapper } from '@/components/layout/CompanyFooterWrapper';

// 静的レンダリングを許可（認証不要のため）
export const dynamic = 'force-static';

export default async function ContactCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 静的ページなので認証なし状態
  const initialAuth = {
    isAuthenticated: false,
    user: null,
    userType: null
  };

  return (
    <>
      {/* ナビゲーションを先行表示（認証なし） */}
      <CompanyNavigationWrapper
        isLoggedIn={false}
        userInfo={undefined}
      />
      
      {/* メインコンテンツ */}
      <Suspense
        fallback={
          <div className="min-h-screen bg-white">
            <div className="animate-pulse bg-gray-100 h-4 w-full" />
            <div className="min-h-[200px] bg-[#323232]" />
          </div>
        }
      >
        {children}
      </Suspense>
      
      {/* フッターを先行表示（認証なし） */}
      <CompanyFooterWrapper
        isLoggedIn={false}
        userInfo={undefined}
      />
    </>
  );
}