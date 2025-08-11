'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MediaHeader } from '@/components/media/MediaHeader';
import { PopularArticlesSidebar } from '@/components/media/PopularArticlesSidebar';
import { articleService, type Article } from '@/lib/services/articleService';

const mockArticle = {
  id: '1',
  date: '2024.12.28',
  category: '転職ノウハウ',
  title: 'テキストが入ります。テキストが入ります。テキストが入ります。',
  supervisor: {
    name: '渡辺 貴明',
    description: 'メルセネール株式会社取締役。東京工業大学工学部卒業。大学卒業後、独立系コンサルティングファームにて製造業のクライアントを中心に業務改革支援に従事。その後、アビームコンサルティング株式会社の戦略部門に転じ、経営戦略・事業戦略策定やM&A、新規事業開発、組織/人材開発に従事。メルセネール株式会社では事業責任者を務める。'
  },
  imageUrl: '/images/media-detail-main.jpg',
  content: {
    intro: 'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。',
    section1: {
      title: 'h2テキストが入ります。h2テキストが入ります。h2テキストが入ります。',
      content: 'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。'
    },
    section2: {
      imageUrl: '/images/media-detail-image1.jpg',
      content: 'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。'
    },
    tableData: {
      headers: ['カラム', 'カラム', 'カラム'],
      rows: [
        ['テキスト', 'テキスト', 'テキスト'],
        ['テキスト', 'テキスト', 'テキスト'],
        ['テキスト', 'テキスト', 'テキスト']
      ]
    },
    section3: {
      content: 'テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。'
    }
  }
};

const sideArticles = [
  {
    id: 's1',
    category: 'ピックアップ',
    title: 'テキストが入ります'
  },
  {
    id: 's2',
    category: 'ランキング',
    title: 'テキストが入ります'
  },
  {
    id: 's3',
    category: 'お知らせ',
    title: 'テキストが入ります'
  },
  {
    id: 's4',
    category: 'キャンペーン',
    title: 'テキストが入ります'
  }
];

const recommendedArticles = [
  {
    id: 'r1',
    date: '2024.12.27',
    category: '転職ノウハウ',
    title: 'テキストが入ります。テキストが入ります。',
    description: 'テキストが入ります。テキストが入ります。テキストが入ります。',
    imageUrl: '/images/media01.jpg'
  },
  {
    id: 'r2',
    date: '2024.12.26',
    category: 'キャリア',
    title: 'テキストが入ります。テキストが入ります。',
    description: 'テキストが入ります。テキストが入ります。テキストが入ります。',
    imageUrl: '/images/media02.jpg'
  },
  {
    id: 'r3',
    date: '2024.12.25',
    category: '面接対策',
    title: 'テキストが入ります。テキストが入ります。',
    description: 'テキストが入ります。テキストが入ります。テキストが入ります。',
    imageUrl: '/images/media03.jpg'
  }
];

const newArticles = [
  {
    id: 'n1',
    date: '2024.12.28',
    category: '転職ノウハウ',
    title: 'テキストが入ります。テキストが入ります。',
    description: 'テキストが入ります。テキストが入ります。テキストが入ります。',
    imageUrl: '/images/media04.jpg'
  },
  {
    id: 'n2',
    date: '2024.12.27',
    category: 'キャリア',
    title: 'テキストが入ります。テキストが入ります。',
    description: 'テキストが入ります。テキストが入ります。テキストが入ります。',
    imageUrl: '/images/media05.jpg'
  },
  {
    id: 'n3',
    date: '2024.12.26',
    category: '業界研究',
    title: 'テキストが入ります。テキストが入ります。',
    description: 'テキストが入ります。テキストが入ります。テキストが入ります。',
    imageUrl: '/images/media06.jpg'
  }
];

export default function MediaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const mediaId = params.media_id as string;
        
        if (!mediaId) {
          setError('記事IDが指定されていません');
          return;
        }

        const fetchedArticle = await articleService.getArticle(mediaId);
        
        if (!fetchedArticle) {
          setError('記事が見つかりませんでした');
          return;
        }

        if (fetchedArticle.status !== 'PUBLISHED') {
          setError('この記事は公開されていません');
          return;
        }

        setArticle(fetchedArticle);
        setError(null);
      } catch (err) {
        console.error('記事の取得に失敗:', err);
        setError('記事の読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [params.media_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] flex items-center justify-center">
        <div className="text-white text-lg">記事を読み込み中...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">エラー</h1>
          <p className="text-lg mb-6">{error || '記事が見つかりません'}</p>
          <button
            onClick={() => router.push('/candidate/media')}
            className="bg-white text-green-700 px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            メディア一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(article.published_at || article.created_at!).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F]">
      {/* ヘッダー */}
      <MediaHeader title="メディア" />

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10">
        <div className="md:px-[80px] md:py-[80px] px-[16px] py-[40px] gap-[80px]">
          
          <div className="flex flex-col lg:flex-row gap-[80px]">
            {/* 記事本文 */}
            <article className="flex-1 max-w-[800px]">
              
              {/* 日時 */}
              <div className="mb-[16px]">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* 記事タイトルセクション */}
              <div className="mb-[32px]">
                <h1 className="text-[32px] font-bold text-[#323232] mb-[16px] Noto_Sans_JP leading-[1.5]">
                  {article.title}
                </h1>
                <div className="flex items-center gap-[16px]">
                  <span className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full">
                    メディア
                  </span>
                </div>
              </div>


              {/* メイン画像 */}
              {article.thumbnail_url && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]">
                  <img 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 記事本文（リッチコンテンツ） */}
              <div 
                className="prose prose-lg max-w-none mb-[60px]"
                dangerouslySetInnerHTML={{ 
                  __html: typeof article.content === 'string' 
                    ? article.content 
                    : JSON.stringify(article.content) 
                }}
              />

              {/* 記事フッター */}
              <footer className="mb-[40px] pt-8 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    公開日: {formattedDate}
                    {article.views_count && (
                      <span className="ml-4">閲覧数: {article.views_count.toLocaleString()}</span>
                    )}
                  </div>
                  <button
                    onClick={() => router.push('/candidate/media')}
                    className="bg-[#0F9058] text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
                  >
                    メディア一覧に戻る
                  </button>
                </div>
              </footer>

              {/* CTAバナー */}
              <div className="mb-[60px]">
                {/* デスクトップ用バナー */}
                <img 
                  src="/images/baner.svg" 
                  alt="プロフィール登録バナー"
                  className="w-full hidden md:block cursor-pointer hover:opacity-90 transition-opacity"
                />
                {/* モバイル用バナー */}
                <img 
                  src="/images/baner2.svg" 
                  alt="プロフィール登録バナー"
                  className="w-full md:hidden cursor-pointer hover:opacity-90 transition-opacity"
                />
              </div>

            </article>

            {/* サイドバー */}
            <aside className="lg:w-[280px]">
              <PopularArticlesSidebar articles={sideArticles} />
            </aside>
          </div>

          {/* おすすめ記事 */}
          <section className="mt-[80px]">
            <div className="flex flex-row gap-[12px] justify-end items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]">
              <img src="/images/recommend.svg" alt="recommend" />
              <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">おすすめ記事</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
              {recommendedArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-[24px]">
                    <p className="text-[16px] font-bold text-[#323232] line-clamp-2 mb-[16px] Noto_Sans_JP">
                      {article.description}
                    </p>
                    <span className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full">
                      {article.category}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 新着記事 */}
          <section className="mt-[80px]">
            <div className="flex flex-row gap-[12px] justify-end items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[32px]">
              <img src="/images/new.svg" alt="new" />
              <h2 className="text-[20px] font-bold text-[#323232] Noto_Sans_JP">新着記事</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
              {newArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-[#FFF] rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)] hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-[24px]">
                    <p className="text-[16px] font-bold text-[#323232] line-clamp-2 mb-[16px] Noto_Sans_JP">
                      {article.description}
                    </p>
                    <span className="bg-[#0F9058] text-[#FFF] text-[14px] font-medium px-[16px] py-[4px] rounded-full">
                      {article.category}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}