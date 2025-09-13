'use server';

import { createAdminClient } from '@/lib/supabase/admin';

/**
 * 記事の訪問数をインクリメント
 */
export async function incrementArticleViewCount(articleId: string): Promise<{ success: boolean; views_count?: number; error?: string }> {
  try {
    if (!articleId || typeof articleId !== 'string') {
      return { success: false, error: 'Invalid article ID' };
    }

    const supabase = createAdminClient();

    // 記事の現在のviews_countを取得してインクリメント
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('views_count')
      .eq('id', articleId)
      .eq('status', 'PUBLISHED') // 公開済みの記事のみ
      .single();

    if (fetchError) {
      if (process.env.NODE_ENV === 'development') console.error('記事の取得に失敗:', fetchError);
      return { success: false, error: 'Article not found' };
    }

    if (!article) {
      return { success: false, error: 'Article not found' };
    }

    const currentCount = (article.views_count as number) || 0;
    const newCount = currentCount + 1;

    // views_countをインクリメント
    const { error: updateError } = await supabase
      .from('articles')
      .update({ 
        views_count: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', articleId);

    if (updateError) {
      if (process.env.NODE_ENV === 'development') console.error('訪問数の更新に失敗:', updateError);
      return { success: false, error: 'Failed to update view count' };
    }

    return { 
      success: true, 
      views_count: newCount 
    };

  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('サーバーアクションエラー:', error);
    return { 
      success: false, 
      error: 'Internal server error' 
    };
  }
}