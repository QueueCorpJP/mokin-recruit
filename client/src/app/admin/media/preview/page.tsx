'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';
import { createClient } from '@/lib/supabase/client';

interface PreviewData {
  title: string;
  categoryIds: string[];
  tags: string[];
  content: string;
  thumbnail: string | null;
  thumbnailName: string | null;
}

interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
}

export default function PreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedArticleId, setSavedArticleId] = useState<string | null>(null);

  const handleSave = useCallback(async (status: 'DRAFT' | 'PUBLISHED') => {
    const currentData = sessionStorage.getItem('previewArticle');
    if (!currentData) return;
    
    const data = JSON.parse(currentData);
    
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('categoryId', data.categoryIds && data.categoryIds.length > 0 ? data.categoryIds[0] : '');
      formData.append('tags', Array.isArray(data.tags) ? data.tags.join(', ') : data.tags);
      formData.append('content', data.content);
      formData.append('status', status);
      
      if (data.thumbnailName && data.thumbnail) {
        try {
          const thumbnailFile = await fetch(data.thumbnail)
            .then(res => res.blob())
            .then(blob => new File([blob], data.thumbnailName!, { type: blob.type }));
          formData.append('thumbnail', thumbnailFile);
        } catch (error) {
          console.warn('サムネイル画像の処理に失敗しました:', error);
        }
      }

      const response = await fetch('/api/admin/articles', {
        method: 'POST',
        body: formData,
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `記事の保存に失敗しました (${response.status})`);
        } catch (parseError) {
          throw new Error(`記事の保存に失敗しました (${response.status}): ${errorText}`);
        }
      }

      const result = await response.json();
      setSavedArticleId(result.article?.id || null);
      sessionStorage.removeItem('previewArticle');
      
      // 公開・下書き保存時ともにモーダルを表示
      setShowSuccessModal(true);
    } catch (error) {
      console.error('記事の保存に失敗:', error);
      setError(error instanceof Error ? error.message : '記事の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEdit = () => {
    // プレビューデータをそのまま残して編集画面に戻る
    router.push('/admin/media/new');
  };

  const handleCancel = useCallback(() => {
    // プレビューデータをそのまま残して作成画面に戻る
    router.push('/admin/media/new');
  }, [router]);

  // データ読み込み用のuseEffect
  useEffect(() => {
    const fetchData = async () => {
      const storedData = sessionStorage.getItem('previewArticle');
      if (storedData) {
        const data = JSON.parse(storedData);
        console.log('Preview data content:', data.content);
        console.log('Preview data categoryIds:', data.categoryIds);
        
        // カテゴリデータを先に取得
        try {
          const supabase = createClient();
          const { data: categoriesData } = await supabase
            .from('article_categories')
            .select('*')
            .order('name');
          
          if (categoriesData) {
            console.log('Fetched categories:', categoriesData);
            setCategories(categoriesData as unknown as ArticleCategory[]);
          }
          
          // 個別にカテゴリ名を取得
          if (data.categoryIds && data.categoryIds.length > 0) {
            const names: {[key: string]: string} = {};
            for (const categoryId of data.categoryIds) {
              try {
                const { data: categoryData } = await supabase
                  .from('article_categories')
                  .select('name')
                  .eq('id', categoryId)
                  .single();
                
                if (categoryData && categoryData.name) {
                  names[categoryId] = categoryData.name as string;
                  console.log('Individual category fetch:', { categoryId, name: categoryData.name });
                }
              } catch (err) {
                console.error('Individual category fetch failed:', categoryId, err);
              }
            }
            setCategoryNames(names);
          }
          
          // カテゴリデータ取得後にプレビューデータを設定
          setPreviewData(data);
        } catch (error) {
          console.error('カテゴリの取得に失敗:', error);
          // エラーが発生してもプレビューデータは設定
          setPreviewData(data);
        }
      } else {
        router.push('/admin/media/new');
      }
    };
    
    fetchData();
  }, [router]);

  // イベントリスナー用のuseEffect
  useEffect(() => {
    const handleCancelPreview = () => {
      console.log('Cancel preview event triggered');
      handleCancel();
    };
    const handleSaveDraft = () => {
      console.log('Save draft event triggered');
      handleSave('DRAFT');
    };
    const handlePublishArticle = () => {
      console.log('Publish article event triggered');
      handleSave('PUBLISHED');
    };

    window.addEventListener('cancel-preview', handleCancelPreview);
    window.addEventListener('save-draft', handleSaveDraft);
    window.addEventListener('publish-article', handlePublishArticle);

    return () => {
      window.removeEventListener('cancel-preview', handleCancelPreview);
      window.removeEventListener('save-draft', handleSaveDraft);
      window.removeEventListener('publish-article', handlePublishArticle);
    };
  }, [handleCancel, handleSave]);

  const handleBackToList = () => {
    setShowSuccessModal(false);
    router.push('/admin/media');
  };

  const handleViewArticle = () => {
    setShowSuccessModal(false);
    if (savedArticleId) {
      router.push(`/admin/media/edit?id=${savedArticleId}`);
    } else {
      router.push('/admin/media');
    }
  };

  if (!previewData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">


      {error && (
        <div className="max-w-[800px] mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] flex items-start">
        <div className="">
          
          <div className="flex flex-col">
            {/* 記事本文 */}
            <article className="w-full max-w-[800px] mx-auto mt-[50px] px-0">
              
              {/* 日時 */}
              <div className="mb-[16px] px-0">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* 記事タイトルセクション */}
              <div className="mb-[32px] px-0">
                <h1 className="text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]" style={{ fontWeight: 700, fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                  {previewData.title}
                </h1>
                <div className="flex items-center gap-[16px] flex-wrap">
                  {/* 選択されたカテゴリを表示 */}
                  {previewData.categoryIds && previewData.categoryIds.length > 0 && 
                    previewData.categoryIds.map(categoryId => {
                      const categoryName = categoryNames[categoryId] || 
                                         categories.find(cat => cat.id === categoryId)?.name;
                      
                      if (!categoryName) {
                        console.log('No category name found for:', categoryId);
                        return null;
                      }
                      
                      return (
                        <span
                          key={categoryId}
                          className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                          style={{ 
                            fontWeight: 700,
                            fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                          }}
                        >
                          {categoryName}
                        </span>
                      );
                    }).filter(Boolean)
                  }
                </div>
              </div>

              {/* サムネイル画像 */}
              {previewData.thumbnail && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]" style={{ minWidth: '900px' }}>
                  <img
                    src={previewData.thumbnail}
                    alt="記事のサムネイル"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}


              {/* 記事本文（リッチコンテンツ） */}
              <div 
                className="prose prose-lg max-w-none mb-[60px]"
                style={{ paddingLeft: '0', paddingRight: '0' }}
                dangerouslySetInnerHTML={{ __html: previewData.content }}
              />

              {/* 記事下のボタン */}
              <div className="flex justify-center gap-4 mt-8 mb-8">
                <AdminButton
                  onClick={handleCancel}
                  text="編集に戻る"
                  variant="green-outline"
                  disabled={isLoading}
                />
                <AdminButton
                  onClick={() => handleSave('DRAFT')}
                  text="記事を下書き保存"
                  variant="green-gradient"
                  disabled={isLoading}
                />
                <AdminButton
                  onClick={() => handleSave('PUBLISHED')}
                  text="記事を投稿する"
                  variant="green-gradient"
                  disabled={isLoading}
                />
              </div>

            </article>




          </div>

        </div>
      </main>

      {/* 成功通知モーダル */}
      <AdminNotificationModal
        isOpen={showSuccessModal}
        onConfirm={handleBackToList}
        onSecondaryAction={handleViewArticle}
        title="記事追加完了"
        description="記事の投稿・保存をしました。"
        confirmText="記事一覧に戻る"
        secondaryText="記事を確認する"
      />
    </div>
  );
}