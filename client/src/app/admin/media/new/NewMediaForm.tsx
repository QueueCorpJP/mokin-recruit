'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/admin/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { Button } from '@/components/ui/button';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';

interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
}

interface ArticleTag {
  id: string;
  name: string;
}

interface NewMediaFormProps {
  categories: ArticleCategory[];
  tags: ArticleTag[];
  saveArticle: (formData: FormData) => Promise<any>;
}

export default function NewMediaForm({ categories, tags, saveArticle }: NewMediaFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [contentError, setContentError] = useState('');
  const [thumbnailError, setThumbnailError] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  

  // プレビューからの戻り時にデータを復元
  useEffect(() => {
    const storedData = sessionStorage.getItem('previewArticle');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setTitle(data.title || '');
        setSelectedCategoryIds(data.categoryIds || []);
        // タグ名からタグIDに変換（プレビューからの復元時）
        if (Array.isArray(data.tags) && data.tags.length > 0 && typeof data.tags[0] === 'string') {
          const tagIds = data.tags.map((tagName: string) => {
            const tag = tags.find(t => t.name === tagName);
            return tag?.id;
          }).filter(Boolean);
          setSelectedTags(tagIds);
        } else {
          setSelectedTags(data.tags || []);
        }
        setContent(data.content || '');
        
        // サムネイルの復元（プレビューからの戻りの場合はURLしかないので表示のみ）
        if (data.thumbnail && data.thumbnailName) {
          // URLから復元する場合は表示のみで実際のFileオブジェクトは作成しない
          // 代わりにプレビュー時と同じ形式でデータを保持
        }
        
        // sessionStorageをクリア（一度復元したらクリア）
        sessionStorage.removeItem('previewArticle');
      } catch (error) {
        console.error('プレビューデータの復元に失敗:', error);
      }
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
  }, []);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      
      // 画像ファイルかどうかをMIMEタイプでチェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setThumbnailError('jpeg、jpg、png、gif形式の画像ファイルのみアップロード可能です');
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
    const fileInput = document.getElementById('thumbnail-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePreview = () => {
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

    const articleData = {
      title,
      categoryIds: selectedCategoryIds,
      tags: selectedTags.map(tagId => {
        const tag = tags.find(t => t.id === tagId);
        return tag?.name || '';
      }).filter(Boolean),
      content: content || '<p>記事内容がここに表示されます</p>',
      thumbnail: thumbnail ? URL.createObjectURL(thumbnail) : null,
      thumbnailName: thumbnail?.name || null
    };

    sessionStorage.setItem('previewArticle', JSON.stringify(articleData));
    router.push('/admin/media/preview');
  };

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
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
      formData.append('categoryId', selectedCategoryIds[0] || ''); // actions.tsはcategoryIdを期待している
      formData.append('tags', selectedTags.map(tagId => {
        const tag = tags.find(t => t.id === tagId);
        return tag?.name || '';
      }).filter(Boolean).join(', ')); // タグ名のカンマ区切り文字列
      formData.append('content', content || '<p>記事内容がここに表示されます</p>');
      formData.append('status', status);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      const result = await saveArticle(formData);
      
      if (status === 'PUBLISHED' && result?.success) {
        // 公開時は成功後にリダイレクト
        router.push('/admin/media');
      } else if (status === 'DRAFT' && result?.success) {
        // 下書き保存時もリダイレクト
        router.push('/admin/media');
      }
    } catch (error) {
      console.error('記事の保存に失敗:', error);
      if (error instanceof Error && error.message.includes('title')) {
        setTitleError('タイトルの保存に失敗しました');
      } else if (error instanceof Error && error.message.includes('category')) {
        setCategoryError('カテゴリの保存に失敗しました');
      } else if (error instanceof Error && error.message.includes('content')) {
        setContentError('記事内容の保存に失敗しました');
      } else {
        setTitleError('記事の保存に失敗しました');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (title || content || thumbnail) {
      if (confirm('入力内容が失われますが、よろしいですか？')) {
        router.push('/admin/media');
      }
    } else {
      router.push('/admin/media');
    }
  };

  return (
    <div className="min-h-screen">

      <div className="space-y-6">
        {/* タイトル */}
        <div>
          <FormFieldHeader>
            タイトル
          </FormFieldHeader>
          <AdminTextarea
            value={title}
            onChange={(value) => {
              if (value.length <= 60) {
                setTitle(value);
                setTitleError('');
              }
            }}
            placeholder="記事のタイトルを入力してください"
            height="h-20"
            rows={2}
          />
          <div className="flex justify-between items-center mt-1">
            <div>
              {titleError && (
                <p className="text-red-500 text-sm">
                  {titleError}
                </p>
              )}
            </div>
            <p className={`text-sm ${
              title.length > 50 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {title.length}/60文字
            </p>
          </div>
        </div>

        {/* カテゴリ */}
        <div>
          <FormFieldHeader>
            カテゴリ
          </FormFieldHeader>
          {selectedCategoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCategoryIds.map(categoryId => {
                const category = categories.find(cat => cat.id === categoryId);
                return (
                  <div
                    key={categoryId}
                    className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0"
                    style={{ borderRadius: '10px' }}
                  >
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {category?.name || ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryIds(prev => prev.filter(id => id !== categoryId));
                      }}
                      className="ml-2 text-[#0f9058] hover:text-[#0a7a46]"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M1 1L11 11M1 11L11 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              value={categoryInput}
              onChange={(e) => {
                setCategoryInput(e.target.value);
                setShowCategorySuggestions(e.target.value.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const matchedCategory = categories.find(
                    cat => cat.name.toLowerCase() === categoryInput.toLowerCase() && 
                    !selectedCategoryIds.includes(cat.id)
                  );
                  if (matchedCategory && selectedCategoryIds.length < 3) {
                    setSelectedCategoryIds(prev => [...prev, matchedCategory.id]);
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
              placeholder="カテゴリ名を入力してください"
              className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
              disabled={selectedCategoryIds.length >= 3}
            />
            {showCategorySuggestions && categoryInput && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#999999] rounded-[5px] shadow-lg max-h-60 overflow-y-auto">
                {categories
                  .filter(category => 
                    category.name.toLowerCase().includes(categoryInput.toLowerCase()) &&
                    !selectedCategoryIds.includes(category.id)
                  )
                  .map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => {
                        if (selectedCategoryIds.length < 3) {
                          setSelectedCategoryIds(prev => [...prev, category.id]);
                          setCategoryInput('');
                          setShowCategorySuggestions(false);
                          setCategoryError('');
                        }
                      }}
                      className="w-full px-[11px] py-[8px] text-left text-[16px] text-[#323232] font-medium tracking-[1.6px] hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                    >
                      {category.name}
                    </button>
                  ))
                }
                {categories.filter(category => 
                  category.name.toLowerCase().includes(categoryInput.toLowerCase()) &&
                  !selectedCategoryIds.includes(category.id)
                ).length === 0 && (
                  <div className="px-[11px] py-[8px] text-[16px] text-[#999999] font-medium tracking-[1.6px]">
                    一致するカテゴリがありません
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <div>
              {categoryError && (
                <p className="text-red-500 text-sm">
                  {categoryError}
                </p>
              )}
            </div>
            <p className={`text-sm ${
              selectedCategoryIds.length >= 3 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {selectedCategoryIds.length}/3個
            </p>
          </div>
        </div>

        {/* タグ */}
        <div>
          <FormFieldHeader>
            タグ
          </FormFieldHeader>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedTags.map(tagId => {
                const tag = tags.find(t => t.id === tagId);
                return (
                  <div
                    key={tagId}
                    className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0"
                    style={{ borderRadius: '10px' }}
                  >
                    <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                      {tag?.name || ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTags(prev => prev.filter(id => id !== tagId));
                      }}
                      className="ml-2 text-[#0f9058] hover:text-[#0a7a46]"
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M1 1L11 11M1 11L11 1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => {
                setTagInput(e.target.value);
                setShowTagSuggestions(e.target.value.length > 0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const matchedTag = tags.find(
                    tag => tag.name.toLowerCase() === tagInput.toLowerCase() && 
                    !selectedTags.includes(tag.id)
                  );
                  if (matchedTag && selectedTags.length < 6) {
                    setSelectedTags(prev => [...prev, matchedTag.id]);
                    setTagInput('');
                    setShowTagSuggestions(false);
                  }
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowTagSuggestions(false), 200);
              }}
              onFocus={() => {
                if (tagInput.length > 0) {
                  setShowTagSuggestions(true);
                }
              }}
              placeholder="タグ名を入力してください"
              className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
            />
            {showTagSuggestions && tagInput && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#999999] rounded-[5px] shadow-lg max-h-60 overflow-y-auto">
                {tags
                  .filter(tag => 
                    tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                    !selectedTags.includes(tag.id)
                  )
                  .map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        if (selectedTags.length < 6) {
                          setSelectedTags(prev => [...prev, tag.id]);
                          setTagInput('');
                          setShowTagSuggestions(false);
                        }
                      }}
                      className="w-full px-[11px] py-[8px] text-left text-[16px] text-[#323232] font-medium tracking-[1.6px] hover:bg-[#f5f5f5] border-b border-[#f0f0f0] last:border-b-0"
                    >
                      {tag.name}
                    </button>
                  ))
                }
                {tags.filter(tag => 
                  tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
                  !selectedTags.includes(tag.id)
                ).length === 0 && (
                  <div className="px-[11px] py-[8px] text-[16px] text-[#999999] font-medium tracking-[1.6px]">
                    一致するタグがありません
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <div></div>
            <p className={`text-sm ${
              selectedTags.length >= 5 ? 'text-red-500' : 'text-gray-500'
            }`}>
              {selectedTags.length}/6個
            </p>
          </div>
        </div>

        {/* サムネイル */}
        <div>
          <FormFieldHeader>
            サムネイル
          </FormFieldHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => document.getElementById('thumbnail-input')?.click()}
                className="px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-fit"
              >
                画像をアップロード
              </button>
              <button
                type="button"
                onClick={handleClearThumbnail}
                className="text-[#323232] text-[16px] font-medium underline hover:text-[#666666] transition-colors"
              >
                画像を消去
              </button>
            </div>
            <input
              id="thumbnail-input"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            <span 
              className="text-gray-500 text-sm"
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              ファイル形式：jpeg、jpg、png、gif（最大10MB）
            </span>
            {thumbnailError && (
              <span className="text-red-500 text-sm">
                {thumbnailError}
              </span>
            )}
            {thumbnail && !thumbnailError && (
              <span className="text-green-600 text-xs">
                選択中: {thumbnail.name}
              </span>
            )}
          </div>
        </div>

        {/* 内容 */}
        <div>
          <FormFieldHeader>
            内容
          </FormFieldHeader>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="記事の内容を入力してください。目次、テーブル、画像、見出しなどを自由に追加できます。"
          />
         
          {contentError && (
            <p className="text-red-500 text-sm mt-1">
              {contentError}
            </p>
          )}
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="flex justify-center gap-4 mt-8 mb-8">
        <div style={{ width: '170px' }}>
          <Button
            onClick={handleCancel}
            variant="green-outline"
            size="figma-default"
          >
            一覧に戻る
          </Button>
        </div>
        <div style={{ width: '170px' }}>
          <Button
            onClick={handlePreview}
            variant="green-gradient"
            size="figma-default"
            className="w-full"
          >
            記事を確認する
          </Button>
        </div>
      </div>
    </div>
  );
}