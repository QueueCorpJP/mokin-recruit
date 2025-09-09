import React from 'react';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { TemplateClient } from './TemplateClient';
import { getMessageTemplates } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TemplatePage() {
  console.log('🚀 TemplatePage loading...');
  
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

  // サーバーサイドでメッセージテンプレートを取得
  let initialMessageTemplates = [];
  let error = null;
  
  try {
    console.log('📡 Calling getMessageTemplates...');
    const result = await getMessageTemplates(50, 0);
    console.log('📊 getMessageTemplates result:', result);
    
    if (result.success) {
      initialMessageTemplates = result.data;
      console.log('✅ Templates loaded:', initialMessageTemplates.length);
    } else {
      error = result.error;
      console.error('❌ Failed to fetch message templates:', result.error);
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    console.error('💥 Exception fetching message templates:', err);
  }

  return (
    <TemplateClient 
      initialMessageTemplates={initialMessageTemplates}
      initialError={error}
      companyUserId={companyUser.id}
    />
  );
}
