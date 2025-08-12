import { createServerAdminClient } from '@/lib/supabase/server-admin';
import NewMediaForm from './NewMediaForm';
import { saveArticle } from './actions';

export default async function NewMediaPage() {
  // サーバーサイドでカテゴリを取得
  const supabase = createServerAdminClient();
  const { data: categories, error } = await supabase
    .from('article_categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('カテゴリの読み込みに失敗:', error);
  }

  return (
    <NewMediaForm 
      categories={categories || []} 
      saveArticle={saveArticle}
    />
  );
}