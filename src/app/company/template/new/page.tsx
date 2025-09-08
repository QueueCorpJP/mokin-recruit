
import React from 'react';
import TemplateNewClient from './TemplateNewClient';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getCompanyGroups, type GroupOption } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

// NOTE: サーバーコンポーネント（ユーザー情報取得のため）
export default async function TemplateNewPage() {
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // サーバーサイドでグループ一覧を取得
  let groupOptions: GroupOption[] = [];
  let error: string | null = null;
  
  try {
    groupOptions = await getCompanyGroups();
  } catch (err) {
    error = 'グループ情報の取得に失敗しました';
    console.error('Failed to fetch company groups:', err);
    groupOptions = [{ value: '', label: '未選択' }];
  }

  return <TemplateNewClient initialGroupOptions={groupOptions} />;
}
