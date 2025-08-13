'use client';

import { useEffect } from 'react';
import { incrementArticleViewCount } from '@/lib/actions/article-views';

interface ArticleViewTrackerProps {
  articleId: string;
}

/**
 * 記事の訪問数を追跡するクライアントコンポーネント
 * セッションストレージを使用して同一セッション内での重複カウントを防ぐ
 */
export function ArticleViewTracker({ articleId }: ArticleViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        if (!articleId) return;

        // セッションストレージをチェックして、同じセッション内で既に訪問したかを確認
        const viewedArticlesKey = 'viewedArticles';
        const viewedArticles = JSON.parse(
          sessionStorage.getItem(viewedArticlesKey) || '[]'
        ) as string[];

        if (viewedArticles.includes(articleId)) {
          return; // 既に訪問済みの場合はカウントしない
        }

        // サーバーアクションを呼び出して訪問数をインクリメント
        const result = await incrementArticleViewCount(articleId);
        
        if (result.success) {
          // セッションストレージに記録
          viewedArticles.push(articleId);
          sessionStorage.setItem(viewedArticlesKey, JSON.stringify(viewedArticles));
        } else {
          console.warn('訪問数の更新に失敗:', result.error);
        }
      } catch (error) {
        console.error('訪問数追跡エラー:', error);
      }
    };

    // 少し遅延させてページ読み込み完了後に実行
    const timeoutId = setTimeout(trackView, 1000);

    return () => clearTimeout(timeoutId);
  }, [articleId]);

  // このコンポーネントは何もレンダリングしない
  return null;
}