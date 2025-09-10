import React from 'react';

interface RemoveButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  className?: string;
  iconType?: 'cross' | 'trash';
}

export const RemoveButton: React.FC<RemoveButtonProps> = ({
  onClick,
  ariaLabel = '削除',
  className = '',
  iconType = 'cross',
}) => (
  <button
    type='button'
    onClick={onClick}
    aria-label={ariaLabel}
    className={
      className ||
      'flex items-center justify-center w-10 h-[40px] rounded-r-[10px] bg-[#d2f1da]'
    }
  >
    {iconType === 'cross' ? (
      <span style={{ fontSize: 20, fontWeight: 'bold', color: '#0f9058' }}>
        ×
      </span>
    ) : (
      <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
        <path
          d='M2 4h12M6 7v4M10 7v4M3 4l1 9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-9'
          stroke='#0f9058'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )}
  </button>
);
