'use client';

import React from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface MediaTableHeaderProps {
  columns: Column[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: (column: string) => void;
}

export const MediaTableHeader: React.FC<MediaTableHeaderProps> = ({
  columns,
  sortColumn,
  sortDirection,
  onSort
}) => {
  const handleSort = (column: Column) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  return (
    <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b-2 border-[#E5E5E5]">
      {columns.map((column) => (
        <div
          key={column.key}
          className={`${column.width || 'flex-1'} px-3 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
          onClick={() => handleSort(column)}
        >
          <div className="flex items-center gap-2">
            <span className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] leading-[1.6] tracking-[1.4px]">
              {column.label}
            </span>
            {column.sortable && (
              <div className="flex flex-col gap-0.5">
                <svg
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                  className={`${sortColumn === column.key && sortDirection === 'asc' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <path d="M4 0L7.5 5H0.5L4 0Z" fill={sortColumn === column.key && sortDirection === 'asc' ? '#0F9058' : '#323232'} />
                </svg>
                <svg
                  width="8"
                  height="5"
                  viewBox="0 0 8 5"
                  fill="none"
                  className={`${sortColumn === column.key && sortDirection === 'desc' ? 'opacity-100' : 'opacity-60'}`}
                >
                  <path d="M4 5L0.5 0H7.5L4 5Z" fill={sortColumn === column.key && sortDirection === 'desc' ? '#0F9058' : '#323232'} />
                </svg>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};