'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CompanyDeleteCompleteClient() {
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
          <div className="text-base font-bold text-black mb-8">
            企業アカウントの削除が完了しました。
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex justify-center gap-6">
          {/* 管理画面トップボタン */}
          <button
            onClick={handleGoToAdminTop}
            className="px-8 py-3 bg-white border border-black rounded-full text-base font-bold text-black hover:bg-gray-50 transition-colors"
          >
            管理画面トップ
          </button>
          
          {/* 企業一覧ボタン */}
          <button
            onClick={handleGoToCompanyList}
            className="px-8 py-3 bg-black text-white rounded-full text-base font-bold hover:bg-gray-800 transition-colors"
          >
            企業一覧
          </button>
        </div>
      </div>
    </div>
  );
}
