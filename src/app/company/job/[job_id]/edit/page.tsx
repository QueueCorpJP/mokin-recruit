import React, { Suspense } from 'react';
import { getCompanyGroups, getJobDetail } from '../../actions';
import { notFound } from 'next/navigation';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import JobEditClient from './JobEditClient';

interface PageProps {
  params: {
    job_id: string;
  };
}

// データ取得を行うサーバーコンポーネント
async function JobEditServerComponent({ jobId }: { jobId: string }) {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return (
      <div className="min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20">
        <main className="w-full max-w-[1280px] mx-auto">
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }
  // 並列でデータを取得
  const [groupsResult, jobResult] = await Promise.all([
    getCompanyGroups(),
    getJobDetail(jobId)
  ]);
  
  // エラーハンドリング
  if (!groupsResult.success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
          <p className="text-gray-600">{groupsResult.error}</p>
        </div>
      </div>
    );
  }

  if (!jobResult.success) {
    notFound();
  }

  const companyGroups = groupsResult.data || [];
  const jobData = jobResult.data;

  return (
    <JobEditClient 
      initialCompanyGroups={companyGroups}
      jobData={jobData}
      jobId={jobId}
    />
  );
}

// ローディング中の表示
function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-16 h-16 border-4 border-[#0f9058] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-[#323232] text-lg font-medium">読み込み中...</p>
      </div>
    </div>
  );
}

export default function JobEditPage({ params }: PageProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobEditServerComponent jobId={params.job_id} />
    </Suspense>
  );
}