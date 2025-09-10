import React from 'react';
import ScoutTemplateEditClient from './ScoutTemplateEditClient';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getCompanyGroups, type GroupOption } from '../new/actions';
import { type ScoutTemplateData } from './actions';
import { getScoutTemplateById } from './actions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ScoutTemplateEditPageProps {
  searchParams: { id?: string };
}

export default async function ScoutTemplateEditPage({ searchParams }: ScoutTemplateEditPageProps) {
  const templateId = searchParams.id;
  
  if (!templateId) {
    redirect('/company/scout-template');
  }

  // 企業ユーザー認証
  const companyUser = await getCachedCompanyUser();
  
  if (!companyUser) {
    redirect('/company/auth/login');
  }

  // サーバーサイドでグループ一覧を取得
  let groupOptions: GroupOption[] = [];
  let templateData: ScoutTemplateData | null = null;
  let error: string | null = null;
  
  try {
    console.log('📋 Fetching template data for ID:', templateId);
    console.log('👤 Company user ID:', companyUser.id);
    console.log('🏢 Company account ID:', companyUser.user_metadata?.company_account_id);

    const [groups, template] = await Promise.all([
      getCompanyGroups(),
      getScoutTemplateById(templateId)
    ]);
    
    console.log('📊 Groups result:', groups);
    console.log('📝 Template result:', template);
    
    groupOptions = groups;
    
    if (template.success) {
      templateData = template.data;
    } else {
      error = template.error || 'テンプレートが見つかりません';
      console.error('❌ Template fetch failed:', template.error);
    }
  } catch (err) {
    error = 'データの取得に失敗しました';
    console.error('💥 Exception in data fetch:', err);
    groupOptions = [{ value: '', label: '未選択' }];
  }

  if (error) {
    console.log('🔄 Redirecting due to error:', error);
    redirect('/company/scout-template');
  }

  return (
    <ScoutTemplateEditClient 
      initialGroupOptions={groupOptions}
      templateData={templateData}
      templateId={templateId}
    />
  );
}
