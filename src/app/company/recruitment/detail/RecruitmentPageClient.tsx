'use client';
import React, { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CandidateSlideMenu } from './CandidateSlideMenu';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectInput } from '@/components/ui/select-input';
import { CandidateData } from '@/lib/server/candidate/recruitment-queries';
import { Pagination } from '@/components/ui/Pagination';

// Icons
const BoardIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
  >
    <path
      d='M16 0C13.3526 0 11.098 1.66875 10.2683 4H7.8933C5.65763 4 3.83997 5.79375 3.83997 8V28C3.83997 30.2062 5.65763 32 7.8933 32H24.1066C26.3423 32 28.16 30.2062 28.16 28V8C28.16 5.79375 26.3423 4 24.1066 4H21.7316C20.902 1.66875 18.6473 0 16 0ZM16 4C16.5375 4 17.053 4.21071 17.433 4.58579C17.8131 4.96086 18.0266 5.46957 18.0266 6C18.0266 6.53043 17.8131 7.03914 17.433 7.41421C17.053 7.78929 16.5375 8 16 8C15.4625 8 14.947 7.78929 14.5669 7.41421C14.1868 7.03914 13.9733 6.53043 13.9733 6C13.9733 5.46957 14.1868 4.96086 14.5669 4.58579C14.947 4.21071 15.4625 4 16 4ZM8.39997 17C8.39997 16.6022 8.56011 16.2206 8.84516 15.9393C9.13022 15.658 9.51684 15.5 9.91997 15.5C10.3231 15.5 10.7097 15.658 10.9948 15.9393C11.2798 16.2206 11.44 16.6022 11.44 17C11.44 17.3978 11.2798 17.7794 10.9948 18.0607C10.7097 18.342 10.3231 18.5 9.91997 18.5C9.51684 18.5 9.13022 18.342 8.84516 18.0607C8.56011 17.7794 8.39997 17.3978 8.39997 17ZM14.9866 16H23.0933C23.6506 16 24.1066 16.45 24.1066 17C24.1066 17.55 23.6506 18 23.0933 18H14.9866C14.4293 18 13.9733 17.55 13.9733 17C13.9733 16.45 14.4293 16 14.9866 16ZM8.39997 23C8.39997 22.6022 8.56011 22.2206 8.84516 21.9393C9.13022 21.658 9.51684 21.5 9.91997 21.5C10.3231 21.5 10.7097 21.658 10.9948 21.9393C11.2798 22.2206 11.44 22.6022 11.44 23C11.44 23.3978 11.2798 23.7794 10.9948 24.0607C10.7097 24.342 10.3231 24.5 9.91997 24.5C9.51684 24.5 9.13022 24.342 8.84516 24.0607C8.56011 23.7794 8.39997 23.3978 8.39997 23ZM13.9733 23C13.9733 22.45 14.4293 22 14.9866 22H23.0933C23.6506 22 24.1066 22.45 24.1066 23C24.1066 23.55 23.6506 24 23.0933 24H14.9866C14.4293 24 13.9733 23.55 13.9733 23Z'
      fill='#0F9058'
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M10 12L6 8L10 4'
      stroke='#0f9058'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6 12L10 8L6 4'
      stroke='#0f9058'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

interface StatusTab {
  id: string;
  label: string;
  active: boolean;
}


interface RecruitmentPageClientProps {
  candidates: CandidateData[];
  groupOptions: Array<{ value: string; label: string }>;
  jobOptions: Array<{ value: string; label: string }>;
}

// Candidate Card Component
function CandidateCard({
  candidate,
  onClick,
}: {
  candidate: CandidateData;
  onClick: (_candidate: CandidateData) => void;
}) {
  return (
    <div
      className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] flex flex-col min-[1440px]:flex-row gap-4 cursor-pointer hover:shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] transition-shadow duration-200'
      onClick={() => onClick(candidate)}
    >
      {/* Left Section - Candidate Info */}
      <div className='w-full min-[1440px]:w-[356px] flex flex-col gap-6 flex-shrink-0'>
        <div className='flex flex-col gap-1 w-full min-[1440px]:w-[356px]'>
          <div
            className='text-[#0f9058] text-[18px] font-bold leading-[160%] tracking-[1.8px] w-full min-[1440px]:w-[356px] h-[29px] truncate'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {candidate.company}
          </div>
          <div
            className='text-[#323232] text-[16px] font-bold leading-[200%] tracking-[1.6px] w-full min-[1440px]:w-[356px] h-[32px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {candidate.name}
          </div>
          <div
            className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] w-full min-[1440px]:w-[356px] h-[22px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {candidate.location}／{candidate.age}歳／{candidate.gender}
          </div>
        </div>

        <div className='flex flex-col gap-2 w-full min-[1440px]:w-[356px]'>
          <div className='flex gap-6 w-full min-[1440px]:w-[356px] h-auto min-[1440px]:h-[48px]'>
            <span
              className='text-[#999999] text-[14px] font-bold leading-[160%] tracking-[1.4px] w-[65px] h-[22px] flex-shrink-0'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              経験職種
            </span>
            <div className='flex flex-wrap gap-0 flex-1 min-[1440px]:w-[267px] h-auto min-[1440px]:h-[48px]'>
              {candidate.experience.map((exp, index) => (
                <React.Fragment key={index}>
                  <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                    {exp}
                  </span>
                  {index < candidate.experience.length - 1 && (
                    <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                      、
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='flex gap-6 w-full min-[1440px]:w-[356px] h-auto min-[1440px]:h-[48px]'>
            <span
              className='text-[#999999] text-[14px] font-bold leading-[160%] tracking-[1.4px] w-[65px] h-[22px] flex-shrink-0'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              経験業種
            </span>
            <div className='flex flex-wrap gap-0 flex-1 min-[1440px]:w-[267px] h-auto min-[1440px]:h-[48px]'>
              {candidate.industry.map((ind, index) => (
                <React.Fragment key={index}>
                  <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                    {ind}
                  </span>
                  {index < candidate.industry.length - 1 && (
                    <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                      、
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className='flex gap-6 w-full min-[1440px]:w-[356px] h-auto min-[1440px]:h-[52px]'>
          <span
            className='text-[#999999] text-[14px] font-bold leading-[160%] tracking-[1.4px] w-[76px] h-[22px] whitespace-nowrap flex-shrink-0'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            選考中企業
          </span>
          <div className='flex flex-col gap-2 flex-1 min-[1440px]:w-[256px] h-auto min-[1440px]:h-[52px] justify-center'>
            <span className='text-[#323232] text-[14px] font-bold leading-[160%] tracking-[1.4px] underline w-full min-[1440px]:w-[256px] h-[22px] truncate'>
              {candidate.targetCompany}
            </span>
            {candidate.targetCompany && (
              <span className='text-[#323232] text-[14px] font-bold leading-[160%] tracking-[1.4px] underline w-full min-[1440px]:w-[256px] h-[22px] truncate'>
                {candidate.targetCompany}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Progress and Status */}
      <div className='w-full min-[1440px]:w-[860px] flex flex-col gap-4'>
        {/* Group and Job */}
        <div className='flex flex-col sm:flex-row gap-[18px] items-stretch sm:items-center w-full min-[1440px]:w-[860px] h-auto sm:h-[38px]'>
          <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-full sm:w-[240px] h-[38px] flex items-center justify-center flex-shrink-0'>
            <span
              className='text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] text-center w-full sm:w-[200px] h-[22px] truncate'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              {candidate.group}
            </span>
          </div>
          <div
            className='flex-1 flex gap-4 items-center w-full sm:w-[602px] h-[38px]'
            onClick={e => e.stopPropagation()}
          >
            <div className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-1 w-full text-[#323232] text-[16px] tracking-[1.6px] h-[38px] flex items-center'>
              {candidate.targetJob || '未選択'}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2'>
          {/* 応募 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              応募
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[10px] font-bold tracking-[1px]'>
              {candidate.applicationDate || 'yyyy/mm/dd'}
            </div>
          </div>

          {/* 書類選考 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              書類選考
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            {candidate.firstScreening ? (
              <button
                className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                style={{
                  background:
                    'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}
              >
                合否登録
              </button>
            ) : (
              <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                -
              </div>
            )}
          </div>

          {/* 一次面接 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              一次面接
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>

          {/* 二次以降 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              二次以降
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>

          {/* 最終面接 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              最終面接
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>

          {/* 内定 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              内定
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            {candidate.offer ? (
              <button
                className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                style={{
                  background:
                    'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}
              >
                合否登録
              </button>
            ) : (
              <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                -
              </div>
            )}
          </div>

          {/* 入社 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              入社
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>
        </div>

        {/* Assigned Users */}
        <div className='h-[66px] flex items-center'>
          <p className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
            やりとりしている担当者：{candidate.assignedUsers.join('、')}
          </p>
        </div>
      </div>
    </div>
  );
}

export function RecruitmentPageClient({ 
  candidates, 
  groupOptions, 
  jobOptions 
}: RecruitmentPageClientProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [keyword, setKeyword] = useState<string>('');
  const [excludeDeclined, setExcludeDeclined] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateData | null>(null);
  const [statusTabs, setStatusTabs] = useState<StatusTab[]>([
    { id: 'all', label: 'すべて', active: true },
    { id: 'not_sent', label: 'スカウト未送信', active: false },
    { id: 'waiting', label: '応募待ち', active: false },
    { id: 'applied', label: '応募受付', active: false },
    { id: 'document_passed', label: '書類選考通過', active: false },
    { id: 'first_interview', label: '一次面接通過', active: false },
    { id: 'second_interview', label: '二次面接通過', active: false },
    { id: 'final_interview', label: '最終面接通過', active: false },
    { id: 'offer', label: '内定', active: false },
  ]);
  const [sortOrder, setSortOrder] = useState<'progress' | 'date'>('progress');
  
  // ページネーション関連のstate
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 1ページあたりの表示件数

  const handleStatusTabClick = (tabId: string) => {
    setStatusTabs(tabs =>
      tabs.map(tab => ({
        ...tab,
        active: tab.id === tabId,
      }))
    );
  };

  const handleSearch = () => {
    // 検索処理の実装
    // 検索処理: keyword, selectedGroup, selectedJob, excludeDeclined
  };

  const handleCandidateClick = (candidate: CandidateData) => {
    setSelectedCandidate(candidate);
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  // ページング処理
  const totalPages = Math.max(1, Math.ceil(candidates.length / itemsPerPage)); // 0件でも最低1ページ表示
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCandidates = candidates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div className='bg-[#F9F9F9] px-20 pt-10'>
        <div className='w-full max-w-[1280px] mx-auto'>
          {/* Page Title */}
          <div className='flex items-center gap-4 mb-10'>
            <BoardIcon />
            <h1
              className='text-[#141414] text-[24px] font-bold tracking-[2.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              進捗管理
            </h1>
          </div>

          {/* Filters Section */}
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
                      onClick={() => handleStatusTabClick(tab.id)}
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
                  onChange={setExcludeDeclined}
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
                  onChange={setSelectedGroup}
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
                  onChange={setSelectedJob}
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setKeyword(e.target.value)
                  }
                  placeholder='キーワード検索'
                  className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-1 w-60 text-[#999999] text-[16px] tracking-[1.6px] placeholder:text-[#999999]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                />
                <Button
                  variant='small-green'
                  size='figma-small'
                  className='px-6 py-2'
                  onClick={handleSearch}
                >
                  検索
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className='bg-[#f9f9f9] px-20 py-10 min-h-[577px]'>
        <div className='w-full max-w-[1280px] mx-auto'>
          {/* Sort Options and Pagination Info */}
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-4'>
            {/* Sort Options */}
            <div className='flex items-center gap-4 h-9 w-full lg:w-[370px]'>
              <div className='flex'>
                <button
                  onClick={() => setSortOrder('progress')}
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
                  onClick={() => setSortOrder('date')}
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

            {/* Pagination Info */}
            <div className='flex items-center gap-2'>
              <ChevronLeftIcon />
              <span
                className='text-[#323232] text-[12px] font-bold tracking-[1.2px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                {candidates.length > 0 ? `${startIndex + 1}〜${Math.min(endIndex, candidates.length)}件 / ${candidates.length}件` : '0件 / 0件'}
              </span>
              <ChevronRightIcon />
            </div>
          </div>

          {/* Candidate Cards */}
          <div className='flex flex-col gap-4'>
            {paginatedCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={handleCandidateClick}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-10 mb-10"
          />
        </div>
      </div>

      {/* スライドメニュー */}
      <CandidateSlideMenu
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        candidateId={selectedCandidate?.id}
        candidateData={
          selectedCandidate
            ? {
                id: selectedCandidate.id,
                name: selectedCandidate.name,
                company: selectedCandidate.company,
                location: selectedCandidate.location,
                age: selectedCandidate.age,
                gender: selectedCandidate.gender,
                income: '500〜600万円',
                lastLogin: '2024/03/15',
                lastUpdate: '2024/03/10',
                registrationDate: '2024/01/01',
                tags: {
                  isHighlighted: true,
                  isCareerChange: true,
                },
              }
            : undefined
        }
      />
    </>
  );
}
