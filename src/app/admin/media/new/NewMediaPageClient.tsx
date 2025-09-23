'use client';

import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import NewMediaForm from './NewMediaForm';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface NewMediaPageClientProps {
  categories: Category[];
  tags: Tag[];
  saveArticle: (formData: FormData) => Promise<any>;
}

export default function NewMediaPageClient({
  categories,
  tags,
  saveArticle,
}: NewMediaPageClientProps) {
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
    <NewMediaForm
      categories={categories}
      tags={tags}
      saveArticle={saveArticle}
    />
  );
}
