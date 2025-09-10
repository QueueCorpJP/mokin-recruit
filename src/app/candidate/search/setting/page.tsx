import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCachedCandidateUser } from '@/lib/auth/server';
import CandidateSearchClient from './CandidateSearchClient';
import { getJobSearchData } from './actions';

function LoadingSpinner() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-[#f9f9f9]'>
      <div className='text-center'>
        <p className='text-gray-500'>読み込み中...</p>
      </div>
    </div>
  );
}

// 初期表示で最新求人を表示（匿名ユーザー対応）
export default async function CandidateSearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // 認証チェック（オプショナル - 匿名ユーザーも可）
  const user = await getCachedCandidateUser();

  // URLパラメータから検索条件を解析
  const searchConditions = {
    keyword: typeof searchParams.keyword === 'string' ? searchParams.keyword : '',
    location: typeof searchParams.location === 'string' ? searchParams.location : '',
    salaryMin: typeof searchParams.salaryMin === 'string' ? searchParams.salaryMin : '',
    industries: typeof searchParams.industries === 'string' ? searchParams.industries.split(',').filter(Boolean) : [],
    jobTypes: typeof searchParams.jobTypes === 'string' ? searchParams.jobTypes.split(',').filter(Boolean) : [],
    appealPoints: typeof searchParams.appealPoints === 'string' ? searchParams.appealPoints.split(',').filter(Boolean) : [],
    page: typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1,
    limit: 10
  };

  // 初期データを取得（検索条件があれば条件付き、なければ最新順全件）
  const initialData = await getJobSearchData(searchConditions);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CandidateSearchClient 
        initialJobs={initialData.success ? initialData.data?.jobs || [] : []}
        initialPagination={initialData.success ? initialData.data?.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        } : {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }}
        initialSearchConditions={searchConditions}
      />
    </Suspense>
  );
}
