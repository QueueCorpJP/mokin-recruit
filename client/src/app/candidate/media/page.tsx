import React, { Suspense } from 'react';
import { ArticleGrid } from '@/components/media/ArticleGrid';
import { PopularArticlesSidebar } from '@/components/media/PopularArticlesSidebar';
import { createServerAdminClient } from '@/lib/supabase/server-admin';
import { unstable_cache } from 'next/cache';
import { mediaService } from '@/lib/services/mediaService';

interface MediaArticle {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

// 軽量化されたモックデータ
const mockArticles: MediaArticle[] = [
  {
    id: '1',
    date: '2025.01.08',
    category: '転職ノウハウ',
    title: '転職活動を成功させる5つのポイント',
    description: '転職活動を効率的に進めるためのコツと、採用担当者が見ているポイントについて解説します。',
    imageUrl: '/images/media01.jpg'
  },
  {
    id: '2',
    date: '2025.01.07',
    category: 'キャリア',
    title: 'IT業界で求められるスキルセット2025',
    description: '最新のIT業界トレンドと、今後需要が高まるスキルについて詳しく解説します。',
    imageUrl: '/images/media02.jpg'
  },
  {
    id: '3',
    date: '2025.01.06',
    category: '面接対策',
    title: 'Web面接で好印象を与える方法',
    description: 'オンライン面接特有の注意点と、印象を良くするためのテクニックをご紹介します。',
    imageUrl: '/images/media03.jpg'
  },
  {
    id: '4',
    date: '2025.01.05',
    category: '転職ノウハウ',
    title: '履歴書と職務経歴書の書き方完全ガイド',
    description: '採用担当者の目に留まる書類作成のコツを、実例を交えて詳しく解説します。',
    imageUrl: '/images/media04.jpg'
  },
  {
    id: '5',
    date: '2025.01.04',
    category: 'キャリア',
    title: '20代後半のキャリアチェンジ戦略',
    description: '20代後半でキャリアチェンジを考えている方に向けた、具体的な戦略と成功事例を紹介します。',
    imageUrl: '/images/media05.jpg'
  },
  {
    id: '6',
    date: '2025.01.03',
    category: '業界研究',
    title: '成長企業の見極め方',
    description: '転職先として優良な成長企業を見極めるポイントと、企業研究の方法を解説します。',
    imageUrl: '/images/media06.jpg'
  },
  {
    id: '7',
    date: '2025.01.02',
    category: '転職ノウハウ',
    title: '転職理由の伝え方',
    description: '面接で必ず聞かれる転職理由を、ポジティブに伝える方法を解説します。',
    imageUrl: '/images/media07.jpg'
  },
  {
    id: '8',
    date: '2025.01.01',
    category: 'キャリア',
    title: 'リモートワーク時代のキャリア形成',
    description: 'リモートワークが一般化した今、新しいキャリア形成の考え方について解説します。',
    imageUrl: '/images/media08.jpg'
  },
  {
    id: '9',
    date: '2024.12.31',
    category: '面接対策',
    title: '自己PRの作り方',
    description: '面接官の心に響く自己PRの作り方と、実際の例文を紹介します。',
    imageUrl: '/images/media09.jpg'
  },
  {
    id: '10',
    date: '2024.12.30',
    category: '業界研究',
    title: 'スタートアップ企業の選び方',
    description: 'スタートアップ企業への転職を考える際の注意点と選び方のポイントを解説します。',
    imageUrl: '/images/media10.jpg'
  },
  {
    id: '11',
    date: '2024.12.29',
    category: '転職ノウハウ',
    title: '年収交渉のタイミングと方法',
    description: '転職時の年収交渉を成功させるためのタイミングと具体的な交渉方法を紹介します。',
    imageUrl: '/images/media11.jpg'
  },
  {
    id: '12',
    date: '2024.12.28',
    category: 'キャリア',
    title: '副業から始めるキャリアチェンジ',
    description: '副業を活用してリスクを抑えながらキャリアチェンジする方法を解説します。',
    imageUrl: '/images/media12.jpg'
  }
];


// キャッシュされた記事取得関数
const getCachedArticles = unstable_cache(
  async (): Promise<MediaArticle[]> => {
    try {
      const supabase = createServerAdminClient();
      const { data: fetchedArticles, error: supabaseError } = await supabase
        .from('articles')
        .select('id, title, excerpt, content, thumbnail_url, published_at, created_at')
        .eq('status', 'PUBLISHED')
        .order('created_at', { ascending: false })
        .limit(20);

      if (supabaseError) {
        throw supabaseError;
      }

      return (fetchedArticles || []).map(article => ({
        id: article.id,
        date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).replace(/\//g, '.'),
        category: 'メディア',
        title: article.title,
        description: article.excerpt || (typeof article.content === 'string' 
          ? article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
          : 'No description available'),
        imageUrl: article.thumbnail_url || '/images/media01.jpg'
      }));
    } catch (err) {
      console.error('記事の取得に失敗:', err);
      return mockArticles;
    }
  },
  ['media-articles'],
  { revalidate: 300 } // 5分間キャッシュ
);

// サイドバーデータ取得関数
const getCachedSidebarData = unstable_cache(
  async () => {
    const [popularArticles, categories, tags] = await Promise.all([
      mediaService.getPopularArticles(5),
      mediaService.getCategories(),
      mediaService.getTags()
    ]);
    return { popularArticles, categories, tags };
  },
  ['media-sidebar'],
  { revalidate: 300 } // 5分間キャッシュ
);

export default async function MediaPage() {
  const [articles, sidebarData] = await Promise.all([
    getCachedArticles(),
    getCachedSidebarData()
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#17856F] to-[#229A4E] relative overflow-hidden">
      

      {/* ヘッダー */}
      <header className="px-[80px] py-[120px] relative z-10 h-[400px] flex items-center justify-center">
        {/* 完全な半円背景 */}
        <div className="absolute inset-0 overflow-visible" style={{ zIndex: -1 }}>
          <div className="relative w-full h-full">
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: '120vw',
                height: '60vw',
                maxWidth: '1200px',
                maxHeight: '600px',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #1CA74F 0%, #198D76 100%)'
              }}
            />
          </div>
        </div>
        <div className="text-center relative z-10">
          <h1 className="text-[32px] font-bold text-[#FFF] Noto_Sans_JP">メディア</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10">
        <div className="px-[16px] md:px-[80px] py-[40px] md:py-[80px]">
          <div className="flex flex-col lg:flex-row lg:justify-between">
            {/* 記事グリッド - 右側のサイドバーとの間に80pxの余白を確保 */}
            <div className="flex-1 lg:pr-[80px]">
              <Suspense fallback={
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
              }>
                <ArticleGrid articles={articles} />
              </Suspense>
            </div>

            {/* サイドバー - 固定幅280px */}
            <aside className="hidden lg:block lg:w-[280px] flex-shrink-0">
              <PopularArticlesSidebar 
                articles={sidebarData.popularArticles} 
                categories={sidebarData.categories}
                tags={sidebarData.tags}
              />
            </aside>
          </div>
          
          {/* モバイル表示用サイドバー */}
          <div className="lg:hidden mt-[40px]">
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