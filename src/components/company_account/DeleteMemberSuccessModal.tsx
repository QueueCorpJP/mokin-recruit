'use client';

import React from 'react';
import { Modal } from '../ui/mo-dal';

interface DeleteMemberSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteMemberSuccessModal({ 
  isOpen, 
  onClose 
}: DeleteMemberSuccessModalProps) {
  return (
    <Modal
      title="メンバー削除"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="閉じる"
      onPrimaryAction={onClose}
      width="760px"
      height="auto"
      hideFooter={false}
    >
      <div className="flex flex-col items-center w-full justify-center py-10 min-h-[240px]">
        {/* 完了メッセージ */}
        <div className="font-['Noto_Sans_JP'] text-[18px] font-medium leading-[1.6] tracking-[1.8px] text-[#323232] text-center w-full">
          メンバーをグループから削除しました。
        </div>
      </div>
    </Modal>
  );
}