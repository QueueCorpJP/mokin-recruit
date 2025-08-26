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
  message?: string;
  variant?: 'delete' | 'approve';
}

export const AdminConfirmModal: React.FC<AdminConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "削除する",
  cancelText = "閉じる",
  message,
  variant = 'delete'
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
          padding: '40px'
        }}
      >
        {/* タイトル */}
        <div className="text-center mb-4">
          <h2 className="font-['Inter'] font-bold text-[24px] text-[#323232] leading-[1.6]">
            {title}
          </h2>
        </div>

        {/* 求人名 */}
        <div className="text-center mb-4">
          <p className="font-['Inter'] text-[16px] text-[#323232] leading-[1.6] font-bold">
            {description}
          </p>
        </div>

        {/* 説明文 */}
        <div className="text-center mb-8">
          <p className="font-['Inter'] text-[16px] text-[#323232] leading-[1.6]">
            {message || (variant === 'approve' ? '求人を承認してもよいですか？' : '求人を削除してもよいですか？')}
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
            variant={variant === 'approve' ? "green-square" : "destructive"}
            className="w-[180px]"
          />
        </div>
      </div>
    </div>
  );
};