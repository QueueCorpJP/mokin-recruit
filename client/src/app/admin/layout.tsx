import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getServerAuth } from '@/lib/auth/server';
import { UserProvider } from '@/contexts/UserContext';
import { AccessRestricted } from '@/components/AccessRestricted';

// Admin コンポーネントを遅延読み込み
const AdminHeader = dynamic(
  () => import('@/components/admin/AdminHeader').then(mod => ({ default: mod.AdminHeader })),
  { 
    loading: () => <div className="h-16 bg-white border-b border-gray-200" />,
    ssr: true,
  }
);

const AdminFooter = dynamic(
  () => import('@/components/admin/AdminFooter').then(mod => ({ default: mod.AdminFooter })),
  { 
    loading: () => <div className="h-16 bg-gray-800" />,
    ssr: true,
  }
);

const AdminSidebar = dynamic(
  () => import('@/components/admin/AdminSidebar').then(mod => ({ default: mod.AdminSidebar })),
  { 
    loading: () => <div className="w-64 bg-gray-100" />,
    ssr: true,
  }
);

const AdminBreadcrumb = dynamic(
  () => import('@/components/admin/AdminBreadcrumb').then(mod => ({ default: mod.AdminBreadcrumb })),
  { 
    loading: () => <div className="h-8 bg-gray-50" />,
    ssr: true,
  }
);

const AdminPageTitle = dynamic(
  () => import('@/components/admin/AdminPageTitle').then(mod => ({ default: mod.AdminPageTitle })),
  { 
    loading: () => <div className="h-12 bg-white" />,
    ssr: true,
  }
);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認
  const auth = await getServerAuth();

  // 認証されていない場合
  if (!auth.isAuthenticated) {
    return <AccessRestricted userType="admin" />;
  }

  // 管理者でない場合は候補者ページへリダイレクト
  if (auth.userType !== 'admin') {
    redirect('/candidate');
  }

  // UserContext用のユーザー情報
  const contextUser = {
    id: auth.user!.id,
    email: auth.user!.email || '',
    role: 'admin' as const,
    profile: auth.user!
  };

  return (
    <UserProvider user={contextUser}>
    <div className='min-h-screen flex flex-col'>
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
        <AdminHeader />
      </Suspense>
      <div className='flex'>
        <Suspense fallback={<div className="w-64 bg-gray-100" />}>
          <AdminSidebar />
        </Suspense>
        <main className='flex-1 p-6 bg-[#F9F9F9] overflow-x-hidden min-w-0'>
          <Suspense fallback={<div className="h-8 bg-gray-50" />}>
            <AdminBreadcrumb />
          </Suspense>
          <div className='p-4 overflow-x-hidden min-w-0'>
            <Suspense fallback={<div className="h-12 bg-white" />}>
              <AdminPageTitle />
            </Suspense>
            {children}
          </div>
        </main>
      </div>
      <Suspense fallback={<div className="h-16 bg-gray-800" />}>
        <AdminFooter />
      </Suspense>
    </div>
    </UserProvider>
  );
}
