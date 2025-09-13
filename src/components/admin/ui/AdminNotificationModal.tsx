'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

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
  if (process.env.NODE_ENV === 'development') console.log('AdminNotificationModal render - isOpen:', isOpen, 'title:', title);
  
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
        <div className="flex gap-4 justify-center">
          <div style={{ width: '198px' }}>
            <Button
              onClick={onConfirm}
              variant="green-gradient"
              size="figma-default"
              className="w-full text-[16px] font-bold tracking-[0.1em]"
            >
              {confirmText}
            </Button>
          </div>
          
          {onSecondaryAction && secondaryText && (
            <div style={{ width: '198px' }}>
              <Button
                onClick={onSecondaryAction}
                variant="green-outline"
                size="figma-default"
                className="w-full text-[16px] font-bold tracking-[0.1em]"
              >
                {secondaryText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};