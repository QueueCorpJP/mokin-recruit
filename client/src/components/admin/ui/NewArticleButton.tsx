'use client';

import React from 'react';
import Link from 'next/link';

interface NewArticleButtonProps {
  href?: string;
  onClick?: () => void;
  text?: string;
}

export const NewArticleButton: React.FC<NewArticleButtonProps> = ({
  href = '/admin/media/new',
  onClick,
  text = '新規記事追加'
}) => {
  const buttonContent = (
    <span className="font-['Noto_Sans_JP'] text-[16px] font-bold text-white leading-[2] tracking-[1.6px]">
      {text}
    </span>
  );

  const buttonStyles = "inline-flex items-center justify-center px-10 py-3.5 bg-gradient-to-b from-[#0F9058] to-[#0D7A4A] rounded-[32px] shadow-lg hover:shadow-xl transition-shadow";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={buttonStyles}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={buttonStyles}
    >
      {buttonContent}
    </Link>
  );
};