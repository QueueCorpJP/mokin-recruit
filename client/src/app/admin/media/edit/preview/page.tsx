'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { SelectInput } from '@/components/ui/select-input';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { createClient } from '@/lib/supabase/client';
import '@/styles/media-content.css';

interface PreviewData {
  title: string;
  categoryIds: string[];
  tags: string[];
  content: string;
  thumbnail: string | null;
  thumbnailName: string | null;
  status: 'DRAFT' | 'PUBLISHED';
}

interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
}

export default function EditPreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedArticleId, setSavedArticleId] = useState<string | null>(null);

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
          setCurrentStatus(data.status || 'DRAFT');
        } catch (error) {
          console.error('カテゴリの取得に失敗:', error);
          // エラーが発生してもプレビューデータは設定
          setPreviewData(data);
          setCurrentStatus(data.status || 'DRAFT');
        }
      } else {
        router.push('/admin/media/edit');
      }
    };
    
    fetchData();

    // AdminPageTitleからのイベントリスナーを追加
    const handleBackToEdit = () => handleBack();
    const handleSaveArticle = () => handleSave();

    window.addEventListener('back-to-edit', handleBackToEdit);
    window.addEventListener('save-article', handleSaveArticle);

    return () => {
      window.removeEventListener('back-to-edit', handleBackToEdit);
      window.removeEventListener('save-article', handleSaveArticle);
    };
  }, [router]);

  const handleSave = async (status?: 'DRAFT' | 'PUBLISHED') => {
    if (!previewData) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', previewData.title);
      formData.append('categoryId', previewData.categoryIds && previewData.categoryIds.length > 0 ? previewData.categoryIds[0] : '');
      formData.append('tags', Array.isArray(previewData.tags) ? previewData.tags.join(', ') : previewData.tags);
      formData.append('content', previewData.content);
      formData.append('status', status || currentStatus);
      
      if (previewData.thumbnailName && previewData.thumbnail) {
        try {
          const thumbnailFile = await fetch(previewData.thumbnail)
            .then(res => res.blob())
            .then(blob => new File([blob], previewData.thumbnailName!, { type: blob.type }));
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
      setShowSuccessModal(true);
    } catch (error) {
      console.error('記事の保存に失敗:', error);
      setError(error instanceof Error ? error.message : '記事の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Update the status in sessionStorage before going back
    if (previewData) {
      const updatedData = { ...previewData, status: currentStatus };
      sessionStorage.setItem('previewArticle', JSON.stringify(updatedData));
    }
    router.push('/admin/media/edit');
  };

  const handleCancel = () => {
    if (confirm('プレビューを終了して一覧に戻りますか？')) {
      sessionStorage.removeItem('previewArticle');
      router.push('/admin/media');
    }
  };

  const handleBackToList = () => {
    setShowSuccessModal(false);
    router.push('/admin/media');
  };

  const handleViewArticle = () => {
    setShowSuccessModal(false);
    if (savedArticleId) {
      router.push(`/admin/media/${savedArticleId}`);
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

  const getStatusText = (status: 'DRAFT' | 'PUBLISHED') => {
    return status === 'DRAFT' ? '下書き' : '公開';
  };

  const getSaveButtonText = () => {
    if (isLoading) return '保存中...';
    return '記事を保存/公開する';
  };

  const handleSaveClick = () => {
    handleSave();
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {error && (
        <div className="max-w-[800px] mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] flex items-start">
        <div className="w-full">
          <div className="flex flex-col">
            {/* ステータス選択エリア */}
            <div className="w-full max-w-[800px] mx-auto mb-16 mt-[50px]">
              <FormFieldHeader>
                ステータス
              </FormFieldHeader>
              <div style={{ width: '300px' }}>
                <SelectInput
                  options={[
                    { value: 'DRAFT', label: '下書き' },
                    { value: 'PUBLISHED', label: '公開' }
                  ]}
                  value={currentStatus}
                  onChange={(value: string) => setCurrentStatus(value as 'DRAFT' | 'PUBLISHED')}
                  placeholder="ステータスを選択してください"
                />
              </div>
            </div>

            {/* 記事本文 */}
            <article className="w-full max-w-[800px] mx-auto px-0">
              
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

            </article>
          </div>
        </div>
      </main>

      {/* 下部ボタンエリア - ページ全体で中央配置 */}
      <div className="w-full flex justify-center gap-4 mt-8 mb-8">
        <div style={{ width: '170px' }}>
          <Button
            onClick={handleBack}
            variant="green-outline"
            size="figma-default"
          >
            編集に戻る
          </Button>
        </div>
        <div style={{ width: '220px' }}>
          <Button
            onClick={handleSaveClick}
            variant="green-gradient"
            size="figma-default"
            className="w-full"
            disabled={isLoading}
          >
            記事を保存/公開する
          </Button>
        </div>
      </div>


      {/* 成功通知モーダル */}
      <AdminNotificationModal
        isOpen={showSuccessModal}
        onConfirm={handleBackToList}
        onSecondaryAction={handleViewArticle}
        title="記事更新完了"
        description="記事の更新・保存をしました。"
        confirmText="記事一覧に戻る"
        secondaryText="記事を確認する"
      />
    </div>
  );
}