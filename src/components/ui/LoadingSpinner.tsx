'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: number;
  label?: string;
  className?: string;
}

export function LoadingSpinner({
  size = 24,
  label = 'Loading...',
  className = '',
}: LoadingSpinnerProps) {
  const strokeWidth = Math.max(2, Math.floor(size / 12));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role='status'
      aria-live='polite'
      aria-busy='true'
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className='animate-spin text-[#dcdcdc]'
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='currentColor'
          strokeWidth={strokeWidth}
          fill='none'
          opacity='0.35'
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke='#0f9058'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          fill='none'
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
        />
      </svg>
      <span className='sr-only'>{label}</span>
    </div>
  );
}

export default LoadingSpinner;
