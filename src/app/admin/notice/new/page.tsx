import { createServerAdminClient } from '@/lib/supabase/server-admin';
import NoticeNewClient from './NoticeNewClient';
import { saveNotice } from './actions';

export default async function AdminNoticeNewPage() {
  // サーバーサイドでカテゴリを取得
  const supabase = createServerAdminClient();
  
  const categoriesResult = await supabase.from('notice_categories').select('*').order('name');

  if (categoriesResult.error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  return (
    <NoticeNewClient 
      categories={categoriesResult.data || []} 
      saveNotice={saveNotice}
    />
  );
}