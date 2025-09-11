'use client';

import React from 'react';
import { Modal } from '../ui/mo-dal';

interface MemberPermissionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  memberName: string;
  newPermission: string;
}

export function MemberPermissionChangeModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  memberName,
  newPermission 
}: MemberPermissionChangeModalProps) {
  return (
    <Modal
      title="メンバーの権限変更"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="変更"
      onPrimaryAction={onConfirm}
      secondaryButtonText="キャンセル"
      onSecondaryAction={onClose}
      width="640px"
      height="auto"
    >
      <div className="flex flex-col items-center gap-6 py-10 min-h-[240px] justify-center">
        {/* メインメッセージ */}
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="font-['Noto_Sans_JP'] text-[18px] font-medium leading-[1.6] tracking-[1.8px] text-[#323232] text-center w-full">
            <p className="mb-0">メンバーの権限を変更してよろしいですか？</p>
          </div>
        </div>

        {/* ユーザー名と権限名 */}
        <div className="font-['Noto_Sans_JP'] text-[18px] font-medium leading-[1.6] tracking-[1.8px] text-[#0f9058] text-center w-full">
          {memberName} | {newPermission}
        </div>
      </div>
    </Modal>
  );
}