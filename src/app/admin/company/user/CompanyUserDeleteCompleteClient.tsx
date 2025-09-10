'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CompanyUserDeleteCompleteClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [companyId, setCompanyId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // クエリパラメータから企業IDとユーザー名を取得
    const companyIdParam = searchParams.get('companyId');
    const userNameParam = searchParams.get('userName');

    if (companyIdParam) {
      setCompanyId(companyIdParam);
    }
    if (userNameParam) {
      setUserName(decodeURIComponent(userNameParam));
    }
  }, [searchParams]);

  const handleGoToCompanyDetail = () => {
    if (companyId) {
      // 企業詳細ページに戻る際に、クエリパラメータを付けてキャッシュを無効化
      router.push(`/admin/company/${companyId}?refresh=${Date.now()}`);
    } else {
      // 企業IDがない場合は企業一覧ページに遷移
      router.push('/admin/company');
    }
  };

  const handleGoToAdminTop = () => {
    router.push('/admin');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        
        {/* 企業ユーザー名表示 */}
        <div className="text-center mb-8">
          <div className="text-base font-bold text-black mb-4">
            {userName || 'ユーザー'}
          </div>
        </div>

        {/* 完了メッセージ */}
        <div className="text-center mb-12">
          <div className="text-base font-bold text-black mb-8">
            企業グループからのユーザーの削除が完了しました。
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
          
          {/* 企業情報詳細ボタン */}
          <button
            onClick={handleGoToCompanyDetail}
            className="px-8 py-3 bg-black text-white rounded-full text-base font-bold hover:bg-gray-800 transition-colors"
          >
            企業情報詳細
          </button>
        </div>
      </div>
    </div>
  );
}
