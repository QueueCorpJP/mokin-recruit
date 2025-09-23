import { createServerAdminClient } from '@/lib/supabase/server-admin';
import NoticeNewClient from './NoticeNewClient';
import { saveNotice } from './actions';

export default async function AdminNoticeNewPage() {
  // サーバーサイドでカテゴリと既存タイトルを取得
  const supabase = createServerAdminClient();

  const [categoriesResult, titlesResult] = await Promise.all([
    supabase.from('notice_categories').select('*').order('name'),
    supabase
      .from('notices')
      .select('title')
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  if (categoriesResult.error) {
    console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  if (titlesResult.error) {
    console.error('タイトルの読み込みに失敗:', titlesResult.error);
  }

  const existingTitles =
    titlesResult.data?.map(notice => notice.title).filter(Boolean) || [];

  return (
    <NoticeNewClient
      categories={categoriesResult.data || []}
      existingTitles={existingTitles}
      saveNotice={saveNotice}
    />
  );
}
