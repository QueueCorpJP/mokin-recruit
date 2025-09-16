import React from 'react';

export type LoadingProps = {
  label?: string;
  className?: string;
  inline?: boolean;
  size?: number | string;
  variant?: 'default' | 'muted' | 'primary' | string;
};

export const Loading: React.FC<LoadingProps> = ({
  label = '読み込み中…',
  className = '',
  inline = false,
  size = 16,
  variant = 'default',
}) => {
  const dimension = typeof size === 'number' ? `${size}px` : size;
  const colorClass =
    variant === 'primary'
      ? 'text-[#0f9058]'
      : variant === 'muted'
        ? 'text-gray-400'
        : variant === 'white'
          ? 'text-white'
          : 'text-gray-500';
  return (
    <div
      className={`${
        inline ? 'inline-flex' : 'flex'
      } items-center justify-center text-sm text-gray-600 ${className}`}
    >
      <svg
        className={`animate-spin -ml-1 mr-2 ${colorClass}`}
        style={{ width: dimension, height: dimension }}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        ></circle>
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
        ></path>
      </svg>
      {label}
    </div>
  );
};

export default Loading;
