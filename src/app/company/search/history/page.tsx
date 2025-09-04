import React from 'react';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getSearchHistory } from '@/lib/actions/search-history';
import { SearchHistoryClient } from './SearchHistoryClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SearchHistoryPage() {
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // 検索履歴を取得
  const searchHistoryResult = await getSearchHistory();
  
  if (!searchHistoryResult.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-[1280px] mx-auto px-10 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">検索履歴</h1>
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">検索履歴の取得に失敗しました</p>
              <p className="text-gray-600">{searchHistoryResult.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SearchHistoryClient 
      initialSearchHistory={searchHistoryResult.data} 
      companyUserId={companyUser.id}
    />
  );
}
