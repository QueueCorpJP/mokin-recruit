'use client';

import React from 'react';
import { Logo } from '@/components/ui/logo';

export const AdminHeader: React.FC = () => {
  return (
    <header className="w-full border-b border-[#E5E5E5] bg-white" style={{ height: '80px' }}>
      <div className="w-full flex justify-center">
        <div className="flex items-center h-[80px] w-full px-[40px] justify-between">
          {/* ロゴのみ */}
          <div className="flex-shrink-0">
            <Logo className="w-[32px] h-auto md:w-[180px] md:h-[32px]" />
          </div>
        </div>
      </div>
    </header>
  );
};