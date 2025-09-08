import React from 'react';
import ScoutTemplateNewClient from './ScoutTemplateNewClient';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getCompanyGroups } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ScoutTemplateNewPage() {
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // サーバーサイドでグループ一覧を取得
  let groupOptions = [];
  let error = null;
  
  try {
    groupOptions = await getCompanyGroups();
  } catch (err) {
    error = 'グループ情報の取得に失敗しました';
    console.error('Failed to fetch company groups:', err);
    groupOptions = [{ value: '', label: '未選択' }];
  }

  return <ScoutTemplateNewClient initialGroupOptions={groupOptions} />;
}
