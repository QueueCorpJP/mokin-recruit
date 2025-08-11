import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { title, content, status, thumbnail_url, excerpt } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'タイトルを入力してください' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();
    
    // スラッグを生成
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();

    const { data, error } = await adminSupabase
      .from('articles')
      .insert({
        title,
        slug,
        content: JSON.stringify(content),
        status,
        thumbnail_url,
        excerpt,
        published_at: status === 'PUBLISHED' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('記事の作成に失敗:', error);
      return NextResponse.json(
        { error: '記事の作成に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('記事作成エラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}