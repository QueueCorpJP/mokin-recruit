import React from 'react';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { SearchHistoryClient } from './SearchHistoryClient';
import { getSearchHistory } from '@/lib/actions/search-history';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SearchHistoryPage() {
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // サーバーサイドで検索履歴を取得（WHEREによる手動フィルタリング）
  let initialSearchHistory = [];
  let error = null;
  
  try {
    const result = await getSearchHistory(undefined, 50, 0);
    if (result.success) {
      initialSearchHistory = result.data;
    } else {
      error = result.error;
      console.error('Failed to fetch search history:', result.error);
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    console.error('Failed to fetch initial search history:', err);
  }

  return (
    <SearchHistoryClient 
      initialSearchHistory={initialSearchHistory}
      initialError={error}
      companyUserId={companyUser.id}
    />
  );
}
