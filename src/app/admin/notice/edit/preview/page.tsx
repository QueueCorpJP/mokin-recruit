'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { SelectInput } from '@/components/ui/select-input';
import { FormFieldHeader } from '@/components/admin/ui/FormFieldHeader';
import { createClient } from '@/lib/supabase/client';

interface PreviewData {
  id?: string;
  title: string;
  categoryIds: string[];
  content: string;
  thumbnail: string | null;
  thumbnailName: string | null;
  status: 'DRAFT' | 'PUBLISHED';
}

interface NoticeCategory {
  id: string;
  name: string;
  description?: string;
}

export default function EditPreviewPage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [categories, setCategories] = useState<NoticeCategory[]>([]);
  const [categoryNames, setCategoryNames] = useState<{[key: string]: string}>({});
  const [currentStatus, setCurrentStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedNoticeId, setSavedNoticeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedData = sessionStorage.getItem('previewNotice');
      if (storedData) {
        const data = JSON.parse(storedData);
        
        // カテゴリデータを取得してカテゴリ名の解決用に使用
        try {
          const supabase = createClient();
          const { data: categoriesData } = await supabase
            .from('notice_categories')
            .select('*')
            .order('name');
          
          if (categoriesData) {
            setCategories(categoriesData as unknown as NoticeCategory[]);
          }
          
          // 個別にカテゴリ名を取得
          if (data.categoryIds && data.categoryIds.length > 0) {
            const names: {[key: string]: string} = {};
            for (const categoryId of data.categoryIds) {
              try {
                const { data: categoryData } = await supabase
                  .from('notice_categories')
                  .select('name')
                  .eq('id', categoryId)
                  .single();
                
                if (categoryData && (categoryData as any).name) {
                  names[categoryId] = (categoryData as any).name as string;
                }
              } catch (err) {
                console.error('Individual category fetch failed:', categoryId, err);
              }
            }
            setCategoryNames(names);
          }
          
          setPreviewData(data);
          setCurrentStatus(data.status || 'DRAFT');
        } catch (error) {
          console.error('カテゴリの取得に失敗:', error);
          setPreviewData(data);
        }
      } else {
        router.push('/admin/notice/edit');
      }
    };
    
    fetchData();
  }, [router]);

  const handleStatusChange = (value: string) => {
    const newStatus = value as 'DRAFT' | 'PUBLISHED';
    setCurrentStatus(newStatus);
    if (previewData) {
      const updatedData = { ...previewData, status: newStatus };
      setPreviewData(updatedData);
      sessionStorage.setItem('previewNotice', JSON.stringify(updatedData));
    }
  };

  const handleEdit = () => {
    // プレビューデータをそのまま残して編集画面に戻る
    router.push('/admin/notice/edit');
  };

  const handleSave = async () => {
    if (!previewData) return;
    
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (previewData.id) {
        formData.append('id', previewData.id);
      }
      formData.append('title', previewData.title);
      formData.append('categoryId', previewData.categoryIds && previewData.categoryIds.length > 0 ? previewData.categoryIds[0] : '');
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
      } else if (previewData.thumbnail && !previewData.thumbnailName) {
        formData.append('thumbnail_url', previewData.thumbnail);
      }

      // actions.tsのsaveNotice関数を使用して更新
      const { saveNotice } = await import('../actions');
      await saveNotice(formData);
      
      // 成功時の処理
      setSavedNoticeId(previewData.id || null);
      sessionStorage.removeItem('previewNotice');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('お知らせの保存に失敗:', error);
      setError(error instanceof Error ? error.message : 'お知らせの保存に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setShowSuccessModal(false);
    router.push('/admin/notice');
  };

  const handleViewNotice = () => {
    setShowSuccessModal(false);
    if (savedNoticeId) {
      router.push(`/admin/notice/${savedNoticeId}`);
    } else {
      router.push('/admin/notice');
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
  });

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {error && (
        <div className="max-w-[800px] mx-auto mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] flex items-start">
        <div className="flex-1">
          <div className="flex flex-col">
            {/* お知らせ本文 */}
            <article className="w-full max-w-[800px] mx-auto mt-[50px] px-0">
              
              {/* 日時 */}
              <div className="mb-[16px] px-0">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* お知らせタイトルセクション */}
              <div className="mb-[32px] px-0">
                <h1 className="text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]" style={{ fontWeight: 700, fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                  {previewData.title}
                </h1>
                <div className="flex items-center gap-[16px] flex-wrap">
                  {/* 選択されたカテゴリを表示 */}
                  {previewData.categoryIds && previewData.categoryIds.length > 0 && 
                    previewData.categoryIds.map(categoryId => {
                      const categoryName = categoryNames[categoryId] || 
                                         categories.find(cat => cat.id === categoryId)?.name;
                      
                      if (!categoryName) {
                        return null;
                      }
                      
                      return (
                        <span
                          key={categoryId}
                          className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                          style={{ 
                            fontWeight: 700,
                            fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                          }}
                        >
                          {categoryName}
                        </span>
                      );
                    }).filter(Boolean)
                  }
                </div>
              </div>

              {/* サムネイル画像 */}
              {previewData.thumbnail && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]" style={{ minWidth: '900px' }}>
                  <img
                    src={previewData.thumbnail}
                    alt="お知らせのサムネイル"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* お知らせ本文（リッチコンテンツ） */}
              <div 
                className="prose prose-lg max-w-none mb-[60px]"
                style={{ paddingLeft: '0', paddingRight: '0' }}
                dangerouslySetInnerHTML={{ __html: previewData.content }}
              />

              {/* お知らせ下のボタン */}
              <div className="flex justify-center gap-4 mt-8 mb-8">
                <AdminButton
                  onClick={handleEdit}
                  text="編集に戻る"
                  variant="green-outline"
                  disabled={isLoading}
                />
                <AdminButton
                  onClick={handleSave}
                  text={previewData.id ? "お知らせを更新する" : "お知らせを保存する"}
                  variant="green-gradient"
                  disabled={isLoading}
                />
              </div>

            </article>
          </div>
        </div>
        
        {/* サイドバー */}
        <div className="w-[300px] ml-8 mt-[50px]">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">公開設定</h3>
            
            <div className="space-y-4">
              <FormFieldHeader>
                ステータス
              </FormFieldHeader>
              <SelectInput
                value={currentStatus}
                onChange={handleStatusChange}
                options={[
                  { value: 'DRAFT', label: '下書き' },
                  { value: 'PUBLISHED', label: '公開' }
                ]}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 成功通知モーダル */}
      <AdminNotificationModal
        isOpen={showSuccessModal}
        onConfirm={handleBackToList}
        onSecondaryAction={handleViewNotice}
        title="お知らせ保存完了"
        description="お知らせの保存・更新をしました。"
        confirmText="お知らせ一覧に戻る"
        secondaryText="お知らせを確認する"
      />
    </div>
  );
}