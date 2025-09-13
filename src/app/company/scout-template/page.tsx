import React from 'react';
import { ScoutTemplateClient } from './ScoutTemplateClient';
import { getScoutTemplates, getJobPostings } from './actions';
import { requireCompanyAuthForAction } from '@/lib/auth/server';

export const dynamic = 'force-dynamic';

export default async function ScoutTemplatePage() {
  console.log('🚀 ScoutTemplatePage loading...');
  
  // 統一パターンの認証チェック
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

  // サーバーサイドでスカウトテンプレートと求人データを取得
  let initialScoutTemplates: any[] = [];
  let initialJobPostings: any[] = [];
  let error: string | null = null;
  
  try {
    const [templatesResult, jobPostingsResult] = await Promise.all([
      getScoutTemplates(50, 0).catch(() => null),
      getJobPostings().catch(() => null),
    ]);

    if (templatesResult?.success) {
      initialScoutTemplates = templatesResult.data;
    } else {
      error = templatesResult?.error || 'スカウトテンプレートの取得に失敗しました';
    }

    if (jobPostingsResult?.success) {
      initialJobPostings = jobPostingsResult.data;
    } else {
      // 求人の取得に失敗してもスカウトテンプレートは表示する
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
  }

  return (
    <ScoutTemplateClient 
      initialScoutTemplates={initialScoutTemplates}
      initialJobPostings={initialJobPostings}
      initialError={error}
    />
  );
}
