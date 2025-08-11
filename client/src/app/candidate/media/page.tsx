import React from 'react';
import { ArticleGrid } from '@/components/media/ArticleGrid';
import { PopularArticlesSidebar } from '@/components/media/PopularArticlesSidebar';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

interface MediaArticle {
  id: string;
  date: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
}

// モックデータ（Supabaseからのデータが取得できない場合の代替）
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

const sideArticles = [
  {
    id: 's1',
    category: 'ピックアップ',
    title: '今週の注目記事'
  },
  {
    id: 's2',
    category: 'ランキング',
    title: '月間人気記事TOP10'
  },
  {
    id: 's3',
    category: 'お知らせ',
    title: '新着求人情報'
  },
  {
    id: 's4',
    category: 'キャンペーン',
    title: '転職成功で特典GET'
  }
];

export default async function MediaPage() {
  let articles: MediaArticle[] = [];
  let error: string | null = null;

  try {
    // サーバーサイドでSupabaseから記事を取得
    const supabase = createServerAdminClient();
    const { data: fetchedArticles, error: supabaseError } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(20);

    if (supabaseError) {
      throw supabaseError;
    }

    // Supabaseの記事データをMediaArticle形式に変換
    articles = (fetchedArticles || []).map(article => ({
      id: article.id,
      date: new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '.'),
      category: 'メディア', // デフォルトカテゴリ（後でリレーション対応）
      title: article.title,
      description: article.excerpt || (typeof article.content === 'string' 
        ? article.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
        : 'No description available'),
      imageUrl: article.thumbnail_url || '/images/media01.jpg' // デフォルト画像
    }));
  } catch (err) {
    console.error('記事の取得に失敗:', err);
    error = '記事の読み込みに失敗しました';
    // エラー時はモックデータを表示
    articles = mockArticles;
  }

  const displayArticles = articles.length > 0 ? articles : mockArticles;

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#17856F] to-[#229A4E] relative overflow-hidden">
      {/* 背景の半円SVG */}
      <div className="absolute top-0 right-0 pointer-events-none" style={{ zIndex: 0 }}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="90" 
          height="128" 
          viewBox="0 0 90 128" 
          fill="none"
          className="w-32 h-32"
        >
          <circle cx="64.5" cy="64" r="64" fill="url(#paint0_linear_media_top)"/>
          <defs>
            <linearGradient id="paint0_linear_media_top" x1="64.5" y1="128" x2="64.5" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#198D76"/>
              <stop offset="1" stopColor="#1CA74F"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ヘッダー */}
      <header className=" px-[80px] py-[75px] relative z-10">
        <div className="max-w-7xl text-center">
          <h1 className="text-[32px] font-bold text-[#FFF] Noto_Sans_JP">メディア</h1>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full md:px-[80px] md:py-[80px] px-[16px] py-[40px] bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row gap-[80px]">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-2">{error}</p>
              <p className="text-gray-600 text-sm">モックデータを表示しています</p>
            </div>
          )}
          <ArticleGrid articles={displayArticles} />
          <PopularArticlesSidebar articles={sideArticles} />
        </div>
      </main>
    </div>
  );
}