'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MediaHeader } from '@/components/media/MediaHeader';
import { PopularArticlesSidebar } from '@/components/media/PopularArticlesSidebar';
import { ArticleViewTracker } from '@/components/media/ArticleViewTracker';
import { articleService, type Article } from '@/lib/services/articleService';
import { mediaService, type PopularArticle, type ArticleCategory, type ArticleTag } from '@/lib/services/mediaService.client';
import '@/styles/media-content.css';

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarData, setSidebarData] = useState<{
    popularArticles: PopularArticle[];
    categories: ArticleCategory[];
    tags: ArticleTag[];
  }>({
    popularArticles: [],
    categories: [],
    tags: []
  });
  const [recommendedArticles, setRecommendedArticles] = useState<any[]>([]);
  const [newArticles, setNewArticles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mediaId = params.media_id as string;
        
        if (!mediaId) {
          setError('記事IDが指定されていません');
          return;
        }

        // 記事とサイドバーデータを並列取得
    const [fetchedArticle, popularArticles, categories, tags, allArticles] = await Promise.all([
          articleService.getArticle(mediaId),
          mediaService.getPopularArticles(5),
          mediaService.getCategories(),
          mediaService.getTags(),
          mediaService.getArticles(20) // より多くの記事を取得して適切なフィルタリングを行う
        ]);
        
        // 現在の記事以外をフィルタリング
        const otherArticles = allArticles.filter(article => article.id !== mediaId);
        
        // おすすめ記事: 同じカテゴリーの記事を優先し、そのうち登録数（人気度）が多い順に3件
        const currentCategories = (fetchedArticle as any)?.article_category_relations?.map(
          (rel: any) => rel.article_categories?.name
        ).filter(Boolean) || [];
        
        let recommended: any[] = [];
        if (currentCategories.length > 0) {
          // 同じカテゴリーの記事をフィルタリング
          const sameCategoryArticles = otherArticles.filter(article => {
            const articleCategories = article.categories || [];
            return articleCategories.some(cat => currentCategories.includes(cat));
          });
          
          // 人気度（view_count）でソート、同じ場合は作成日で決定
          sameCategoryArticles.sort((a, b) => {
            const viewCountA = (a as any).views_count || 0;
            const viewCountB = (b as any).views_count || 0;
            
            if (viewCountB !== viewCountA) {
              return viewCountB - viewCountA; // view_count の降順
            }
            
            // view_count が同じ場合は作成日の新しい順
            const dateA = new Date(a.published_at || a.created_at).getTime();
            const dateB = new Date(b.published_at || b.created_at).getTime();
            return dateB - dateA;
          });
          
          recommended = sameCategoryArticles.slice(0, 3);
          
          // 同じカテゴリーの記事が3件未満の場合は、他の記事で補完
          if (recommended.length < 3) {
            const remainingArticles = otherArticles.filter(article => 
              !recommended.find(rec => rec.id === article.id)
            );
            recommended = [...recommended, ...remainingArticles.slice(0, 3 - recommended.length)];
          }
        } else {
          // カテゴリーがない場合は最新記事から3件
          recommended = otherArticles.slice(0, 3);
        }
        
        // 新着記事: 公開日が最新の順に3件
        const latest = otherArticles
          .sort((a, b) => {
            const dateA = new Date(a.published_at || a.created_at).getTime();
            const dateB = new Date(b.published_at || b.created_at).getTime();
            return dateB - dateA;
          })
          .slice(0, 3);
        
        if (!fetchedArticle) {
          setError('記事が見つかりませんでした');
          return;
        }

        if (fetchedArticle.status !== 'PUBLISHED') {
          setError('この記事は公開されていません');
          return;
        }

        setArticle(fetchedArticle);
        setSidebarData({ popularArticles, categories, tags });
        setRecommendedArticles(recommended.map(article => ({
          id: article.id,
          date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          categories: article.categories || ['メディア'],
          tags: article.tags || [],
          title: article.title,
          description: article.excerpt || (typeof article.content === 'string' 
            ? article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
            : 'No description available'),
          imageUrl: article.thumbnail_url || '/images/media01.jpg'
        })));
        setNewArticles(latest.map(article => ({
          id: article.id,
          date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          categories: article.categories || ['メディア'],
          tags: article.tags || [],
          title: article.title,
          description: article.excerpt || (typeof article.content === 'string' 
            ? article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
            : 'No description available'),
          imageUrl: article.thumbnail_url || '/images/media01.jpg'
        })));
        setError(null);
      } catch (err) {
        console.error('データの取得に失敗:', err);
        setError('記事の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.media_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] flex items-center justify-center">
        <div className="text-white text-lg">記事を読み込み中...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-lg mb-6">{error || '記事が見つかりません'}</p>
          <button
            onClick={() => router.push('/candidate/media')}
            className="bg-white text-green-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            メディア一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const date = new Date(article.published_at || article.created_at!);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const formattedDate = `${year}/${month}/${day}`;

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative">
      {/* 訪問数トラッキング */}
      {article.id && <ArticleViewTracker articleId={article.id} />}
      
      {/* ヘッダー */}
      <MediaHeader title="メディア" />

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%]">
        <div className="w-full md:py-[75px] py-[40px]">
          
          <div className="flex flex-col lg:flex-row lg:justify-between px-[16px] md:px-[80px]">
            {/* 記事本文 - 右側のサイドバーとの間に80pxの余白を確保 */}
            <article className="flex-1 lg:pr-[80px]">
              
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
                  {(article as any).article_category_relations?.map((relation: any, index: number) => (
                    <span
                      key={index}
             className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                      style={{ 
                        fontWeight: 700,
                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      {relation.article_categories?.name || 'メディア'}
                    </span>
                  )) || (
                    <span className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                      style={{ 
                        fontWeight: 700,
                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}>
                      メディア
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

            {/* サイドバー（デスクトップ表示用） - 固定幅280px */}
            <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
              <PopularArticlesSidebar 
                articles={sidebarData.popularArticles} 
                categories={sidebarData.categories}
                tags={sidebarData.tags}
              />
            </aside>
          </div>

          {/* おすすめ記事 */}
          <section className="mt-[80px]">
            <div className="px-[16px] md:px-[80px]">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div className="flex-1 lg:pr-[360px]">
                  <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]">
                    <img src="/images/new.svg" alt="new" />
                    <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">おすすめ記事</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                  {recommendedArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => router.push(`/candidate/media/${article.id}`)}
                      className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-none transition-all duration-300 cursor-pointer group"
                    >
                      <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
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
                          {article.title}
                        </h3>
                        <div className="space-y-2">
                          {article.categories && article.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '32px' }}>
                              {article.categories.map((category: string, index: number) => (
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
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '72px' }}>
                              {article.tags.map((tag: string, index: number) => (
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

          {/* 新着記事 */}
          <section className="mt-[80px]">
            <div className="px-[16px] md:px-[80px]">
              <div className="flex flex-col lg:flex-row lg:justify-between">
                <div className="flex-1 lg:pr-[360px]">
                  <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]">
                    <img src="/images/new.svg" alt="new" />
                    <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">新着記事</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                  {newArticles.map((article) => (
                    <article
                      key={article.id}
                      onClick={() => router.push(`/candidate/media/${article.id}`)}
                      className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-none transition-all duration-300 cursor-pointer group"
                    >
                      <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
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
                          {article.title}
                        </h3>
                        <div className="space-y-2">
                          {article.categories && article.categories.length > 0 && (
                            <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '32px' }}>
                              {article.categories.map((category: string, index: number) => (
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
                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 overflow-hidden" style={{ maxHeight: '72px' }}>
                              {article.tags.map((tag: string, index: number) => (
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

          {/* サイドバー（モバイル表示用） */}
          <div className="lg:hidden mt-[80px] px-[16px] md:px-[80px]">
            <PopularArticlesSidebar 
              articles={sidebarData.popularArticles} 
              categories={sidebarData.categories}
              tags={sidebarData.tags}
            />
          </div>

        </div>
      </main>
    </div>
  );
}