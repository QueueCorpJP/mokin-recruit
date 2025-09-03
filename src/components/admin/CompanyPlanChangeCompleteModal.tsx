'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyPlanChangeCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  newPlan: string;
}

export default function CompanyPlanChangeCompleteModal({
  isOpen,
  onClose,
  companyName,
  newPlan,
}: CompanyPlanChangeCompleteModalProps) {
  const router = useRouter();

  const handleGoToCompanyDetail = () => {
    // 現在の企業詳細ページに留まる
    onClose();
  };

  const handleGoToAdminTop = () => {
    router.push('/admin');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="bg-white border border-black rounded-2xl"
        style={{
          width: '564px',
          padding: '26px 170px',
          borderRadius: '16px'
        }}
      >
        {/* メインコンテンツ */}
        <div className="flex flex-col items-center gap-8">
          {/* タイトル */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              プラン変更完了
            </h2>
            <p className="text-base font-bold text-black mb-2">
              {companyName}
            </p>
            <p className="text-base font-bold text-black">
              プラン変更が完了しました。
            </p>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4">
            {/* 企業ページに戻るボタン */}
            <button
              onClick={handleGoToCompanyDetail}
              className="px-10 py-3.5 border border-black text-black text-base font-bold hover:bg-gray-50 transition-colors"
              style={{ borderRadius: '35px' }}
            >
              企業ページに戻る
            </button>

            {/* 管理画面トップに戻るボタン */}
            <button
              onClick={handleGoToAdminTop}
              className="w-[196px] h-[51px] bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors"
              style={{ borderRadius: '35px' }}
            >
              管理画面トップに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
