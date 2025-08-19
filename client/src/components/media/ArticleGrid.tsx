'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';

interface MediaArticle {
  id: string;
  date: string;
  categories: string[];
  title: string;
  description: string;
  imageUrl: string | null;
  tags?: string[];
}

interface ArticleGridProps {
  articles: MediaArticle[];
  filterType?: 'all' | 'category' | 'tag';
  filterValue?: string;
}

const ITEMS_PER_PAGE = 9;

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, filterType = 'all', filterValue }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = useMemo(() => Math.ceil(articles.length / ITEMS_PER_PAGE), [articles.length]);
  
  const currentArticles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return articles.slice(startIndex, endIndex);
  }, [articles, currentPage]);
  
  const handleArticleClick = useCallback((articleId: string) => {
    router.prefetch(`/candidate/media/${articleId}`);
    router.push(`/candidate/media/${articleId}`);
  }, [router]);

  const getSectionInfo = () => {
    switch (filterType) {
      case 'category':
        return {
          icon: '/images/cotegory.svg',
          title: `「${filterValue || 'カテゴリー'}」の記事の一覧`,
          alt: 'category'
        };
      case 'tag':
        return {
          icon: '/images/tag.svg',
          title: `「${filterValue || 'タグ'}」の記事の一覧`,
          alt: 'tag'
        };
      default:
        return {
          icon: '/images/new.svg',
          title: '新着記事',
          alt: 'new'
        };
    }
  };

  const sectionInfo = getSectionInfo();

  return (
    <div className="flex-1">
      <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[24px]">
        <img src={sectionInfo.icon} alt={sectionInfo.alt} />
        <h2 className="text-[20px] text-[#323232] Noto_Sans_JP" style={{ 
          fontWeight: 700,
          fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>{sectionInfo.title}</h2>
      </div>
      {articles.length === 0 ? (
        <div className="flex items-center justify-center py-[120px]">
          <p className="text-[18px] text-[#666666] Noto_Sans_JP">まだ記事はありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
          {currentArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-none transition-all duration-300 cursor-pointer group"
            >
              {/* 画像エリア - パフォーマンス最適化 */}
              <div className="relative h-[240px] md:h-[200px] bg-gray-200 overflow-hidden">
                {article.imageUrl ? (
                  // Next.js Imageコンポーネントは設定済み - 必要に応じて以下のように変更可能:
                  // <Image src={article.imageUrl} alt={article.title} fill sizes="..." className="..." />
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              {/* コンテンツエリア */}
              <div className="p-[24px] pb-[40px]">
                <h3 className="text-[18px] font-extrabold text-[#323232] mb-[16px] Noto_Sans_JP tracking-tight overflow-hidden" 
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
                      {article.categories.map((category, index) => (
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
                      {article.tags.map((tag, index) => (
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
      )}

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-10"
      />
    </div>
  );
};