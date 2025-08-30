'use client';

import React from 'react';

// SVG Arrow icon from Figma design
const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M6 12L10 8L6 4" 
      stroke="#0F9058" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

// Design tokens from Figma
const DESIGN_TOKENS = {
  colors: {
    green: '#0F9058'
  }
};

interface PaginationButtonProps {
  /** ボタンの向き */
  direction: 'previous' | 'next';
  /** クリック時のハンドラ */
  onClick?: () => void;
  /** ボタンが無効かどうか */
  disabled?: boolean;
}

function PaginationButton({ direction, onClick, disabled = false }: PaginationButtonProps) {
  const isPrevious = direction === 'previous';
  
  return (
    <button
      className={`
        inline-flex items-center justify-center 
        w-14 h-14 
        rounded-[32px] 
        border border-solid
        transition-all duration-200 ease-in-out
        ${disabled 
          ? 'opacity-50 cursor-not-allowed border-gray-300' 
          : 'cursor-pointer hover:bg-gray-50 active:scale-95'
        }
      `}
      style={{
        borderColor: DESIGN_TOKENS.colors.green
      }}
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrevious ? '前のページ' : '次のページ'}
    >
      <div 
        className={`flex items-center justify-center w-4 h-4 ${
          isPrevious ? 'rotate-180 scale-y-[-100%]' : ''
        }`}
      >
        <ArrowIcon />
      </div>
    </button>
  );
}

interface PaginationButtonsProps {
  /** 前のページボタンのクリックハンドラ */
  onPrevious?: () => void;
  /** 次のページボタンのクリックハンドラ */
  onNext?: () => void;
  /** 前のページボタンが無効かどうか */
  isPreviousDisabled?: boolean;
  /** 次のページボタンが無効かどうか */
  isNextDisabled?: boolean;
}

export function PaginationButtons({
  onPrevious,
  onNext,
  isPreviousDisabled = false,
  isNextDisabled = false
}: PaginationButtonsProps) {
  return (
    <div className="flex items-start justify-start gap-4">
      <PaginationButton
        direction="previous"
        onClick={onPrevious}
        disabled={isPreviousDisabled}
      />
      <PaginationButton
        direction="next"
        onClick={onNext}
        disabled={isNextDisabled}
      />
    </div>
  );
}

export default PaginationButtons;