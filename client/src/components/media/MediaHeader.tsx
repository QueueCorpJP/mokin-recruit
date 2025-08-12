import React from 'react';

interface MediaHeaderProps {
  title: string;
  subtitle?: string;
}

export const MediaHeader: React.FC<MediaHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="w-full bg-gradient-to-t from-[#17856F] to-[#229A4E] relative overflow-hidden">
      {/* 背景の半円SVG */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{ zIndex: 0 }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="90" 
          height="128" 
          viewBox="0 0 90 128" 
          fill="none"
          className="w-32 h-32"
        >
          <circle cx="64.5" cy="64" r="64" fill="url(#paint0_linear_media_header)"/>
          <defs>
            <linearGradient id="paint0_linear_media_header" x1="64.5" y1="128" x2="64.5" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#17856F"/>
              <stop offset="1" stopColor="#229A4E"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ヘッダー */}
      <header className="px-[80px] py-[75px] relative z-10">
        <div className="max-w-7xl text-center">
          <h1 className="text-[32px] font-bold text-[#FFF] Noto_Sans_JP">{title}</h1>
          {subtitle && (
            <p className="text-[16px] text-[#FFF] mt-[8px] Noto_Sans_JP">{subtitle}</p>
          )}
        </div>
      </header>
    </div>
  );
};