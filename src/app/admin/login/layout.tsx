import React from 'react';

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ログインページは認証チェックをバイパス
  return <div className='min-h-screen bg-gray-50'>{children}</div>;
}
