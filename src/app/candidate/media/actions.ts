'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export interface PopularArticle {
  id: string;
  title: string;
  views_count: number;
  published_at: string;
  created_at: string;
  excerpt?: string;
  content?: any;
  thumbnail_url?: string;
}

export interface ArticleCategory {
  name: string;
  count: number;
}

export interface ArticleTag {
  name: string;
  count: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: any;
  thumbnail_url: string;
  published_at: string;
  created_at: string;
  categories: string[];
  tags: string[];
}

export async function getPopularArticles(limit: number = 5): Promise<PopularArticle[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, views_count, published_at, created_at, excerpt, content, thumbnail_url')
      .eq('status', 'PUBLISHED')
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('人気記事の取得エラー:', error);
    return [];
  }
}

export async function getMediaCategories(): Promise<ArticleCategory[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('article_categories')
      .select(`
        name,
        article_category_relations!inner(
          articles!inner(
            id,
            status
          )
        )
      `)
      .eq('article_category_relations.articles.status', 'PUBLISHED');

    if (error) throw error;

    const categoryMap = new Map<string, number>();
    
    data?.forEach((category: any) => {
      const categoryName = category.name;
      const currentCount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentCount + 1);
    });

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  } catch (error) {
    console.error('カテゴリー取得エラー:', error);
    return [];
  }
}

export async function getMediaTags(): Promise<ArticleTag[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('article_tags')
      .select(`
        name,
        article_tag_relations!inner(
          articles!inner(
            id,
            status
          )
        )
      `)
      .eq('article_tag_relations.articles.status', 'PUBLISHED');

    if (error) throw error;

    const tagMap = new Map<string, number>();
    
    data?.forEach((tag: any) => {
      const tagName = tag.name;
      const currentCount = tagMap.get(tagName) || 0;
      tagMap.set(tagName, currentCount + 1);
    });

    return Array.from(tagMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  } catch (error) {
    console.error('タグ取得エラー:', error);
    return [];
  }
}

export async function getArticles(limit: number = 20, offset: number = 0): Promise<Article[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        article_category_relations(
          article_categories(name)
        ),
        article_tag_relations(
          article_tags(name)
        )
      `)
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      thumbnail_url: article.thumbnail_url,
      published_at: article.published_at || '',
      created_at: article.created_at,
      categories: article.article_category_relations?.map(rel => (rel.article_categories as any)?.name) || [],
      tags: article.article_tag_relations?.map(rel => (rel.article_tags as any)?.name) || []
    })) || [];
  } catch (error) {
    console.error('記事取得エラー:', error);
    return [];
  }
}

export async function getArticlesWithPagination(limit: number = 20, offset: number = 0): Promise<{
  articles: Article[];
  hasMore: boolean;
  total: number;
}> {
  try {
    const supabase = await getSupabaseServerClient();
    const { count } = await supabase
      .from('articles')
      .select('id', { count: 'exact' })
      .eq('status', 'PUBLISHED');

    const articles = await getArticles(limit, offset);
    
    return {
      articles,
      hasMore: offset + limit < (count || 0),
      total: count || 0
    };
  } catch (error) {
    console.error('ページネーション記事取得エラー:', error);
    return {
      articles: [],
      hasMore: false,
      total: 0
    };
  }
}

export async function getSidebarData(): Promise<{
  popularArticles: PopularArticle[];
  categories: ArticleCategory[];
  tags: ArticleTag[];
}> {
  try {
    const [popularArticles, categories, tags] = await Promise.all([
      getPopularArticles(5),
      getMediaCategories(),
      getMediaTags()
    ]);

    return {
      popularArticles,
      categories,
      tags
    };
  } catch (error) {
    console.error('サイドバーデータ取得エラー:', error);
    return {
      popularArticles: [],
      categories: [],
      tags: []
    };
  }
}

export async function getRelatedArticles(currentArticleId: string, limit: number = 6): Promise<Article[]> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        article_category_relations(
          article_categories(name)
        ),
        article_tag_relations(
          article_tags(name)
        )
      `)
      .eq('status', 'PUBLISHED')
      .neq('id', currentArticleId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      thumbnail_url: article.thumbnail_url,
      published_at: article.published_at || '',
      created_at: article.created_at,
      categories: article.article_category_relations?.map(rel => (rel.article_categories as any)?.name) || [],
      tags: article.article_tag_relations?.map(rel => (rel.article_tags as any)?.name) || []
    })) || [];
  } catch (error) {
    console.error('関連記事取得エラー:', error);
    return getArticles(limit);
  }
}