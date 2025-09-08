'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { createServerAdminClient } from '@/lib/supabase/server-admin';
import NewMediaForm from './NewMediaForm';
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

async function fetchCategoriesAndTags(): Promise<{ categories: Category[], tags: Tag[] }> {
  const supabase = createServerAdminClient();
  
  const [categoriesResult, tagsResult] = await Promise.all([
    supabase.from('article_categories').select('*').order('name'),
    supabase.from('article_tags').select('*').order('name')
  ]);

  if (categoriesResult.error) {
    console.error('カテゴリの読み込みに失敗:', categoriesResult.error);
  }

  if (tagsResult.error) {
    console.error('タグの読み込みに失敗:', tagsResult.error);
  }

  return {
    categories: categoriesResult.data || [],
    tags: tagsResult.data || []
  };
}

export default function NewMediaPage() {
  const { isAdmin, loading } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      fetchCategoriesAndTags()
        .then(({ categories, tags }) => {
          setCategories(categories);
          setTags(tags);
        })
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

  return (
    <NewMediaForm 
      categories={categories} 
      tags={tags}
      saveArticle={saveArticle}
    />
  );
}