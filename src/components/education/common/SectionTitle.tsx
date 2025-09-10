import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  className,
}) => (
  <h2
    className={
      className || 'text-[#323232] text-[20px] font-bold tracking-[2px] mb-2'
    }
  >
    {children}
  </h2>
);
