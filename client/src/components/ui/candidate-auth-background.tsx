import { ReactNode } from 'react';
import Image from 'next/image';

interface BallPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  transform?: string;
}

interface CandidateAuthBackgroundProps {
  children: ReactNode;
  // スマホ用ボールの位置調整props
  topRightBallPosition?: BallPosition;
  leftCenterBallPosition?: BallPosition;
  bottomRightBallPosition?: BallPosition;
  // 背景画像の位置調整
  backgroundPosition?: string;
}

// 右上のボール用SVG
const TopRightBall = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="90" 
    height="128" 
    viewBox="0 0 90 128" 
    fill="none"
    className="w-32 h-32"
  >
    <circle cx="64.5" cy="64" r="64" fill="url(#paint0_linear_4545_7374)"/>
    <defs>
      <linearGradient id="paint0_linear_4545_7374" x1="64.5" y1="128" x2="64.5" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#198D76"/>
        <stop offset="1" stopColor="#1CA74F"/>
      </linearGradient>
    </defs>
  </svg>
);

// 左中央のボール用SVG
const LeftCenterBall = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="72" 
    height="160" 
    viewBox="0 0 72 160" 
    fill="none"
    className="w-40 h-40"
  >
    <circle cx="-8.5" cy="80" r="80" fill="url(#paint0_linear_4545_7377)"/>
    <defs>
      <linearGradient id="paint0_linear_4545_7377" x1="-8.5" y1="160" x2="-8.5" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#198D76"/>
        <stop offset="1" stopColor="#1CA74F"/>
      </linearGradient>
    </defs>
  </svg>
);

// 右下のボール用SVG
const BottomRightBall = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="136" 
    height="224" 
    viewBox="0 0 136 224" 
    fill="none"
    className="w-56 h-56"
  >
    <circle cx="112.5" cy="112" r="112" fill="url(#paint0_linear_4545_7379)"/>
    <defs>
      <linearGradient id="paint0_linear_4545_7379" x1="112.5" y1="224" x2="112.5" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#198D76"/>
        <stop offset="1" stopColor="#1CA74F"/>
      </linearGradient>
    </defs>
  </svg>
);

export function CandidateAuthBackground({ 
  children,
  // 元のクラス名に対応する正確な値をデフォルト値として設定
  topRightBallPosition = { top: '6.666667%', right: '-2rem' }, // top-1/15 -right-8
  leftCenterBallPosition = { top: '25%', left: '-4rem', transform: 'translateY(-50%)' }, // top-1/4 -left-16 transform -translate-y-1/2
  bottomRightBallPosition = { top: '30.303030%', right: '-4rem' }, // top-10/33 -right-16
  backgroundPosition = 'center 15%'
}: CandidateAuthBackgroundProps) {
  
  // 位置オブジェクトをCSSスタイルに変換
  const getBallStyle = (position: BallPosition) => {
    return {
      position: 'absolute' as const,
      ...position
    };
  };

  return (
    <div className='md:min-h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col relative overflow-hidden'>
      {/* デスクトップ用PNG背景画像 */}
      <div className='absolute inset-0 pointer-events-none hidden md:block' style={{ zIndex: 1 }}>
        <Image
          src="/background.png"
          alt="背景画像"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
          style={{ objectPosition: backgroundPosition }}
        />
      </div>
      
      {/* スマホ用SVGボール背景 */}
      <div className='absolute inset-0 pointer-events-none md:hidden' style={{ zIndex: 1 }}>
        {/* 右上のボール */}
        <div style={getBallStyle(topRightBallPosition)}>
          <TopRightBall />
        </div>
        
        {/* 左中央のボール */}
        <div style={getBallStyle(leftCenterBallPosition)}>
          <LeftCenterBall />
        </div>
        
        {/* 右下のボール */}
        <div style={getBallStyle(bottomRightBallPosition)}>
          <BottomRightBall />
        </div>
      </div>
      
      {/* コンテンツ */}
      <div className='relative z-10'>
        {children}
      </div>
    </div>
  );
} 