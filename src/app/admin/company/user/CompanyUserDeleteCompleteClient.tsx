'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';

export default function CompanyUserDeleteCompleteClient() {
  const router = useRouter();

  const handleGoToCompanyDetail = () => {
    // TODO: 実際の企業IDを取得して遷移
    // 現在はダミーIDを使用
    router.push('/admin/company/debug-company');
  };

  const handleGoToAdminTop = () => {
    router.push('/admin');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        
        {/* 企業ユーザー名表示 */}
        <div className="text-center mb-8">
          <div className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] mb-4">
            企業ユーザー名を表示企業ユーザー名を表示
          </div>
        </div>

        {/* 完了メッセージ */}
        <div className="text-center mb-12">
          <div className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] mb-8">
            企業ユーザーの削除が完了しました。
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
            onClick={handleGoToCompanyDetail}
            text="企業情報詳細"
            variant="green-gradient"
          />
        </div>
      </div>
    </div>
  );
}