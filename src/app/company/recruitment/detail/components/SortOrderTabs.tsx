import React from 'react';

interface SortOrderTabsProps {
  sortOrder: 'progress' | 'date';
  onSortOrderChange: (order: 'progress' | 'date') => void;
}

export function SortOrderTabs({
  sortOrder,
  onSortOrderChange,
}: SortOrderTabsProps) {
  return (
    <div className='flex items-center gap-4 h-9 w-full lg:w-[370px]'>
      <div className='flex'>
        <button
          onClick={() => onSortOrderChange('progress')}
          className={`px-4 py-1 min-w-[62px] border border-[#efefef] ${
            sortOrder === 'progress'
              ? 'bg-[#d2f1da] text-[#0f9058]'
              : 'bg-white text-[#999999]'
          } text-[14px] font-bold tracking-[1.4px] whitespace-nowrap transition-colors`}
          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
        >
          選考が進行している順
        </button>
        <button
          onClick={() => onSortOrderChange('date')}
          className={`px-4 py-1 min-w-[62px] border border-[#efefef] ${
            sortOrder === 'date'
              ? 'bg-[#d2f1da] text-[#0f9058]'
              : 'bg-white text-[#999999]'
          } text-[14px] font-bold tracking-[1.4px] whitespace-nowrap transition-colors`}
          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
        >
          応募日時が新しい順
        </button>
      </div>
    </div>
  );
}
