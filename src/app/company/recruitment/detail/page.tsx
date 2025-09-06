import React from 'react';
import { getCandidatesData, getGroupOptions, getJobOptions } from '@/lib/server/candidate/recruitment-queries';
import { RecruitmentPageClient } from './RecruitmentPageClient';

export default async function JobDetailPage() {
  const [candidates, groupOptions, jobOptions] = await Promise.all([
    getCandidatesData(),
    getGroupOptions(),
    getJobOptions(),
  ]);

  return (
    <RecruitmentPageClient
      candidates={candidates}
      groupOptions={groupOptions}
      jobOptions={jobOptions}
    />
  );
}