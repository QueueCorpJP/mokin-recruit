'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyRegistrationCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

export default function CompanyRegistrationCompleteModal({
  isOpen,
  onClose,
  companyName,
}: CompanyRegistrationCompleteModalProps) {
  const router = useRouter();

  const handleGoToAdminTop = () => {
    router.push('/admin');
  };

  const handleAddGroup = () => {
    // TODO: 企業グループ追加ページに遷移
    router.push('/admin/company/group/new');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="bg-white border border-black rounded-2xl w-[604px] h-[255px] relative"
      >
        {/* コンテンツ */}
        <div className="flex flex-col items-center justify-center h-full px-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              新規企業の追加完了
            </h2>
            <p className="text-base font-bold text-black">
              新規企業の追加が完了しました。
            </p>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[463px]">
            {/* 企業グループを追加するボタン */}
            <button
              onClick={handleAddGroup}
              className="flex-1 h-[51px] bg-white border border-black rounded-[35px] text-base font-bold text-black hover:bg-gray-50 transition-colors"
            >
              企業グループを追加する
            </button>

            {/* 管理画面トップボタン */}
            <button
              onClick={handleGoToAdminTop}
              className="flex-1 h-[51px] bg-black text-white rounded-[35px] text-base font-bold hover:bg-gray-800 transition-colors"
            >
              管理画面トップ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
