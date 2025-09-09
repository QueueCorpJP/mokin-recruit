import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectInput } from '@/components/ui/select-input';

interface StatusTab {
  id: string;
  label: string;
  active: boolean;
}

interface RecruitmentFilterBarProps {
  statusTabs: StatusTab[];
  onStatusTabClick: (tabId: string) => void;
  excludeDeclined: boolean;
  onExcludeDeclinedChange: (checked: boolean) => void;
  groupOptions: Array<{ value: string; label: string }>;
  selectedGroup: string;
  onGroupChange: (value: string) => void;
  jobOptions: Array<{ value: string; label: string }>;
  selectedJob: string;
  onJobChange: (value: string) => void;
  keyword: string;
  onKeywordChange: (value: string) => void;
  onSearch: () => void;
}

export function RecruitmentFilterBar({
  statusTabs,
  onStatusTabClick,
  excludeDeclined,
  onExcludeDeclinedChange,
  groupOptions,
  selectedGroup,
  onGroupChange,
  jobOptions,
  selectedJob,
  onJobChange,
  keyword,
  onKeywordChange,
  onSearch,
}: RecruitmentFilterBarProps) {
  return (
    <div className='bg-white rounded-[10px] p-10'>
      {/* Status Tabs */}
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-4'>
          <span
            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap w-[80px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            ステータス
          </span>
          <div className='flex flex-wrap'>
            {statusTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onStatusTabClick(tab.id)}
                className={`px-4 py-1 min-w-[62px] border border-[#efefef] ${
                  tab.active
                    ? 'bg-[#d2f1da] text-[#0f9058]'
                    : 'bg-white text-[#999999]'
                } text-[14px] font-bold tracking-[1.4px] whitespace-nowrap transition-colors`}
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Exclude Declined Checkbox */}
        <div className='pl-[96px]'>
          <Checkbox
            checked={excludeDeclined}
            onChange={onExcludeDeclinedChange}
            label={
              <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                見送り・辞退を除く
              </span>
            }
          />
        </div>
      </div>
      {/* Filter Row */}
      <div className='flex flex-col min-[1440px]:flex-row items-start min-[1440px]:items-center justify-left my-6 gap-10'>
        {/* Group Select */}
        <div className='flex items-center gap-4'>
          <span
            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap w-33 min-[1440px]:w-[80px] text-end ml-12'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            グループ
          </span>
          <SelectInput
            options={groupOptions}
            value={selectedGroup}
            onChange={onGroupChange}
            placeholder='すべて'
            className='w-60'
          />
        </div>
        {/* Job Select */}
        <div className='flex items-center gap-4'>
          <span
            className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap w-33 min-[1440px]:w-fit'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            対象の求人
          </span>
          <SelectInput
            options={jobOptions}
            value={selectedJob}
            onChange={onJobChange}
            placeholder='すべて'
            className='w-60'
          />
        </div>
      </div>
      {/* Keyword Search */}
      <div className='flex items-center gap-4'>
        <span
          className='text-[#323232] text-[16px] font-bold tracking-[1.6px] whitespace-nowrap w-33 min-[1440px]:w-fit'
          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
        >
          キーワード検索
        </span>
        <div className='flex gap-2'>
          <input
            type='text'
            value={keyword}
            onChange={e => onKeywordChange(e.target.value)}
            placeholder='キーワード検索'
            className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-1 w-60 text-[#999999] text-[16px] tracking-[1.6px] placeholder:text-[#999999]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          />
          <button
            type='button'
            className='px-6 py-2 bg-gradient-to-r from-[#26AF94] to-[#3A93CB] text-white rounded-[5px] text-[14px] font-bold tracking-[1.4px]'
            onClick={onSearch}
          >
            検索
          </button>
        </div>
      </div>
    </div>
  );
}