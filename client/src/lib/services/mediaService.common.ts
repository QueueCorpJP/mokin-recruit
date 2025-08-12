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

  async getArticles(limit: number = 20): Promise<Article[]> {
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
        .limit(limit);

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
  }
});