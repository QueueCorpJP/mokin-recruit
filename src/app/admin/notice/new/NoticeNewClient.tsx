'use client';

import { useState, useEffect, useCallback } from 'react';

// --- Encryption helper using Web Crypto API ---
// These helpers encrypt/decrypt with AES-GCM using a key stored in session
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

// Encrypts a string and returns base64(iv+data)
async function encryptString(text: string) {
  const encoder = new TextEncoder();
  const key = await getCryptoKey();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(text)
  );
  // Combine IV + ciphertext, encode base64
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  return btoa(String.fromCharCode(...combined));
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
import { useRouter } from 'next/navigation';
import { Input } from '@/components/admin/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { Button } from '@/components/ui/button';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';

interface NoticeCategory {
  id: string;
  name: string;
  description?: string;
}

interface NewNoticeFormProps {
  categories: NoticeCategory[];
  existingTitles: string[];
  saveNotice: (formData: FormData) => Promise<any>;
}

export default function NoticeNewClient({
  categories,
  existingTitles,
  saveNotice,
}: NewNoticeFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [contentError, setContentError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);

  const handlePreview = useCallback(() => {
    // バリデーションエラーをクリア
    setTitleError('');
    setCategoryError('');
    setContentError('');

    let hasError = false;

    if (!title.trim()) {
      setTitleError('タイトルを入力してください');
      hasError = true;
    } else if (title.length > 60) {
      setTitleError('タイトルは60文字以内で入力してください');
      hasError = true;
    }

    if (selectedCategoryIds.length === 0) {
      setCategoryError('カテゴリを選択してください');
      hasError = true;
    }

    if (!content.trim() || content === '<p></p>') {
      setContentError('記事内容を入力してください');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const noticeData = {
      title,
      categoryIds: selectedCategoryIds,
      content: content || '<p>記事内容がここに表示されます</p>',
      thumbnail: thumbnail ? URL.createObjectURL(thumbnail) : null,
      thumbnailName: thumbnail?.name || null,
    };

    (async () => {
      try {
        const encrypted = await encryptString(JSON.stringify(noticeData));
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('previewNotice', encrypted);
        }
        router.push('/admin/notice/preview');
      } catch (error) {
        console.error('暗号化に失敗:', error);
        router.push('/admin/notice/preview');
      }
    })();
  }, [title, selectedCategoryIds, content, thumbnail, router]);

  const handleSubmit = useCallback(
    async (status: 'DRAFT' | 'PUBLISHED') => {
      // バリデーションエラーをクリア
      setTitleError('');
      setCategoryError('');
      setContentError('');

      let hasError = false;

      if (!title.trim()) {
        setTitleError('タイトルを入力してください');
        hasError = true;
      } else if (title.length > 60) {
        setTitleError('タイトルは60文字以内で入力してください');
        hasError = true;
      }

      if (selectedCategoryIds.length === 0) {
        setCategoryError('カテゴリを選択してください');
        hasError = true;
      }

      if (!content.trim() || content === '<p></p>') {
        setContentError('記事内容を入力してください');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('categoryId', selectedCategoryIds[0] || '');
        formData.append(
          'content',
          content || '<p>記事内容がここに表示されます</p>'
        );
        formData.append('status', status);
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        }

        const result = await saveNotice(formData);

        if (status === 'PUBLISHED' && result?.success) {
          router.push('/admin/notice');
        } else if (status === 'DRAFT' && result?.success) {
          router.push('/admin/notice');
        }
      } catch (error) {
        console.error('お知らせの保存に失敗:', error);
        alert('お知らせの保存に失敗しました');
      } finally {
        setIsLoading(false);
      }
    },
    [title, selectedCategoryIds, content, thumbnail, router, saveNotice]
  );

  // プレビューからの戻り時にデータを復元
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;

    const storedData = sessionStorage.getItem('previewNotice');
    if (storedData) {
      (async () => {
        try {
          // decrypt and parse
          const decrypted = await decryptString(storedData);
          let data;
          try {
            data = JSON.parse(decrypted);
          } catch (e) {
            console.error('Failed to parse decrypted notice data:', e);
            return;
          }
          setTitle(data.title || '');
          setSelectedCategoryIds(data.categoryIds || []);
          setContent(data.content || '');

          // サムネイルの復元（プレビューからの戻りの場合はURLしかないので表示のみ）
          if (data.thumbnail && data.thumbnailName) {
            // URLから復元する場合は表示のみで実際のFileオブジェクトは作成しない
            // 代わりにプレビュー時と同じ形式でデータを保持
          }

          // sessionStorageをクリア（一度復元したらクリア）
          sessionStorage.removeItem('previewNotice');
        } catch (error) {
          console.error('プレビューデータの復元に失敗:', error);
        }
      })();
    }

    // AdminPageTitleからのイベントリスナーを追加
    const handleDraftSave = () => {
      handleSubmit('DRAFT');
    };

    const handlePreviewClick = () => {
      handlePreview();
    };

    window.addEventListener('draft-save', handleDraftSave);
    window.addEventListener('preview-click', handlePreviewClick);

    return () => {
      window.removeEventListener('draft-save', handleDraftSave);
      window.removeEventListener('preview-click', handlePreviewClick);
    };
  }, [handlePreview, handleSubmit]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes

      // 画像ファイルかどうかをMIMEタイプでチェック
      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.type)) {
        setThumbnailError(
          'jpeg、jpg、png、gif形式の画像ファイルのみアップロード可能です'
        );
        setThumbnail(null);
        // ファイル入力をクリア
        e.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        setThumbnailError('ファイルサイズは10MB以下にしてください');
        setThumbnail(null);
        // ファイル入力をクリア
        e.target.value = '';
        return;
      }

      setThumbnailError('');
      setThumbnail(file);
    }
  };

  const handleClearThumbnail = () => {
    setThumbnail(null);
    setThumbnailError('');
    // ファイル入力をクリア
    if (typeof document !== 'undefined') {
      const fileInput = document.getElementById(
        'thumbnail-input'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  };

  const handleCancel = () => {
    if (title || content || thumbnail) {
      if (confirm('入力内容が失われますが、よろしいですか？')) {
        router.push('/admin/notice');
      }
    } else {
      router.push('/admin/notice');
    }
  };

  return (
    <div className='min-h-screen'>
      <div className='space-y-6'>
        {/* タイトル */}
        <div>
          <FormFieldHeader>タイトル</FormFieldHeader>
          <div className='relative'>
            <input
              type='text'
              value={title}
              onChange={e => {
                const value = e.target.value;
                if (value.length <= 60) {
                  setTitle(value);
                  setTitleError('');
                  setShowTitleSuggestions(value.length > 0);
                }
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const matchedTitle = existingTitles.find(
                    existingTitle =>
                      existingTitle
                        .toLowerCase()
                        .includes(title.toLowerCase()) &&
                      existingTitle !== title
                  );
                  if (matchedTitle) {
                    setTitle(matchedTitle);
                    setShowTitleSuggestions(false);
                  }
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowTitleSuggestions(false), 200);
              }}
              onFocus={() => {
                if (title.length > 0) {
                  setShowTitleSuggestions(true);
                }
              }}
              placeholder='お知らせのタイトルを入力してください'
              className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]'
            />
            {showTitleSuggestions && title && (
              <div className='absolute z-10 w-full mt-1 bg-white border border-[#999999] rounded-[5px] shadow-lg max-h-60 overflow-y-auto'>
                {existingTitles
                  .filter(
                    existingTitle =>
                      existingTitle
                        .toLowerCase()
                        .includes(title.toLowerCase()) &&
                      existingTitle !== title
                  )
                  .slice(0, 10)
                  .map((existingTitle, index) => (
                    <button
                      key={index}
                      type='button'
                      onClick={() => {
                        setTitle(existingTitle);
                        setShowTitleSuggestions(false);
                        setTitleError('');
                      }}
                      className='w-full px-[11px] py-[8px] text-left text-[16px] text-[#323232] font-medium tracking-[1.6px] hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0'
                    >
                      {existingTitle}
                    </button>
                  ))}
                {existingTitles.filter(
                  existingTitle =>
                    existingTitle.toLowerCase().includes(title.toLowerCase()) &&
                    existingTitle !== title
                ).length === 0 && (
                  <div className='px-[11px] py-[8px] text-[16px] text-[#999999] font-medium tracking-[1.6px]'>
                    一致するタイトルがありません
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='flex justify-between items-center mt-1'>
            <div>
              {titleError && (
                <p className='text-red-500 text-sm'>{titleError}</p>
              )}
            </div>
            <p
              className={`text-sm ${
                title.length > 50 ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {title.length}/60文字
            </p>
          </div>
        </div>

        {/* カテゴリ */}
        <div>
          <FormFieldHeader>カテゴリ</FormFieldHeader>
          <div className='relative'>
            <input
              type='text'
              value={categoryInput}
              onChange={e => {
                setCategoryInput(e.target.value);
                setShowCategorySuggestions(e.target.value.length > 0);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const matchedCategory = categories.find(
                    cat =>
                      cat.name.toLowerCase() === categoryInput.toLowerCase() &&
                      !selectedCategoryIds.includes(cat.id)
                  );
                  if (matchedCategory && selectedCategoryIds.length < 3) {
                    setSelectedCategoryIds(prev => [
                      ...prev,
                      matchedCategory.id,
                    ]);
                    setCategoryInput('');
                    setShowCategorySuggestions(false);
                  }
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowCategorySuggestions(false), 200);
              }}
              onFocus={() => {
                if (categoryInput.length > 0) {
                  setShowCategorySuggestions(true);
                }
              }}
              placeholder='カテゴリ名を入力してください'
              className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]'
              disabled={selectedCategoryIds.length >= 3}
            />
            {showCategorySuggestions && categoryInput && (
              <div className='absolute z-10 w-full mt-1 bg-white border border-[#999999] rounded-[5px] shadow-lg max-h-60 overflow-y-auto'>
                {categories
                  .filter(
                    category =>
                      category.name
                        .toLowerCase()
                        .includes(categoryInput.toLowerCase()) &&
                      !selectedCategoryIds.includes(category.id)
                  )
                  .map(category => (
                    <button
                      key={category.id}
                      type='button'
                      onClick={() => {
                        if (selectedCategoryIds.length < 3) {
                          setSelectedCategoryIds(prev => [
                            ...prev,
                            category.id,
                          ]);
                          setCategoryInput('');
                          setShowCategorySuggestions(false);
                          setCategoryError('');
                        }
                      }}
                      className='w-full px-[11px] py-[8px] text-left text-[16px] text-[#323232] font-medium tracking-[1.6px] hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0'
                    >
                      {category.name}
                    </button>
                  ))}
                {categories.filter(
                  category =>
                    category.name
                      .toLowerCase()
                      .includes(categoryInput.toLowerCase()) &&
                    !selectedCategoryIds.includes(category.id)
                ).length === 0 && (
                  <div className='px-[11px] py-[8px] text-[16px] text-[#999999] font-medium tracking-[1.6px]'>
                    一致するカテゴリがありません
                  </div>
                )}
              </div>
            )}
          </div>
          {selectedCategoryIds.length > 0 && (
            <div className='flex flex-wrap gap-2 mt-3'>
              {selectedCategoryIds.map(categoryId => {
                const category = categories.find(cat => cat.id === categoryId);
                return (
                  <div
                    key={categoryId}
                    className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0'
                    style={{ borderRadius: '10px' }}
                  >
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {category?.name || ''}
                    </span>
                    <button
                      type='button'
                      onClick={() => {
                        setSelectedCategoryIds(prev =>
                          prev.filter(id => id !== categoryId)
                        );
                      }}
                      className='ml-2 text-[#0f9058] hover:text-[#0a7a46]'
                    >
                      <svg
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'
                      >
                        <path
                          d='M1 1L11 11M1 11L11 1'
                          stroke='currentColor'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className='flex justify-between items-center mt-1'>
            <div>
              {categoryError && (
                <p className='text-red-500 text-sm'>{categoryError}</p>
              )}
            </div>
            <p
              className={`text-sm ${
                selectedCategoryIds.length >= 3
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {selectedCategoryIds.length}/3個
            </p>
          </div>
        </div>

        {/* サムネイル */}
        <div>
          <FormFieldHeader>サムネイル</FormFieldHeader>
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-4'>
              <button
                type='button'
                onClick={() => {
                  if (typeof document !== 'undefined') {
                    document.getElementById('thumbnail-input')?.click();
                  }
                }}
                className='px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-fit'
              >
                画像をアップロード
              </button>
              <button
                type='button'
                onClick={handleClearThumbnail}
                className='text-[#323232] text-[16px] font-medium underline hover:text-[#666666] transition-colors'
              >
                アップロードされた画像を削除する
              </button>
            </div>
            <input
              id='thumbnail-input'
              type='file'
              accept='image/*'
              onChange={handleThumbnailChange}
              className='hidden'
            />
            <span
              className='text-gray-500 text-sm'
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              ファイル形式：jpeg、jpg、png、gif（最大10MB）
            </span>
            {thumbnailError && (
              <span className='text-red-500 text-sm'>{thumbnailError}</span>
            )}
            {thumbnail && !thumbnailError && (
              <span className='text-green-600 text-xs'>
                選択中: {thumbnail.name}
              </span>
            )}
          </div>
        </div>

        {/* 内容 */}
        <div>
          <FormFieldHeader>内容</FormFieldHeader>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder='お知らせの内容を入力してください。'
          />

          {contentError && (
            <p className='text-red-500 text-sm mt-1'>{contentError}</p>
          )}
        </div>
      </div>

      {/* 下部ボタン */}
      <div className='flex justify-center gap-4 mt-8 mb-8'>
        <div style={{ width: '170px' }}>
          <Button
            onClick={handleCancel}
            variant='green-outline'
            size='figma-default'
          >
            一覧に戻る
          </Button>
        </div>
        <div style={{ width: '170px' }}>
          <Button
            onClick={handlePreview}
            variant='green-gradient'
            size='figma-default'
            className='w-full'
          >
            お知らせを確認する
          </Button>
        </div>
      </div>
    </div>
  );
}
