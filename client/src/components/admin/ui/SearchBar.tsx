'use client';

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
  onFilter?: () => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "キーワード検索",
  onSearch,
  onFilter,
  className = ""
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-[#ffffff] box-border flex flex-row gap-2.5 items-center justify-start px-[11px] py-1 rounded-[5px] border border-[#999999] border-solid w-96 h-10"
          style={{
            fontFamily: "'Noto Sans JP', sans-serif",
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: 2,
            letterSpacing: '1.6px',
            color: value ? '#000000' : '#999999'
          }}
        />
      </div>
      <button 
        onClick={onSearch}
        className="bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors box-border flex flex-row gap-2 items-center justify-center px-6 py-2 rounded-[32px]"
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: 1.6,
          letterSpacing: '1.4px',
          color: '#ffffff'
        }}
      >
        検索
      </button>
      {onFilter && (
        <button 
          onClick={onFilter}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          style={{
            borderRadius: '8px',
            fontSize: '16px',
            fontFamily: "'Noto Sans JP', sans-serif",
            fontWeight: 700,
            lineHeight: 1.6,
            minWidth: '100px'
          }}
        >
          絞り込み
        </button>
      )}
    </div>
  );
};