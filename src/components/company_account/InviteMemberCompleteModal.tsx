'use client';

import React from 'react';
import { Modal } from '../ui/mo-dal';

interface InviteMemberCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberCompleteModal({
  isOpen,
  onClose,
}: InviteMemberCompleteModalProps) {
  return (
    <Modal
      title="グループへのメンバー招待"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="閉じる"
      onPrimaryAction={onClose}
      width="760px"
      height="auto"
      hideFooter={false}
    >
      <div className="flex flex-col items-center w-full justify-center py-10 min-h-[200px]">
        <p className="text-base font-bold text-[#323232] text-center leading-relaxed">
          入力したアドレス宛に、グループへの招待メールが送信されました。<br />
          メール内のリンクから、グループへご参加いただけます。
        </p>
      </div>
    </Modal>
  );
}


