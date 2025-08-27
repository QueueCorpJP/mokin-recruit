import React from 'react';
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

export default async function PreviewPage() {
  const categories = await fetchCategories();
  
  // サーバーアクションをラップして適切な形式で返す
  async function wrappedSaveAction(formData: FormData) {
    'use server';
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
  
  return <PreviewClient categories={categories} saveArticleAction={wrappedSaveAction} />;
}