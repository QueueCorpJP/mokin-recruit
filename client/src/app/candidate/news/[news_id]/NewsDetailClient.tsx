'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NewsHeader } from '@/components/news/NewsHeader';
import { newsService, type Article } from '@/lib/services/newsService.client';

interface NewsDetailClientProps {
  article: Article;
}

export default function NewsDetailClient({
  article
}: NewsDetailClientProps) {
  const router = useRouter();
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [newArticles, setNewArticles] = useState<Article[]>([]);

  const date = new Date(article.published_at || article.created_at!);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const formattedDate = `${year}/${month}/${day}`;

  useEffect(() => {
    const fetchRelatedData = async () => {
      try {
        // 関連ニュースを取得
        const related = await newsService.getRelatedNews(article.id, 6);
        setRelatedArticles(related);

        // 新着ニュースを取得（最新6件）
        const latest = await newsService.getNews(6);
        setNewArticles(latest.filter(item => item.id !== article.id));
      } catch (error) {
        console.error('関連データ取得エラー:', error);
      }
    };

    fetchRelatedData();
  }, [article.id, article.categories]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative">
      {/* ヘッダー */}
      <NewsHeader title="お知らせ" showLargeCircle={true} />

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%]">
        <div className="w-full md:py-[75px] py-[40px]">
          
          <div className="px-[16px] md:px-[80px]">
            {/* 記事本文 */}
            <article className="max-w-4xl mx-auto">
              
              {/* 日時 */}
              <div className="mb-[16px]">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* 記事タイトルセクション */}
              <div className="mb-[32px]">
                <h1 className="text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]" style={{ fontWeight: 700, fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                  {article.title}
                </h1>
                <div className="flex items-center gap-[16px]">
                  {article.categories && article.categories.length > 0 ? (
                    article.categories.slice(0, 3).map((category, index) => (
                      <span
                        key={index}
                        className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                        style={{ 
                          fontWeight: 700,
                          fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                      style={{ 
                        fontWeight: 700,
                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}>
                      お知らせ
                    </span>
                  )}
                </div>
              </div>

              {/* メイン画像 */}
              {article.thumbnail_url && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]">
                  <img 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    className="w-full h-full object-cover"
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

              {/* CTAバナー */}
              <div className="mb-[60px]">
                {/* デスクトップ用バナー */}
                <img 
                  src="/images/baner.svg" 
                  alt="プロフィール登録バナー"
                  className="w-full hidden md:block cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => router.push('/candidate')}
                />
                {/* モバイル用バナー */}
                <img 
                  src="/images/baner2.svg" 
                  alt="プロフィール登録バナー"
                  className="w-full md:hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => router.push('/candidate')}
                />
              </div>

            </article>
          </div>

          {/* 関連ニュース */}
          {relatedArticles.length > 0 && (
            <section className="mt-[80px]">
              <div className="px-[16px] md:px-[80px]">
                <div className="flex flex-col lg:flex-row lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]">
                      <img src="/images/new.svg" alt="new" />
                      <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">関連ニュース</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                      {relatedArticles.map((relatedArticle) => (
                        <article
                          key={relatedArticle.id}
                          onClick={() => router.push(`/candidate/news/${relatedArticle.id}`)}
                          className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer group"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E9E9E9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF';
                          }}
                        >
                          <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                            {relatedArticle.thumbnail_url ? (
                              <img 
                                src={relatedArticle.thumbnail_url} 
                                alt={relatedArticle.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-[12px]">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-[24px]">
                            <h3 className="text-[16px] font-extrabold text-[#323232] mb-[16px] Noto_Sans_JP tracking-tight overflow-hidden"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  textOverflow: 'ellipsis',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                }}>
                              {relatedArticle.title}
                            </h3>
                            <div className="space-y-2">
                              {relatedArticle.categories && relatedArticle.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '32px' }}>
                                  {relatedArticle.categories.slice(0, 2).map((category: string, index: number) => (
                                    <span
                                      key={index}
                                      className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                                      style={{ 
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                      }}
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {relatedArticle.tags && relatedArticle.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '72px' }}>
                                  {relatedArticle.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="text-[#0F9058] text-[16px]"
                                      style={{ 
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                      }}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 新着ニュース */}
          {newArticles.length > 0 && (
            <section className="mt-[80px]">
              <div className="px-[16px] md:px-[80px]">
                <div className="flex flex-col lg:flex-row lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]">
                      <img src="/images/new.svg" alt="new" />
                      <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">新着ニュース</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                      {newArticles.slice(0, 6).map((newArticle) => (
                        <article
                          key={newArticle.id}
                          onClick={() => router.push(`/candidate/news/${newArticle.id}`)}
                          className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] transition-all duration-200 cursor-pointer group"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E9E9E9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FFF';
                          }}
                        >
                          <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                            {newArticle.thumbnail_url ? (
                              <img 
                                src={newArticle.thumbnail_url} 
                                alt={newArticle.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-500 text-[12px]">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-[24px]">
                            <h3 className="text-[16px] font-extrabold text-[#323232] mb-[16px] Noto_Sans_JP tracking-tight overflow-hidden"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  textOverflow: 'ellipsis',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                }}>
                              {newArticle.title}
                            </h3>
                            <div className="space-y-2">
                              {newArticle.categories && newArticle.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '32px' }}>
                                  {newArticle.categories.slice(0, 2).map((category: string, index: number) => (
                                    <span
                                      key={index}
                                      className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                                      style={{ 
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                      }}
                                    >
                                      {category}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {newArticle.tags && newArticle.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '72px' }}>
                                  {newArticle.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className="text-[#0F9058] text-[16px]"
                                      style={{ 
                                        fontWeight: 700,
                                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                      }}
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}