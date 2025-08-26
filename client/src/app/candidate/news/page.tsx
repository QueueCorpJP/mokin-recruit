'use client';
import React, { useState, useEffect } from 'react';
import { NewsTabsAndList } from '@/components/news/NewsTabsAndList';
import { NewsHeader } from '@/components/news/NewsHeader';
import { getNews, getNewsWithPagination, getNewsCategories, getSidebarData, type Article, type PopularArticle, type ArticleCategory } from './actions';

interface NewsArticle {
  id: string;
  date: string;
  categories: string[];
  title: string;
  description: string;
  imageUrl: string | null;
  tags?: string[];
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ページネーション用のニュース取得
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginationResult = await getNewsWithPagination(ITEMS_PER_PAGE, offset);
        
        // カテゴリー取得
        const categoriesResult = await getNewsCategories();
        
        setArticles(paginationResult.articles.map(article => ({
          id: article.id,
          date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }),
          categories: article.categories || ['ニュース'],
          title: article.title,
          description: article.excerpt || 'No description available',
          imageUrl: article.thumbnail_url || null,
          tags: article.tags && article.tags.length > 0 ? article.tags : undefined
        })));
        
        setCategories(categoriesResult.map(cat => cat.name));
        setTotalPages(Math.ceil(paginationResult.total / ITEMS_PER_PAGE));
        
      } catch (error) {
        console.error('ニュースデータの取得に失敗:', error);
        setArticles([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // スムーズスクロールでページトップに移動
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative">
        <NewsHeader title="お知らせ" showLargeCircle={true} />
        <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%] pt-[75px]">
          <div className="px-[16px] md:px-[80px] py-[40px] md:py-[75px]">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-[120px] h-[80px] bg-gray-200 rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative">
      {/* ヘッダー */}
      <NewsHeader 
        title="お知らせ" 
        showLargeCircle={true}
      />

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%]">
        <div className="px-[16px] md:px-[80px] py-[40px] md:py-[75px]">
          <NewsTabsAndList 
            articles={articles}
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  );
}