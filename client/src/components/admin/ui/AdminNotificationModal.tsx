'use client';

import React from 'react';

interface AdminNotificationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onSecondaryAction?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  secondaryText?: string;
}

export const AdminNotificationModal: React.FC<AdminNotificationModalProps> = ({
  isOpen,
  onConfirm,
  onSecondaryAction,
  title,
  description,
  confirmText = "確認",
  secondaryText
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
          <p className="font-['Inter'] text-[16px] text-[#323232] leading-[1.6]">
            {description}
          </p>
        </div>

        {/* ボタンエリア */}
        <div className={`flex ${onSecondaryAction && secondaryText ? 'justify-between' : 'justify-center'}`}>
          <button
            onClick={onConfirm}
            className="bg-[#0F9058] text-white font-bold text-[16px] leading-[1.6] rounded-[35px] hover:bg-[#0A7A46] transition-colors"
            style={{
              width: '198px',
              height: '51px',
              fontFamily: 'Inter'
            }}
          >
            {confirmText}
          </button>
          
          {onSecondaryAction && secondaryText && (
            <button
              onClick={onSecondaryAction}
              className="bg-white text-[#0F9058] border border-[#0F9058] font-bold text-[16px] leading-[1.6] rounded-[35px] hover:bg-[#0F9058] hover:text-white transition-colors"
              style={{
                width: '198px',
                height: '51px',
                fontFamily: 'Inter'
              }}
            >
              {secondaryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};