import React from 'react';
import ScoutTemplateEditClient from './ScoutTemplateEditClient';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
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
  let templateData: ScoutTemplateData | null = null;
  let error: string | null = null;
  
  try {
    console.log('📋 Fetching template data for ID:', templateId);

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
