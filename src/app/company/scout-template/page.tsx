import React from 'react';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { ScoutTemplateClient } from './ScoutTemplateClient';
import { getScoutTemplates } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ScoutTemplatePage() {
  console.log('🚀 ScoutTemplatePage loading...');
  
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  console.log('👤 Page companyUser:', companyUser ? {
    id: companyUser.id,
    email: companyUser.email,
    userType: companyUser.userType,
    company_account_id: companyUser.user_metadata?.company_account_id
  } : 'not found');
  
  if (!companyUser) {
    console.log('🔄 Redirecting to login...');
    redirect('/company/auth/login');
  }

  // サーバーサイドでスカウトテンプレートを取得
  let initialScoutTemplates = [];
  let error = null;
  
  try {
    console.log('📡 Calling getScoutTemplates...');
    const result = await getScoutTemplates(50, 0);
    console.log('📊 getScoutTemplates result:', result);
    
    if (result.success) {
      initialScoutTemplates = result.data;
      console.log('✅ Templates loaded:', initialScoutTemplates.length);
    } else {
      error = result.error;
      console.error('❌ Failed to fetch scout templates:', result.error);
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    console.error('💥 Exception fetching scout templates:', err);
  }

  return (
    <ScoutTemplateClient 
      initialScoutTemplates={initialScoutTemplates}
      initialError={error}
      companyUserId={companyUser.id}
    />
  );
}
