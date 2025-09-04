'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MediaHeader } from '@/components/media/MediaHeader';
import { PopularArticlesSidebar } from '@/components/media/PopularArticlesSidebar';
import { ArticleViewTracker } from '@/components/media/ArticleViewTracker';
import type {
  Article,
  PopularArticle,
  ArticleCategory,
  ArticleTag,
} from '@/app/candidate/media/actions';

interface MediaDetailClientProps {
  article: Article;
  sidebarData: {
    popularArticles: PopularArticle[];
    categories: ArticleCategory[];
    tags: ArticleTag[];
  };
  recommendedArticles: any[];
  newArticles: any[];
}

export default function MediaDetailClient({
  article,
  sidebarData,
  recommendedArticles,
  newArticles,
}: MediaDetailClientProps) {
  const router = useRouter();

  const date = new Date(article.published_at || article.created_at!);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const formattedDate = `${year}/${month}/${day}`;

  return (
    <div className='min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative'>
      {/* 訪問数トラッキング */}
      {article.id && <ArticleViewTracker articleId={article.id} />}

      {/* ヘッダー */}
      <MediaHeader title='メディア' />

      {/* メインコンテンツ */}
      <main className='px-[16px] md:px-[80px] py-[40px] md:py-[75px] w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%]'>
        <div className='max-w-[1280px] mx-auto w-full'>
          <div className='flex flex-col lg:flex-row lg:justify-between px-[16px] md:px-[80px]'>
            {/* 記事本文 - 右側のサイドバーとの間に80pxの余白を確保 */}
            <article className='flex-1 lg:pr-[80px]'>
              {/* 日時 */}
              <div className='mb-[16px]'>
                <span className='text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP'>
                  {formattedDate}
                </span>
              </div>

              {/* 記事タイトルセクション */}
              <div className='mb-[32px]'>
                <h1
                  className='text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]'
                  style={{
                    fontWeight: 700,
                    fontFamily:
                      'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  }}
                >
                  {article.title}
                </h1>
                <div className='flex items-center gap-[16px]'>
                  {(article as any).article_category_relations?.map(
                    (relation: any, index: number) => (
                      <span
                        key={index}
                        className='bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]'
                        style={{
                          fontWeight: 700,
                          fontFamily:
                            'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                        }}
                      >
                        {relation.article_categories?.name || 'メディア'}
                      </span>
                    )
                  ) || (
                    <span
                      className='bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]'
                      style={{
                        fontWeight: 700,
                        fontFamily:
                          'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      }}
                    >
                      メディア
                    </span>
                  )}
                </div>
              </div>

              {/* メイン画像 */}
              {article.thumbnail_url && (
                <div className='relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]'>
                  <Image
                    src={article.thumbnail_url}
                    alt={article.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              {/* 記事本文（リッチコンテンツ） */}
              <div
                className='prose prose-lg max-w-none mb-[60px]'
                dangerouslySetInnerHTML={{
                  __html:
                    typeof article.content === 'string'
                      ? article.content
                      : JSON.stringify(article.content),
                }}
              />

              {/* CTAバナー */}
              <div className='mb-[60px]'>
                {/* デスクトップ用バナー */}
                <Image
                  src='/images/baner.svg'
                  alt='プロフィール登録バナー'
                  width={800}
                  height={200}
                  className='w-full hidden md:block cursor-pointer hover:opacity-90 transition-opacity'
                  onClick={() => router.push('/candidate')}
                />
                {/* モバイル用バナー */}
                <Image
                  src='/images/baner2.svg'
                  alt='プロフィール登録バナー'
                  width={400}
                  height={150}
                  className='w-full md:hidden cursor-pointer hover:opacity-90 transition-opacity'
                  onClick={() => router.push('/candidate')}
                />
              </div>
            </article>

            {/* サイドバー（デスクトップ表示用） - 固定幅280px */}
            <aside className='hidden lg:block lg:w-[280px] flex-shrink-0'>
              <PopularArticlesSidebar
                articles={sidebarData.popularArticles}
                categories={sidebarData.categories}
                tags={sidebarData.tags}
              />
            </aside>
          </div>

          {/* おすすめ記事 */}
          <section className='mt-[80px]'>
            <div className='px-[16px] md:px-[80px]'>
              <div className='flex flex-col lg:flex-row lg:justify-between'>
                <div className='flex-1 lg:pr-[360px]'>
                  <div className='flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]'>
                    <Image
                      src='/images/new.svg'
                      alt='new'
                      width={24}
                      height={24}
                      loading='lazy'
                    />
                    <h2 className='text-[20px] font-bold text-[#323232] Noto_Sans_JP'>
                      おすすめ記事
                    </h2>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]'>
                    {recommendedArticles.map(article => (
                      <article
                        key={article.id}
                        onClick={() =>
                          router.push(`/candidate/media/${article.id}`)
                        }
                        className='bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-none transition-all duration-300 cursor-pointer group'
                      >
                        <div className='relative h-[200px] bg-gray-200 overflow-hidden'>
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className='object-cover group-hover:scale-110 transition-transform duration-500'
                          />
                        </div>
                        <div className='p-[24px]'>
                          <h3
                            className='text-[16px] font-extrabold text-[#323232] mb-[16px] Noto_Sans_JP tracking-tight overflow-hidden'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              textOverflow: 'ellipsis',
                              fontWeight: 700,
                              fontFamily:
                                'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                          >
                            {article.title}
                          </h3>
                          <div className='space-y-2'>
                            {article.categories &&
                              article.categories.length > 0 && (
                                <div
                                  className='flex flex-wrap gap-2 overflow-hidden'
                                  style={{ maxHeight: '32px' }}
                                >
                                  {article.categories.map(
                                    (category: string, index: number) => (
                                      <span
                                        key={index}
                                        className='bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]'
                                        style={{
                                          fontWeight: 700,
                                          fontFamily:
                                            'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }}
                                      >
                                        {category}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            {article.tags && article.tags.length > 0 && (
                              <div
                                className='flex flex-wrap gap-2 overflow-hidden'
                                style={{ maxHeight: '72px' }}
                              >
                                {article.tags.map(
                                  (tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className='text-[#0F9058] text-[16px]'
                                      style={{
                                        fontWeight: 700,
                                        fontFamily:
                                          'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                      }}
                                    >
                                      #{tag}
                                    </span>
                                  )
                                )}
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
          <section className='mt-[80px]'>
            <div className='px-[16px] md:px-[80px]'>
              <div className='flex flex-col lg:flex-row lg:justify-between'>
                <div className='flex-1 lg:pr-[360px]'>
                  <div className='flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]'>
                    <Image
                      src='/images/new.svg'
                      alt='new'
                      width={24}
                      height={24}
                      loading='lazy'
                    />
                    <h2 className='text-[20px] font-bold text-[#323232] Noto_Sans_JP'>
                      新着記事
                    </h2>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]'>
                    {newArticles.map(article => (
                      <article
                        key={article.id}
                        onClick={() =>
                          router.push(`/candidate/media/${article.id}`)
                        }
                        className='bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-none transition-all duration-300 cursor-pointer group'
                      >
                        <div className='relative h-[200px] bg-gray-200 overflow-hidden'>
                          <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className='object-cover group-hover:scale-110 transition-transform duration-500'
                          />
                        </div>
                        <div className='p-[24px]'>
                          <h3
                            className='text-[16px] font-extrabold text-[#323232] mb-[16px] Noto_Sans_JP tracking-tight overflow-hidden'
                            style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              textOverflow: 'ellipsis',
                              fontWeight: 700,
                              fontFamily:
                                'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                            }}
                          >
                            {article.title}
                          </h3>
                          <div className='space-y-2'>
                            {article.categories &&
                              article.categories.length > 0 && (
                                <div
                                  className='flex flex-wrap gap-2 overflow-hidden'
                                  style={{ maxHeight: '32px' }}
                                >
                                  {article.categories.map(
                                    (category: string, index: number) => (
                                      <span
                                        key={index}
                                        className='bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]'
                                        style={{
                                          fontWeight: 700,
                                          fontFamily:
                                            'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                        }}
                                      >
                                        {category}
                                      </span>
                                    )
                                  )}
                                </div>
                              )}
                            {article.tags && article.tags.length > 0 && (
                              <div
                                className='flex flex-wrap gap-2 overflow-hidden'
                                style={{ maxHeight: '72px' }}
                              >
                                {article.tags.map(
                                  (tag: string, index: number) => (
                                    <span
                                      key={index}
                                      className='text-[#0F9058] text-[16px]'
                                      style={{
                                        fontWeight: 700,
                                        fontFamily:
                                          'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                      }}
                                    >
                                      #{tag}
                                    </span>
                                  )
                                )}
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
          <div className='lg:hidden mt-[80px] px-[16px] md:px-[80px]'>
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
