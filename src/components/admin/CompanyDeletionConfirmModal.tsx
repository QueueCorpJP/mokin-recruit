'use client';

import React from 'react';

interface CompanyDeletionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
}

export default function CompanyDeletionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  companyName,
}: CompanyDeletionConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white border border-black rounded-2xl w-[604px] h-[284px] relative">
        {/* コンテンツ */}
        <div className="flex flex-col items-center justify-center h-full px-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              企業アカウント退会
            </h2>
            <p className="text-base font-bold text-black mb-2">
              企業アカウントを退会しますか？
            </p>
            <p className="text-base font-bold text-black mb-4">
              この操作は取り消すことができません。
            </p>
            <p className="text-base font-bold text-black">
              {companyName}
            </p>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[435px]">
            {/* キャンセルボタン */}
            <button
              onClick={onClose}
              className="flex-1 h-[51px] bg-white border border-black rounded-[35px] text-base font-bold text-black hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>

            {/* 退会処理するボタン */}
            <button
              onClick={onConfirm}
              className="flex-1 h-[51px] bg-red-600 text-white rounded-[35px] text-base font-bold hover:bg-red-700 transition-colors"
            >
              退会処理する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
