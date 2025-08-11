'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

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
            color: '#000'
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
          <Button 
            onClick={() => handleSubmit('DRAFT')}
            disabled={isLoading}
            className="bg-white text-black border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50 disabled:opacity-50"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            {isLoading ? '保存中...' : '下書き保存'}
          </Button>
          <Button 
            onClick={() => handleSubmit('PUBLISHED')}
            disabled={isLoading}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            {isLoading ? '保存中...' : '記事を保存する'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* タイトル */}
        <div>
          <label 
            className="block mb-2 bg-black text-white px-4 py-2"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            タイトル
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 border border-gray-300 rounded-none"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          />
        </div>

        {/* カテゴリ */}
        <div>
          <label 
            className="block mb-2 bg-black text-white px-4 py-2"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            カテゴリ
          </label>
          <div className="flex gap-2 mb-3">
            <span 
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              カテゴリA
            </span>
            <span 
              className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              カテゴリB
            </span>
          </div>
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="w-full h-12 border border-gray-300 rounded-none">
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
          <label 
            className="block mb-2 bg-black text-white px-4 py-2"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            タグ
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="タグをカンマ区切りで入力 (例: React, TypeScript, Web開発)"
            className="w-full h-12 border border-gray-300 rounded-none"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: 1.6
            }}
          />
        </div>

        {/* サムネイル */}
        <div>
          <label 
            className="block mb-2 bg-black text-white px-4 py-2"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            サムネイル
          </label>
          <div className="flex gap-4">
            <div className="bg-red-100 border-2 border-dashed border-red-400 w-16 h-16 flex items-center justify-center rounded">
              <span className="text-red-500 text-xs">10</span>
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline"
                className="border border-gray-300 text-black px-4 py-1 rounded text-sm hover:bg-gray-50"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
                onClick={() => document.getElementById('thumbnail-input')?.click()}
              >
                画像をアップロード
              </Button>
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
          <label 
            className="block mb-2 bg-black text-white px-4 py-2"
            style={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 700,
              lineHeight: 1.6
            }}
          >
            内容
          </label>
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
        <Button 
          onClick={handleCancel}
          variant="outline"
          className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-50"
          style={{
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 1.6
          }}
        >
          一覧に戻る
        </Button>
        <Button 
          onClick={() => handleSubmit('PUBLISHED')}
          disabled={isLoading}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
          style={{
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: 1.6
          }}
        >
          {isLoading ? '保存中...' : '記事を保存する'}
        </Button>
      </div>
    </div>
  );
}