'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function CompanyGroupDeleteCompleteClient() {
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
        
        {/* 企業グループ名表示 */}
        <div className="text-center mb-8">
          <div className="text-base font-bold text-black mb-4">
            企業グループ名を表示企業グループ名を表示
          </div>
        </div>

        {/* 完了メッセージ */}
        <div className="text-center mb-12">
          <div className="text-base font-bold text-black mb-8">
            企業グループの削除が完了しました。
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex justify-center gap-6">
          {/* 企業情報詳細に戻るボタン */}
          <button
            onClick={handleGoToCompanyDetail}
            className="px-8 py-3 bg-white border border-black rounded-full text-base font-bold text-black hover:bg-gray-50 transition-colors"
          >
            企業情報詳細に戻る
          </button>
          
          {/* 管理画面トップに戻るボタン */}
          <button
            onClick={handleGoToAdminTop}
            className="px-8 py-3 bg-black text-white rounded-full text-base font-bold hover:bg-gray-800 transition-colors"
          >
            管理画面トップに戻る
          </button>
        </div>
      </div>
    </div>
  );
}
