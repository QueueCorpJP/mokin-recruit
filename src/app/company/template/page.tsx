import React from 'react';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { TemplateClient } from './TemplateClient';
import { getMessageTemplates } from './actions';

export default async function TemplatePage() {
  console.log('🚀 TemplatePage loading...');

  // 企業ユーザー認証（統一パターン）
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

  // サーバーサイドでメッセージテンプレートを取得
  let initialMessageTemplates: any[] = [];
  let error = null;

  try {
    console.log('📡 Calling getMessageTemplates...');
    const result = await getMessageTemplates(50, 0);
    console.log('📊 getMessageTemplates result:', result);

    if (result.success) {
      initialMessageTemplates = result.data;
      console.log('✅ Templates loaded:', initialMessageTemplates.length);
    } else {
      error = (result as any).error || 'エラーが発生しました';
      console.error(
        '❌ Failed to fetch message templates:',
        (result as any).error || 'エラーが発生しました'
      );
    }
  } catch (err) {
    error = 'サーバーエラーが発生しました';
    console.error('💥 Exception fetching message templates:', err);
  }

  return (
    <TemplateClient
      initialMessageTemplates={initialMessageTemplates}
      initialError={error || null}
      companyUserId={auth.data.companyUserId}
    />
  );
}
