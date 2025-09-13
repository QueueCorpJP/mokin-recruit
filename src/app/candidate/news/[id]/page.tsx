import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { NewsHeader } from '@/components/news/NewsHeader';
import { getRelatedNews } from '@/app/candidate/news/actions';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';

// 実際のnoticesテーブルからニュース記事を取得
async function getNewsData(newsId: string) {
  const supabase = await createClient();
  
  try {
    const { data, error } = await supabase
      .from('notices')
      .select(`
        id, title, excerpt, content, thumbnail_url, published_at, created_at,
        notice_category_relations(
          notice_categories(name)
        )
      `)
      .eq('id', newsId)
      .eq('status', 'PUBLISHED')
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      excerpt: data.excerpt || '',
      content: data.content,
      thumbnail_url: data.thumbnail_url,
      published_at: data.published_at,
      created_at: data.created_at,
      categories: data.notice_category_relations?.map(rel => (rel.notice_categories as any)?.name) || []
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('ニュース記事取得エラー:', error);
    return null;
  }
}

// メタデータ生成
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getNewsData(resolvedParams.id);
  
  if (!article) {
    return {
      title: 'ニュースが見つかりません',
      description: '指定されたニュース記事が見つかりません'
    };
  }

  return {
    title: article.title,
    description: article.excerpt || '',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
    }
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const newsId = resolvedParams.id;
  
  if (!newsId) {
    notFound();
  }

  // サーバーサイドで記事と関連データを取得
  const article = await getNewsData(newsId);
  if (!article) {
    notFound();
  }

  // 関連ニュースをサーバーサイドで取得
  const relatedArticles = await getRelatedNews(article.id, 6);

  // 日付フォーマット
  const date = new Date(article.published_at || article.created_at!);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear());
  const formattedDate = `${year}/${month}/${day}`;

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative">
      {/* ヘッダー */}
      <NewsHeader title="お知らせ" showLargeCircle={true} />

      {/* メインコンテンツ */}
      <main className="w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%]">
        <div className="w-full md:py-[75px] py-[40px]">
          
          <div className="px-[16px] md:px-[80px]">
            {/* 記事本文 */}
            <article className="max-w-4xl mx-auto">
              
              {/* 日時 */}
              <div className="mb-[16px]">
                <span className="text-[#323232] text-[14px] font-medium leading-[1.6] tracking-[1.4px] Noto_Sans_JP">
                  {formattedDate}
                </span>
              </div>
              
              {/* 記事タイトルセクション */}
              <div className="mb-[32px]">
                <h1 className="text-[32px] text-[#323232] mb-[16px] font-noto-sans-jp leading-[1.5]" style={{ fontWeight: 700, fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                  {article.title}
                </h1>
                <div className="flex items-center gap-[16px]">
                  {article.categories && article.categories.length > 0 ? (
                    article.categories.slice(0, 3).map((category, index) => (
                      <span
                        key={index}
                        className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                        style={{ 
                          fontWeight: 700,
                          fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                        }}
                      >
                        {category}
                      </span>
                    ))
                  ) : (
                    <span className="bg-[#0F9058] text-[#FFF] text-[14px] px-[16px] py-[4px] rounded-full whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]"
                      style={{ 
                        fontWeight: 700,
                        fontFamily: 'var(--font-noto-sans-jp), "Noto Sans JP", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}>
                      お知らせ
                    </span>
                  )}
                </div>
              </div>

              {/* メイン画像 */}
              {article.thumbnail_url && (
                <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-[24px] overflow-hidden mb-[40px]">
                  <Image 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    fill
                    className="object-cover"
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

            </article>
          </div>        

        </div>
      </main>
    </div>
  );
}