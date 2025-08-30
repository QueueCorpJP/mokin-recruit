import { ReactNode } from 'react';
import PageHeader from './PageHeader';

interface PageLayoutProps {
  breadcrumb: string;
  title: string;
  children: ReactNode;
}

export default function PageLayout({ breadcrumb, title, children }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen isolate">
      {/* メインコンテンツ */}
      <main className="flex-1 relative z-[2]">
        {/* ヘッダー部分 */}
        <PageHeader breadcrumb={breadcrumb} title={title} />

        {/* コンテンツ部分 */}
        <div className="bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]">
          {children}
        </div>
      </main>
    </div>
  );
}