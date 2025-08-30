import React, { Suspense } from 'react';
import { getCompanyGroups } from '../actions';
import JobNewClient from './JobNewClient';

// データ取得を行うサーバーコンポーネント
async function JobNewServerComponent() {
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

export default function JobNewPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <JobNewServerComponent />
    </Suspense>
  );
}