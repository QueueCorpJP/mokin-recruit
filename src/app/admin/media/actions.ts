'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// Type definitions
export interface Article {
  id: string;
  title: string;
  excerpt?: string;
  content: any;
  thumbnail_url?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  slug?: string;
  categories?: string[];
  tags?: string[];
}

export interface ArticleCategory {
  id?: string;
  name: string;
  count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleTag {
  id?: string;
  name: string;
  count?: number;
  created_at?: string;
  updated_at?: string;
}

// Article operations
export async function getArticle(id: string): Promise<Article | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at, updated_at, status, slug,
        article_category_relations(
          article_categories(name)
        ),
        article_tag_relations(
          article_tags(name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('記事取得エラー:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content,
      thumbnail_url: data.thumbnail_url,
      published_at: data.published_at,
      created_at: data.created_at,
      updated_at: data.updated_at,
      status: data.status,
      slug: data.slug,
      categories: data.article_category_relations?.map(rel => (rel.article_categories as any)?.name) || [],
      tags: data.article_tag_relations?.map(rel => (rel.article_tags as any)?.name) || []
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('記事取得エラー:', error);
    return null;
  }
}

export async function getAllArticles(limit: number = 50, offset: number = 0): Promise<Article[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at, updated_at, status, slug,
        article_category_relations(
          article_categories(name)
        ),
        article_tag_relations(
          article_tags(name)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data?.map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      thumbnail_url: article.thumbnail_url,
      published_at: article.published_at,
      created_at: article.created_at,
      updated_at: article.updated_at,
      status: article.status,
      slug: article.slug,
      categories: article.article_category_relations?.map(rel => (rel.article_categories as any)?.name) || [],
      tags: article.article_tag_relations?.map(rel => (rel.article_tags as any)?.name) || []
    })) || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('記事一覧取得エラー:', error);
    return [];
  }
}

// Category operations
export async function getCategories(): Promise<ArticleCategory[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリー取得エラー:', error);
    return [];
  }
}

export async function createCategory(name: string): Promise<ArticleCategory | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('article_categories')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリー作成エラー:', error);
    throw error;
  }
}

export async function updateCategory(id: string, name: string): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('article_categories')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリー更新エラー:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    
    // 関連付けも削除
    await supabase
      .from('article_category_relations')
      .delete()
      .eq('category_id', id);
    
    const { error } = await supabase
      .from('article_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリー削除エラー:', error);
    throw error;
  }
}

export async function getCategoryArticleCount(categoryId: string): Promise<number> {
  try {
    const supabase = getSupabaseAdminClient();
    const { count, error } = await supabase
      .from('article_category_relations')
      .select('id', { count: 'exact' })
      .eq('category_id', categoryId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリー記事数取得エラー:', error);
    return 0;
  }
}

// Tag operations
export async function getTags(): Promise<ArticleTag[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('article_tags')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('タグ取得エラー:', error);
    return [];
  }
}

export async function createTag(name: string): Promise<ArticleTag | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('article_tags')
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('タグ作成エラー:', error);
    throw error;
  }
}

export async function updateTag(id: string, name: string): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('article_tags')
      .update({ name, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('タグ更新エラー:', error);
    throw error;
  }
}

export async function deleteTag(id: string): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    
    // 関連付けも削除
    await supabase
      .from('article_tag_relations')
      .delete()
      .eq('tag_id', id);
    
    const { error } = await supabase
      .from('article_tags')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('タグ削除エラー:', error);
    throw error;
  }
}

export async function getTagArticleCount(tagId: string): Promise<number> {
  try {
    const supabase = getSupabaseAdminClient();
    const { count, error } = await supabase
      .from('article_tag_relations')
      .select('id', { count: 'exact' })
      .eq('tag_id', tagId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('タグ記事数取得エラー:', error);
    return 0;
  }
}