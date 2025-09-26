import React from 'react';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { SearchHistoryClient } from './SearchHistoryClient';
import { getSearchHistory } from '@/lib/actions/search-history';

export default async function SearchHistoryPage() {
  // 企業ユーザー認証（統一パターン）
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

  // サーバーサイドで検索履歴を取得（WHEREによる手動フィルタリング）
  let initialSearchHistory = [];
  let error = null;

  try {
    const result = await getSearchHistory(undefined, 50, 0);
    if (result.success) {
      initialSearchHistory = result.data || [];
      console.log(
        '[SearchHistoryPage] Data fetched successfully, count:',
        initialSearchHistory.length
      );
      if (initialSearchHistory.length > 0) {
        console.log(
          '[SearchHistoryPage] First item:',
          JSON.stringify(initialSearchHistory[0], null, 2)
        );
      }
    } else {
      error = (result as any).error || 'エラーが発生しました';
      console.error(
        'Failed to fetch search history:',
        (result as any).error || 'エラーが発生しました'
      );
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    console.error('Failed to fetch initial search history:', err);
  }

  return (
    <SearchHistoryClient
      initialSearchHistory={initialSearchHistory}
      initialError={error || null}
      companyUserId={auth.data.companyUserId}
    />
  );
}
