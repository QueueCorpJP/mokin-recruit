
import ArticleClient, { ArticleListItem } from './ArticleClient';
import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

// ArticleListItemはArticleClientから既にimportされているため削除

async function fetchAdminArticleList(): Promise<ArticleListItem[]> {
  const supabase = getSupabaseAdminClient();
  // 1. articles取得
  const { data: articles, error: articleError } = await supabase
    .from('articles')
    .select('id, title, status, updated_at')
    .order('updated_at', { ascending: false });
  if (articleError) throw new Error(articleError.message);
  if (!articles || articles.length === 0) return [];

  // 2. article_category_relations取得
  const articleIds = articles.map(a => a.id);
  const { data: relations, error: relError } = await supabase
    .from('article_category_relations')
    .select('article_id, category_id')
    .in('article_id', articleIds);
  if (relError) throw new Error(relError.message);

  // 3. article_categories取得
  const categoryIds = relations ? relations.map(r => r.category_id) : [];
  const { data: categories, error: catError } = await supabase
    .from('article_categories')
    .select('id, name')
    .in('id', categoryIds);
  if (catError) throw new Error(catError.message);

  // 4. 紐付けてDTO化
  return articles.map(article => {
    const relatedCategoryIds = (relations || [])
      .filter(r => r.article_id === article.id)
      .map(r => r.category_id);
    const categoryNames = (categories || [])
      .filter(c => relatedCategoryIds.includes(c.id))
      .map(c => c.name);
    return {
      id: article.id,
      title: article.title,
      status: article.status,
      updated_at: article.updated_at,
      category_names: categoryNames,
    };
  });
}

export default async function ArticlePage() {

  const articles = await fetchAdminArticleList();
  return <ArticleClient articles={articles} />;
}
