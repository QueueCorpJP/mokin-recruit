'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/admin/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { Button } from '@/components/ui/button';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';

interface NoticeCategory {
  id: string;
  name: string;
  description?: string;
}

interface EditNoticeFormProps {
  categories: NoticeCategory[];
  saveNotice: (formData: FormData) => Promise<void>;
  initialNotice?: any;
}

export default function EditNoticeForm({
  categories,
  saveNotice,
  initialNotice,
}: EditNoticeFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialNotice?.title || '');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    () => {
      if (
        initialNotice?.notice_categories &&
        Array.isArray(initialNotice.notice_categories)
      ) {
        return initialNotice.notice_categories.map((cat: any) => cat.id);
      }
      return [];
    }
  );
  const [content, setContent] = useState(initialNotice?.content || '');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>(
    initialNotice?.status || 'DRAFT'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [contentError, setContentError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [noticeId, setNoticeId] = useState<string | null>(
    initialNotice?.id || null
  );

  // 初期データのセット
  useEffect(() => {
    if (initialNotice) {
      setTitle(initialNotice.title || '');
      setContent(initialNotice.content || '');
      setStatus(initialNotice.status || 'DRAFT');
      setThumbnailUrl(initialNotice.thumbnail_url || '');
      setThumbnailPreview(initialNotice.thumbnail_url || '');
      setNoticeId(initialNotice.id || null);
    }
  }, [initialNotice]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailError('');

    // ファイルサイズチェック (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setThumbnailError('ファイルサイズが10MBを超えています');
      return;
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setThumbnailError(
        'jpeg、jpg、png、gif形式のファイルのみアップロード可能です'
      );
      return;
    }

    setThumbnail(file);

    // プレビュー表示
    const reader = new FileReader();
    reader.onload = e => {
      setThumbnailPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearThumbnail = () => {
    setThumbnail(null);
    setThumbnailUrl('');
    setThumbnailPreview('');
    setThumbnailError('');

    // input要素をリセット
    const input = document.getElementById(
      'thumbnail-input'
    ) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handlePreview = useCallback(async () => {
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
      setContentError('お知らせ内容を入力してください');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // プレビュー用データを準備
    const noticeData = {
      id: noticeId,
      title,
      categoryIds: selectedCategoryIds,
      content: content || '<p>お知らせ内容がここに表示されます</p>',
      thumbnail: thumbnailPreview,
      thumbnailName: thumbnail?.name || null,
      status,
    };

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('previewNotice', JSON.stringify(noticeData));
      } catch {}
      router.push('/admin/notice/edit/preview');
    } else {
      router.push('/admin/notice/edit/preview');
    }
  }, [
    title,
    selectedCategoryIds,
    content,
    thumbnailPreview,
    thumbnail,
    status,
    noticeId,
    router,
  ]);

  const handleCancel = () => {
    if (title || content || thumbnail) {
      if (confirm('入力内容が失われますが、よろしいですか？')) {
        router.push('/admin/notice');
      }
    } else {
      router.push('/admin/notice');
    }
  };

  const handleSubmit = useCallback(
    async (submitStatus: 'DRAFT' | 'PUBLISHED') => {
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
        setContentError('お知らせ内容を入力してください');
        hasError = true;
      }

      if (hasError) {
        return;
      }

      setIsLoading(true);

      try {
        const formData = new FormData();
        if (noticeId) {
          formData.append('id', noticeId);
        }
        formData.append('title', title);
        formData.append('categoryId', selectedCategoryIds[0] || '');
        formData.append(
          'content',
          content || '<p>お知らせ内容がここに表示されます</p>'
        );
        formData.append('status', submitStatus);
        if (thumbnail) {
          formData.append('thumbnail', thumbnail);
        } else if (thumbnailUrl) {
          formData.append('thumbnail_url', thumbnailUrl);
        }

        await saveNotice(formData);
      } catch (error) {
        console.error('お知らせの保存に失敗:', error);
        if (error instanceof Error && error.message.includes('title')) {
          setTitleError('タイトルの保存に失敗しました');
        } else if (
          error instanceof Error &&
          error.message.includes('category')
        ) {
          setCategoryError('カテゴリの保存に失敗しました');
        } else if (
          error instanceof Error &&
          error.message.includes('content')
        ) {
          setContentError('お知らせ内容の保存に失敗しました');
        } else {
          setTitleError('お知らせの保存に失敗しました');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      title,
      selectedCategoryIds,
      content,
      noticeId,
      thumbnail,
      thumbnailUrl,
      saveNotice,
    ]
  );

  // AdminPageTitleからのイベントリスナーを追加
  useEffect(() => {
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
  }, [
    title,
    selectedCategoryIds,
    content,
    thumbnail,
    thumbnailUrl,
    handlePreview,
    handleSubmit,
  ]);

  return (
    <div className='min-h-screen'>
      <div className='space-y-6'>
        {/* タイトル */}
        <div>
          <FormFieldHeader>タイトル</FormFieldHeader>
          <AdminTextarea
            value={title}
            onChange={value => {
              if (value.length <= 60) {
                setTitle(value);
                setTitleError('');
              }
            }}
            placeholder='お知らせのタイトルを入力してください'
            height='h-20'
            rows={2}
          />
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
                onClick={() =>
                  document.getElementById('thumbnail-input')?.click()
                }
                className='px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-fit'
              >
                画像をアップロード
              </button>
              <button
                type='button'
                onClick={handleClearThumbnail}
                className='text-[#323232] text-[16px] font-medium underline hover:text-[#666666] transition-colors'
              >
                画像を消去
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
            {thumbnailPreview && !thumbnailError && (
              <div className='mt-3'>
                <div
                  className='relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden'
                  style={{ minWidth: '300px', maxWidth: '500px' }}
                >
                  <Image
                    src={thumbnailPreview}
                    alt={thumbnail ? '選択中の画像' : '現在のサムネイル'}
                    fill
                    className='object-cover'
                  />
                </div>
                <div className='mt-2 flex justify-between items-center'>
                  <div>
                    <span className='text-green-600 text-sm font-medium'>
                      {thumbnail ? '選択中の画像' : '現在のサムネイル画像'}
                    </span>
                    {thumbnail && (
                      <span className='text-gray-600 text-xs block mt-1'>
                        {thumbnail.name}
                      </span>
                    )}
                  </div>
                  <button
                    type='button'
                    onClick={handleClearThumbnail}
                    className='text-red-500 text-sm hover:text-red-700 transition-colors px-3 py-1 border border-red-300 rounded hover:bg-red-50'
                  >
                    画像を削除
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ステータス */}
        <div>
          <FormFieldHeader>ステータス</FormFieldHeader>
          <div style={{ width: '300px' }}>
            <SelectInput
              options={[
                { value: 'DRAFT', label: '下書き' },
                { value: 'PUBLISHED', label: '公開' },
              ]}
              value={status}
              onChange={(value: string) =>
                setStatus(value as 'DRAFT' | 'PUBLISHED')
              }
              placeholder='ステータスを選択してください'
            />
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
          <div className='text-right mt-2'></div>
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
