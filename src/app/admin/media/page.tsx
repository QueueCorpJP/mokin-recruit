'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
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

export default function MediaPage() {
  const { isAdmin, loading } = useAdminAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchMediaArticles()
        .then(setArticles)
        .catch(console.error)
        .finally(() => setArticlesLoading(false));
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">認証状態を確認中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessRestricted userType="admin" />;
  }

  if (articlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">記事を読み込み中...</div>
      </div>
    );
  }

  return <MediaPageClient articles={articles} />;
}
