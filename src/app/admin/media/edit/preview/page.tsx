'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { Button } from '@/components/ui/button';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { SelectInput } from '@/components/ui/select-input';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

// Encryption helpers for sessionStorage.
async function encrypt(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode('a-very-secret-key-32b'),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    data
  );
  const encArr = new Uint8Array(encrypted);
  const fullArr = new Uint8Array(iv.length + encArr.length);
  fullArr.set(iv, 0);
  fullArr.set(encArr, iv.length);
  return btoa(String.fromCharCode(...fullArr));
}

async function decrypt(stored: string): Promise<string> {
  const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const data = raw.slice(12);
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode('a-very-secret-key-32b'),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    data
  );
  const decArr = new Uint8Array(decrypted);
  return new TextDecoder().decode(decArr);
}

interface PreviewData {
  id?: string;
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
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED'>(
    'DRAFT'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedArticleId, setSavedArticleId] = useState<string | null>(null);

  const handleBack = useCallback(async () => {
    // Update the status in sessionStorage before going back
    if (previewData) {
      const updatedData = { ...previewData, status: currentStatus };
      try {
        sessionStorage.setItem('previewArticle', JSON.stringify(updatedData));
      } catch (e) {
        console.error('Failed to save previewArticle data:', e);
      }
    }
    // 編集ページに記事IDと共に戻る
    router.push(`/admin/media/edit?id=${previewData?.id}`);
  }, [previewData, currentStatus, router]);

  const handleSave = useCallback(
    async (status?: 'DRAFT' | 'PUBLISHED') => {
      if (!previewData) return;

      setIsLoading(true);
      setError('');

      try {
        if (!previewData.id) {
          throw new Error('記事IDが見つかりません');
        }

        const formData = new FormData();
        formData.append('id', previewData.id);
        formData.append('title', previewData.title);
        formData.append(
          'categoryId',
          previewData.categoryIds && previewData.categoryIds.length > 0
            ? previewData.categoryIds[0]
            : ''
        );
        formData.append(
          'tags',
          Array.isArray(previewData.tags)
            ? previewData.tags.join(', ')
            : previewData.tags
        );
        formData.append('content', previewData.content);
        formData.append('status', status || currentStatus);

        // サムネイル処理
        if (previewData.thumbnail) {
          if (previewData.thumbnailName) {
            // 新しいファイルがある場合
            try {
              const thumbnailFile = await fetch(previewData.thumbnail)
                .then(res => res.blob())
                .then(
                  blob =>
                    new File([blob], previewData.thumbnailName!, {
                      type: blob.type,
                    })
                );
              formData.append('thumbnail', thumbnailFile);
            } catch (error) {
              // サムネイル画像の処理に失敗
              console.warn('サムネイル画像の処理に失敗しました:', error);
            }
          } else {
            // 既存の画像URLの場合
            formData.append('thumbnail_url', previewData.thumbnail);
          }
        }

        // actions.tsのsaveArticle関数を使用して更新
        const { saveArticle } = await import('../actions');
        await saveArticle(formData);

        // 成功時の処理
        setSavedArticleId(previewData.id);
        sessionStorage.removeItem('previewArticle');
        setShowSuccessModal(true);
      } catch (error) {
        // 記事の保存に失敗
        console.error('記事の保存に失敗:', error);
        setError(
          error instanceof Error ? error.message : '記事の保存に失敗しました'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [previewData, currentStatus]
  );

  const handleSaveClick = useCallback(() => {
    handleSave();
  }, [handleSave]);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      const storedData = sessionStorage.getItem('previewArticle');
      if (storedData) {
        let data;
        try {
          data = JSON.parse(storedData);
        } catch (e) {
          console.error('Failed to parse previewArticle data:', e);
          router.push('/admin/media/edit');
          return;
        }

        if (data.content) {
          data.content = DOMPurify.sanitize(data.content);
        }

        try {
          const supabase = createClient();
          const { data: categoriesData } = await supabase
            .from('article_categories')
            .select('*')
            .order('name');

          if (categoriesData) {
            setCategories(categoriesData as ArticleCategory[]);

            if (data.categoryIds && data.categoryIds.length > 0) {
              const names: { [key: string]: string } = {};
              for (const categoryId of data.categoryIds) {
                const category = categoriesData.find(
                  (cat: any) => cat && cat.id === categoryId
                ) as any;
                if (category?.name) {
                  names[categoryId] = category.name;
                }
              }
              setCategoryNames(names);
            }
          }
        } catch (error) {
          console.error('カテゴリの取得に失敗:', error);
        }

        setPreviewData(data);
        setCurrentStatus(data.status || 'DRAFT');
      } else {
        router.push('/admin/media/edit');
      }
    };

    fetchData();

    const handleBackToEdit = () => handleBack();
    const handleSaveArticle = () => handleSave();
    const handleSaveArticleDirect = () => handleSaveClick();

    window.addEventListener('back-to-edit', handleBackToEdit);
    window.addEventListener('save-article', handleSaveArticle);
    window.addEventListener('save-article-direct', handleSaveArticleDirect);

    return () => {
      window.removeEventListener('back-to-edit', handleBackToEdit);
      window.removeEventListener('save-article', handleSaveArticle);
      window.removeEventListener(
        'save-article-direct',
        handleSaveArticleDirect
      );
    };
  }, [router, isAdmin, handleBack, handleSave, handleSaveClick]);

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

  if (!previewData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-lg'>読み込み中...</div>
      </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className='min-h-screen bg-[#F9F9F9]'>
      {error && (
        <div className='max-w-[800px] mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      {/* メインコンテンツ */}
      <main className='w-full bg-[#F9F9F9] flex items-start'>
        <div className='w-full'>
          <div className='flex flex-col'>
            {/* ステータス選択エリア */}
            <div className='w-full max-w-[800px] mx-auto mb-16 mt-[50px]'>
              <FormFieldHeader>ステータス</FormFieldHeader>
              <div style={{ width: '300px' }}>
                <SelectInput
                  options={[
                    { value: 'DRAFT', label: '下書き' },
                    { value: 'PUBLISHED', label: '公開' },
                  ]}
                  value={currentStatus}
                  onChange={(value: string) =>
                    setCurrentStatus(value as 'DRAFT' | 'PUBLISHED')
                  }
                  placeholder='ステータスを選択してください'
                />
              </div>
            </div>

            {/* 記事本文 */}
            <article className='w-full max-w-[800px] mx-auto px-0'>
              {/* 日時 */}
              <div className='mb-[16px] px-0'>
                <span className='text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP'>
                  {formattedDate}
                </span>
              </div>

              {/* 記事タイトルセクション */}
              <div className='mb-[32px] px-0'>
                <h1
                  className='text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]'
                  style={{
                    fontWeight: 700,
                    fontFamily:
                      'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {previewData.title}
                </h1>
                <div className='flex items-center gap-[16px] flex-wrap'>
                  {/* 選択されたカテゴリを表示 */}
                  {previewData.categoryIds &&
                    previewData.categoryIds.length > 0 &&
                    previewData.categoryIds
                      .map(categoryId => {
                        const categoryName =
                          categoryNames[categoryId] ||
                          categories.find(cat => cat.id === categoryId)?.name;

                        if (!categoryName) {
                          // カテゴリ名が見つからない場合
                          console.log(
                            'No category name found for:',
                            categoryId
                          );
                          return null;
                        }

                        return (
                          <span
                            key={categoryId}
                            className='bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]'
                            style={{
                              fontWeight: 700,
                              fontFamily:
                                'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                          >
                            {categoryName}
                          </span>
                        );
                      })
                      .filter(Boolean)}
                </div>
              </div>

              {/* サムネイル画像 */}
              {previewData.thumbnail && (
                <div
                  className='relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]'
                  style={{ minWidth: '900px' }}
                >
                  <Image
                    src={previewData.thumbnail}
                    alt='記事のサムネイル'
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              {/* 記事本文（リッチコンテンツ） */}
              <div
                className='prose prose-lg max-w-none mb-[60px]'
                style={{ paddingLeft: '0', paddingRight: '0' }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(previewData.content),
                }}
              />
            </article>
          </div>
        </div>
      </main>

      {/* 下部ボタンエリア - ページ全体で中央配置 */}
      <div className='w-full flex justify-center gap-4 mt-8 mb-8'>
        <div style={{ width: '170px' }}>
          <Button
            onClick={handleBack}
            variant='green-outline'
            size='figma-default'
          >
            編集に戻る
          </Button>
        </div>
        <div style={{ width: '220px' }}>
          <Button
            onClick={handleSaveClick}
            variant='green-gradient'
            size='figma-default'
            className='w-full'
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
        title='記事更新完了'
        description='記事の更新・保存をしました。'
        confirmText='記事一覧に戻る'
        secondaryText='記事を確認する'
      />
    </div>
  );
}
