'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyEditCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  companyId: string;
}

export default function CompanyEditCompleteModal({
  isOpen,
  onClose,
  companyName,
  companyId,
}: CompanyEditCompleteModalProps) {
  const router = useRouter();

  const handleBackToDetail = () => {
    onClose();
    // 現在のページに留まり、強制的にリフレッシュして最新データを取得
    router.push(`/admin/company/${companyId}?refresh=${Date.now()}`);
  };

  const handleBackToList = () => {
    onClose();
    router.push('/admin/company');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white border border-black rounded-2xl w-[604px] h-[320px] relative">
        {/* コンテンツ */}
        <div className="flex flex-col items-center justify-center h-full px-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              企業情報編集完了
            </h2>
            <p className="text-base font-bold text-black mb-2">
              {companyName}
            </p>
            <p className="text-base font-bold text-black">
              企業の情報編集が完了しました。
            </p>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[500px]">
            {/* 企業詳細に戻るボタン */}
            <button
              onClick={handleBackToDetail}
              className="flex-1 h-[51px] bg-white border border-black rounded-[35px] text-base font-bold text-black hover:bg-gray-50 transition-colors"
            >
              企業詳細に戻る
            </button>

            {/* 企業一覧に戻るボタン */}
            <button
              onClick={handleBackToList}
              className="flex-1 h-[51px] bg-black text-white rounded-[35px] text-base font-bold hover:bg-gray-800 transition-colors"
            >
              企業一覧に戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
