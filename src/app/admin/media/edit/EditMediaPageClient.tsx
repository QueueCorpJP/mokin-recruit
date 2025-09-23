'use client';

import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import EditMediaForm from './EditMediaForm';

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
  article_categories: { id: string; name: string }[];
  article_tags: { id: string; name: string }[];
}

interface EditMediaPageClientProps {
  categories: Category[];
  tags: Tag[];
  saveArticle: (formData: FormData) => Promise<any>;
  initialArticle: ArticleData | null;
}

export default function EditMediaPageClient({
  categories,
  tags,
  saveArticle,
  initialArticle,
}: EditMediaPageClientProps) {
  const { isAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>認証状態を確認中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessRestricted userType='admin' />;
  }

  return (
    <EditMediaForm
      categories={categories}
      tags={tags}
      saveArticle={saveArticle}
      initialArticle={initialArticle}
    />
  );
}
