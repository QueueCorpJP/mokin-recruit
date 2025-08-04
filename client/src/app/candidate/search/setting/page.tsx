import React, { Suspense } from 'react';
import CandidateSearchServerComponent from './CandidateSearchServerComponent';

interface CandidateSearchPageProps {
  searchParams?: {
    keyword?: string;
    location?: string;
    salaryMin?: string;
    industries?: string | string[];
    jobTypes?: string | string[];
    appealPoints?: string | string[];
    page?: string;
  };
}

function LoadingSpinner() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-[#f9f9f9]'>
      <div className='text-center'>
        <div className='w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4'></div>
        <p className='text-gray-500'>読み込み中...</p>
      </div>
    </div>
  );
}

// ✅ 関数定義が必要
export default function CandidateSearchPage({ searchParams }: CandidateSearchPageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CandidateSearchServerComponent searchParams={searchParams} />
    </Suspense>
  );
}
