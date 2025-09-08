import React from 'react';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { ScoutTemplateClient } from './ScoutTemplateClient';
import { getScoutTemplates } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ScoutTemplatePage() {
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // サーバーサイドでスカウトテンプレートを取得
  let initialScoutTemplates = [];
  let error = null;
  
  try {
    const result = await getScoutTemplates(50, 0);
    if (result.success) {
      initialScoutTemplates = result.data;
    } else {
      error = result.error;
      console.error('Failed to fetch scout templates:', result.error);
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    console.error('Failed to fetch initial scout templates:', err);
  }

  return (
    <ScoutTemplateClient 
      initialScoutTemplates={initialScoutTemplates}
      initialError={error}
      companyUserId={companyUser.id}
    />
  );
}
