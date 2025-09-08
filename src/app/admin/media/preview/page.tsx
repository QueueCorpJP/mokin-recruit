'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { saveArticle } from '@/app/admin/media/new/actions';
import PreviewClient from './PreviewClient';

interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
}

async function fetchCategories(): Promise<ArticleCategory[]> {
  const supabase = getSupabaseAdminClient();
  
  const { data: categories, error } = await supabase
    .from('article_categories')
    .select('*')
    .order('name');
    
  if (error) {
    console.error('カテゴリの取得に失敗:', error);
    return [];
  }
  
  return categories || [];
}

// サーバーアクションをラップして適切な形式で返す
async function wrappedSaveAction(formData: FormData) {
  try {
    const result = await saveArticle(formData);
    return { success: true, article: result.article };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : '記事の保存に失敗しました' 
    };
  }
}

export default function PreviewPage() {
  const { isAdmin, loading } = useAdminAuth();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchCategories()
        .then(setCategories)
        .catch(console.error)
        .finally(() => setDataLoading(false));
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

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">データを読み込み中...</div>
      </div>
    );
  }
  
  return <PreviewClient categories={categories} saveArticleAction={wrappedSaveAction} />;
}