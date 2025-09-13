import React from 'react';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { TemplateClient } from './TemplateClient';
import { getMessageTemplates } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function TemplatePage() {
  if (process.env.NODE_ENV === 'development') console.log('🚀 TemplatePage loading...');
  
  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  if (process.env.NODE_ENV === 'development') console.log('👤 Page companyUser:', companyUser ? {
    id: companyUser.id,
    email: companyUser.email,
    userType: companyUser.userType,
    company_account_id: companyUser.user_metadata?.company_account_id
  } : 'not found');
  
  if (!companyUser) {
    if (process.env.NODE_ENV === 'development') console.log('🔄 Redirecting to login...');
    redirect('/company/auth/login');
  }

  // サーバーサイドでメッセージテンプレートを取得
  let initialMessageTemplates = [];
  let error = null;
  
  try {
    if (process.env.NODE_ENV === 'development') console.log('📡 Calling getMessageTemplates...');
    const result = await getMessageTemplates(50, 0);
    if (process.env.NODE_ENV === 'development') console.log('📊 getMessageTemplates result:', result);
    
    if (result.success) {
      initialMessageTemplates = result.data;
      if (process.env.NODE_ENV === 'development') console.log('✅ Templates loaded:', initialMessageTemplates.length);
    } else {
      error = result.error;
      if (process.env.NODE_ENV === 'development') console.error('❌ Failed to fetch message templates:', result.error);
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    if (process.env.NODE_ENV === 'development') console.error('💥 Exception fetching message templates:', err);
  }

  return (
    <TemplateClient 
      initialMessageTemplates={initialMessageTemplates}
      initialError={error}
      companyUserId={companyUser.id}
    />
  );
}
