import React, { Suspense } from 'react';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getCompanyGroups } from '../actions';
import JobNewClient from './JobNewClient';

// データ取得を行うサーバーコンポーネント
async function JobNewServerComponent() {
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