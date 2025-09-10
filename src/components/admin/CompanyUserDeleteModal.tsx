'use client';

import React from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { Button } from '@/components/ui/button';

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
  return (
    <Modal
      title="企業ユーザー削除"
      isOpen={isOpen}
      onClose={onClose}
      width="604px"
      height="284px"
      hideFooter={true}
    >
      <div className="flex flex-col items-center justify-center w-full h-full space-y-8">
        {/* 確認メッセージ */}
        <div className="text-center space-y-2">
          <p className="text-base font-bold text-[#323232]">
            企業ユーザーを削除しますか？
          </p>
          <p className="text-base font-bold text-[#323232]">
            {userName}
          </p>
        </div>

        {/* ボタン群 */}
        <div className="flex gap-4 w-full max-w-[435px]">
          <Button
            variant="outline"
            size="figma-default"
            onClick={onClose}
            className="flex-1 h-[51px] border-[#323232] text-[#323232] rounded-[35px] hover:bg-gray-50"
          >
            キャンセル
          </Button>
          <Button
            variant="green-gradient"
            size="figma-default"
            onClick={onConfirm}
            className="flex-1 h-[51px]"
          >
            削除する
          </Button>
        </div>
      </div>
    </Modal>
  );
}
