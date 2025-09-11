import React from 'react';

/**
 * 共通Section部品
 * - title: セクションタイトル
 * - description: 補足説明（省略可）
 * - children: セクション内の要素
 * - className: ラッパーの追加クラス
 */
export interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <section className={`mb-6 lg:mb-6 ${className}`}>
      <div className='mb-2'>
        <h2 className='text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]'>
          {title}
        </h2>
      </div>
      {description && (
        <div className='mb-2 text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-8 text-left'>
          {description}
        </div>
      )}
      <div className='border-b border-[#dcdcdc] mb-6'></div>
      {children}
    </section>
  );
};

export default Section;
