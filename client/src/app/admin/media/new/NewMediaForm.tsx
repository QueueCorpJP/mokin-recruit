'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/admin/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTextarea } from '@/components/admin/ui/AdminTextarea';

interface ArticleCategory {
  id: string;
  name: string;
  description?: string;
}

interface NewMediaFormProps {
  categories: ArticleCategory[];
  saveArticle: (formData: FormData) => Promise<void>;
}

export default function NewMediaForm({ categories, saveArticle }: NewMediaFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handlePreview = () => {
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    const articleData = {
      title,
      categoryId: selectedCategoryId,
      tags,
      content: content || '<p>記事内容がここに表示されます</p>',
      thumbnail: thumbnail ? URL.createObjectURL(thumbnail) : null,
      thumbnailName: thumbnail?.name || null
    };

    sessionStorage.setItem('previewArticle', JSON.stringify(articleData));
    router.push('/admin/media/preview');
  };

  const handleSubmit = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('categoryId', selectedCategoryId);
      formData.append('tags', tags);
      formData.append('content', content || '<p>記事内容がここに表示されます</p>');
      formData.append('status', status);
      if (thumbnail) {
        formData.append('thumbnail', thumbnail);
      }

      await saveArticle(formData);
    } catch (error) {
      console.error('記事の保存に失敗:', error);
      setError(error instanceof Error ? error.message : '記事の保存に失敗しました');
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
      <div className="mb-6">
        <h1 
          className="text-2xl font-bold mb-6"
          style={{
            fontFamily: 'Inter',
            fontSize: '24px',
            fontWeight: 700,
            lineHeight: 1.6,
            color: '#323232'
          }}
        >
          新規記事追加
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-end gap-4">
          <AdminButton
            onClick={() => handleSubmit('DRAFT')}
            text={isLoading ? '保存中...' : '下書き保存'}
            variant="primary"
            disabled={isLoading}
          />
          <AdminButton
            onClick={handlePreview}
            text="確認"
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* タイトル */}
        <div>
          <FormFieldHeader>
            タイトル
          </FormFieldHeader>
          <AdminTextarea
            value={title}
            onChange={setTitle}
            placeholder="記事のタイトルを入力してください"
            height="h-20"
            rows={2}
          />
        </div>

        {/* カテゴリ */}
        <div>
          <FormFieldHeader>
            カテゴリ
          </FormFieldHeader>
          {selectedCategoryId && (
            <div className="flex flex-wrap gap-2 mb-3">
              <div
                className="bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0"
                style={{ borderRadius: '10px' }}
              >
                <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
                  {categories.find(cat => cat.id === selectedCategoryId)?.name || ''}
                </span>
              </div>
            </div>
          )}
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] shadow-none">
              <SelectValue placeholder="カテゴリを選択してください" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* タグ */}
        <div>
          <FormFieldHeader>
            タグ
          </FormFieldHeader>
          <AdminTextarea
            value={tags}
            onChange={setTags}
            placeholder="タグをカンマ区切りで入力 (例: React, TypeScript, Web開発)"
            height="h-16"
            rows={2}
          />
        </div>

        {/* サムネイル */}
        <div>
          <FormFieldHeader>
            サムネイル
          </FormFieldHeader>
          <div className="flex gap-4">
            <div className="bg-red-100 border-2 border-dashed border-red-400 w-16 h-16 flex items-center justify-center rounded">
              <span className="text-red-500 text-xs">10</span>
            </div>
            <div className="flex flex-col gap-2">
              <AdminButton
                onClick={() => document.getElementById('thumbnail-input')?.click()}
                text="画像をアップロード"
                variant="secondary"
                size="small"
              />
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
                ファイル形式：jpeg、jpg、png、gif
              </span>
              {thumbnail && (
                <span className="text-green-600 text-xs">
                  選択中: {thumbnail.name}
                </span>
              )}
            </div>
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
          <div className="text-right mt-2">
            <span 
              className="text-red-500 text-sm"
              style={{
                fontFamily: 'Inter',
                fontSize: '12px',
                fontWeight: 400,
                lineHeight: 1.6
              }}
            >
              WYSIWYGエディタで記事内容を作成<br />
              目次、テーブル、画像、見出しなどを自由に配置可能
            </span>
          </div>
        </div>
      </div>

      {/* 下部ボタン */}
      <div className="flex justify-center gap-4 mt-8 mb-8">
        <AdminButton
          onClick={handleCancel}
          text="一覧に戻る"
          variant="green-outline"
        />
        <AdminButton
          onClick={handlePreview}
          text="確認"
        />
      </div>
    </div>
  );
}