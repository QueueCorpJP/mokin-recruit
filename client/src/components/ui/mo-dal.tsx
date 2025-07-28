import React from 'react';
import { X } from 'lucide-react';
import { Button } from './button';

export interface ModalProps {
  title: string;
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  primaryButtonText?: string;
  onPrimaryAction?: () => void;
  secondaryButtonText?: string;
  onSecondaryAction?: () => void;
  width?: string;
  industries?: string;
  height?: string;
  overlayBgColor?: string;
  selectedCount?: number;
  totalCount?: number;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  isOpen = true,
  onClose,
  industries,
  children,
  primaryButtonText = '決定',
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction,
  width = '800px',
  height = '680px',
  overlayBgColor = 'rgba(0, 0, 0, 0.4)',
  selectedCount,
  totalCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 p-4'
      style={{ backgroundColor: overlayBgColor }}
    >
      <div
        className='flex flex-col items-start bg-white rounded-[10px] overflow-hidden shadow-lg h-[640px]'
        style={{
          width,
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <header className='flex w-full items-center justify-between gap-6 px-6 py-6 relative bg-white border-b border-[#E5E7EB] flex-shrink-0'>
          <h2 className="text-[#323232] text-[20px] tracking-[0.05em] leading-[1.6] font-bold font-['Noto_Sans_JP']">
            {title}
          </h2>

          <button
            className='flex w-8 h-8 items-center justify-center hover:bg-gray-100 rounded transition-colors'
            onClick={onClose}
          >
            <X className='w-6 h-6 text-gray-400 hover:text-gray-600' />
          </button>
        </header>

        {/* Main content with native scroll */}
        <div
          className='flex flex-col w-full items-start gap-6 p-6 bg-[#F9F9F9] overflow-y-auto overflow-x-hidden relative'
          style={{
            flex: '1 1 auto',
          }}
        >
          {industries && (
            <div className='flex items-center justify-between w-[100%]'>
              <h3 className="font-['Noto_Sans_JP'] w-[100%] text-[20px] font-bold leading-[160%] tracking-[2px] text-[#323232] border-b-2 border-[#E5E7EB] pb-2">
                業種カテゴリーテキスト
              </h3>
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        <footer
          className='w-full flex items-center justify-between px-6 bg-white border-t border-[#E5E7EB] flex-shrink-0'
          style={{
            height: '108px',
            minHeight: '108px',
            maxHeight: '108px',
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {/* Left: Selection count */}
          <div className='flex items-center'>
            {selectedCount !== undefined && totalCount !== undefined ? (
              <span
                className='text-[#323232] text-[14px] font-medium'
                style={{ opacity: 0 }}
              >
                {selectedCount}/{totalCount} 選択中
              </span>
            ) : (
              <div></div>
            )}
          </div>

          {/* Center: Buttons */}
          <div className='flex justify-center gap-4 absolute left-1/2 transform -translate-x-1/2'>
            {secondaryButtonText && (
              <Button
                variant='green-outline'
                size='figma-default'
                className='min-w-40'
                onClick={onSecondaryAction}
              >
                {secondaryButtonText}
              </Button>
            )}
            <Button
              variant='green-gradient'
              size='figma-default'
              className='min-w-40'
              onClick={onPrimaryAction}
            >
              {primaryButtonText}
            </Button>
          </div>

          {/* Right: Empty space for balance */}
          <div></div>
        </footer>
      </div>
    </div>
  );
};