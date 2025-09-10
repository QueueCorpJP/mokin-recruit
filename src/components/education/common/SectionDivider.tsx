import React from 'react';

interface SectionDividerProps {
  className?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  className,
}) => <div className={className || 'border-b border-[#dcdcdc] mb-6'} />;