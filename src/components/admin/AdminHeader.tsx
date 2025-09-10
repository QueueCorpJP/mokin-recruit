'use client';

import React from 'react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { adminLogoutAction } from '@/app/admin/auth/logout/actions';

export const AdminHeader: React.FC = () => {
  const handleLogout = async () => {
    try {
      await adminLogoutAction();
    } catch (error) {
      console.error('Logout error:', error);
      // エラーが発生してもログインページにリダイレクト
      window.location.href = '/admin/login';
    }
  };

  return (
    <header className="w-full border-b border-[#E5E5E5] bg-white" style={{ height: '80px' }}>
      <div className="w-full flex justify-center">
        <div className="flex items-center h-[80px] w-full px-[40px] justify-between">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Logo className="w-[32px] h-auto md:w-[180px] md:h-[32px]" />
          </div>
          
          {/* ログアウトボタン */}
          <div className="flex items-center">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-sm px-4 py-2 border-gray-300 hover:bg-gray-50"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};