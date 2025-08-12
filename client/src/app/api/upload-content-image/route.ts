import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: 'ファイルが選択されていません' });
    }

    const supabase = createServerAdminClient();

    const fileExtension = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const sanitizedFilename = file.name
      .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/[-]{2,}/g, '-')
      .replace(/^-+|-+$/g, '') || `content-image-${timestamp}.${fileExtension}`;
    
    const finalPath = `content/images/${timestamp}-${sanitizedFilename}`;
    
    const { data, error: uploadError } = await supabase.storage
      .from('blog')
      .upload(finalPath, file);

    if (uploadError) {
      console.error('画像アップロードエラー:', uploadError);
      return NextResponse.json({ success: false, error: 'ファイルのアップロードに失敗しました' });
    }

    const { data: urlData } = supabase.storage
      .from('blog')
      .getPublicUrl(data.path);

    return NextResponse.json({ 
      success: true, 
      url: urlData.publicUrl,
      imagePath: data.path,
      timestamp: timestamp
    });
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    return NextResponse.json({ success: false, error: 'サーバーエラーが発生しました' });
  }
}