'use client';

import React from 'react';
import Link from 'next/link';

interface AdminButtonProps {
  href?: string;
  onClick?: () => void;
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  href,
  onClick,
  text,
  variant = 'primary',
  size = 'medium',
  disabled = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'danger':
        return 'bg-[#FF5B5B] hover:bg-[#E54545]';
      default:
        return 'bg-gradient-to-b from-[#0F9058] to-[#0D7A4A] hover:from-[#0D7A4A] hover:to-[#0B6940]';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-4 py-2 text-[14px]';
      case 'large':
        return 'px-12 py-4 text-[18px]';
      default:
        return 'px-10 py-3.5 text-[16px]';
    }
  };

  const buttonContent = (
    <span className="font-['Noto_Sans_JP'] font-bold text-white text-center text-nowrap leading-[2] tracking-[1.6px]">
      {text}
    </span>
  );

  const buttonStyles = `box-border content-stretch flex flex-row gap-2.5 items-center justify-center rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_5px_10px_0px_rgba(0,0,0,0.25)] transition-all ${getSizeStyles()} ${getVariantStyles()} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (disabled) {
    return (
      <button disabled className={buttonStyles}>
        {buttonContent}
      </button>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={buttonStyles}>
        {buttonContent}
      </button>
    );
  }

  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        {buttonContent}
      </Link>
    );
  }

  return null;
};