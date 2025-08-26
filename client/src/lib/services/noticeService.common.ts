export interface PopularNotice {
  id: string;
  title: string;
  views_count: number;
  published_at: string;
  created_at: string;
  excerpt?: string;
  content?: any;
  thumbnail_url?: string;
}

export interface NoticeCategory {
  name: string;
  count: number;
}

export interface Notice {
  id: string;
  title: string;
  excerpt: string;
  content: any; // jsonb型
  thumbnail_url: string;
  published_at: string;
  created_at: string;
  categories: string[];
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
}

// 共通のデータ取得ロジック
export const createNoticeService = (supabaseClient: any) => ({
  async getPopularNotices(limit: number = 5): Promise<PopularNotice[]> {
    try {
      const { data, error } = await supabaseClient
        .from('notices')
        .select('id, title, views_count, published_at, created_at, excerpt, content, thumbnail_url')
        .eq('status', 'PUBLISHED')
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('人気お知らせの取得エラー:', error);
      return [];
    }
  },

  async getCategories(): Promise<NoticeCategory[]> {
    try {
      // 関連テーブルからカテゴリーを取得し、お知らせ数を集計
      const { data, error } = await supabaseClient
        .from('notice_categories')
        .select(`
          id,
          name,
          notice_category_relations!inner(
            notice_id,
            notices!inner(status)
          )
        `);

      if (error) throw error;

      // カテゴリーごとのお知らせ数を集計（公開お知らせのみ）
      const categories = data?.map((category: any) => {
        const publishedCount = category.notice_category_relations?.filter(
          (relation: any) => relation.notices?.status === 'PUBLISHED'
        ).length || 0;
        
        return {
          name: category.name,
          count: publishedCount
        };
      }).filter((cat: NoticeCategory) => cat.count > 0)
        .sort((a: NoticeCategory, b: NoticeCategory) => b.count - a.count) || [];
      
      console.log('取得したカテゴリー:', categories);
      return categories;
    } catch (error) {
      console.error('カテゴリー取得エラー:', error);
      return [];
    }
  },

  async getNotices(limit: number = 20, offset: number = 0): Promise<Notice[]> {
    try {
      const { data: notices, error } = await supabaseClient
        .from('notices')
        .select(`
          id,
          title,
          excerpt,
          content,
          thumbnail_url,
          published_at,
          created_at,
          notice_category_relations(
            notice_categories(name)
          )
        `)
        .eq('status', 'PUBLISHED')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      // データを変換してカテゴリーを配列形式に整形
      const transformedNotices = notices?.map((notice: any) => ({
        ...notice,
        categories: notice.notice_category_relations?.map((rel: any) => rel.notice_categories?.name).filter(Boolean) || []
      })) || [];

      return transformedNotices;
    } catch (error) {
      console.error('お知らせ取得エラー:', error);
      return [];
    }
  },

  async getNotice(noticeId: string): Promise<Notice | null> {
    try {
      const { data: notice, error } = await supabaseClient
        .from('notices')
        .select(`
          id,
          title,
          excerpt,
          content,
          thumbnail_url,
          published_at,
          created_at,
          status,
          notice_category_relations(
            notice_categories(name)
          )
        `)
        .eq('id', noticeId)
        .single();

      if (error) throw error;
      if (!notice) return null;

      // データを変換してカテゴリーを配列形式に整形
      const transformedNotice = {
        ...notice,
        categories: notice.notice_category_relations?.map((rel: any) => rel.notice_categories?.name).filter(Boolean) || []
      };

      return transformedNotice;
    } catch (error) {
      console.error('お知らせ詳細取得エラー:', error);
      return null;
    }
  },

  async getNoticesWithPagination(limit: number = 20, offset: number = 0): Promise<{
    notices: Notice[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      // 総お知らせ数を取得
      const { count, error: countError } = await supabaseClient
        .from('notices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'PUBLISHED');

      if (countError) throw countError;

      // お知らせデータを取得
      const notices = await this.getNotices(limit, offset);

      return {
        notices,
        hasMore: offset + limit < (count || 0),
        total: count || 0
      };
    } catch (error) {
      console.error('ページネーションお知らせ取得エラー:', error);
      return {
        notices: [],
        hasMore: false,
        total: 0
      };
    }
  },

  async getSidebarData(): Promise<{
    popularNotices: PopularNotice[];
    categories: NoticeCategory[];
  }> {
    try {
      // 人気お知らせ・カテゴリを1回のPromise.allで効率的に取得
      const [popularNotices, categories] = await Promise.all([
        this.getPopularNotices(5),
        this.getCategories()
      ]);

      return {
        popularNotices,
        categories
      };
    } catch (error) {
      console.error('サイドバーデータ取得エラー:', error);
      return {
        popularNotices: [],
        categories: []
      };
    }
  },

  async getRelatedNotices(currentNoticeId: string, limit: number = 6): Promise<Notice[]> {
    try {
      // より効率的に関連お知らせを取得
      const { data: relatedNotices, error } = await supabaseClient
        .from('notices')
        .select(`
          id,
          title,
          excerpt,
          content,
          thumbnail_url,
          published_at,
          created_at,
          notice_category_relations(
            notice_categories(name)
          )
        `)
        .eq('status', 'PUBLISHED')
        .neq('id', currentNoticeId)
        .order('published_at', { ascending: false })
        .limit(limit * 2); // 関連性フィルタリングのため多めに取得

      if (error) throw error;

      // データを変換
      const transformedNotices = relatedNotices?.map((notice: any) => ({
        ...notice,
        categories: notice.notice_category_relations?.map((rel: any) => rel.notice_categories?.name).filter(Boolean) || []
      })) || [];

      // 必要な数だけ返す（関連性計算を省略してパフォーマンス向上）
      return transformedNotices.slice(0, limit);
    } catch (error) {
      console.error('関連お知らせ取得エラー:', error);
      return this.getNotices(limit);
    }
  }
});