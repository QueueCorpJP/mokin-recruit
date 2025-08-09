import React, { useState } from 'react';
import { Pagination } from '@/components/ui/Pagination';

interface MediaArticle {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ArticleGridProps {
  articles: MediaArticle[];
}

const ITEMS_PER_PAGE = 9;

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = articles.slice(startIndex, endIndex);

  return (
    <div className="flex-1">
      <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[24px]">
      <img src="/images/new.svg" alt="new" />
      <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">新着記事</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
        {currentArticles.map((article) => (
          <article
            key={article.id}
            className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            {/* 画像エリア */}
            <div className="relative h-[240px] md:h-[200px] bg-gray-200 overflow-hidden">
              <div className="absolute top-3 left-3 z-10">
                <img src={article.imageUrl} alt={article.title} />
              </div>
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-500" />
            </div>

            {/* コンテンツエリア */}
            <div className="p-[24px] pb-[40px]">
              <p className="text-[18px] font-bold text-[#323232] line-clamp-2 mb-[16px] Noto_Sans_JP">
                {article.description}
              </p>
              <span className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full">
                  {article.category}
                </span>
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