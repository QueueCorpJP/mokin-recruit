import { notFound, redirect } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import {
  getSidebarData,
  getRelatedArticles,
} from '@/app/candidate/media/actions';
import MediaDetailClient from './MediaDetailClient';
import {
  parseArticleContent,
  formatArticleCards,
} from '@/app/candidate/media/_shared/utils';
import type { Metadata } from 'next';

// 記事詳細を取得する関数
async function getArticleData(mediaId: string) {
  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase
    .from('articles')
    .select(
      `
      *,
      article_category_relations (
        article_categories (*)
      ),
      article_tag_relations (
        article_tags (*)
      )
    `
    )
    .eq('id', mediaId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// 関連記事のフォーマットは共通ユーティリティに委譲

// メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ media_id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleData(resolvedParams.media_id);

  if (!article) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事は存在しません',
    };
  }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
    },
  };
}

export default async function MediaDetailPage({
  params,
}: {
  params: Promise<{ media_id: string }>;
}) {
  const resolvedParams = await params;
  const mediaId = resolvedParams.media_id;

  if (!mediaId) {
    notFound();
  }

  // 並列でデータ取得
  const [article, sidebarData, relatedArticles] = await Promise.all([
    getArticleData(mediaId),
    getSidebarData(),
    getRelatedArticles(mediaId, 6),
  ]);

  if (!article) {
    notFound();
  }

  if (article.status !== 'PUBLISHED') {
    redirect('/candidate/media');
  }

  // 記事データを整形
  const formattedArticle = {
    ...article,
    content: parseArticleContent(article.content),
  };

  // 関連記事を分割してフォーマット
  const recommendedArticles = formatArticleCards(relatedArticles.slice(0, 3));
  const newArticles = formatArticleCards(relatedArticles.slice(3, 6));

  return (
    <MediaDetailClient
      article={formattedArticle}
      sidebarData={sidebarData}
      recommendedArticles={recommendedArticles}
      newArticles={newArticles}
    />
  );
}
