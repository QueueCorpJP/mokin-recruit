import React from 'react';

export const MapPinFilled: React.FC<{
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
      d='M12 2C7.03 2 3 6.03 3 11c0 5.25 7.2 10.36 8.13 11.01a1 1 0 0 0 1.13 0C13.8 21.36 21 16.25 21 11c0-4.97-4.03-9-9-9z'
      fill={color}
    />
    <circle cx='12' cy='11' r='2.8' fill='white' />
  </svg>
);
