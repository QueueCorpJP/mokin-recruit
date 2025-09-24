'use client';

import React from 'react';

interface ActionButtonProps {
  text: string;
  variant:
    | 'delete'
    | 'delete-outline'
    | 'edit'
    | 'approve'
    | 'primary'
    | 'secondary';
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  variant,
  onClick,
  className = '',
  size = 'medium',
  disabled = false,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'delete':
        return 'bg-[#ff5b5b] hover:bg-[#af4545] text-white';
      case 'delete-outline':
        return 'bg-transparent border-2 border-[#ff5b5b] text-[#ff5b5b] hover:bg-[#ff5b5b] hover:text-white';
      case 'edit':
        return 'bg-[#0F9058] hover:bg-[#0D7A4A] text-white';
      case 'approve':
        return 'bg-[#FFA500] hover:bg-[#FF8C00] text-white';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return 'bg-[#0F9058] hover:bg-[#0D7A4A] text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-[12px] tracking-[1.2px]';
      case 'large':
        return 'px-6 py-2 text-[16px] tracking-[1.6px]';
      default:
        return 'px-4 py-1 text-[14px] tracking-[1.4px]';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // イベント伝播を停止
    onClick?.(e);
  };

  return (
    <button
      onClick={disabled ? undefined : handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center 
        rounded-[32px]
        font-['Noto_Sans_JP'] font-bold
        leading-[1.6]
        transition-all
        duration-200
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md'}
        ${disabled ? 'bg-gray-400 text-white' : getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
    >
      {text}
    </button>
  );
};
