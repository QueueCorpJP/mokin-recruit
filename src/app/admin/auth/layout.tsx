import React from 'react';

// 認証ページ専用レイアウト（認証チェックなし）
// 親のlayout.tsxの認証チェックをバイパスする
export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}