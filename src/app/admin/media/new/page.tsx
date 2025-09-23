import { createServerAdminClient } from '@/lib/supabase/server-admin';
import { saveArticle } from './actions';
import NewMediaPageClient from './NewMediaPageClient';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
}

async function fetchCategoriesAndTags(): Promise<{
  categories: Category[];
  tags: Tag[];
}> {
  const supabase = createServerAdminClient();

  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from('article_categories').select('*').order('name'),
    supabase.from('article_tags').select('*').order('name'),
  ]);

  if (categoriesResult.error) {
    console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  if (tagsResult.error) {
    console.error('タグの読み込みに失敗:', tagsResult.error);
  }

  return {
    categories: categoriesResult.data || [],
    tags: tagsResult.data || [],
  };
}

export default async function NewMediaPage() {
  const { categories, tags } = await fetchCategoriesAndTags();

  return (
    <NewMediaPageClient
      categories={categories}
      tags={tags}
      saveArticle={saveArticle}
    />
  );
}
