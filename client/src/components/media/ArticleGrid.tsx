'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pagination } from '@/components/ui/Pagination';

interface MediaArticle {
  id: string;
  date: string;
  categories: string[];
  title: string;
  description: string;
  imageUrl: string;
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
          title: filterValue || 'カテゴリー',
          alt: 'category'
        };
      case 'tag':
        return {
          icon: '/images/tag.svg',
          title: filterValue || 'タグ',
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
        <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">{sectionInfo.title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
        {currentArticles.map((article) => (
          <article
            key={article.id}
            onClick={() => handleArticleClick(article.id)}
            className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            {/* 画像エリア - パフォーマンス最適化 */}
            <div className="relative h-[240px] md:h-[200px] bg-gray-200 overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkRMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            </div>

            {/* コンテンツエリア */}
            <div className="p-[24px] pb-[40px]">
              <h3 className="text-[18px] font-extrabold text-[#323232] line-clamp-2 mb-[8px] Noto_Sans_JP tracking-tight">
                {article.title}
              </h3>
              <p className="text-[14px] text-[#666666] line-clamp-3 mb-[16px] Noto_Sans_JP">
                {article.description}
              </p>
              {article.categories && article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category, index) => (
                    <span
                      key={index}
                      className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

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