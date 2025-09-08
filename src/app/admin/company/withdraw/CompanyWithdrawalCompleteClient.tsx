'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';

export default function CompanyWithdrawalCompleteClient() {
  const router = useRouter();

  const handleGoToCompanyList = () => {
    router.push('/admin/company');
  };

  const handleGoToAdminTop = () => {
    router.push('/admin');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        
        {/* 完了メッセージ */}
        <div className="text-center mb-12">
          <div className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] mb-8">
            企業アカウントの退会が完了しました。
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex justify-center gap-6">
          {/* 管理画面トップボタン */}
          <AdminButton
            onClick={handleGoToAdminTop}
            text="管理画面トップ"
            variant="green-outline"
          />
          
          <AdminButton
            onClick={handleGoToCompanyList}
            text="企業一覧"
            variant="green-gradient"
          />
        </div>
      </div>
    </div>
  );
}