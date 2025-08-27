import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { UserProvider } from '@/contexts/UserContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで認証状態を確認
  // const auth = await getServerAuth();

  // 認証されていない場合
  // if (!auth.isAuthenticated) {
  //   return <AccessRestricted userType="admin" />;
  // }

  // 管理者でない場合は候補者ページへリダイレクト
  // if (auth.userType !== 'admin') {
  //   redirect('/candidate');
  // }

  // UserContext用のユーザー情報
  const contextUser = {
    id: 'dummy-admin-id',
    email: 'admin@example.com',
    role: 'admin' as const,
    profile: { id: 'dummy-admin-id', email: 'admin@example.com' }
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
