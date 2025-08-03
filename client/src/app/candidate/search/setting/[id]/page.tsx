import React, { Suspense } from 'react';
import { getJobDetailData } from './actions';
import CandidateSearchSettingClient from './CandidateSearchSettingClient';

interface CandidateSearchSettingPageProps {
  params: Promise<{ id: string }>;
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

export default async function CandidateSearchSettingPage({ params }: CandidateSearchSettingPageProps) {
  const { id } = await params;
  const jobData = await getJobDetailData(id);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CandidateSearchSettingClient initialJobData={jobData} />
    </Suspense>
  );
}