'use client';
import React, { ChangeEvent, useState } from 'react';
import { CandidateSlideMenu } from './CandidateSlideMenu';
import { CandidateData } from '@/lib/server/candidate/recruitment-queries';
import { useRecruitmentPage } from './hooks/useRecruitmentPage';
import { Pagination } from '@/components/ui/Pagination';
import { CandidateCard } from './components/CandidateCard';
import { BoardIcon } from './components/icons/BoardIcon';
import { ChevronLeftIcon } from './components/icons/ChevronLeftIcon';
import { ChevronRightIcon } from './components/icons/ChevronRightIcon';
import { RecruitmentFilterBar } from './components/RecruitmentFilterBar';
import { SortOrderTabs } from './components/SortOrderTabs';

interface StatusTab {
  id: string;
  label: string;
  active: boolean;
}

interface RecruitmentPageClientProps {
  candidates: CandidateData[];
  groupOptions: Array<{ value: string; label: string }>;
  jobOptions: Array<{ value: string; label: string }>;
  companyGroups: Array<{ value: string; label: string }>;
}

export function RecruitmentPageClient({
  candidates,
  groupOptions,
  jobOptions,
  companyGroups,
}: RecruitmentPageClientProps) {
  const page = useRecruitmentPage({
    initialCandidates: candidates,
    groupOptions,
    jobOptions,
  });

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
          <RecruitmentFilterBar
            statusTabs={page.statusTabs}
            onStatusTabClick={page.handleStatusTabClick}
            excludeDeclined={page.excludeDeclined}
            onExcludeDeclinedChange={page.setExcludeDeclined}
            groupOptions={page.groupOptions}
            selectedGroup={page.selectedGroup}
            onGroupChange={page.setSelectedGroup}
            jobOptions={page.jobOptions}
            selectedJob={page.selectedJob}
            onJobChange={page.setSelectedJob}
            keyword={page.keyword}
            onKeywordChange={page.setKeyword}
            onSearch={page.handleSearch}
          />
        </div>
      </div>

      {/* Main Content Section */}
      <div className='bg-[#f9f9f9] px-20 py-10 min-h-[577px]'>
        <div className='w-full max-w-[1280px] mx-auto'>
          {/* Sort Options and Pagination Info */}
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 gap-4'>
            {/* Sort Options */}
            <SortOrderTabs
              sortOrder={page.sortOrder}
              onSortOrderChange={page.setSortOrder}
            />
            {/* Pagination Info */}
            <div className='flex items-center gap-2'>
              <ChevronLeftIcon />
              <span
                className='text-[#323232] text-[12px] font-bold tracking-[1.2px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                {page.paginatedCandidates.length > 0
                  ? `${page.startIndex + 1}〜${Math.min(
                      page.endIndex,
                      candidates.length
                    )}件 / ${candidates.length}件`
                  : '0件 / 0件'}
              </span>
              <ChevronRightIcon />
            </div>
          </div>

          {/* Candidate Cards */}
          <div className='flex flex-col gap-4'>
            {page.paginatedCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => page.handleCandidateClick(candidate)}
                jobOptions={page.jobOptions}
                onJobChange={page.handleJobChange}
                companyGroupId={companyGroups[0]?.value}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page.currentPage}
            totalPages={page.totalPages}
            onPageChange={page.handlePageChange}
            className='mt-10 mb-10'
          />
        </div>
      </div>

      {/* スライドメニュー */}
      <CandidateSlideMenu
        isOpen={page.isMenuOpen}
        onClose={page.handleCloseMenu}
        candidateId={page.selectedCandidate?.id}
        candidateData={page.selectedCandidate || undefined}
        companyGroupId={companyGroups[0]?.value}
        jobOptions={page.jobOptions}
        onJobChange={page.handleJobChange}
      />
    </>
  );
}
