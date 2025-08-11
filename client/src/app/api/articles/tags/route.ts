import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'タグ名が必要です' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const adminSupabase = createAdminClient();

    // 既存のタグを検索
    const { data: existingTag } = await supabase
      .from('article_tags')
      .select('*')
      .eq('name', name.trim())
      .single();

    if (existingTag) {
      return NextResponse.json(existingTag);
    }

    // 新しいタグを作成
    const { data, error } = await adminSupabase
      .from('article_tags')
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      console.error('タグ作成エラー:', error);
      return NextResponse.json(
        { error: 'タグの作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('タグ作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}

// タグを記事に関連付け
export async function PUT(request: NextRequest) {
  try {
    const { articleId, tagId } = await request.json();

    if (!articleId || !tagId) {
      return NextResponse.json(
        { error: '記事IDとタグIDが必要です' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('article_tag_relations')
      .upsert({ article_id: articleId, tag_id: tagId });

    if (error) {
      console.error('タグ関連付けエラー:', error);
      return NextResponse.json(
        { error: 'タグの関連付けに失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('タグ関連付けエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}