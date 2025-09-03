'use client';

import React from 'react';

interface CompanyUserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

export default function CompanyUserDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: CompanyUserDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* モーダル本体 - 他のモーダルと同じ背景 */}
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
                企業ユーザー削除
              </h2>
              <p className="text-base font-bold text-black mb-2">
                企業ユーザーを削除しますか？
              </p>
              <p className="text-base font-bold text-black">
                {userName}
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

              {/* 削除するボタン */}
              <button
                onClick={onConfirm}
                className="flex-1 h-[51px] bg-black text-white rounded-[35px] text-base font-bold hover:bg-gray-800 transition-colors"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
