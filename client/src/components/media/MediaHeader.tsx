import React from 'react';
import Image from 'next/image';

interface MediaHeaderProps {
  title: string;
  subtitle?: string;
  showLargeCircle?: boolean;
  filterType?: 'all' | 'category' | 'tag';
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({ title, subtitle, showLargeCircle = false, filterType = 'all' }) => {
  
  return (
    <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] relative w-full h-full overflow-hidden">
      {/* SVG背景 - 横幅85%、マージン0 */}
      <div className="absolute bottom-0 left-1/2 translate-x-[-50%] w-[85vw] z-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 -50 1280 250" 
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path 
            d="M640 -50C882.58 -50 1105.3 58.02 1280 199.89H0C174.7 58.02 397.42 -50 640 -50Z" 
            fill="url(#paint0_linear_5275_20012)"
          />
          <defs>
            <linearGradient 
              id="paint0_linear_5275_20012" 
              x1="640" 
              y1="199.89" 
              x2="640" 
              y2="-50" 
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#198D76"/>
              <stop offset="1" stopColor="#1CA74F"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ヘッダー */}
      <header className="px-[80px] py-[75px] relative z-10">
        <div className="max-w-7xl text-center">
          <div className="flex items-center justify-center gap-[12px] mb-[8px]">
            <h1 className="text-[32px] font-bold text-[#FFF] Noto_Sans_JP">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-[16px] text-[#FFF] mt-[8px] Noto_Sans_JP">{subtitle}</p>
          )}
        </div>
      </header>
    </div>
  );
};
