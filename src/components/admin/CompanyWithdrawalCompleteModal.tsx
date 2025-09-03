'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyWithdrawalCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export default function CompanyWithdrawalCompleteModal({
  isOpen,
  onClose,
  companyName,
}: CompanyWithdrawalCompleteModalProps) {
  const router = useRouter();

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

          {/* ボタン */}
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
  );
}
