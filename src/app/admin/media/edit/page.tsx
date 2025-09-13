'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { createServerAdminClient } from '@/lib/supabase/server-admin';
import EditMediaForm from './EditMediaForm';
import { saveArticle } from './actions';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface ArticleData {
  id: string;
  title: string;
  content: string;
  status: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  article_categories: { id: string; name: string; }[];
  article_tags: { id: string; name: string; }[];
}

// 画像URL変数を実際のURLに変換する関数
function replaceImageVariables(content: string): string {
  if (!content) return content;
  
  let processedContent = content;
  
  // 既にSupabase URLが含まれている場合はそのまま返す
  if (processedContent.includes('/storage/v1/object/public/blog/')) {
    return processedContent;
  }
  
  // ハードコードされたSupabase URL（client.tsと同じ値を使用）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjhqeagxibsklugikyma.supabase.co';
  
  // src属性内の{{image:filename}}形式の変数を実際のURLに変換
  processedContent = processedContent.replace(/src=["']?\{\{image:([^}]+)\}\}["']?/g, (match, filename) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog/content/images/${filename}`;
    return `src="${publicUrl}"`;
  });
  
  // 単体の{{image:filename}} 形式の変数を実際のURLに変換
  processedContent = processedContent.replace(/\{\{image:([^}]+)\}\}/g, (match, filename) => {
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog/content/images/${filename}`;
    return publicUrl;
  });
  
  return processedContent;
}

async function fetchDataForEdit(articleId?: string): Promise<{
  categories: Category[];
  tags: Tag[];
  articleData: ArticleData | null;
}> {
  const supabase = createServerAdminClient();
  
  // カテゴリとタグを取得
  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from('article_categories').select('*').order('name'),
    supabase.from('article_tags').select('*').order('name')
  ]);

  if (categoriesResult.error) {
    if (process.env.NODE_ENV === 'development') console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  if (tagsResult.error) {
    if (process.env.NODE_ENV === 'development') console.error('タグの読み込みに失敗:', tagsResult.error);
  }

  // 記事IDがある場合は記事データを取得
  let articleData = null;
  if (articleId) {
    // まず記事本体を取得
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .single();

    if (articleError) {
      if (process.env.NODE_ENV === 'development') console.error('記事の読み込みに失敗:', articleError);
    } else {
      // カテゴリとタグを並列取得
      const [categoryRelationsResult, tagRelationsResult] = await Promise.all([
        supabase
          .from('article_category_relations')
          .select('category_id, article_categories(id, name)')
          .eq('article_id', articleId),
        supabase
          .from('article_tag_relations')
          .select('tag_id, article_tags(id, name)')
          .eq('article_id', articleId)
      ]);
      
      const categoryRelations = categoryRelationsResult.data;
      const tagRelations = tagRelationsResult.data;

      // データを整形
      const processedContent = replaceImageVariables(article.content || '');
      
      articleData = {
        ...article,
        article_categories: categoryRelations?.map(rel => rel.article_categories).filter(Boolean) || [],
        article_tags: tagRelations?.map(rel => rel.article_tags).filter(Boolean) || [],
        // コンテンツ内の画像変数を実際のURLに変換
        content: processedContent
      };
    }
  }

  return {
    categories: categoriesResult.data || [],
    tags: tagsResult.data || [],
    articleData
  };
}

export default function EditMediaPage() {
  const { isAdmin, loading } = useAdminAuth();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchDataForEdit(articleId || undefined)
        .then(({ categories, tags, articleData }) => {
          setCategories(categories);
          setTags(tags);
          setArticleData(articleData);
        })
        .catch(console.error)
        .finally(() => setDataLoading(false));
    }
  }, [isAdmin, articleId]);

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

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">データを読み込み中...</div>
      </div>
    );
  }

  return (
    <EditMediaForm 
      categories={categories} 
      tags={tags}
      saveArticle={saveArticle}
      initialArticle={articleData}
    />
  );
}