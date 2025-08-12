'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/admin/ui/button';
import '@/styles/media-content.css';

interface PreviewData {
  title: string;
  categoryId: string;
  tags: string;
  content: string;
  thumbnail: string | null;
  thumbnailName: string | null;
}

export default function PreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedData = sessionStorage.getItem('previewArticle');
    if (storedData) {
      const data = JSON.parse(storedData);
      console.log('Preview data content:', data.content);
      setPreviewData(data);
    } else {
      router.push('/admin/media/new');
    }
  }, [router]);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    if (!previewData) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', previewData.title);
      formData.append('categoryId', previewData.categoryId);
      formData.append('tags', previewData.tags);
      formData.append('content', previewData.content);
      formData.append('status', status);
      
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

      if (!response.ok) {
        throw new Error('記事の保存に失敗しました');
      }

      sessionStorage.removeItem('previewArticle');
      router.push('/admin/media');
    } catch (error) {
      console.error('記事の保存に失敗:', error);
      setError(error instanceof Error ? error.message : '記事の保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    router.push('/admin/media/new');
  };

  const handleCancel = () => {
    if (confirm('プレビューを終了して一覧に戻りますか？')) {
      sessionStorage.removeItem('previewArticle');
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
  }).replace(/\//g, '.');

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 操作ボタンエリア */}
      <div className="bg-white border-b border-gray-300 py-4 mb-6">
        <div className="max-w-[800px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-800">記事プレビュー</h1>
            <p className="text-sm text-gray-600">公開前に記事の確認ができます</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              キャンセル
            </Button>
            <Button 
              onClick={handleEdit}
              variant="outline"
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              編集に戻る
            </Button>
            <Button 
              onClick={() => handleSave('DRAFT')}
              disabled={isLoading}
              className="bg-white text-black border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-50 disabled:opacity-50"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              {isLoading ? '保存中...' : '下書き保存'}
            </Button>
            <Button 
              onClick={() => handleSave('PUBLISHED')}
              disabled={isLoading}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              {isLoading ? '保存中...' : '記事を公開'}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-[800px] mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9]">
        <div className="">
          
          <div className="flex flex-col">
            {/* 記事本文 */}
            <article className="w-full max-w-[800px] mx-auto">
              
              {/* 日時 */}
              <div className="mb-[16px]">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* 記事タイトルセクション */}
              <div className="mb-[32px]">
                <h1 className="text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]" style={{ fontWeight: 700, fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                  {previewData.title}
                </h1>
                <div className="flex items-center gap-[16px]">
                  <span
                    className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                    style={{ 
                      fontWeight: 700,
                      fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    メディア
                  </span>
                  <span 
                    className="bg-yellow-600 text-white text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                    style={{ 
                      fontWeight: 700,
                      fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    プレビュー
                  </span>
                </div>
              </div>

              {/* メイン画像 */}
              {previewData.thumbnail && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]">
                  <img 
                    src={previewData.thumbnail} 
                    alt={previewData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 記事本文（リッチコンテンツ） */}
              <div 
                className="prose prose-lg max-w-none mb-[60px]"
                dangerouslySetInnerHTML={{ __html: previewData.content }}
              />

            </article>
          </div>

        </div>
      </main>
    </div>
  );
}