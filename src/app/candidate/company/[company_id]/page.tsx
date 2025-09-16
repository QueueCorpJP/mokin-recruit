import React, { Suspense } from 'react';
import { getCompanyDetailData, getCompanyJobPostings } from './actions';
import CompanyDetailClient from './CompanyDetailClient';
import Loading from './loading';

interface CompanyDetailPageProps {
  params: Promise<{ company_id: string }>;
}

export default async function CompanyDetailPage({
  params,
}: CompanyDetailPageProps) {
  const { company_id } = await params;

  // 企業情報と求人情報を並列で取得（パフォーマンス向上）
  const [companyData, jobPostings] = await Promise.all([
    getCompanyDetailData(company_id),
    getCompanyJobPostings(company_id),
  ]);

  return (
    <Suspense fallback={<Loading />}>
      <CompanyDetailClient
        initialCompanyData={companyData}
        jobPostings={jobPostings}
      />
    </Suspense>
  );
}
