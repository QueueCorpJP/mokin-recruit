import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { articleId, categoryId } = await request.json();

    if (!articleId || !categoryId) {
      return NextResponse.json(
        { error: '記事IDとカテゴリIDが必要です' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('article_category_relations')
      .upsert({ article_id: articleId, category_id: categoryId });

    if (error) {
      console.error('カテゴリ関連付けエラー:', error);
      return NextResponse.json(
        { error: 'カテゴリの関連付けに失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('カテゴリ関連付けエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}