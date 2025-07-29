'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SelectInput } from '@/components/ui/select-input';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface MessageSearchFilterProps {
  statusValue?: string;
  groupValue?: string;
  keywordValue?: string;
  onStatusChange?: (value: string) => void;
  onGroupChange?: (value: string) => void;
  onKeywordChange?: (value: string) => void;
  onSearch?: () => void;
  className?: string;
}

const statusOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'unread', label: '未読' },
  { value: 'read', label: '既読' },
];

const groupOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'group1', label: 'グループ1' },
  { value: 'group2', label: 'グループ2' },
];

export function MessageSearchFilter({
  statusValue = 'all',
  groupValue = 'all',
  keywordValue = '',
  onStatusChange,
  onGroupChange,
  onKeywordChange,
  onSearch,
  className
}: MessageSearchFilterProps) {
  return (
    <div
      className={cn(
        'bg-white p-6 border-b border-[#efefef]',
        'flex flex-col gap-4',
        className
      )}
    >
      {/* フィルター行 */}
      <div className="flex flex-row gap-4 w-full">
        <div className="flex-1">
          <SelectInput
            options={statusOptions}
            value={statusValue}
            placeholder="対応状況"
            onChange={onStatusChange}
            className="w-full"
            style={{ width: '100%' }}
          />
        </div>
        <div className="flex-1">
          <SelectInput
            options={groupOptions}
            value={groupValue}
            placeholder="グループ"
            onChange={onGroupChange}
            className="w-full"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* 検索行 */}
      <div className="flex flex-row gap-4 items-center w-full">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="キーワード検索"
            value={keywordValue}
            onChange={(e) => onKeywordChange?.(e.target.value)}
            className={cn(
              'bg-white border border-[#999999] rounded-[5px]',
              'px-[11px] py-1 text-[16px] font-["Noto_Sans_JP"] font-medium',
              'leading-[2] tracking-[1.6px] text-[#999999]',
              'placeholder:text-[#999999] focus:text-[#323232]'
            )}
          />
        </div>
        <Button
          variant="small-green"
          size="figma-small"
          onClick={onSearch}
          className={cn(
            'rounded-[32px] px-6 py-2',
            'bg-[linear-gradient(to_right,#198D76,#1CA74F)]',
            'hover:bg-[linear-gradient(to_right,#12614E,#1A8946)]'
          )}
        >
          検索
        </Button>
      </div>
    </div>
  );
} 