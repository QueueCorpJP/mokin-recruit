import { createClient } from '@/lib/supabase/client';

export interface Article {
  id?: string;
  title: string;
  slug?: string;
  content: any; // JSONBでリッチコンテンツを保存
  excerpt?: string;
  thumbnail_url?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  views_count?: number;
  meta_title?: string;
  meta_description?: string;
  category?: ArticleCategory;
  categories?: ArticleCategory[];
  tags?: ArticleTag[];
}

export interface ArticleCategory {
  id?: string;
  name: string;
  description?: string;
}

export interface ArticleTag {
  id?: string;
  name: string;
}

class ArticleService {
  private supabase = createClient();

  // contentフィールドの安全な解析
  private parseContent(content: any): any {
    if (!content) return content;
    
    if (typeof content === 'string') {
      // HTMLコンテンツの場合はそのまま返す
      if (content.startsWith('<') || content.includes('<p>') || content.includes('<div>')) {
        return content;
      }
      
      // JSONコンテンツの場合は解析を試行
      try {
        return JSON.parse(content);
      } catch (error) {
        // JSON解析に失敗した場合はそのまま返す
        return content;
      }
    }
    
    return content;
  }

  // スラッグを生成
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 特殊文字除去
      .replace(/[\s_-]+/g, '-') // スペースをハイフンに
      .replace(/^-+|-+$/g, '') // 前後のハイフン除去
      + '-' + Date.now(); // 一意性確保
  }

  // ファイル名をサニタイズ
  private sanitizeFilename(filename: string): string {
    // 日本語文字、スペース、特殊文字を除去またはエンコード
    const sanitized = filename
      .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '') // ひらがな、カタカナ、漢字を除去
      .replace(/[^a-zA-Z0-9._-]/g, '-') // 英数字と一部記号以外をハイフンに置換
      .replace(/[-]{2,}/g, '-') // 連続するハイフンを1つにまとめる
      .replace(/^-+|-+$/g, ''); // 前後のハイフンを除去
    
    // ファイル名が空になった場合はタイムスタンプを使用
    if (!sanitized || sanitized === '') {
      const ext = filename.split('.').pop() || 'jpg';
      return `image-${Date.now()}.${ext}`;
    }
    
    return sanitized;
  }

  // 記事を作成（サーバーサイドのAPIを呼び出し）
  async createArticle(articleData: Article): Promise<Article> {
    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData)
    });

    if (!response.ok) {
      throw new Error(`記事の作成に失敗しました: ${response.statusText}`);
    }

    return response.json();
  }

  // 記事を更新（サーバーサイドのAPIを呼び出し）
  async updateArticle(id: string, articleData: Partial<Article>): Promise<Article> {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData)
    });

    if (!response.ok) {
      throw new Error(`記事の更新に失敗しました: ${response.statusText}`);
    }

    return response.json();
  }

  // 記事を取得
  async getArticle(id: string): Promise<Article | null> {
    const { data, error } = await this.supabase
      .from('articles')
      .select(`
        *,
        article_category_relations (
          article_categories (*)
        ),
        article_tag_relations (
          article_tags (*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`記事の取得に失敗しました: ${error.message}`);
    }

    return {
      ...data,
      content: this.parseContent(data.content)
    } as unknown as Article;
  }

  // 記事一覧を取得
  async getArticles(options: {
    status?: Article['status'];
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): Promise<{ articles: Article[]; total: number }> {
    let query = this.supabase
      .from('articles')
      .select(`
        *,
        article_category_relations (
          article_categories (
            id,
            name,
            description
          )
        )
      `, { count: 'exact' })
      .order('updated_at', { ascending: false });

    if (options.status) {
      query = query.eq('status', options.status);
    }

    if (options.search) {
      query = query.ilike('title', `%${options.search}%`);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      throw new Error(`記事一覧の取得に失敗しました: ${error.message}`);
    }

    return {
      articles: data.map((article: any) => ({
        ...article,
        content: this.parseContent(article.content),
        category: article.article_category_relations?.[0]?.article_categories || null,
        categories: article.article_category_relations?.map((rel: any) => rel.article_categories) || []
      } as Article)),
      total: count || 0
    };
  }

  // 記事を削除（サーバーサイドのAPIを呼び出し）
  async deleteArticle(id: string): Promise<void> {
    const response = await fetch(`/api/admin/articles/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error(`記事の削除に失敗しました: ${response.statusText}`);
    }
  }

  // カテゴリを取得
  async getCategories(): Promise<ArticleCategory[]> {
    const { data, error } = await this.supabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`カテゴリの取得に失敗しました: ${error.message}`);
    }

    return (data || []) as unknown as ArticleCategory[];
  }

  // カテゴリを作成
  async createCategory(name: string, description?: string): Promise<ArticleCategory> {
    const { data, error } = await this.supabase
      .from('article_categories')
      .insert([{ name, description }])
      .select()
      .single();

    if (error) {
      throw new Error(`カテゴリの作成に失敗しました: ${error.message}`);
    }

    return data as unknown as ArticleCategory;
  }

  // カテゴリを更新
  async updateCategory(id: string, name: string, description?: string): Promise<ArticleCategory> {
    const { data, error } = await this.supabase
      .from('article_categories')
      .update({ name, description })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`カテゴリの更新に失敗しました: ${error.message}`);
    }

    return data as unknown as ArticleCategory;
  }

  // カテゴリを削除
  async deleteCategory(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('article_categories')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`カテゴリの削除に失敗しました: ${error.message}`);
    }
  }

  // カテゴリの記事数を取得
  async getCategoryArticleCount(categoryId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('article_category_relations')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', categoryId);

    if (error) {
      throw new Error(`カテゴリの記事数取得に失敗しました: ${error.message}`);
    }

    return count || 0;
  }

  // タグを取得
  async getTags(): Promise<ArticleTag[]> {
    const { data, error } = await this.supabase
      .from('article_tags')
      .select('*')
      .order('name');

    if (error) {
      throw new Error(`タグの取得に失敗しました: ${error.message}`);
    }

    return (data || []) as unknown as ArticleTag[];
  }

  // タグを作成
  async createTag(name: string): Promise<ArticleTag> {
    const { data, error } = await this.supabase
      .from('article_tags')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      throw new Error(`タグの作成に失敗しました: ${error.message}`);
    }

    return data as unknown as ArticleTag;
  }

  // タグを更新
  async updateTag(id: string, name: string): Promise<ArticleTag> {
    const { data, error } = await this.supabase
      .from('article_tags')
      .update({ name })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`タグの更新に失敗しました: ${error.message}`);
    }

    return data as unknown as ArticleTag;
  }

  // タグを削除
  async deleteTag(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('article_tags')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`タグの削除に失敗しました: ${error.message}`);
    }
  }

  // タグの記事数を取得
  async getTagArticleCount(tagId: string): Promise<number> {
    const { count, error } = await this.supabase
      .from('article_tag_relations')
      .select('*', { count: 'exact', head: true })
      .eq('tag_id', tagId);

    if (error) {
      throw new Error(`タグの記事数取得に失敗しました: ${error.message}`);
    }

    return count || 0;
  }

  // タグを作成または取得（サーバーサイドのAPIを呼び出し）
  async createOrGetTag(name: string): Promise<ArticleTag> {
    const response = await fetch('/api/articles/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name })
    });

    if (!response.ok) {
      throw new Error(`タグの作成に失敗しました: ${response.statusText}`);
    }

    return response.json();
  }

  // 記事にカテゴリを関連付け（サーバーサイドのAPIを呼び出し）
  async associateCategory(articleId: string, categoryId: string): Promise<void> {
    const response = await fetch('/api/articles/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article_id: articleId, category_id: categoryId })
    });

    if (!response.ok) {
      throw new Error(`カテゴリの関連付けに失敗しました: ${response.statusText}`);
    }
  }

  // 記事にタグを関連付け（サーバーサイドのAPIを呼び出し）
  async associateTag(articleId: string, tagId: string): Promise<void> {
    const response = await fetch('/api/articles/tags', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ article_id: articleId, tag_id: tagId })
    });

    if (!response.ok) {
      throw new Error(`タグの関連付けに失敗しました: ${response.statusText}`);
    }
  }

  // ファイルをアップロード（サーバーサイドのAPIを呼び出し）
  async uploadFile(file: File, path: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const response = await fetch('/api/articles/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`ファイルのアップロードに失敗しました: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url;
  }
}

export const articleService = new ArticleService();