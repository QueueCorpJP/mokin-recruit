import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { createMediaService } from './mediaService.common';

export type { PopularArticle, ArticleCategory, ArticleTag, Article } from './mediaService.common';

// 軽量化されたカテゴリ取得（記事数は事前計算された値を使用）
async function getOptimizedCategories() {
  const supabase = getSupabaseAdminClient();
  
  try {
    // カテゴリと公開記事数を効率的に取得
    const { data, error } = await supabase
      .from('article_categories')
      .select(`
        name,
        article_category_relations!inner(
          articles!inner(
            id,
            status
          )
        )
      `)
      .eq('article_category_relations.articles.status', 'PUBLISHED');

    if (error) throw error;

    // カテゴリ名でグループ化して記事数をカウント
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

// 軽量化されたタグ取得
async function getOptimizedTags() {
  const supabase = getSupabaseAdminClient();
  
  try {
    // タグと公開記事数を効率的に取得
    const { data, error } = await supabase
      .from('article_tags')
      .select(`
        name,
        article_tag_relations!inner(
          articles!inner(
            id,
            status
          )
        )
      `)
      .eq('article_tag_relations.articles.status', 'PUBLISHED');

    if (error) throw error;

    // タグ名でグループ化して記事数をカウント
    const tagMap = new Map<string, number>();
    
    data?.forEach((tag: any) => {
      const name = tag.name;
      if (!tagMap.has(name)) {
        tagMap.set(name, 0);
      }
      tagMap.set(name, tagMap.get(name)! + 1);
    });

    return Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .filter(tag => tag.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  } catch (error) {
    console.error('タグ取得エラー:', error);
    return [];
  }
}

// サーバーサイド用の最適化されたmediaService
const baseService = createMediaService(getSupabaseAdminClient());

export const mediaService = {
  ...baseService,
  getCategories: getOptimizedCategories,
  getTags: getOptimizedTags,
  
  // サイドバーデータを最適化
  async getSidebarData() {
    try {
      const [popularArticles, categories, tags] = await Promise.all([
        baseService.getPopularArticles(5),
        getOptimizedCategories(),
        getOptimizedTags()
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
  }
};