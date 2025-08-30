'use client';

import React, { Suspense } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';

interface AdminLayoutClientProps {
  children: React.ReactNode;
  contextUser: {
    id: string;
    email: string;
    role: 'admin';
    profile: any;
  };
}

export function AdminLayoutClient({ children, contextUser }: AdminLayoutClientProps) {
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