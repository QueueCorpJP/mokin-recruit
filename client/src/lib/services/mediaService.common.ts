export interface PopularArticle {
  id: string;
  title: string;
  views_count: number;
  published_at: string;
  created_at: string;
  excerpt?: string;
  content?: any;
  thumbnail_url?: string;
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
  content: any; // jsonb型
  thumbnail_url: string;
  published_at: string;
  created_at: string;
  categories: string[];
  tags: string[];
}

// 共通のデータ取得ロジック
export const createMediaService = (supabaseClient: any) => ({
  async getPopularArticles(limit: number = 5): Promise<PopularArticle[]> {
    try {
      const { data, error } = await supabaseClient
        .from('articles')
        .select('id, title, views_count, published_at, created_at, excerpt, content, thumbnail_url')
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
      // 関連テーブルからカテゴリーを取得し、記事数を集計
      const { data, error } = await supabaseClient
        .from('article_categories')
        .select(`
          id,
          name,
          article_category_relations!inner(
            article_id,
            articles!inner(status)
          )
        `);

      if (error) throw error;

      // カテゴリーごとの記事数を集計（公開記事のみ）
      const categories = data?.map((category: any) => {
        const publishedCount = category.article_category_relations?.filter(
          (relation: any) => relation.articles?.status === 'PUBLISHED'
        ).length || 0;
        
        return {
          name: category.name,
          count: publishedCount
        };
      }).filter((cat: ArticleCategory) => cat.count > 0)
        .sort((a: ArticleCategory, b: ArticleCategory) => b.count - a.count) || [];
      
      console.log('取得したカテゴリー:', categories);
      return categories;
    } catch (error) {
      console.error('カテゴリー取得エラー:', error);
      return [];
    }
  },

  async getTags(): Promise<ArticleTag[]> {
    try {
      // 関連テーブルからタグを取得し、記事数を集計
      const { data, error } = await supabaseClient
        .from('article_tags')
        .select(`
          id,
          name,
          article_tag_relations!inner(
            article_id,
            articles!inner(status)
          )
        `);

      if (error) throw error;

      // タグごとの記事数を集計（公開記事のみ）
      const tags = data?.map((tag: any) => {
        const publishedCount = tag.article_tag_relations?.filter(
          (relation: any) => relation.articles?.status === 'PUBLISHED'
        ).length || 0;
        
        return {
          name: tag.name,
          count: publishedCount
        };
      }).filter((tag: ArticleTag) => tag.count > 0)
        .sort((a: ArticleTag, b: ArticleTag) => b.count - a.count)
        .slice(0, 20) || [];
      
      console.log('取得したタグ:', tags);
      return tags;
    } catch (error) {
      console.error('タグ取得エラー:', error);
      return [];
    }
  },

  async getArticles(limit: number = 20, offset: number = 0): Promise<Article[]> {
    try {
      const { data: articles, error } = await supabaseClient
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          content,
          thumbnail_url,
          published_at,
          created_at,
          article_category_relations(
            article_categories(name)
          ),
          article_tag_relations(
            article_tags(name)
          )
        `)
        .eq('status', 'PUBLISHED')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // データを変換してカテゴリーとタグを配列形式に整形
      const transformedArticles = articles?.map((article: any) => ({
        ...article,
        categories: article.article_category_relations?.map((rel: any) => rel.article_categories?.name).filter(Boolean) || [],
        tags: article.article_tag_relations?.map((rel: any) => rel.article_tags?.name).filter(Boolean) || []
      })) || [];

      return transformedArticles;
    } catch (error) {
      console.error('記事取得エラー:', error);
      return [];
    }
  },

  async getArticlesWithPagination(limit: number = 20, offset: number = 0): Promise<{
    articles: Article[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      // 総記事数を取得
      const { count, error: countError } = await supabaseClient
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PUBLISHED');

      if (countError) throw countError;

      // 記事データを取得
      const articles = await this.getArticles(limit, offset);

      return {
        articles,
        hasMore: offset + limit < (count || 0),
        total: count || 0
      };
    } catch (error) {
      console.error('ページネーション記事取得エラー:', error);
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
      // 人気記事・カテゴリ・タグを1回のPromise.allで効率的に取得
      const [popularArticles, categories, tags] = await Promise.all([
        this.getPopularArticles(5),
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

  async getRelatedArticles(currentArticleId: string, limit: number = 6): Promise<Article[]> {
    try {
      // より効率的に関連記事を取得
      const { data: relatedArticles, error } = await supabaseClient
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          content,
          thumbnail_url,
          published_at,
          created_at,
          article_category_relations(
            article_categories(name)
          ),
          article_tag_relations(
            article_tags(name)
          )
        `)
        .eq('status', 'PUBLISHED')
        .neq('id', currentArticleId)
        .order('published_at', { ascending: false })
        .limit(limit * 2); // 関連性フィルタリングのため多めに取得

      if (error) throw error;

      // データを変換
      const transformedArticles = relatedArticles?.map((article: any) => ({
        ...article,
        categories: article.article_category_relations?.map((rel: any) => rel.article_categories?.name).filter(Boolean) || [],
        tags: article.article_tag_relations?.map((rel: any) => rel.article_tags?.name).filter(Boolean) || []
      })) || [];

      // 必要な数だけ返す（関連性計算を省略してパフォーマンス向上）
      return transformedArticles.slice(0, limit);
    } catch (error) {
      console.error('関連記事取得エラー:', error);
      return this.getArticles(limit);
    }
  }
});