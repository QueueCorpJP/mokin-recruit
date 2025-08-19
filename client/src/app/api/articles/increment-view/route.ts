import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json();
    
    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // 記事の現在のviews_countを取得してインクリメント
    const { data: article, error: fetchError } = await supabase
      .from('articles')
      .select('views_count')
      .eq('id', articleId)
      .single();

    if (fetchError) {
      console.error('記事の取得に失敗:', fetchError);
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    const currentCount = article?.views_count || 0;
    const newCount = currentCount + 1;

    // views_countをインクリメント
    const { error: updateError } = await supabase
      .from('articles')
      .update({ views_count: newCount })
      .eq('id', articleId);

    if (updateError) {
      console.error('訪問数の更新に失敗:', updateError);
      return NextResponse.json(
        { error: 'Failed to update view count' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      views_count: newCount 
    });

  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}