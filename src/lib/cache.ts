import { unstable_cache } from 'next/cache';

// キャッシュキー
export const CACHE_KEYS = {
  MEDIA_ARTICLES: 'media-articles',
  POPULAR_ARTICLES: 'popular-articles',
  ARTICLE_DETAIL: 'article-detail',
} as const;

// キャッシュ設定
export const CACHE_CONFIG = {
  // メディア記事一覧: 5分間キャッシュ
  MEDIA_ARTICLES: { revalidate: 300 },
  // 人気記事: 1時間キャッシュ
  POPULAR_ARTICLES: { revalidate: 3600 },
  // 記事詳細: 10分間キャッシュ
  ARTICLE_DETAIL: { revalidate: 600 },
} as const;

// キャッシュタグ
export const CACHE_TAGS = {
  ARTICLES: 'articles',
  MEDIA: 'media',
  POPULAR: 'popular',
} as const;

// キャッシュされた記事取得のヘルパー関数
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: string[],
  config: { revalidate?: number; tags?: string[] } = {}
) {
  return unstable_cache(fn, keyParts, config);
}