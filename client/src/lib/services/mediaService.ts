import { createServerAdminClient } from '@/lib/supabase/server-admin';

export interface PopularArticle {
  id: string;
  title: string;
  views_count: number;
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

export const mediaService = {
  async getPopularArticles(limit: number = 5): Promise<PopularArticle[]> {
    try {
      const supabase = createServerAdminClient();
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, views_count, published_at')
        .eq('status', 'PUBLISHED')
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('人気記事の取得エラー:', error);
      return [];
    }
  },

  async getCategories(): Promise<ArticleCategory[]> {
    try {
      const supabase = createServerAdminClient();
      
      // 記事からカテゴリーを集計
      const { data, error } = await supabase
        .from('articles')
        .select('category')
        .eq('status', 'PUBLISHED')
        .not('category', 'is', null);

      if (error) throw error;

      // カテゴリーごとに集計
      const categoryMap = new Map<string, number>();
      (data || []).forEach(article => {
        if (article.category) {
          categoryMap.set(article.category, (categoryMap.get(article.category) || 0) + 1);
        }
      });

      // 配列に変換して降順ソート
      return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    } catch (error) {
      console.error('カテゴリー取得エラー:', error);
      return [];
    }
  },

  async getTags(): Promise<ArticleTag[]> {
    try {
      const supabase = createServerAdminClient();
      
      // 記事からタグを集計
      const { data, error } = await supabase
        .from('articles')
        .select('tags')
        .eq('status', 'PUBLISHED')
        .not('tags', 'is', null);

      if (error) throw error;

      // タグごとに集計
      const tagMap = new Map<string, number>();
      (data || []).forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach((tag: string) => {
            tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
          });
        }
      });

      // 配列に変換して降順ソート
      return Array.from(tagMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 20); // 上位20タグまで
    } catch (error) {
      console.error('タグ取得エラー:', error);
      return [];
    }
  }
};