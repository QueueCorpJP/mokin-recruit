'use client';

import React from 'react';
import { Modal } from '../ui/mo-dal';

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
}

export function DeleteMemberModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  memberName 
}: DeleteMemberModalProps) {
  return (
    <Modal
      title="メンバー削除"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="削除"
      onPrimaryAction={onConfirm}
      secondaryButtonText="キャンセル"
      onSecondaryAction={onClose}
      width="640px"
      height="auto"
    >
      <div className="flex flex-col items-center gap-6 py-10 min-h-[240px] justify-center w-full">
        {/* メインメッセージ */}
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <div className="font-['Noto_Sans_JP'] text-[18px] font-medium leading-[1.6] tracking-[1.8px] text-[#323232] text-center justify-center items-center w-full">
            <p className="mb-0">このメンバーをグループから削除しますか？</p>
            <p className="mb-0">削除後は、グループ内の求人・候補者情報に</p>
            <p className="mb-0">一切アクセスできなくなります。</p>
          </div>
        </div>

        {/* ユーザー名 */}
        <div className="font-['Noto_Sans_JP'] text-[18px] font-medium leading-[1.6] tracking-[1.8px] text-[#0f9058] text-center w-full">
          {memberName}
        </div>
      </div>
    </Modal>
  );
}