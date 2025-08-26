'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { SelectInput } from '@/components/ui/select-input';
import Link from 'next/link';
import { updateNotice, uploadNoticeThumbnail } from '../../actions';

interface NoticeDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
}

interface NoticeFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  status: string;
  meta_title: string;
  meta_description: string;
}

interface Props {
  initialNotice: NoticeDetail;
}

export default function NoticeEditClient({ initialNotice }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<NoticeFormData>({
    title: initialNotice.title,
    slug: initialNotice.slug,
    excerpt: initialNotice.excerpt || '',
    content: initialNotice.content,
    thumbnail_url: initialNotice.thumbnail_url || '',
    status: initialNotice.status,
    meta_title: initialNotice.meta_title || '',
    meta_description: initialNotice.meta_description || '',
  });

  const statusOptions = [
    { value: 'DRAFT', label: '下書き' },
    { value: 'PUBLISHED', label: '公開' },
    { value: 'ARCHIVED', label: 'アーカイブ' },
  ];

  const handleInputChange = (field: keyof NoticeFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // サムネイルのアップロード処理（必要な場合）
      let thumbnailUrl = formData.thumbnail_url;
      
      // TODO: 画像アップロード機能が必要な場合は実装
      
      // お知らせを更新
      const result = await updateNotice(initialNotice.id, {
        title: formData.title,
        excerpt: formData.excerpt || formData.title.substring(0, 100),
        content: formData.content,
        status: formData.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
        thumbnail_url: thumbnailUrl || undefined,
        categories: [] // TODO: カテゴリ選択機能を実装する場合は追加
      });

      if (result.success) {
        router.push(`/admin/notice/${initialNotice.id}`);
      } else {
        console.error('Failed to update notice:', result.error);
      }
    } catch (error) {
      console.error('Error updating notice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href={`/admin/notice/${initialNotice.id}`}>
              <Button variant="outline">← 詳細に戻る</Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">お知らせ編集</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">基本情報</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  タイトル <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  placeholder="お知らせのタイトルを入力"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  スラッグ <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  required
                  placeholder="URL用のスラッグ"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">URLに使用される識別子です</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ステータス <span className="text-red-500">*</span>
                </label>
                <SelectInput
                  options={statusOptions}
                  value={formData.status}
                  onChange={(value) => handleInputChange('status', value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  抜粋
                </label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="記事の概要を入力（一覧表示時に使用）"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  サムネイル画像URL
                </label>
                <Input
                  type="text"
                  value={formData.thumbnail_url}
                  onChange={(e) => handleInputChange('thumbnail_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">コンテンツ</h2>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  本文 <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  required
                  placeholder="お知らせの本文を入力（HTMLタグ使用可）"
                  rows={15}
                  className="w-full font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">HTMLタグを使用して記述できます</p>
              </div>
            </div>
          </div>

          {/* SEO設定 */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">SEO設定（任意）</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メタタイトル
                </label>
                <Input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="検索結果に表示されるタイトル"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メタディスクリプション
                </label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="検索結果に表示される説明文"
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end gap-4">
            <Link href={`/admin/notice/${initialNotice.id}`}>
              <Button variant="outline" type="button">
                キャンセル
              </Button>
            </Link>
            <Button
              type="submit"
              variant="green-gradient"
              disabled={isSubmitting || !formData.title || !formData.slug || !formData.content}
            >
              {isSubmitting ? '更新中...' : 'お知らせを更新'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}