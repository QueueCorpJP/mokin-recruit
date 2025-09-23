import React from 'react';
import { AdminLayoutClient } from './AdminLayoutClient';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証チェックは各ページで個別に行う
  // ログインページで無限リダイレクトを防ぐため
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
