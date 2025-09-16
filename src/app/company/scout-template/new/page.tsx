import React from 'react';
import ScoutTemplateNewClient from './ScoutTemplateNewClient';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { getCompanyGroups, type GroupOption } from './actions';

export default async function ScoutTemplateNewPage() {
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

  // サーバーサイドでグループ一覧を取得
  let groupOptions: GroupOption[] = [];
  let _error: string | null = null;

  try {
    groupOptions = await getCompanyGroups();
  } catch (err) {
    _error = 'グループ情報の取得に失敗しました';
    console.error('Failed to fetch company groups:', err);
    groupOptions = [{ value: '', label: '未選択' }];
  }

  return <ScoutTemplateNewClient initialGroupOptions={groupOptions} />;
}
