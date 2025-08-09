import React from 'react';

interface SideArticle {
  id: string;
  category: string;
  title: string;
}

interface PopularArticlesSidebarProps {
  articles: SideArticle[];
}

export const PopularArticlesSidebar: React.FC<PopularArticlesSidebarProps> = ({ articles }) => {
  return (
    <aside className="lg:max-w-[240px] flex flex-col gap-[40px]">
      <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px]">
        <img src="/images/king.svg" alt="king" />
        <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">人気記事</h2>
      </div>
      <div className="flex flex-col gap-[8px] mt-[-16px]">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-[#FFF] rounded-[8px] p-[16px] shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-[16px] flex-row">
             
                <img src="/images/new.svg" alt="new" />
                <h4 className="font-bold text-[#323232] overflow-hidden text-ellipsis whitespace-nowrap font-[14px] Noto_Sans_JP">
                  {article.title}
                </h4>

            </div>
          </div>
        ))}       
      </div>
      <div className="flex flex-col gap-[8px]">
        
      <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] mb-[16px]">
        <img src="/images/cotegory.svg" alt="category" />
        <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">カテゴリー</h2>
      </div>
      <div className="flex flex-wrap gap-[8px]">
  {articles.map((article, index) => (
    <span key={index} className="bg-[#0F9058] text-[#FFF] text-[14px] font-bold px-[16px] py-[4px] w-fit rounded-full">
      {article.category}
    </span>
  ))}
</div>
      </div>
      <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] mb-[16px]">
        <img src="/images/tag.svg" alt="tag" />
        <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">タグ</h2>
      </div> 
    </aside>
  );
};