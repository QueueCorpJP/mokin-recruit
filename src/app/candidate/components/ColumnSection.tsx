'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ColumnCard } from '@/components/ui/ColumnCard';
import { getArticlesWithPagination } from '@/app/candidate/media/actions';

interface MediaArticle {
  id: string;
  title: string;
  categories: string[];
  imageUrl: string | null;
}

export function ColumnSection() {
  const [articles, setArticles] = useState<MediaArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const result = await getArticlesWithPagination(6, 0);
        const formattedArticles = result.articles.map(article => ({
          id: article.id,
          title: article.title,
          categories: article.categories || ['メディア'],
          imageUrl: article.thumbnail_url || '/company.jpg',
        }));
        setArticles(formattedArticles);
      } catch {
        // Fallback to dummy data
        setArticles([
          {
            id: '1',
            title:
              'テキストが入ります。テキストが入ります。テキストが入ります。',
            categories: ['カテゴリ', 'カテゴリ'],
            imageUrl: '/company.jpg',
          },
          {
            id: '2',
            title:
              'テキストが入ります。テキストが入ります。テキストが入ります。',
            categories: ['カテゴリ', 'カテゴリ'],
            imageUrl: '/company.jpg',
          },
          {
            id: '3',
            title:
              'テキストが入ります。テキストが入ります。テキストが入ります。',
            categories: ['カテゴリ', 'カテゴリ'],
            imageUrl: '/company.jpg',
          },
          {
            id: '4',
            title:
              'テキストが入ります。テキストが入ります。テキストが入ります。',
            categories: ['カテゴリ', 'カテゴリ'],
            imageUrl: '/company.jpg',
          },
          {
            id: '5',
            title:
              'テキストが入ります。テキストが入ります。テキストが入ります。',
            categories: ['カテゴリ', 'カテゴリ'],
            imageUrl: '/company.jpg',
          },
          {
            id: '6',
            title:
              'テキストが入ります。テキストが入ります。テキストが入ります。',
            categories: ['カテゴリ', 'カテゴリ'],
            imageUrl: '/company.jpg',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <section className='bg-[#f9f9f9] py-[120px] flex flex-col items-center relative'>
      {/* 背景装飾テキスト */}
      <div className="absolute bottom-[270px] font-['League_Spartan'] font-bold text-[200px] text-[#ffffff] opacity-80 text-center tracking-[20px] left-1/2 transform -translate-x-1/2 translate-y-full leading-[1.8] whitespace-nowrap z-0 pointer-events-none select-none">
        MEDIA ARTICLES
      </div>

      <div className='w-full max-w-[1200px] flex flex-col items-center relative z-10 px-5'>
        {/* セクションタイトル */}
        <div className='flex flex-col items-center'>
          <h2 className='font-bold text-[32px] leading-[1.6] tracking-[3.2px] text-center text-[#0f9058] font-[family-name:var(--font-noto-sans-jp)]'>
            コラム
          </h2>
          {/* ドット装飾 */}
          <div className='flex flex-row gap-7 mt-4'>
            <span className='w-[12px] h-[12px] rounded-full bg-[#0f9058]'></span>
            <span className='w-[12px] h-[12px] rounded-full bg-[#0f9058]'></span>
            <span className='w-[12px] h-[12px] rounded-full bg-[#0f9058]'></span>
          </div>
        </div>

        {/* コラムカードグリッド */}
        <div className='mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full'>
          {loading
            ? // Loading skeleton
              [...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] overflow-hidden animate-pulse'
                >
                  <div className='w-full aspect-[373/249] bg-gray-200'></div>
                  <div className='p-6'>
                    <div className='h-6 bg-gray-200 rounded mb-4'></div>
                    <div className='h-6 bg-gray-200 rounded w-3/4 mb-4'></div>
                    <div className='flex gap-2'>
                      <div className='h-8 w-20 bg-gray-200 rounded-full'></div>
                      <div className='h-8 w-20 bg-gray-200 rounded-full'></div>
                    </div>
                  </div>
                </div>
              ))
            : articles.map(article => (
                <Link
                  key={article.id}
                  href={`/candidate/media/${article.id}`}
                  className='block cursor-pointer'
                >
                  <ColumnCard
                    imageUrl={article.imageUrl || '/company.jpg'}
                    title={article.title}
                    categories={article.categories}
                  />
                </Link>
              ))}
        </div>

        {/* 他のコラムも見るボタン */}
        <div className='mt-14'>
          <Link href='/candidate/media'>
            <button className='border border-[#0f9058] rounded-[32px] px-10 py-3.5 min-w-40 transition-colors duration-200 hover:bg-[#0F9058]/20'>
              <span className='text-[#0f9058] font-bold text-[16px] leading-[2] tracking-[1.6px] font-[family-name:var(--font-noto-sans-jp)]'>
                他のコラムも見る
              </span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
