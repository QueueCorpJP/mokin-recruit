import React from 'react';
import { getCandidatesData, getGroupOptions, getJobOptions } from '@/lib/server/candidate/recruitment-queries';
import { getCompanyGroups } from '@/lib/actions/search-history';
import { RecruitmentPageClient } from './RecruitmentPageClient';
import { requireCompanyAuthForAction } from '@/lib/auth/server';

export default async function JobDetailPage() {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  const [candidates, groupOptions, jobOptions, companyGroupsResult] = await Promise.all([
    getCandidatesData(),
    getGroupOptions(),
    getJobOptions(),
    getCompanyGroups(),
  ]);

  const companyGroups = companyGroupsResult.success 
    ? companyGroupsResult.data.map(group => ({
        value: group.id,
        label: group.name
      }))
    : [];

  return (
    <RecruitmentPageClient
      candidates={candidates}
      groupOptions={groupOptions}
      jobOptions={jobOptions}
      companyGroups={companyGroups}
    />
  );
}