import React from 'react';

interface TagListProps<T> {
  items: T[];
  onRemove: (item: T) => void;
  getKey: (item: T, idx: number) => string | number;
  getLabel: (item: T) => string;
  className?: string;
}

export default function TagList<T>({
  items,
  onRemove,
  getKey,
  getLabel,
  className = '',
}: TagListProps<T>) {
  if (!items || items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-2 mt-2 ${className}`}>
      {items.map((item, idx) => (
        <div
          key={getKey(item, idx)}
          className='bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px] flex items-center gap-2'
        >
          {getLabel(item)}
          <button type='button' onClick={() => onRemove(item)} className='ml-1'>
            <svg width='10' height='10' viewBox='0 0 10 10' fill='none'>
              <path
                d='M1 1L9 9M1 9L9 1'
                stroke='#0f9058'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
