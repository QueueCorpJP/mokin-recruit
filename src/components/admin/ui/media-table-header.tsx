'use client';

import React from 'react';

// SVG Arrow icon from Figma
const ArrowIcon = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 5L0 0H8L4 5Z" fill="#323232"/>
  </svg>
);

// Design tokens from Figma
const DESIGN_TOKENS = {
  colors: {
    black: '#323232',
    lightGray: '#dcdcdc'
  },
  fonts: {
    miniBold: {
      fontFamily: 'Noto Sans JP',
      fontSize: '14px', 
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: '1.4px'
    }
  }
};

interface SortIconProps {
  direction?: 'asc' | 'desc' | 'none';
}

function SortIcon({ direction = 'none' }: SortIconProps) {
  return (
    <div className="flex flex-col items-center justify-center w-2.5">
      {/* Up arrow */}
      <div 
        className={`w-2 h-2 transition-opacity ${
          direction === 'asc' ? 'opacity-100' : 'opacity-30'
        }`}
      >
        <div className="rotate-180 scale-y-[-100%]">
          <ArrowIcon />
        </div>
      </div>
      {/* Down arrow */}
      <div 
        className={`w-2 h-2 transition-opacity ${
          direction === 'desc' ? 'opacity-100' : 'opacity-30'
        }`}
      >
        <ArrowIcon />
      </div>
    </div>
  );
}

interface MediaTableHeaderColumnProps {
  /** 列のテキスト */
  text: string;
  /** ソート状態 */
  sortDirection?: 'asc' | 'desc' | 'none';
  /** ソート可能かどうか */
  sortable?: boolean;
  /** ソートクリック時のハンドラ */
  onSort?: () => void;
  /** 列の幅を制御するクラス */
  widthClass?: string;
}

function MediaTableHeaderColumn({ 
  text, 
  sortDirection = 'none', 
  sortable = true,
  onSort,
  widthClass = "shrink-0"
}: MediaTableHeaderColumnProps) {
  return (
    <div 
      className={`flex items-center gap-2 p-0 ${widthClass} ${sortable ? 'cursor-pointer' : ''}`}
      onClick={sortable ? onSort : undefined}
    >
      <div
        style={{
          ...DESIGN_TOKENS.fonts.miniBold,
          color: DESIGN_TOKENS.colors.black
        }}
        className="text-left whitespace-nowrap"
      >
        {text}
      </div>
      {sortable && <SortIcon direction={sortDirection} />}
    </div>
  );
}

interface MediaTableHeaderProps {
  /** 列の設定 */
  columns: Array<{
    /** 列のキー */
    key: string;
    /** 列のテキスト */
    text: string;
    /** ソート可能かどうか */
    sortable?: boolean;
    /** 列の幅を制御するクラス */
    widthClass?: string;
  }>;
  /** 現在のソート状態 */
  sortConfig?: {
    key: string;
    direction: 'asc' | 'desc';
  } | null;
  /** ソートクリック時のハンドラ */
  onSort?: (key: string) => void;
}

export function MediaTableHeader({ 
  columns, 
  sortConfig,
  onSort 
}: MediaTableHeaderProps) {
  return (
    <div 
      className="flex items-center justify-start gap-6 px-10 pb-2 pt-0 border-b"
      style={{
        borderBottomColor: DESIGN_TOKENS.colors.lightGray,
        borderBottomWidth: '1px'
      }}
    >
      {columns.map((column) => (
        <MediaTableHeaderColumn
          key={column.key}
          text={column.text}
          sortable={column.sortable}
          sortDirection={
            sortConfig?.key === column.key ? sortConfig.direction : 'none'
          }
          onSort={() => onSort?.(column.key)}
          widthClass={column.widthClass}
        />
      ))}
    </div>
  );
}

export default MediaTableHeader;