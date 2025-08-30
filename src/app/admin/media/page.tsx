import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { Article } from '@/app/admin/media/actions';
import MediaPageClient from './MediaPageClient';

async function fetchMediaArticles(): Promise<Article[]> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      article_category_relations (
        article_categories (
          id,
          name,
          description
        )
      )
    `
    )
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  if (!data) return [];
  // DTO整形
  return data.map((article: any) => ({
    ...article,
    category:
      article.article_category_relations?.[0]?.article_categories || null,
    categories:
      article.article_category_relations?.map(
        (rel: any) => rel.article_categories
      ) || [],
  })) as Article[];
}

export default async function MediaPage() {
  const articles = await fetchMediaArticles();
  return <MediaPageClient articles={articles} />;
}
