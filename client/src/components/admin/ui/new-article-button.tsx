'use client';

import React from 'react';

// Design tokens from Figma
const DESIGN_TOKENS = {
  colors: {
    white: '#FFFFFF'
  },
  fonts: {
    bodyBold: {
      fontFamily: 'Noto Sans JP',
      fontSize: '16px',
      fontWeight: 700,
      lineHeight: 2,
      letterSpacing: '1.6px'
    }
  }
};

interface NewArticleButtonProps {
  /** ボタンのテキスト */
  children: React.ReactNode;
  /** クリック時のハンドラ */
  onClick?: () => void;
  /** ホバー状態かどうか */
  isHover?: boolean;
  /** ボタンが無効かどうか */
  disabled?: boolean;
}

export function NewArticleButton({ 
  children, 
  onClick, 
  isHover = false,
  disabled = false 
}: NewArticleButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center 
        px-10 py-3.5 
        rounded-[32px] 
        shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]
        transition-all duration-200 ease-in-out
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-[0px_8px_15px_0px_rgba(0,0,0,0.2)]'}
        ${isHover ? 'transform scale-[0.98]' : 'transform scale-100'}
      `}
      style={{
        background: 'linear-gradient(135deg, #0F9058 0%, #0D7A4A 100%)',
        color: DESIGN_TOKENS.colors.white,
        ...DESIGN_TOKENS.fonts.bodyBold
      }}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => {}}
      onMouseUp={() => {}}
    >
      {children}
    </button>
  );
}

export default NewArticleButton;