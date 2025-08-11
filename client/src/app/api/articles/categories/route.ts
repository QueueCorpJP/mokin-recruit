import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    const adminSupabase = createAdminClient();
    
    const { data, error } = await adminSupabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (error) {
      return NextResponse.json(
        { error: `カテゴリの取得に失敗しました: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: data || [] });
  } catch (error) {
    console.error('API エラー:', error);
    return NextResponse.json(
      { error: 'カテゴリの取得に失敗しました' },
      { status: 500 }
    );
  }
}