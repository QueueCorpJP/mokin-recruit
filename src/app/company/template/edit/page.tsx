
import React from 'react';
import TemplateEditClient from './TemplateEditClient';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getCompanyGroups, type GroupOption, type MessageTemplateData } from '../new/actions';
import { getMessageTemplateById } from '../actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface TemplateEditPageProps {
  searchParams: { id?: string };
}

export default async function TemplateEditPage({ searchParams }: TemplateEditPageProps) {
  const templateId = searchParams.id;
  
  if (!templateId) {
    redirect('/company/template');
  }

  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // サーバーサイドでグループ一覧を取得
  let groupOptions: GroupOption[] = [];
  let templateData: MessageTemplateData | null = null;
  let error: string | null = null;
  
  try {
    if (process.env.NODE_ENV === 'development') console.log('📋 Fetching template data for ID:', templateId);
    if (process.env.NODE_ENV === 'development') console.log('👤 Company user ID:', companyUser.id);
    if (process.env.NODE_ENV === 'development') console.log('🏢 Company account ID:', companyUser.user_metadata?.company_account_id);

    const [groups, template] = await Promise.all([
      getCompanyGroups(),
      getMessageTemplateById(templateId)
    ]);
    
    if (process.env.NODE_ENV === 'development') console.log('📊 Groups result:', groups);
    if (process.env.NODE_ENV === 'development') console.log('📝 Template result:', template);
    
    groupOptions = groups;
    
    if (template.success) {
      templateData = template.data;
    } else {
      error = template.error || 'テンプレートが見つかりません';
      if (process.env.NODE_ENV === 'development') console.error('❌ Template fetch failed:', template.error);
    }
  } catch (err) {
    error = 'データの取得に失敗しました';
    if (process.env.NODE_ENV === 'development') console.error('💥 Exception in data fetch:', err);
    groupOptions = [{ value: '', label: '未選択' }];
  }

  if (error) {
    if (process.env.NODE_ENV === 'development') console.log('🔄 Redirecting due to error:', error);
    redirect('/company/template');
  }

  return (
    <TemplateEditClient 
      initialGroupOptions={groupOptions}
      templateData={templateData}
      templateId={templateId}
    />
  );
}
