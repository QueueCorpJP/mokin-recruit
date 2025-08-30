import React from 'react';

export const YenFilled: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 24, color = '#0f9058', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M6 4c-.55 0-1 .45-1 1 0 .22.07.43.2.6L10.2 12H8a1 1 0 1 0 0 2h4v2H8a1 1 0 1 0 0 2h4v1a1 1 0 1 0 2 0v-1h4a1 1 0 1 0 0-2h-4v-2h4a1 1 0 1 0 0-2h-2.2l5-6.4A1 1 0 0 0 18 4c-.32 0-.62.15-.8.4L12 10.13 6.8 4.4A1 1 0 0 0 6 4z'
      fill={color}
    />
  </svg>
);

