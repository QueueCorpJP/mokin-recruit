'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import { Button } from '@/components/ui/button';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminPageTitle } from '@/components/admin/AdminPageTitle';
import { createClient } from '@/lib/supabase/client';
import { createNotice, uploadNoticeThumbnail } from '../actions';

// --- Encryption helper using Web Crypto API ---
const PREVIEW_NOTICE_KEY_NAME = 'previewNoticeKey';

// Generates and stores/retrieves encryption key from sessionStorage
async function getCryptoKey() {
  // Try to get exported key from sessionStorage
  let keyJwk = sessionStorage.getItem(PREVIEW_NOTICE_KEY_NAME);
  if (keyJwk) {
    const jwk = JSON.parse(keyJwk);
    return await window.crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  // Create new key
  const key = await window.crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
  // Export and store
  const exported = await window.crypto.subtle.exportKey('jwk', key);
  sessionStorage.setItem(PREVIEW_NOTICE_KEY_NAME, JSON.stringify(exported));
  return key;
}

// Decrypts base64(iv+data) string
async function decryptString(encryptedStr: string) {
  const raw = atob(encryptedStr);
  const arr = Uint8Array.from(raw, c => c.charCodeAt(0));
  const iv = arr.slice(0, 12);
  const data = arr.slice(12);
  const key = await getCryptoKey();
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
interface PreviewData {
  title: string;
  categoryIds: string[];
  content: string;
  thumbnail: string | null;
  thumbnailName: string | null;
}

interface NoticeCategory {
  id: string;
  name: string;
  description?: string;
}

export default function PreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [categoryNames, setCategoryNames] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = useCallback(
    async (status: 'DRAFT' | 'PUBLISHED') => {
      const currentData = sessionStorage.getItem('previewNotice');
      if (!currentData) return;

      let data;
      try {
        // Decrypt the data first
        const decrypted = await decryptString(currentData);
        data = JSON.parse(decrypted);
      } catch (e) {
        console.error('Failed to decrypt previewNotice data:', e);
        setError('プレビューデータの読み込みに失敗しました');
        return;
      }

      setIsLoading(true);
      setIsSubmitting(true);
      setError('');

      try {
        let thumbnailUrl = '';

        // サムネイルがある場合はアップロード
        if (data.thumbnailName && data.thumbnail) {
          try {
            const thumbnailFile = await fetch(data.thumbnail)
              .then(res => res.blob())
              .then(
                blob =>
                  new File([blob], data.thumbnailName!, { type: blob.type })
              );

            const formData = new FormData();
            formData.append('thumbnail', thumbnailFile);

            const uploadResult = await uploadNoticeThumbnail(formData);
            if (uploadResult.success && uploadResult.url) {
              thumbnailUrl = uploadResult.url;
            }
          } catch (error) {
            console.warn('サムネイル画像の処理に失敗しました:', error);
          }
        }

        // カテゴリ名を取得
        const categoryNamesList: string[] = [];
        if (data.categoryIds && data.categoryIds.length > 0) {
          for (const categoryId of data.categoryIds) {
            const categoryName =
              categoryNames[categoryId] ||
              categories.find(cat => cat.id === categoryId)?.name;
            if (categoryName) {
              categoryNamesList.push(categoryName);
            }
          }
        }

        // お知らせを作成
        const result = await createNotice({
          title: data.title,
          excerpt: data.title.substring(0, 100), // タイトルから抜粋を生成
          content: data.content,
          status: status,
          thumbnail_url: thumbnailUrl || undefined,
          categories: categoryNamesList,
        });

        if (result.success && result.data) {
          // 完了ページへリダイレクト（sessionStorage削除前に）
          router.push('/admin/notice/new/complete');
          sessionStorage.removeItem('previewNotice');
        } else {
          throw new Error(result.error || 'お知らせの保存に失敗しました');
        }
      } catch (error) {
        console.error('お知らせの保存に失敗:', error);
        setError(
          error instanceof Error
            ? error.message
            : 'お知らせの保存に失敗しました'
        );
      } finally {
        setIsLoading(false);
      }
    },
    [categories, categoryNames]
  );

  const handleCancel = useCallback(() => {
    // 投稿中は戻れないように制御
    if (isSubmitting) return;
    // プレビューデータをそのまま残して作成画面に戻る
    router.push('/admin/notice/new');
  }, [router, isSubmitting]);

  // データ読み込み用のuseEffect
  useEffect(() => {
    const fetchData = async () => {
      const storedData = sessionStorage.getItem('previewNotice');
      if (storedData) {
        let data;
        try {
          // Try to decrypt the data first
          const decrypted = await decryptString(storedData);
          data = JSON.parse(decrypted);
        } catch (e) {
          console.error('Failed to decrypt previewNotice data:', e);
          router.push('/admin/notice/new');
          return;
        }
        console.log('Preview data content:', data.content);
        console.log('Preview data categoryIds:', data.categoryIds);

        // カテゴリデータを先に取得
        try {
          const supabase = createClient();
          const { data: categoriesData } = await supabase
            .from('notice_categories')
            .select('*')
            .order('name');

          if (categoriesData) {
            console.log('Fetched categories:', categoriesData);
            setCategories(categoriesData as unknown as NoticeCategory[]);
          }

          // 個別にカテゴリ名を取得
          if (data.categoryIds && data.categoryIds.length > 0) {
            const names: { [key: string]: string } = {};
            for (const categoryId of data.categoryIds) {
              try {
                const { data: categoryData } = await supabase
                  .from('notice_categories')
                  .select('name')
                  .eq('id', categoryId)
                  .single();

                if (categoryData && (categoryData as any).name) {
                  names[categoryId] = (categoryData as any).name as string;
                  console.log('Individual category fetch:', {
                    categoryId,
                    name: (categoryData as any).name,
                  });
                }
              } catch (err) {
                console.error(
                  'Individual category fetch failed:',
                  categoryId,
                  err
                );
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
        router.push('/admin/notice/new');
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
    const handlePublishNotice = () => {
      console.log('Publish notice event triggered');
      handleSave('PUBLISHED');
    };

    window.addEventListener('cancel-preview', handleCancelPreview);
    window.addEventListener('save-draft', handleSaveDraft);
    window.addEventListener('publish-notice', handlePublishNotice);

    return () => {
      window.removeEventListener('cancel-preview', handleCancelPreview);
      window.removeEventListener('save-draft', handleSaveDraft);
      window.removeEventListener('publish-notice', handlePublishNotice);
    };
  }, [handleCancel, handleSave]);

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
        <div className=''>
          <div className='flex flex-col'>
            {/* お知らせ本文 */}
            <article className='w-full max-w-[800px] mx-auto mt-[50px] px-0'>
              {/* 日時 */}
              <div className='mb-[16px] px-0'>
                <span className='text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP'>
                  {formattedDate}
                </span>
              </div>

              {/* お知らせタイトルセクション */}
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
                    alt='お知らせのサムネイル'
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              {/* お知らせ本文（リッチコンテンツ） */}
              <div
                className='prose prose-lg max-w-none mb-[60px]'
                style={{ paddingLeft: '0', paddingRight: '0' }}
                dangerouslySetInnerHTML={{
                  __html:
                    previewData && previewData.content
                      ? DOMPurify.sanitize(previewData.content)
                      : '',
                }}
              />

              {/* お知らせ下のボタン */}
              <div className='flex justify-center gap-4 mt-8 mb-8'>
                <AdminButton
                  onClick={handleCancel}
                  text='編集に戻る'
                  variant='green-outline'
                  disabled={isLoading}
                />
                <AdminButton
                  onClick={() => handleSave('DRAFT')}
                  text='お知らせを下書き保存'
                  variant='green-gradient'
                  disabled={isLoading}
                />
                <AdminButton
                  onClick={() => handleSave('PUBLISHED')}
                  text='お知らせを投稿する'
                  variant='green-gradient'
                  disabled={isLoading}
                />
              </div>
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
