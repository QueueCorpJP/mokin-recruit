'use client';

import React from 'react';
import { AdminButton } from './AdminButton';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue: string) => void;
  title: string;
  description: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  confirmText?: string;
  cancelText?: string;
  placeholder?: string;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  inputValue,
  onInputChange,
  confirmText = "確認する",
  cancelText = "閉じる",
  placeholder = "入力してください"
}) => {
  const handleConfirm = () => {
    onConfirm(inputValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

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
        <div className="text-center mb-6 justify-start">
          <h2 className="font-['Inter'] font-bold text-[24px] text-[#323232] leading-[1.6]">
            {title}
          </h2>
        </div>

        {/* 説明文 */}
        <div className="text-center mb-6">
          <p className="font-['Inter'] text-[16px] text-[#323232] leading-[1.6] font-bold">
            {description}
          </p>
        </div>

        {/* 入力フィールド */}
        <div className="mb-8 flex justify-center items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="w-[343px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] outline-none"
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            placeholder={placeholder}
          />
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
            onClick={handleConfirm}
            text={confirmText}
            variant="green-gradient"
            className="w-[180px]"
          />
        </div>
      </div>
    </div>
  );
};