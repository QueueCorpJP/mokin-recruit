import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getJobDetailData } from './actions';
import Loading from './loading';

// クライアントコンポーネントを動的インポート
const CandidateSearchSettingClient = dynamic(
  () => import('./CandidateSearchSettingClient'),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

interface CandidateSearchSettingPageProps {
  params: Promise<{ id: string }>;
}

export default async function CandidateSearchSettingPage({
  params,
}: CandidateSearchSettingPageProps) {
  const { id } = await params;

  // 初期データを非同期で取得し、エラーハンドリングを改善
  let jobData;
  try {
    jobData = await getJobDetailData(id);
  } catch (error) {
    console.error('Failed to fetch job data:', error);
    jobData = null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <CandidateSearchSettingClient initialJobData={jobData} />
    </Suspense>
  );
}
