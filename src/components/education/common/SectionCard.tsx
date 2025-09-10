import React from 'react';

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * [SectionCard]
 * 白背景＋角丸＋影のラッパー。
 * - children: 内包要素
 * - className: 追加クラス
 */
const SectionCard: React.FC<SectionCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px] mx-auto ${className}`}
    >
      {children}
    </div>
  );
};

export default SectionCard;