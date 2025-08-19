import React from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminFooter } from '@/components/admin/AdminFooter';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-[#F9F9F9]">
          <AdminBreadcrumb />
          <div className="p-4">
            <AdminPageTitle />
            {children}
          </div>
        </main>
      </div>
      <AdminFooter />
    </div>
  );
}