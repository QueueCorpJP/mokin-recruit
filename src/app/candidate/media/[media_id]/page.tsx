import { notFound, redirect } from 'next/navigation';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { getSidebarData, getRelatedArticles } from '@/app/candidate/media/actions';
import MediaDetailClient from './MediaDetailClient';
import type { Metadata } from 'next';

// 記事詳細を取得する関数
async function getArticleData(mediaId: string) {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_category_relations (
        article_categories (*)
      ),
      article_tag_relations (
        article_tags (*)
      )
    `)
    .eq('id', mediaId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// 関連記事を取得してフォーマットする関数
function formatArticles(articles: any[]) {
  return articles.map(article => ({
    id: article.id,
    date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    categories: article.categories || ['メディア'],
    tags: article.tags || [],
    title: article.title,
    description: article.excerpt || 'No description available',
    imageUrl: article.thumbnail_url || '/images/media01.jpg'
  }));
}

// メタデータ生成
export async function generateMetadata({ params }: { params: Promise<{ media_id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticleData(resolvedParams.media_id);
  
  if (!article) {
    return {
      title: '記事が見つかりません',
      description: '指定された記事は存在しません'
    };
  }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
    }
  };
}

export default async function MediaDetailPage({ params }: { params: Promise<{ media_id: string }> }) {
  const resolvedParams = await params;
  const mediaId = resolvedParams.media_id;
  
  if (!mediaId) {
    notFound();
  }

  // 並列でデータ取得
  const [article, sidebarData, relatedArticles] = await Promise.all([
    getArticleData(mediaId),
    getSidebarData(),
    getRelatedArticles(mediaId, 6)
  ]);

  if (!article) {
    notFound();
  }

  if (article.status !== 'PUBLISHED') {
    redirect('/candidate/media');
  }

  // content フィールドの安全な解析
  const parseContent = (content: any): any => {
    if (!content) return content;
    
    if (typeof content === 'string') {
      // HTMLコンテンツの場合はそのまま返す
      if (content.startsWith('<') || content.includes('<p>') || content.includes('<div>')) {
        return content;
      }
      
      // JSONコンテンツの場合は解析を試行
      try {
        return JSON.parse(content);
      } catch (error) {
        // JSON解析に失敗した場合はそのまま返す
        return content;
      }
    }
    
    return content;
  };

  // 記事データを整形
  const formattedArticle = {
    ...article,
    content: parseContent(article.content)
  };

  // 関連記事を分割してフォーマット
  const recommendedArticles = formatArticles(relatedArticles.slice(0, 3));
  const newArticles = formatArticles(relatedArticles.slice(3, 6));

  return (
    <MediaDetailClient
      article={formattedArticle}
      sidebarData={sidebarData}
      recommendedArticles={recommendedArticles}
      newArticles={newArticles}
    />
  );
}