'use client';

import React from 'react';
import { AdminButton } from './AdminButton';

interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "削除する",
  cancelText = "閉じる"
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div 
        className="bg-white border border-[#323232] flex flex-col"
        style={{
          width: '604px',
          height: 'auto',
          borderRadius: '16px',
          padding: '80px'
        }}
      >
        {/* タイトル */}
        <div className="text-center mb-6">
          <h2 className="font-['Inter'] font-bold text-[24px] text-[#323232] leading-[1.6]">
            {title}
          </h2>
        </div>

        {/* 説明文 */}
        <div className="text-center mb-8">
          <p className="font-['Inter'] text-[16px] text-[#323232] leading-[1.6] font-bold">
            {description}
          </p>
        </div>

        {/* ボタン */}
        <div className="flex gap-4 justify-center">
          <AdminButton
            onClick={onClose}
            text={cancelText}
            variant="green-outline"
            className="w-[180px]"
          />
          <AdminButton
            onClick={onConfirm}
            text={confirmText}
            variant="destructive"
            className="w-[180px]"
          />
        </div>
      </div>
    </div>
  );
};