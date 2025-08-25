import { mockNewsArticles, mockNewsCategories, mockNewsTags } from '@/lib/data/mockNewsData';

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

// モックデータを使用する共通のニュース取得ロジック
export const createNewsService = () => ({
  async getPopularNews(limit: number = 5): Promise<PopularArticle[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return mockNewsArticles.slice(0, limit).map(article => ({
        id: article.id,
        title: article.title,
        thumbnail_url: article.thumbnail_url,
        published_at: article.published_at
      }));
    } catch (error) {
      console.error('人気ニュースの取得エラー:', error);
      return [];
    }
  },

  async getCategories(): Promise<ArticleCategory[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockNewsCategories;
    } catch (error) {
      console.error('ニュースカテゴリー取得エラー:', error);
      return [];
    }
  },

  async getTags(): Promise<ArticleTag[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockNewsTags;
    } catch (error) {
      console.error('ニュースタグ取得エラー:', error);
      return [];
    }
  },

  async getNews(limit: number = 20, offset: number = 0): Promise<Article[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      return mockNewsArticles.slice(offset, offset + limit);
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const articles = mockNewsArticles.slice(offset, offset + limit);
      const total = mockNewsArticles.length;
      
      return {
        articles,
        hasMore: offset + limit < total,
        total
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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const relatedNews = mockNewsArticles.filter(article => article.id !== currentNewsId);
      return relatedNews.slice(0, limit);
    } catch (error) {
      console.error('関連ニュース取得エラー:', error);
      return this.getNews(limit);
    }
  }
});