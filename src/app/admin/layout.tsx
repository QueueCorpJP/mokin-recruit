import React from 'react';
import { redirect } from 'next/navigation';
import { AdminLayoutClient } from './AdminLayoutClient';

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
    <AdminLayoutClient contextUser={contextUser}>
      {children}
    </AdminLayoutClient>
  );
}
