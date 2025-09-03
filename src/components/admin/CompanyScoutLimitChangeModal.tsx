'use client';

import React, { useState } from 'react';

interface CompanyScoutLimitChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newLimit: number) => void;
  currentLimit: number;
}

export default function CompanyScoutLimitChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentLimit,
}: CompanyScoutLimitChangeModalProps) {
  const [newLimit, setNewLimit] = useState(currentLimit.toString());

  const handleConfirm = () => {
    const limit = parseInt(newLimit, 10);

    if (isNaN(limit) || limit < 0) {
      alert('正しい数値を入力してください');
      return;
    }

    if (limit === currentLimit) {
      alert('上限数が変更されていません');
      return;
    }

    onConfirm(limit);
    handleClose();
  };

  const handleClose = () => {
    setNewLimit(currentLimit.toString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white border border-black rounded-2xl w-[604px] h-[359px] relative">
        {/* コンテンツ */}
        <div className="flex flex-col items-center justify-center h-full px-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              スカウト上限数変更
            </h2>
            <p className="text-base font-bold text-black">
              現在のスカウト上限数: {currentLimit}件
            </p>
          </div>

          {/* スカウト上限数入力 */}
          <div className="mb-16">
            <div className="flex items-center gap-3">
              <label className="text-base font-bold text-black">
                新しい上限数
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  min="0"
                  className="w-24 px-3 py-3 bg-white border border-black text-base font-bold text-black text-center outline-none"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
                <span className="text-base font-bold text-black">件</span>
              </div>
            </div>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[435px]">
            {/* キャンセルボタン */}
            <button
              onClick={handleClose}
              className="flex-1 h-[51px] bg-white border border-black rounded-[35px] text-base font-bold text-black hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>

            {/* 更新するボタン */}
            <button
              onClick={handleConfirm}
              className="flex-1 h-[51px] bg-black text-white rounded-[35px] text-base font-bold hover:bg-gray-800 transition-colors"
            >
              更新する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
