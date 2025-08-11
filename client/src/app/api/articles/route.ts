import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, status, excerpt, thumbnail_url } = body;
    
    if (!title || !content || !status) {
      return NextResponse.json(
        { error: 'タイトル、コンテンツ、ステータスは必須です' },
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
        content,
        excerpt,
        thumbnail_url,
        status,
        published_at: status === 'PUBLISHED' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('記事作成エラー:', error);
      return NextResponse.json(
        { error: `記事の作成に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ article: data });
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: '記事の作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const adminSupabase = createAdminClient();
    
    const { data, error } = await adminSupabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: `記事の取得に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ articles: data });
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: '記事の取得に失敗しました' },
      { status: 500 }
    );
  }
}