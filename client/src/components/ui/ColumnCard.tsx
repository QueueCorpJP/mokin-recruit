import React from 'react';
import Image from 'next/image';

type ColumnCardProps = {
  imageUrl: string;
  title: string;
  categories: string[];
};

export const ColumnCard: React.FC<ColumnCardProps> = ({
  imageUrl,
  title,
  categories,
}) => {
  return (
    <div className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col w-[373px] h-[471px]'>
      <div className='relative w-full aspect-[373/249]'>
        <Image src={imageUrl} alt={title} fill className='object-cover' />
      </div>
      <div className='p-6 flex flex-col gap-4 flex-1'>
        <h3
          className='font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] overflow-hidden font-[family-name:var(--font-noto-sans-jp)]'
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            letterSpacing: '10%',
          }}
        >
          {title}
        </h3>
        <div className='flex flex-row gap-[10px] flex-wrap'>
          {categories.map((category, index) => (
            <div
              key={index}
              className='bg-[#16a76e] rounded-[28px] flex items-center justify-center px-[16px] py-[4px]'
            >
              <span className='text-white font-bold !text-[14px] leading-[1.6] tracking-[1.4px] font-[family-name:var(--font-noto-sans-jp)]'>
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};