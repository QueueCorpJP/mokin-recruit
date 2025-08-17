'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/admin/ui/button';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/admin/ui/select';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
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

export default function EditPreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedArticleId, setSavedArticleId] = useState<string | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('previewArticle');
    if (storedData) {
      const data = JSON.parse(storedData);
      console.log('Preview data content:', data.content);
      setPreviewData(data);
      setCurrentStatus(data.status || 'DRAFT');
    } else {
      router.push('/admin/media/edit');
    }
  }, [router]);

  const handleSave = async () => {
    if (!previewData) return;

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', previewData.title);
      formData.append('categoryIds', JSON.stringify(previewData.categoryIds));
      formData.append('tags', JSON.stringify(previewData.tags));
      formData.append('content', previewData.content);
      formData.append('status', currentStatus);
      
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
  }).replace(/\//g, '.');

  const getStatusText = (status: 'DRAFT' | 'PUBLISHED') => {
    return status === 'DRAFT' ? '下書き' : '公開';
  };

  const getSaveButtonText = () => {
    if (isLoading) return '保存中...';
    return currentStatus === 'DRAFT' ? '記事を下書き保存' : '記事を公開する';
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* 操作ボタンエリア */}
      <div className="bg-white border-b border-gray-300 py-4 mb-6">
        <div className="max-w-[800px] mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-gray-800">記事プレビュー（編集）</h1>
            <p className="text-sm text-gray-600">公開前に記事の確認ができます</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleBack}
              variant="outline"
              className="border border-gray-400 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 min-w-[140px]"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              戻る
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50 min-w-[140px]"
              style={{
                fontFamily: 'Inter',
                fontSize: '14px',
                fontWeight: 700,
                lineHeight: 1.6
              }}
            >
              {getSaveButtonText()}
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
            {/* ステータス選択エリア */}
            <div className="w-full max-w-[800px] mx-auto mb-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <FormFieldHeader>
                  ステータス
                </FormFieldHeader>
                <Select
                  value={currentStatus}
                  onValueChange={(value: 'DRAFT' | 'PUBLISHED') => setCurrentStatus(value)}
                >
                  <SelectTrigger className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                    <SelectValue placeholder="ステータスを選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">下書き</SelectItem>
                    <SelectItem value="PUBLISHED">公開</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                  <span 
                    className={`text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px] ${
                      currentStatus === 'DRAFT' 
                        ? 'bg-gray-500 text-white' 
                        : 'bg-blue-600 text-white'
                    }`}
                    style={{ 
                      fontWeight: 700,
                      fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }}
                  >
                    {getStatusText(currentStatus)}
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

            {/* 下部ボタンエリア */}
            <div className="w-full max-w-[800px] mx-auto py-8">
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={handleBack}
                  variant="outline"
                  className="border border-gray-400 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-50 min-w-[140px]"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}
                >
                  戻る
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 disabled:opacity-50 min-w-[140px]"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}
                >
                  {getSaveButtonText()}
                </Button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* 成功通知モーダル */}
      <AdminNotificationModal
        isOpen={showSuccessModal}
        onConfirm={handleBackToList}
        onSecondaryAction={handleViewArticle}
        title="記事の編集完了"
        description="記事の編集、保存をしました。"
        confirmText="記事一覧に戻る"
        secondaryText="記事を確認する"
      />
    </div>
  );
}