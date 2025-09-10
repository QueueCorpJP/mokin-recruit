'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { Button } from '@/components/ui/button';

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

  return (
    <Modal
      title="スカウト上限数変更"
      isOpen={isOpen}
      onClose={handleClose}
      width="604px"
      height="359px"
      hideFooter={true}
    >
      <div className="flex flex-col items-center justify-center w-full h-full space-y-8">
        {/* 現在の上限数表示 */}
        <div className="text-center">
          <p className="text-base font-bold text-[#323232]">
            現在のスカウト上限数: {currentLimit}件
          </p>
        </div>

        {/* スカウト上限数入力 */}
        <div className="flex items-center gap-3">
          <label className="text-base font-bold text-[#323232]">
            新しい上限数
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              min="0"
              className="w-24 px-3 py-3 bg-white border border-[#999999] rounded-[8px] text-base font-bold text-[#323232] text-center outline-none focus:border-[#4FC3A1] focus:shadow-[0_0_0_2px_rgba(79,195,161,0.2)] transition-all duration-200"
              style={{ 
                fontFamily: '"Noto Sans JP", sans-serif',
                height: '50px'
              }}
            />
            <span className="text-base font-bold text-[#323232]">件</span>
          </div>
        </div>

        {/* ボタン群 */}
        <div className="flex gap-4 w-full max-w-[435px]">
          <Button
            variant="outline"
            size="figma-default"
            onClick={handleClose}
            className="flex-1 h-[51px] border-[#323232] text-[#323232] rounded-[35px] hover:bg-gray-50"
          >
            キャンセル
          </Button>
          <Button
            variant="green-gradient"
            size="figma-default"
            onClick={handleConfirm}
            className="flex-1 h-[51px]"
          >
            更新する
          </Button>
        </div>
      </div>
    </Modal>
  );
}
