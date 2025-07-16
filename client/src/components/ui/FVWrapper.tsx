import React from 'react';

interface FVWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Figma: Frame 2531 (PC MVラッパー)
 * - 外側: 背景色 #F9F9F9 横幅いっぱい
 * - 内側: 幅1440px, 高さ730px, 角丸80px, 中央寄せ
 */
export const FVWrapper: React.FC<FVWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <div className='w-full bg-[#F9F9F9] p-4 sm:p-6 lg:p-10'>
      <div
        className={`w-full max-w-[1440px] h-[400px] sm:h-[500px] lg:h-[730px] mx-auto relative rounded-[40px] sm:rounded-[60px] lg:rounded-[80px] overflow-hidden ${className || ''}`}
        style={{ minWidth: 320 }}
      >
        {children}
      </div>
    </div>
  );
};
