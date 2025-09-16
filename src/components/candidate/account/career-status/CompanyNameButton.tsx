'use client';

import React from 'react';

interface CompanyNameButtonProps {
  companyName: string;
}

export default function CompanyNameButton({
  companyName,
}: CompanyNameButtonProps) {
  const handleClick = () => {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(companyName)}`,
      '_blank'
    );
  };

  return (
    <button
      onClick={handleClick}
      className='text-[16px] text-[#0F9058] font-medium tracking-[1.6px] leading-[2] hover:underline cursor-pointer bg-transparent border-none p-0 text-left'
    >
      {companyName}
    </button>
  );
}
