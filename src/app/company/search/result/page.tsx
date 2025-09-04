import React from 'react';
import SearchClient from './SearchClient';
import { getCandidatesFromDatabase, parseSearchParams } from './actions';
import { getCompanyGroups } from '../../job/actions';

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // サーバーサイドでデータを取得
  const candidates = await getCandidatesFromDatabase();
  
  // グループ情報をサーバーサイドで取得
  const companyGroupsResult = await getCompanyGroups();
  const companyGroups = companyGroupsResult.success 
    ? companyGroupsResult.data.map(group => ({
        value: group.id,
        label: group.group_name
      }))
    : [];
  
  // URLパラメータをパース
  const urlParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlParams.set(key, value.join(','));
    }
  });
  
  const initialSearchParams = parseSearchParams(urlParams);

  return (
    <div className="min-h-screen bg-gray-100">
      <SearchClient 
        initialCandidates={candidates}
        initialSearchParams={initialSearchParams}
        initialCompanyGroups={companyGroups}
      />
    </div>
  );
}
