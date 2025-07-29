import React from 'react';

export const Tag: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div
    className={`bg-[#d2f1da] flex flex-row gap-2.5 items-center justify-center px-6 py-0.5 md:py-0 rounded-[10px] ${className}`}
  >
    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] md:text-[16px] md:leading-[2]">
      {children}
    </span>
  </div>
);