import { createClient } from '@supabase/supabase-js';

export interface PopularArticle {
  id: string;
  title: string;
  thumbnail_url?: string | null;
  published_at: string;
}

export interface ArticleCategory {
  name: string;
  count: number;
}

export interface ArticleTag {
  name: string;
  count: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail_url: string | null;
  published_at: string;
  created_at: string;
  categories: string[];
  tags: string[];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createNewsService = () => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  return {
    async getPopularNews(limit: number = 5): Promise<PopularArticle[]> {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select('id, title, thumbnail_url, published_at')
          .eq('status', 'PUBLISHED')
          .order('views_count', { ascending: false })
          .limit(limit);

        if (error) throw error;

        return data?.map(notice => ({
          id: notice.id,
          title: notice.title,
          thumbnail_url: notice.thumbnail_url,
          published_at: notice.published_at
        })) || [];
      } catch (error) {
        console.error('人気ニュースの取得エラー:', error);
        return [];
      }
    },

    async getCategories(): Promise<ArticleCategory[]> {
      try {
        const { data: categories, error: categoriesError } = await supabase
          .from('notice_categories')
          .select('id, name');

        if (categoriesError) throw categoriesError;

        const categoriesWithCount = await Promise.all(
          (categories || []).map(async (category) => {
            const { count, error: countError } = await supabase
              .from('notice_category_relations')
              .select('id', { count: 'exact' })
              .eq('category_id', category.id);

            if (countError) {
              console.error(`カテゴリー ${category.name} の記事数取得エラー:`, countError);
              return { name: category.name, count: 0 };
            }

            return { name: category.name, count: count || 0 };
          })
        );

        return categoriesWithCount;
      } catch (error) {
        console.error('ニュースカテゴリー取得エラー:', error);
        return [];
      }
    },

    async getTags(): Promise<ArticleTag[]> {
      // notices doesn't have tags, return empty array
      return [];
    },

    async getNews(limit: number = 20, offset: number = 0): Promise<Article[]> {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select(`
            id, title, excerpt, content, thumbnail_url, published_at, created_at,
            notice_category_relations(
              notice_categories(name)
            )
          `)
          .eq('status', 'PUBLISHED')
          .order('published_at', { ascending: false })
          .range(offset, offset + limit - 1);

        if (error) throw error;

        return data?.map(notice => ({
          id: notice.id,
          title: notice.title,
          excerpt: notice.excerpt || '',
          content: notice.content,
          thumbnail_url: notice.thumbnail_url,
          published_at: notice.published_at || '',
          created_at: notice.created_at,
          categories: notice.notice_category_relations?.map(rel => (rel.notice_categories as any)?.name) || [],
          tags: [] // notices doesn't have tags currently
        })) || [];
      } catch (error) {
        console.error('ニュース取得エラー:', error);
        return [];
      }
    },

    async getNewsWithPagination(limit: number = 20, offset: number = 0): Promise<{
      articles: Article[];
      hasMore: boolean;
      total: number;
    }> {
      try {
        const { count } = await supabase
          .from('notices')
          .select('id', { count: 'exact' })
          .eq('status', 'PUBLISHED');

        const articles = await this.getNews(limit, offset);
        
        return {
          articles,
          hasMore: offset + limit < (count || 0),
          total: count || 0
        };
      } catch (error) {
        console.error('ページネーションニュース取得エラー:', error);
        return {
          articles: [],
          hasMore: false,
          total: 0
        };
      }
    },

    async getSidebarData(): Promise<{
      popularArticles: PopularArticle[];
      categories: ArticleCategory[];
      tags: ArticleTag[];
    }> {
      try {
        const [popularArticles, categories, tags] = await Promise.all([
          this.getPopularNews(5),
          this.getCategories(),
          this.getTags()
        ]);

        return {
          popularArticles,
          categories,
          tags
        };
      } catch (error) {
        console.error('サイドバーデータ取得エラー:', error);
        return {
          popularArticles: [],
          categories: [],
          tags: []
        };
      }
    },

    async getRelatedNews(currentNewsId: string, limit: number = 6): Promise<Article[]> {
      try {
        const { data, error } = await supabase
          .from('notices')
          .select(`
            id, title, excerpt, content, thumbnail_url, published_at, created_at,
            notice_category_relations(
              notice_categories(name)
            )
          `)
          .eq('status', 'PUBLISHED')
          .neq('id', currentNewsId)
          .order('published_at', { ascending: false })
          .limit(limit);

        if (error) throw error;

        return data?.map(notice => ({
          id: notice.id,
          title: notice.title,
          excerpt: notice.excerpt || '',
          content: notice.content,
          thumbnail_url: notice.thumbnail_url,
          published_at: notice.published_at || '',
          created_at: notice.created_at,
          categories: notice.notice_category_relations?.map(rel => (rel.notice_categories as any)?.name) || [],
          tags: [] // notices doesn't have tags currently
        })) || [];
      } catch (error) {
        console.error('関連ニュース取得エラー:', error);
        return this.getNews(limit);
      }
    }
  };
};