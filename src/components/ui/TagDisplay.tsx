import React from 'react';

export const TagDisplay: React.FC<{ 
  items: string[];
  borderRadius?: string;
}> = ({ items, borderRadius = '10px' }) => (
  <div className='flex flex-wrap gap-2 items-center justify-start w-full'>
    {items.map(item => (
      <div
        key={item}
        className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0'
        style={{ borderRadius }}
      >
        <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
          {item}
        </span>
      </div>
    ))}
  </div>
);
