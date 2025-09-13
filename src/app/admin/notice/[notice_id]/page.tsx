'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getNotice, type Notice } from '@/app/admin/notice/[notice_id]/actions';


export default function AdminNoticeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const noticeId = params.notice_id as string;
        
        if (!noticeId) {
          setError('お知らせIDが指定されていません');
          return;
        }

        const fetchedNotice = await getNotice(noticeId);
        
        if (!fetchedNotice) {
          setError('お知らせが見つかりませんでした');
          return;
        }

        setNotice(fetchedNotice);
        setError(null);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.error('お知らせの取得に失敗:', err);
        setError('お知らせの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [params.notice_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">お知らせを読み込み中...</div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-lg mb-6">{error || 'お知らせが見つかりません'}</p>
          <button
            onClick={() => router.push('/admin/notice')}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            お知らせ一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(notice.published_at || notice.created_at!).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9]">
        <div className="">
          
          <div className="flex flex-col">
            {/* お知らせ本文 */}
            <article className="w-full max-w-[800px] mx-auto">
              
              {/* 日時 */}
              <div className="mb-[16px]">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* お知らせタイトルセクション */}
              <div className="mb-[32px]">
                <h1 className="text-[32px] font-bold text-[#323232] mb-[16px] Noto_Sans_JP leading-[1.5]">
                  {notice.title}
                </h1>
                <div className="flex items-center gap-[16px]">
                  {/* カテゴリを表示 */}
                  {notice.categories && notice.categories.length > 0 && 
                    notice.categories.map((categoryName, index) => (
                      <span 
                        key={index}
                        className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full"
                      >
                        {categoryName}
                      </span>
                    ))
                  }
                  <span className={`text-[14px] font-medium px-[16px] py-[4px] rounded-full ${
                    notice.status === 'PUBLISHED' 
                      ? 'bg-green-600 text-white' 
                      : notice.status === 'DRAFT' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {notice.status === 'PUBLISHED' ? '公開中' : notice.status === 'DRAFT' ? '下書き' : 'アーカイブ'}
                  </span>
                </div>
              </div>

              {/* メイン画像 */}
              {notice.thumbnail_url && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 overflow-hidden mb-[40px]">
                  <Image 
                    src={notice.thumbnail_url} 
                    alt={notice.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* お知らせ本文（リッチコンテンツ） */}
              <div 
                className="prose prose-lg max-w-none mb-[60px]"
                dangerouslySetInnerHTML={{ 
                  __html: typeof notice.content === 'string' 
                    ? notice.content 
                    : JSON.stringify(notice.content) 
                }}
              />

            </article>
          </div>

        </div>
      </main>
    </div>
  );
}