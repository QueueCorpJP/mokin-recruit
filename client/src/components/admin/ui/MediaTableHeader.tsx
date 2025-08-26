'use client';

import React from 'react';
import { ArrowIcon } from './ArrowIcon';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

interface MediaTableHeaderProps {
  columns?: Column[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: (column: string) => void;
  children?: React.ReactNode;
  className?: string;
  rightSideButton?: React.ReactNode;
}

export const MediaTableHeader: React.FC<MediaTableHeaderProps> = ({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  children,
  className = '',
  rightSideButton
}) => {
  const handleSort = (column: Column) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  // If children are provided, render them as-is (for table usage)
  if (children) {
    return (
      <thead className={className}>
        {children}
      </thead>
    );
  }

  // If columns are provided, render the flex layout
  if (columns) {
    return (
      <div className="flex items-center justify-between px-5 py-3 bg-[#F8F8F8] border-b-2 border-[#E5E5E5]">
        <div className="flex items-center flex-1">
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
                    <ArrowIcon
                      direction="up"
                      size={8}
                      color="#0F9058"
                    />
                    <ArrowIcon
                      direction="down"
                      size={8}
                      color="#0F9058"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {rightSideButton && (
          <div className="flex-shrink-0 ml-4">
            {rightSideButton}
          </div>
        )}
      </div>
    );
  }

  // Fallback if neither children nor columns are provided
  return null;
};