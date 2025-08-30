'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface MessageSearchFilterCandidateProps {
  companyValue?: string;
  jobValue?: string;
  keywordValue?: string;
  searchTarget?: 'company' | 'job';
  messages?: Array<{ id: string; companyName: string; jobTitle: string }>;
  onCompanyChange?: (value: string) => void;
  onJobChange?: (value: string) => void;
  onKeywordChange?: (value: string) => void;
  onSearchTargetChange?: (target: 'company' | 'job') => void;
  onSearch?: () => void;
  className?: string;
}

// companyOptionsは動的に生成されるため削除

interface CustomDropdownProps {
  options: { value: string; label: string }[];
  value: string;
  placeholder: string;
  onChange?: (value: string) => void;
  className?: string;
}

function CustomDropdown({
  options,
  value,
  placeholder,
  onChange,
  className,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = React.useMemo(() => 
    options.find(option => option.value === value), 
    [options, value]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        type='button'
        className={cn(
          'w-full bg-white border border-[#999999] rounded-[5px]',
          'pl-[11px] pr-4 py-1 flex items-center justify-between h-[38px]',
          'text-left focus:outline-none focus:ring-2 focus:ring-[#0f9058]'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-['Noto_Sans_JP'] font-bold text-[14px] text-[#323232] tracking-[1.4px] leading-[1.6]">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className='w-3.5 h-[9.333px] flex items-center justify-center'>
          <svg className='w-3.5 h-[9.333px]' fill='none' viewBox='0 0 14 10'>
            <path
              d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
              fill='#0F9058'
            />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-[#999999] rounded-[5px] shadow-lg z-10'>
          {options.map(option => (
            <button
              key={option.value}
              type='button'
              className={cn(
                'w-full px-[11px] py-2 text-left hover:bg-gray-100',
                'font-["Noto_Sans_JP"] font-bold text-[14px] text-[#323232] tracking-[1.4px] leading-[1.6]',
                option.value === value && 'bg-gray-50'
              )}
              onClick={() => {
                console.log('Option clicked:', option.value, option.label);
                onChange?.(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MessageSearchFilterCandidate({
  companyValue = 'all',
  jobValue = 'all',
  keywordValue = '',
  searchTarget = 'company',
  messages = [],
  onCompanyChange,
  onJobChange,
  onKeywordChange,
  onSearchTargetChange,
  onSearch,
  className,
}: MessageSearchFilterCandidateProps) {
  // 検索対象のオプション
  const searchTargetOptions = [
    { value: 'company', label: '企業名' },
    { value: 'job', label: '求人名' }
  ];
  
  // 企業名のオプションを生成
  const companyOptions = React.useMemo(() => {
    const allOption = { value: 'all', label: '企業名' };
    const uniqueCompanies = Array.from(new Set(messages.map(m => m.companyName)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map(company => ({
        value: company,
        label: company
      }));
    
    return [allOption, ...uniqueCompanies];
  }, [messages]);
  
  return (
    <div
      className={cn(
        'bg-white p-6 border-b border-[#efefef]',
        'flex flex-col gap-2',
        className
      )}
    >
      {/* 検索対象選択 */}
      <div className='flex flex-row gap-4 items-center w-full'>
        <div className='w-full'>
          <CustomDropdown
            options={searchTargetOptions}
            value={searchTarget}
            placeholder='検索対象'
            onChange={(value) => {
              console.log('Search target changed to:', value);
              if (value === 'company' || value === 'job') {
                onSearchTargetChange?.(value);
              }
            }}
            className='w-full'
          />
        </div>
      </div>
      {/* 検索入力行 */}
      <div className='flex flex-row gap-4 items-center w-full'>
        <div className='flex-1'>
          <Input
            type='text'
            placeholder='キーワード検索'
            value={keywordValue}
            onChange={e => onKeywordChange?.(e.target.value)}
            className={cn(
              'bg-white border border-[#999999] rounded-[5px]',
              'px-[11px] py-1 text-[16px] font-["Noto_Sans_JP"] font-medium',
              'leading-[2] tracking-[1.6px] text-[#999999]',
              'placeholder:text-[#999999] focus:text-[#323232]'
            )}
          />
        </div>
        <Button
          type='button'
          onClick={onSearch}
          variant='green-gradient'
          size='figma-default'
          className='min-w-[78px] py-2 px-6 shadow-none'
        >
          検索
        </Button>
      </div>
    </div>
  );
}
