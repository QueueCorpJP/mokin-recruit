'use client';
import React from 'react';

interface PopularArticle {
  id: string;
  title: string;
  views_count?: number;
}

interface Category {
  name: string;
  count: number;
}

interface Tag {
  name: string;
  count: number;
}

interface PopularArticlesSidebarProps {
  articles?: PopularArticle[];
  categories?: Category[];
  tags?: Tag[];
  onCategoryClick?: (categoryName: string) => void;
  onTagClick?: (tagName: string) => void;
}

export const PopularArticlesSidebar: React.FC<PopularArticlesSidebarProps> = ({ 
  articles = [], 
  categories = [], 
  tags = [],
  onCategoryClick,
  onTagClick
}) => {
  return (
    <aside className="lg:max-w-[240px] flex flex-col gap-[40px]">
      {/* 人気記事セクション */}
      {articles.length > 0 && (
        <>
          <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px]">
            <img src="/images/king.svg" alt="king" />
            <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">人気記事</h2>
          </div>
          <div className="flex flex-col gap-[8px] mt-[-16px]">
            {articles.slice(0, 5).map((article, index) => (
              <div
                key={article.id}
                className="bg-[#FFF] rounded-[8px] p-[16px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-[16px] flex-row">
                  <img src={`/images/book${index + 1}.svg`} alt={`book ${index + 1}`} />
                  <h4 className="text-[#323232] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-noto-sans-jp" style={{ fontWeight: 700, fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", sans-serif' }}>
                    {article.title}
                  </h4>
                </div>
              </div>
            ))}       
          </div>
        </>
      )}

      {/* カテゴリーセクション */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] mb-[16px]">
          <img src="/images/cotegory.svg" alt="category" />
          <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">カテゴリー</h2>
        </div>
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-[8px]">
            {categories.slice(0, 10).map((category, index) => (
              <span 
                key={index} 
                className="bg-[#0F9058] text-[#FFF] text-[14px] font-bold px-[16px] py-[4px] w-fit rounded-full cursor-pointer hover:bg-[#0D7347] transition-colors"
                title={`${category.count}件の記事`}
                onClick={() => onCategoryClick?.(category.name)}
              >
                {category.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[#999] text-[14px]">カテゴリーがありません</div>
        )}
      </div>

      {/* タグセクション */}
      <div className="flex flex-col gap-[8px]">
        <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] mb-[16px]">
          <img src="/images/tag.svg" alt="tag" />
          <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">タグ</h2>
        </div>
        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-[8px]">
            {tags.slice(0, 15).map((tag, index) => (
              <span 
                key={index} 
                className="bg-[#E8F5E8] text-[#0F9058] text-[12px] font-medium px-[12px] py-[2px] w-fit rounded-full cursor-pointer hover:bg-[#D4EBD4] transition-colors"
                title={`${tag.count}件の記事`}
                onClick={() => onTagClick?.(tag.name)}
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[#999] text-[14px]">タグがありません</div>
        )}
      </div>
    </aside>
  );
};