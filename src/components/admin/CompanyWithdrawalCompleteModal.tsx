'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyWithdrawalCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId?: string;
}

export default function CompanyWithdrawalCompleteModal({
  isOpen,
  onClose,
  companyName,
  companyId,
}: CompanyWithdrawalCompleteModalProps) {
  const router = useRouter();

  const handleGoToCompanyDetail = () => {
    onClose();
    // 休会完了後に企業詳細ページに戻る（休会状態を確認するため）
    setTimeout(() => {
      if (companyId) {
        const refreshUrl = `/admin/company/${companyId}?refresh=${Date.now()}`;
        window.location.href = refreshUrl;
      } else {
        router.push('/admin/company');
      }
    }, 150);
  };

  const handleGoToAdminTop = () => {
    onClose();
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
          padding: '26px 170px',
          borderRadius: '16px'
        }}
      >
        {/* メインコンテンツ */}
        <div className="flex flex-col items-center gap-8">
          {/* タイトル */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              企業アカウント休会完了
            </h2>
            <p className="text-base font-bold text-black mb-2">
              {companyName}
            </p>
            <p className="text-base font-bold text-black">
              企業の休会が完了しました。
            </p>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[500px] justify-center">
            {/* 企業詳細に戻るボタン */}
            <button
              onClick={handleGoToCompanyDetail}
              className="flex-1 min-w-[180px] h-[51px] px-8 py-4 bg-white border border-black rounded-full text-base font-bold text-black hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              企業詳細に戻る
            </button>

            {/* 管理画面トップに戻るボタン */}
            <button
              onClick={handleGoToAdminTop}
              className="flex-1 min-w-[180px] h-[51px] px-8 py-4 bg-black text-white rounded-full text-base font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              管理画面トップに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
