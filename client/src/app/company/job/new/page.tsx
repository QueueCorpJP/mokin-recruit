import React from 'react';
import { getCompanyGroups } from '../actions';
import JobNewClient from './JobNewClient';

export default async function JobNewPage() {
  // サーバーサイドで企業グループ情報を取得
  const groupsResult = await getCompanyGroups();
  
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

  const companyGroups = groupsResult.data || [];

  return (
    <JobNewClient 
      initialCompanyGroups={companyGroups}
    />
  );
}