import { createServerAdminClient } from '@/lib/supabase/server-admin';
import { createNoticeService } from './noticeService.common';

export type { PopularNotice, NoticeCategory, Notice } from './noticeService.common';

// 軽量化されたカテゴリ取得（お知らせ数は事前計算された値を使用）
async function getOptimizedCategories() {
  const supabase = createServerAdminClient();
  
  try {
    // カテゴリと公開お知らせ数を効率的に取得
    const { data, error } = await supabase
      .from('notice_categories')
      .select(`
        name,
        notice_category_relations!inner(
          notices!inner(
            id,
            status
          )
        )
      `)
      .eq('notice_category_relations.notices.status', 'PUBLISHED');

    if (error) throw error;

    // カテゴリ名でグループ化してお知らせ数をカウント
    const categoryMap = new Map<string, number>();
    
    data?.forEach((category: any) => {
      const name = category.name;
      if (!categoryMap.has(name)) {
        categoryMap.set(name, 0);
      }
      categoryMap.set(name, categoryMap.get(name)! + 1);
    });

    return Array.from(categoryMap.entries())
      .map(([name, count]) => ({ name, count }))
      .filter(cat => cat.count > 0)
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('カテゴリー取得エラー:', error);
    return [];
  }
}

// サーバーサイド用の最適化されたnoticeService
const baseService = createNoticeService(createServerAdminClient());

export const noticeService = {
  ...baseService,
  getCategories: getOptimizedCategories,
  
  // サイドバーデータを最適化
  async getSidebarData() {
    try {
      const [popularNotices, categories] = await Promise.all([
        baseService.getPopularNotices(5),
        getOptimizedCategories()
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
  }
};