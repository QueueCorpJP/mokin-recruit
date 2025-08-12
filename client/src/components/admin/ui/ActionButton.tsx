'use client';

import React from 'react';

interface ActionButtonProps {
  text: string;
  variant: 'delete' | 'edit' | 'approve' | 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  text, 
  variant, 
  onClick, 
  className = '',
  size = 'medium'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'delete':
        return 'bg-[#FF5B5B] hover:bg-[#E54545]';
      case 'edit':
        return 'bg-[#0F9058] hover:bg-[#0D7A4A]';
      case 'approve':
        return 'bg-[#FFA500] hover:bg-[#FF8C00]';
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-[#0F9058] hover:bg-[#0D7A4A]';
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

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center 
        rounded-[32px] 
        font-['Noto_Sans_JP'] font-bold 
        text-white 
        leading-[1.6] 
        transition-all 
        duration-200 
        cursor-pointer 
        hover:shadow-md
        ${getVariantClasses()} 
        ${getSizeClasses()} 
        ${className}
      `}
    >
      {text}
    </button>
  );
};