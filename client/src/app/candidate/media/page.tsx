'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { ArticleGrid } from '@/components/media/ArticleGrid';
import { PopularArticlesSidebar } from '@/components/media/PopularArticlesSidebar';
import { MediaHeader } from '@/components/media/MediaHeader';
import { mediaService, type Article, type PopularArticle, type ArticleCategory, type ArticleTag } from '@/lib/services/mediaService.client';

interface MediaArticle {
  id: string;
  date: string;
  categories: string[];
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
}



// 記事データ取得関数
const getArticles = async (): Promise<MediaArticle[]> => {
  try {
    const articles = await mediaService.getArticles(20);
    
    if (!articles || articles.length === 0) {
      return [];
    }

    return articles.map(article => ({
      id: article.id,
      date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      categories: article.categories || ['メディア'],
      title: article.title,
      description: article.excerpt || 'No description available',
      imageUrl: article.thumbnail_url || '/images/media01.jpg',
      tags: article.tags || []
    }));
  } catch (err) {
    console.error('記事の取得に失敗:', err);
    return [];
  }
};

interface FilterState {
  type: 'all' | 'category' | 'tag';
  value: string;
  displayName: string;
}

export default function MediaPage() {
  const [articles, setArticles] = useState<MediaArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<MediaArticle[]>([]);
  const [sidebarData, setSidebarData] = useState<{
    popularArticles: PopularArticle[];
    categories: ArticleCategory[];
    tags: ArticleTag[];
  }>({
    popularArticles: [],
    categories: [],
    tags: []
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterState>({
    type: 'all',
    value: '',
    displayName: 'メディア'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, popularArticles, categories, tags] = await Promise.all([
          getArticles(),
          mediaService.getPopularArticles(5),
          mediaService.getCategories(),
          mediaService.getTags()
        ]);
        console.log('取得したカテゴリー:', categories);
        console.log('取得したタグ:', tags);
        console.log('取得した記事:', articlesData);
        setArticles(articlesData);
        setFilteredArticles(articlesData);
        setSidebarData({ popularArticles, categories, tags });
      } catch (error) {
        console.error('データの取得に失敗:', error);
        // モックデータは使わない - 空配列をセット
        setArticles([]);
        setFilteredArticles([]);
        setSidebarData({ popularArticles: [], categories: [], tags: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filter.type === 'all') {
      setFilteredArticles(articles);
    } else if (filter.type === 'category') {
      setFilteredArticles(articles.filter(article => article.categories && article.categories.includes(filter.value)));
    } else if (filter.type === 'tag') {
      setFilteredArticles(articles.filter(article => 
        article.tags && article.tags.includes(filter.value)
      ));
    }
  }, [filter, articles]);

  const handleCategoryClick = (categoryName: string) => {
    setFilter({
      type: 'category',
      value: categoryName,
      displayName: categoryName
    });
  };

  const handleTagClick = (tagName: string) => {
    setFilter({
      type: 'tag',
      value: tagName,
      displayName: tagName
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative">
        <MediaHeader title="メディア" showLargeCircle={true} />
        <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%] pt-[75px]">
          <div className="px-[16px] md:px-[80px] py-[40px] md:py-[75px]">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[10px] overflow-hidden">
                    <div className="h-[200px] bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
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
      <MediaHeader 
        title="メディア" 
        showLargeCircle={true}
      />

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%] pt-[75px]">
        <div className="px-[16px] md:px-[80px] py-[40px] md:py-[75px]">
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* 記事グリッド - 右側のサイドバーとの間に80pxの余白を確保 */}
            <div className="flex-1 lg:pr-[80px]">
              <ArticleGrid 
                articles={filteredArticles} 
                filterType={filter.type}
                filterValue={filter.value}
              />
            </div>

            {/* サイドバー - 固定幅280px */}
            <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
              <PopularArticlesSidebar 
                articles={sidebarData.popularArticles} 
                categories={sidebarData.categories}
                tags={sidebarData.tags}
                onCategoryClick={handleCategoryClick}
                onTagClick={handleTagClick}
              />
            </aside>
          </div>
          
          {/* モバイル表示用サイドバー */}
          <div className="lg:hidden mt-[40px]">
            <PopularArticlesSidebar 
              articles={sidebarData.popularArticles} 
              categories={sidebarData.categories}
              tags={sidebarData.tags}
              onCategoryClick={handleCategoryClick}
              onTagClick={handleTagClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}