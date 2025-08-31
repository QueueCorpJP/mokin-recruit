import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';

export interface NoticeData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published_at: string;
  created_at: string;
}

/**
 * 公開されているお知らせを最新順で取得する
 */
export const getPublishedNotices = unstable_cache(
  async (limit: number = 10): Promise<NoticeData[]> => {
    try {
      const supabase = await createClient();
      
      const { data: notices, error } = await supabase
        .from('notices')
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          published_at,
          created_at
        `)
        .eq('status', 'PUBLISHED')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching notices:', error);
        return [];
      }

      return notices || [];
    } catch (error) {
      console.error('Error in getPublishedNotices:', error);
      return [];
    }
  },
  ['published-notices'],
  {
    revalidate: 300, // 5分間キャッシュ
    tags: ['notices', 'published']
  }
);

/**
 * 特定のお知らせを取得する
 */
export const getNoticeById = unstable_cache(
  async (id: string): Promise<NoticeData | null> => {
    try {
      const supabase = await createClient();
      
      const { data: notice, error } = await supabase
        .from('notices')
        .select(`
          id,
          title,
          slug,
          content,
          excerpt,
          published_at,
          created_at
        `)
        .eq('id', id)
        .eq('status', 'PUBLISHED')
        .not('published_at', 'is', null)
        .single();

      if (error) {
        console.error('Error fetching notice:', error);
        return null;
      }

      return notice;
    } catch (error) {
      console.error('Error in getNoticeById:', error);
      return null;
    }
  },
  ['notice-by-id'],
  {
    revalidate: 300,
    tags: ['notices', 'published']
  }
);

/**
 * 日付をフォーマットする
 */
export const formatNoticeDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  });
};