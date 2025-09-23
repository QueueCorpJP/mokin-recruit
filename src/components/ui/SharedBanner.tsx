'use client';

import React from 'react';
import Image from 'next/image';

interface SharedBannerProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onClick?: () => void;
}

export default function SharedBanner({
  src = '/images/banner01.png',
  alt = 'バナー画像',
  width = 1200,
  height = 300,
  className = 'w-full h-auto block rounded-lg',
  priority = false,
  quality = 85,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onClick,
}: SharedBannerProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={onClick ? 'cursor-pointer' : ''}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={priority ? undefined : 'lazy'}
        priority={priority}
        sizes={sizes}
        quality={quality}
        onClick={handleClick}
        style={{
          display: 'block',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
}
