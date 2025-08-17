import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const articleId = params.id;
    
    if (!articleId) {
      return NextResponse.json(
        { error: '記事IDが指定されていません' },
        { status: 400 }
      );
    }

    const supabase = createServerAdminClient();

    // 記事を削除（関連するレコードはCASCADEで自動削除される）
    const { error: deleteError } = await supabase
      .from('articles')
      .delete()
      .eq('id', articleId);

    if (deleteError) {
      console.error('記事削除エラー:', deleteError);
      return NextResponse.json(
        { error: `記事の削除に失敗しました: ${deleteError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('記事の削除に失敗:', error);
    return NextResponse.json(
      { error: '記事の削除に失敗しました' },
      { status: 500 }
    );
  }
}