'use server';

import { createClient } from '@/lib/supabase/server';
import type {
  PopularArticle,
  ArticleCategory,
  ArticleTag,
  Article,
} from '@/types';

// Re-export types for components
export type {
  PopularArticle,
  ArticleCategory,
  ArticleTag,
  Article,
} from '@/types';

export async function getNews(
  limit: number = 20,
  offset: number = 0
): Promise<Article[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notices')
      .select(
        `
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        notice_category_relations(
          notice_categories(name)
        )
      `
      )
      .eq('status', 'PUBLISHED')
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return (
      data?.map(notice => ({
        id: notice.id,
        title: notice.title,
        excerpt: notice.excerpt || '',
        content: notice.content,
        thumbnail_url: notice.thumbnail_url || '',
        published_at: notice.published_at || '',
        created_at: notice.created_at,
        categories: notice.notice_category_relations?.map(
          rel => (rel.notice_categories as any)?.name
        ) || ['お知らせ'],
        tags: [], // noticesテーブルにはタグがないため空配列
      })) || []
    );
  } catch (error) {
    console.error('お知らせ取得エラー:', error);
    return [];
  }
}

export async function getNewsWithPagination(
  limit: number = 20,
  offset: number = 0
): Promise<{
  articles: Article[];
  totalCount: number;
}> {
  try {
    const supabase = await createClient();

    // Get count first
    const { count } = await supabase
      .from('notices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PUBLISHED')
      .not('published_at', 'is', null);

    // Get articles
    const articles = await getNews(limit, offset);

    return {
      articles,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('お知らせ取得エラー:', error);
    return {
      articles: [],
      totalCount: 0,
    };
  }
}

export async function getRelatedNews(
  currentArticleId: string,
  limit: number = 6
): Promise<Article[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('notices')
      .select(
        `
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        notice_category_relations(
          notice_categories(name)
        )
      `
      )
      .eq('status', 'PUBLISHED')
      .not('published_at', 'is', null)
      .neq('id', currentArticleId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (
      data?.map(notice => ({
        id: notice.id,
        title: notice.title,
        excerpt: notice.excerpt || '',
        content: notice.content,
        thumbnail_url: notice.thumbnail_url || '',
        published_at: notice.published_at || '',
        created_at: notice.created_at,
        categories: notice.notice_category_relations?.map(
          rel => (rel.notice_categories as any)?.name
        ) || ['お知らせ'],
        tags: [],
      })) || []
    );
  } catch (error) {
    console.error('関連お知らせ取得エラー:', error);
    return getNews(limit);
  }
}

export async function getPopularNews(
  limit: number = 5
): Promise<PopularArticle[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notices')
      .select(
        'id, title, views_count, published_at, created_at, excerpt, content, thumbnail_url'
      )
      .eq('status', 'PUBLISHED')
      .not('published_at', 'is', null)
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('人気お知らせ取得エラー:', error);
    return [];
  }
}

export async function getNewsCategories(): Promise<ArticleCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('notice_categories')
      .select(
        `
        name,
        notice_category_relations!inner(
          notices!inner(
            id,
            status,
            published_at
          )
        )
      `
      )
      .eq('notice_category_relations.notices.status', 'PUBLISHED')
      .not('notice_category_relations.notices.published_at', 'is', null);

    if (error) throw error;

    const categoryMap = new Map<string, number>();

    data?.forEach(
      (category: { name: string; notice_category_relations: any }) => {
        const categoryName = category.name;
        const currentCount = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, currentCount + 1);
      }
    );

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  } catch (error) {
    console.error('お知らせカテゴリー取得エラー:', error);
    return [{ name: 'お知らせ', count: 0 }];
  }
}

export async function getNewsTags(): Promise<ArticleTag[]> {
  // noticesテーブルにはタグ機能がないため空配列を返す
  return [];
}

export async function getSidebarData(): Promise<{
  popularArticles: PopularArticle[];
  categories: ArticleCategory[];
  tags: ArticleTag[];
}> {
  try {
    const [popularArticles, categories, tags] = await Promise.all([
      getPopularNews(5),
      getNewsCategories(),
      getNewsTags(),
    ]);

    return {
      popularArticles,
      categories,
      tags,
    };
  } catch (error) {
    console.error('サイドバーデータ取得エラー:', error);
    return {
      popularArticles: [],
      categories: [],
      tags: [],
    };
  }
}
