import React, { Suspense } from 'react';
import CandidateSearchServerComponent from './CandidateSearchServerComponent';
import { SpinnerIcon } from '@/components/ui/Loading';


interface CandidateSearchPageProps {
  searchParams?: Promise<{
    keyword?: string;
    location?: string;
    salaryMin?: string;
    industries?: string | string[];
    jobTypes?: string | string[];
    appealPoints?: string | string[];
    page?: string;
  }>;
}

function LoadingSpinner() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-[#f9f9f9]'>
      <div className='text-center'>
        <SpinnerIcon size="lg" className="mx-auto mb-4" />
        <p className='text-gray-500'>読み込み中...</p>
      </div>
    </div>
  );
}

// ✅ 関数定義が必要
export default async function CandidateSearchPage({ searchParams }: CandidateSearchPageProps) {
  const params = searchParams ? await searchParams : undefined;
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CandidateSearchServerComponent searchParams={params} />
    </Suspense>
  );
}
