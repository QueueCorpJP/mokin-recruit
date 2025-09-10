import React, { Suspense } from 'react';
import { getCompanyDetailData, getCompanyJobPostings } from './actions';
import CompanyDetailClient from './CompanyDetailClient';

interface CompanyDetailPageProps {
  params: Promise<{ company_id: string }>;
}

function LoadingSpinner() {
  return (
    <div className='w-full h-screen flex items-center justify-center bg-[#f9f9f9]'>
      <div className='text-center'>
        <p className='text-gray-500'>読み込み中...</p>
      </div>
    </div>
  );
}

export default async function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const { company_id } = await params;
  
  // 企業情報と求人情報を並列で取得（パフォーマンス向上）
  const [companyData, jobPostings] = await Promise.all([
    getCompanyDetailData(company_id),
    getCompanyJobPostings(company_id)
  ]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CompanyDetailClient 
        initialCompanyData={companyData} 
        jobPostings={jobPostings}
      />
    </Suspense>
  );
}