'use client';

import React from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ArrowIconProps {
  direction?: Direction;
  size?: number;
  color?: string;
  className?: string;
}

export const ArrowIcon: React.FC<ArrowIconProps> = ({
  direction = 'up',
  size = 8,
  color = '#0F9058',
  className = ''
}) => {
  const getRotation = (dir: Direction): number => {
    switch (dir) {
      case 'up':
        return 0;
      case 'right':
        return 90;
      case 'down':
        return 180;
      case 'left':
        return 270;
      default:
        return 0;
    }
  };

  const rotation = getRotation(direction);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="none"
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 0.2s ease'
      }}
    >
      <path
        d="M3.46959 1.84524L0.133806 5.95369C-0.194005 6.35743 0.117864 6.93359 0.664217 6.93359H7.33578C7.88214 6.93359 8.19401 6.35743 7.86619 5.95369L4.53041 1.84524C4.26521 1.5186 3.7348 1.5186 3.46959 1.84524Z"
        fill={color}
      />
    </svg>
  );
};