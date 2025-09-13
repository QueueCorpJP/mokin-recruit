import React from 'react';
import { getCandidatesData, getGroupOptions, getJobOptions } from '@/lib/server/candidate/recruitment-queries';
import { getCompanyGroups } from '@/lib/actions/search-history';
import { RecruitmentPageClient } from './detail/RecruitmentPageClient';

export default async function RecruitmentPage() {
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
