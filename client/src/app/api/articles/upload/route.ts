import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'ファイルが選択されていません' },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient();

    // ファイル名をサニタイズ
    const sanitizedFilename = file.name
      .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/[-]{2,}/g, '-')
      .replace(/^-+|-+$/g, '') || `image-${Date.now()}.jpg`;

    const finalPath = path ? `${path}/${sanitizedFilename}` : sanitizedFilename;

    const { data, error } = await adminSupabase.storage
      .from('articles')
      .upload(finalPath, file);

    if (error) {
      console.error('ファイルアップロードエラー:', error);
      return NextResponse.json(
        { error: 'ファイルのアップロードに失敗しました' },
        { status: 500 }
      );
    }

    const { data: urlData } = adminSupabase.storage
      .from('articles')
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('ファイルアップロードエラー:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}