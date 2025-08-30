'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

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

export async function getNews(limit: number = 20, offset: number = 0): Promise<Article[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('news') // Assuming news is in a different table
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        news_category_relations(
          news_categories(name)
        ),
        news_tag_relations(
          news_tags(name)
        )
      `)
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      // Fallback to articles table if news table doesn't exist
      const { data: articleData, error: articleError } = await supabase
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

      if (articleError) throw articleError;
      
      return articleData?.map(article => ({
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
    }

    return data?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      thumbnail_url: article.thumbnail_url,
      published_at: article.published_at || '',
      created_at: article.created_at,
      categories: article.news_category_relations?.map(rel => (rel.news_categories as any)?.name) || [],
      tags: article.news_tag_relations?.map(rel => (rel.news_tags as any)?.name) || []
    })) || [];
  } catch (error) {
    console.error('ニュース取得エラー:', error);
    return [];
  }
}

export async function getNewsWithPagination(limit: number = 20, offset: number = 0): Promise<{
  articles: Article[];
  totalCount: number;
}> {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Get count first
    const { count } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PUBLISHED');
    
    // Get articles
    const articles = await getNews(limit, offset);
    
    return {
      articles,
      totalCount: count || 0
    };
  } catch (error) {
    console.error('ニュース取得エラー:', error);
    return {
      articles: [],
      totalCount: 0
    };
  }
}

export async function getRelatedNews(currentArticleId: string, limit: number = 6): Promise<Article[]> {
  try {
    const supabase = getSupabaseAdminClient();
    
    // Try news table first, fallback to articles
    const { data, error } = await supabase
      .from('news')
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        news_category_relations(
          news_categories(name)
        ),
        news_tag_relations(
          news_tags(name)
        )
      `)
      .eq('status', 'PUBLISHED')
      .neq('id', currentArticleId)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) {
      // Fallback to articles
      const { data: articleData, error: articleError } = await supabase
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

      if (articleError) throw articleError;
      
      return articleData?.map(article => ({
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
    }

    return data?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      thumbnail_url: article.thumbnail_url,
      published_at: article.published_at || '',
      created_at: article.created_at,
      categories: article.news_category_relations?.map(rel => (rel.news_categories as any)?.name) || [],
      tags: article.news_tag_relations?.map(rel => (rel.news_tags as any)?.name) || []
    })) || [];
  } catch (error) {
    console.error('関連ニュース取得エラー:', error);
    return getNews(limit);
  }
}

export async function getPopularNews(limit: number = 5): Promise<PopularArticle[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('news')
      .select('id, title, views_count, published_at, created_at, excerpt, content, thumbnail_url')
      .eq('status', 'PUBLISHED')
      .order('views_count', { ascending: false })
      .limit(limit);

    if (error) {
      // Fallback to articles table
      const { data: articleData, error: articleError } = await supabase
        .from('articles')
        .select('id, title, views_count, published_at, created_at, excerpt, content, thumbnail_url')
        .eq('status', 'PUBLISHED')
        .order('views_count', { ascending: false })
        .limit(limit);

      if (articleError) throw articleError;
      return articleData || [];
    }

    return data || [];
  } catch (error) {
    console.error('人気ニュース取得エラー:', error);
    return [];
  }
}

export async function getNewsCategories(): Promise<ArticleCategory[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('news_categories')
      .select(`
        name,
        news_category_relations!inner(
          news!inner(
            id,
            status
          )
        )
      `)
      .eq('news_category_relations.news.status', 'PUBLISHED');

    if (error) {
      // Fallback to article categories
      const { data: categoryData, error: categoryError } = await supabase
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

      if (categoryError) throw categoryError;

      const categoryMap = new Map<string, number>();
      
      categoryData?.forEach((category: any) => {
        const categoryName = category.name;
        const currentCount = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, currentCount + 1);
      });

      return Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count
      }));
    }

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
    console.error('ニュースカテゴリー取得エラー:', error);
    return [];
  }
}

export async function getNewsTags(): Promise<ArticleTag[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('news_tags')
      .select(`
        name,
        news_tag_relations!inner(
          news!inner(
            id,
            status
          )
        )
      `)
      .eq('news_tag_relations.news.status', 'PUBLISHED');

    if (error) {
      // Fallback to article tags
      const { data: tagData, error: tagError } = await supabase
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

      if (tagError) throw tagError;

      const tagMap = new Map<string, number>();
      
      tagData?.forEach((tag: any) => {
        const tagName = tag.name;
        const currentCount = tagMap.get(tagName) || 0;
        tagMap.set(tagName, currentCount + 1);
      });

      return Array.from(tagMap.entries()).map(([name, count]) => ({
        name,
        count
      }));
    }

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
    console.error('ニュースタグ取得エラー:', error);
    return [];
  }
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
      getNewsTags()
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