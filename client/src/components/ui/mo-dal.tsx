import React, { useState, useEffect } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex items-center justify-center z-50 p-2 md:p-4'
      style={{ backgroundColor: overlayBgColor }}
    >
      <div
        className='flex flex-col items-start bg-white rounded-[10px] overflow-hidden shadow-lg w-full md:w-auto max-w-[95vw] max-h-[95vh] md:max-h-[90vh]'
        style={{
          width: isMobile ? '100%' : width,
          height: isMobile ? 'auto' : height,
          maxHeight: isMobile ? '95vh' : '90vh',
        }}
      >
        {/* Header */}
        <header className='flex w-full items-center justify-between gap-4 md:gap-6 px-4 md:px-6 py-4 md:py-6 relative bg-white border-b border-[#E5E7EB] flex-shrink-0'>
          <h2 className="text-[#323232] text-lg md:text-[20px] tracking-[0.05em] leading-[1.6] font-bold font-['Noto_Sans_JP'] truncate">
            {title}
          </h2>

          <button
            className='flex w-8 h-8 items-center justify-center hover:bg-gray-100 rounded transition-colors flex-shrink-0'
            onClick={onClose}
          >
            <X className='w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-gray-600' />
          </button>
        </header>

        {/* Main content with native scroll */}
        <div
          className='flex flex-col w-full items-start gap-4 md:gap-6 p-4 md:p-6 bg-[#F9F9F9] overflow-y-auto overflow-x-hidden relative modal-content'
          style={{
            flex: '1 1 auto',
          }}
        >
          {industries && (
            <div className='flex items-center justify-between w-full'>
              <h3 className="font-['Noto_Sans_JP'] w-full text-lg md:text-[20px] font-bold leading-[160%] tracking-[1.5px] md:tracking-[2px] text-[#323232] border-b-2 border-[#E5E7EB] pb-2">
                業種カテゴリーテキスト
              </h3>
            </div>
          )}
          {children}
        </div>

        {/* Footer */}
        <footer
          className='w-full flex flex-col md:flex-row items-stretch md:items-center justify-between px-4 md:px-6 py-4 md:py-0 bg-white border-t border-[#E5E7EB] flex-shrink-0 gap-3 md:gap-0'
          style={{
            height: 'auto',
            minHeight: isMobile ? 'auto' : '108px',
            maxHeight: 'none',
          }}
        >
          {/* Left: Selection count */}
          <div className='flex items-center order-3 md:order-1'>
            {selectedCount !== undefined && totalCount !== undefined ? (
              <span
                className='text-[#323232] text-sm md:text-[14px] font-medium'
                style={{ opacity: 0 }}
              >
                {selectedCount}/{totalCount} 選択中
              </span>
            ) : (
              <div className="hidden md:block"></div>
            )}
          </div>

          {/* Center: Buttons */}
          <div className='flex flex-col md:flex-row justify-center gap-3 md:gap-4 order-1 md:order-2 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 w-full md:w-auto'>
            {secondaryButtonText && (
              <Button
                variant='green-outline'
                size='figma-default'
                className='min-w-40 w-full md:w-auto'
                onClick={onSecondaryAction}
              >
                {secondaryButtonText}
              </Button>
            )}
            <Button
              variant='green-gradient'
              size='figma-default'
              className='min-w-40 w-full md:w-auto'
              onClick={onPrimaryAction}
            >
              {primaryButtonText}
            </Button>
          </div>

          {/* Right: Empty space for balance */}
          <div className="hidden md:block order-2 md:order-3"></div>
        </footer>
      </div>
    </div>
  );
};