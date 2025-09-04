'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyDeletionCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export default function CompanyDeletionCompleteModal({
  isOpen,
  onClose,
  companyName,
}: CompanyDeletionCompleteModalProps) {
  const router = useRouter();

  const handleGoToCompanyList = () => {
    onClose();
    router.push('/admin/company');
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
              企業アカウント退会完了
            </h2>
            <p className="text-base font-bold text-black mb-2">
              {companyName}
            </p>
            <p className="text-base font-bold text-black">
              企業の退会が完了しました。
            </p>
            <p className="text-sm font-medium text-gray-600 mt-2">
              ※ この操作は取り消すことができません
            </p>
          </div>

          {/* ボタン */}
          <button
            onClick={handleGoToCompanyList}
            className="w-[196px] h-[51px] bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors"
            style={{ borderRadius: '35px' }}
          >
            企業一覧に戻る
          </button>
        </div>
      </div>
    </div>
  );
}
