import { createServerAdminClient } from '@/lib/supabase/server-admin';
import NewMediaForm from './NewMediaForm';
import { saveArticle } from './actions';

export default async function NewMediaPage() {
  // サーバーサイドでカテゴリとタグを取得
  const supabase = createServerAdminClient();
  
  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from('article_categories').select('*').order('name'),
    supabase.from('article_tags').select('*').order('name')
  ]);

  if (categoriesResult.error) {
    console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  if (tagsResult.error) {
    console.error('タグの読み込みに失敗:', tagsResult.error);
  }

  return (
    <NewMediaForm 
      categories={categoriesResult.data || []} 
      tags={tagsResult.data || []}
      saveArticle={saveArticle}
    />
  );
}