'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getArticle, type Article } from '@/app/admin/media/actions';
import Image from 'next/image';


export default function AdminMediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const mediaId = params.media_id as string;
        
        if (!mediaId) {
          setError('記事IDが指定されていません');
          return;
        }

        const fetchedArticle = await getArticle(mediaId);
        
        if (!fetchedArticle) {
          setError('記事が見つかりませんでした');
          return;
        }

        setArticle(fetchedArticle);
        setError(null);
      } catch (err) {
        console.error('記事の取得に失敗:', err);
        setError('記事の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.media_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">記事を読み込み中...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-lg mb-6">{error || '記事が見つかりません'}</p>
          <button
            onClick={() => router.push('/admin/media')}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            記事一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.published_at || article.created_at!).toLocaleDateString('ja-JP', {
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
                <h1 className="text-[32px] font-bold text-[#323232] mb-[16px] Noto_Sans_JP leading-[1.5]">
                  {article.title}
                </h1>
                <div className="flex items-center gap-[16px]">
                  <span className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full">
                    メディア
                  </span>
                  <span className={`text-[14px] font-medium px-[16px] py-[4px] rounded-full ${
                    article.status === 'PUBLISHED' 
                      ? 'bg-green-600 text-white' 
                      : article.status === 'DRAFT' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {article.status === 'PUBLISHED' ? '公開中' : article.status === 'DRAFT' ? '下書き' : 'アーカイブ'}
                  </span>
                </div>
              </div>

              {/* メイン画像 */}
              {article.thumbnail_url && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 overflow-hidden mb-[40px]">
                  <Image 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* 記事本文（リッチコンテンツ） */}
              <div 
                className="prose prose-lg max-w-none mb-[60px]"
                dangerouslySetInnerHTML={{ 
                  __html: typeof article.content === 'string' 
                    ? article.content 
                    : JSON.stringify(article.content) 
                }}
              />

            </article>
          </div>

        </div>
      </main>
    </div>
  );
}