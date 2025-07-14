import React from 'react';

type SectionLeadProps = {
  title: React.ReactNode;
  lead: React.ReactNode;
  className?: string;
};

export const SectionLead = ({
  title,
  lead,
  className = '',
}: SectionLeadProps) => (
  <div className={`flex flex-col items-center w-full ${className}`}>
    <h2
      className='text-center font-bold text-[32px] leading-[1.6] tracking-wider text-[#0F9058] font-[family-name:var(--font-noto-sans-jp)]'
      style={{ letterSpacing: '0.1em' }}
    >
      {title}
    </h2>
    <div className='mt-6'></div>
    <p
      className='text-center text-[16px] leading-[2] tracking-wider text-[#323232] font-medium font-[family-name:var(--font-noto-sans-jp)] max-w-[1200px]'
      style={{ letterSpacing: '0.1em' }}
    >
      {lead}
    </p>
  </div>
);
