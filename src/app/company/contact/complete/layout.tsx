import { Suspense } from 'react';
import { CompanyNavigationWrapper } from '@/components/layout/CompanyNavigationWrapper';
import dynamicImport from 'next/dynamic';

const CompanyFooterWrapper = dynamicImport(
  () => import('@/components/layout/CompanyFooterWrapper').then(mod => ({ default: mod.CompanyFooterWrapper })),
  {
    loading: () => <div className='min-h-[200px] bg-[#323232]' />,
  }
);

// 静的レンダリングを許可（認証不要のため）
export const dynamic = 'force-static';

export default async function ContactCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {

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