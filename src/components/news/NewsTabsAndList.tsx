'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/ui/Pagination';
import { sanitizeHtml } from '@/lib/utils/sanitizer';

interface NewsArticle {
  id: string;
  date: string;
  categories: string[];
  title: string;
  description: string;
  imageUrl: string | null;
  tags?: string[];
}

interface NewsTabsAndListProps {
  articles: NewsArticle[];
  categories: string[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 10;

export const NewsTabsAndList: React.FC<NewsTabsAndListProps> = ({
  articles,
  categories,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('すべて');

  const handleArticleClick = (articleId: string) => {
    router.push(`/candidate/news/${articleId}`);
  };

  const tabs = ['すべて', ...categories.slice(0, 2)]; // 最大3つのタブ

  const filteredArticles =
    activeTab === 'すべて'
      ? articles
      : articles.filter(
          article =>
            article.categories && article.categories.includes(activeTab)
        );

  return (
    <div className='w-full'>
      {/* タブ */}
      <div className='border-b-2 border-[#DCDCDC] mb-[32px] relative'>
        <div className='flex justify-center space-x-0'>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-[24px] py-[12px] text-[16px] font-bold relative ${
                activeTab === tab
                  ? 'text-[#0F9058]'
                  : 'text-[#666666] hover:text-[#0F9058]'
              }`}
              style={{
                fontFamily:
                  'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              {tab}
              {activeTab === tab && (
                <div className='absolute bottom-[-2px] left-0 right-0 h-[2px] bg-[#0F9058]' />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ニュース一覧 */}
      <div className='flex flex-col gap-6 md:gap-2 items-start justify-start relative w-full'>
        {filteredArticles.map(article => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(article.id)}
            className='flex flex-col md:flex-row grow items-start justify-start min-w-60 overflow-hidden relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] cursor-pointer w-full'
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#E9E9E9';
              // 内側のdivの背景色も変更
              const innerDiv = e.currentTarget.querySelector(
                '.news-card-inner'
              ) as HTMLElement;
              if (innerDiv) {
                innerDiv.style.backgroundColor = '#E9E9E9';
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              // 内側のdivの背景色も戻す
              const innerDiv = e.currentTarget.querySelector(
                '.news-card-inner'
              ) as HTMLElement;
              if (innerDiv) {
                innerDiv.style.backgroundColor = '#ffffff';
              }
            }}
          >
            <div
              className='aspect-[300/200] bg-center bg-cover bg-no-repeat flex-shrink-0 w-full md:w-[230px]'
              style={{
                backgroundImage: `url('${article.imageUrl || '/images/placeholder.jpg'}')`,
              }}
            />
            <div className='news-card-inner bg-[#ffffff] flex flex-col gap-4 flex-grow items-start justify-start p-[24px] relative'>
              <div className='flex items-start justify-between relative w-full'>
                <div className='flex flex-wrap gap-2 flex-grow items-start justify-start relative'>
                  {article.categories && article.categories.length > 0 && (
                    <>
                      {article.categories.slice(0, 2).map((category, index) => (
                        <div
                          key={index}
                          className='bg-[#0f9058] flex gap-2.5 items-center justify-center px-4 py-1 relative rounded-[28px]'
                        >
                          <div
                            className='font-bold text-[#ffffff] text-[14px] whitespace-nowrap tracking-[1.4px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            <p className='leading-[1.6]'>{category}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  {article.tags && article.tags.length > 0 && (
                    <>
                      {article.tags.slice(0, 2).map((tag, index) => (
                        <div
                          key={index}
                          className='bg-[#0f9058] flex gap-2.5 items-center justify-center px-4 py-1 relative rounded-[28px]'
                        >
                          <div
                            className='font-bold text-[#ffffff] text-[14px] whitespace-nowrap tracking-[1.4px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            <p className='leading-[1.6]'>{tag}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div
                  className='md:block hidden font-medium text-[#999999] text-[14px] whitespace-nowrap tracking-[1.4px] flex-shrink-0'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  <p className='leading-[1.6]'>{article.date}</p>
                </div>
              </div>
              <div
                className='font-bold h-[60px] overflow-hidden text-[#323232] text-[18px] tracking-[1.8px] w-full prose-lists'
                style={{
                  fontFamily: 'Noto Sans JP, sans-serif',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <div
                  className='leading-[1.6] [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:mb-1 [&_ul]:list-disc [&_ol]:list-decimal [&_li]:list-item'
                  style={{ display: 'inline' }}
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(article.title),
                  }}
                />
              </div>
              <div
                className='block md:hidden font-medium text-[#999999] text-[14px] whitespace-nowrap tracking-[1.4px] flex-shrink-0'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                <p className='leading-[1.6]'>{article.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ページネーション */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className='mt-[40px]'
      />
    </div>
  );
};
