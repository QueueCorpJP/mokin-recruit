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
    <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
      <div className="relative aspect-[300/200] w-full">
        <Image src={imageUrl} alt={title} fill className="object-cover" />
      </div>
      <div className="p-6 flex flex-col gap-4">
        <h3
          className="font-bold h-[87px] text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] overflow-hidden font-[family-name:var(--font-noto-sans-jp)]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-[#16a76e] rounded-[28px] px-4 py-1"
            >
              <span className="text-white font-bold text-[14px] leading-[1.6] tracking-[1.4px] font-[family-name:var(--font-noto-sans-jp)]">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 