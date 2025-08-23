import React from 'react';
import Image from 'next/image';

interface NewJobPostCardProps {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  tags: string[];
  companyName: string;
  companyLogoUrl?: string;
  starred?: boolean;
  showStar?: boolean;
  onClick?: () => void;
  onStarClick?: () => void;
}

export function NewJobPostCard({
  imageUrl,
  imageAlt = '',
  title,
  tags,
  companyName,
  companyLogoUrl,
  starred = false,
  showStar = true,
  onClick,
  onStarClick
}: NewJobPostCardProps) {
  return (
    <div 
      className="bg-white box-border flex gap-6 items-start justify-start p-6 rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] w-full cursor-pointer hover:shadow-[0px_0px_25px_0px_rgba(0,0,0,0.1)] transition-shadow"
      onClick={onClick}
    >
      {/* メイン画像 */}
      <div className="aspect-[2/3] w-[120px] bg-center bg-cover bg-no-repeat rounded-[5px] shrink-0">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={120}
          height={180}
          className="w-full h-full object-cover rounded-[5px]"
        />
      </div>
      
      {/* コンテンツ部分 */}
      <div className="flex-1 flex flex-col justify-start min-h-0 min-w-0">
        <div className="flex flex-col gap-2 flex-1">
          {/* タグ */}
          <div className="flex flex-wrap gap-2 items-start justify-start w-full">
            {tags.slice(0, 3).map((tag, index) => (
              <div 
                key={index}
                className="bg-[#d2f1da] flex gap-2.5 items-center justify-center px-4 py-0 rounded-[5px] shrink-0"
              >
                <div className="font-['Noto_Sans_JP'] font-medium text-[#0f9058] text-[16px] text-center whitespace-nowrap tracking-[1.6px] leading-[2]">
                  {tag}
                </div>
              </div>
            ))}
          </div>
          
          {/* 求人タイトル */}
          <div className="font-['Noto_Sans_JP'] font-bold h-[29px] text-[#0f9058] text-[16px] tracking-[1.6px] leading-[2] w-full overflow-hidden text-ellipsis whitespace-nowrap">
            {title}
          </div>
          
          {/* 企業情報 */}
          <div className="flex gap-2 items-center justify-start w-full">
            {/* 企業ロゴ */}
            <div className="w-6 h-6 bg-center bg-cover bg-no-repeat rounded-full shrink-0">
              {companyLogoUrl ? (
                <Image
                  src={companyLogoUrl}
                  alt={`${companyName}のロゴ`}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">企</span>
                </div>
              )}
            </div>
            
            {/* 企業名 */}
            <div className="flex-1 font-['Noto_Sans_JP'] font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[1.6] min-w-0">
              {companyName}
            </div>
          </div>
        </div>
        
        {/* お気に入りアイコン */}
        {showStar && (
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStarClick?.();
              }}
              className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill={starred ? "#0F9058" : "none"} 
                stroke={starred ? "#0F9058" : "#DCDCDC"} 
                strokeWidth="2"
              >
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}