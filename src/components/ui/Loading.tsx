import React from 'react';

export type LoadingProps = {
  label?: string;
  className?: string;
};

export const Loading: React.FC<LoadingProps> = ({
  label = '読み込み中…',
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-center text-sm text-gray-600 ${className}`}
    >
      <svg
        className='animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500'
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
