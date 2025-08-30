import React, { Suspense } from 'react';
import { getJobDetailData } from './actions';
import CandidateSearchSettingClient from './CandidateSearchSettingClient';
import { SpinnerIcon } from '@/components/ui/Loading';

interface CandidateSearchSettingPageProps {
  params: Promise<{ id: string }>;
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

export default async function CandidateSearchSettingPage({ params }: CandidateSearchSettingPageProps) {
  const { id } = await params;
  const jobData = await getJobDetailData(id);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CandidateSearchSettingClient initialJobData={jobData} />
    </Suspense>
  );
}