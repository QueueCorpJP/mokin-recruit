'use server';

import { redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

// Supabase URLを変数形式に変換する関数
function convertUrlsToVariables(content: string): string {
  if (!content) return content;
  
  // src属性内のSupabase URLを変数形式に変換
  const supabaseUrlPattern = new RegExp(
    `src=["']?${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/content/images/([^"'>\\s]+)["']?`,
    'g'
  );
  
  let processedContent = content.replace(supabaseUrlPattern, (match, filename) => {
    // ファイル名からタイムスタンプを除去
    const cleanFilename = filename.replace(/^\d+-/, '');
    return `src="{{image:${cleanFilename}}}"`;
  });
  
  // 単体のSupabase URLも変数形式に変換
  const singleUrlPattern = new RegExp(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/blog/content/images/([^"'>\\s]+)`,
    'g'
  );
  
  processedContent = processedContent.replace(singleUrlPattern, (match, filename) => {
    // ファイル名からタイムスタンプを除去
    const cleanFilename = filename.replace(/^\d+-/, '');
    return `{{image:${cleanFilename}}}`;
  });
  
  return processedContent;
}

export async function saveNotice(formData: FormData) {
  const noticeId = formData.get('id') as string | null;
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const rawContent = formData.get('content') as string;
  const content = convertUrlsToVariables(rawContent);
  const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
  const thumbnail = formData.get('thumbnail') as File;
  const existingThumbnailUrl = formData.get('thumbnail_url') as string | null;

  if (!title.trim()) {
    throw new Error('タイトルを入力してください');
  }

  const supabase = createServerAdminClient();

  try {
    // サムネイルをアップロード（ある場合）
    let thumbnailUrl = existingThumbnailUrl || '';
    if (thumbnail && thumbnail.size > 0) {
      const fileExtension = thumbnail.name.split('.').pop() || 'jpg';
      const fileName = `thumbnails/${Date.now()}-thumbnail.${fileExtension}`;
      
      // ファイル名をサニタイズ
      const sanitizedFilename = thumbnail.name
        .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/[-]{2,}/g, '-')
        .replace(/^-+|-+$/g, '') || `image-${Date.now()}.${fileExtension}`;
      
      const finalPath = `thumbnails/${sanitizedFilename}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('blog')
        .upload(finalPath, thumbnail);

      if (uploadError) {
        throw new Error(`ファイルのアップロードに失敗しました: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('blog')
        .getPublicUrl(data.path);

      thumbnailUrl = urlData.publicUrl;
    }

    // スラッグを生成
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();

    // コンテンツ内の画像情報を抽出
    const contentImages = extractImagesFromContent(content);

    let notice;
    
    if (noticeId) {
      // 既存お知らせを更新
      const { data, error: updateError } = await supabase
        .from('notices')
        .update({
          title,
          content,
          status,
          thumbnail_url: thumbnailUrl,
          excerpt: content.replace(/<[^>]*>/g, '').substring(0, 200),
          published_at: status === 'PUBLISHED' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
          content_images: contentImages
        })
        .eq('id', noticeId)
        .select()
        .single();

      if (updateError) {
        throw new Error(`お知らせの更新に失敗しました: ${updateError.message}`);
      }
      notice = data;
      
      // 既存のカテゴリの関連を削除
      await supabase
        .from('notice_category_relations')
        .delete()
        .eq('notice_id', noticeId);
    } else {
      // 新規お知らせを作成
      const { data, error: createError } = await supabase
        .from('notices')
        .insert({
          title,
          slug,
          content,
          status,
          thumbnail_url: thumbnailUrl,
          excerpt: content.replace(/<[^>]*>/g, '').substring(0, 200),
          published_at: status === 'PUBLISHED' ? new Date().toISOString() : null,
          content_images: contentImages
        })
        .select()
        .single();

      if (createError) {
        throw new Error(`お知らせの作成に失敗しました: ${createError.message}`);
      }
      notice = data;
    }

    // カテゴリを関連付け
    if (categoryId) {
      const { error: categoryError } = await supabase
        .from('notice_category_relations')
        .upsert({ notice_id: notice.id, category_id: categoryId });

      if (categoryError) {
        throw new Error(`カテゴリの関連付けに失敗しました: ${categoryError.message}`);
      }
    }

    redirect('/admin/notice');
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('お知らせの保存に失敗:', error);
    throw error;
  }
}

interface ContentImage {
  url: string;
  order: number;
  position: number;
  filename: string;
  uploadedAt: string;
}

function extractImagesFromContent(content: string): ContentImage[] {
  const images: ContentImage[] = [];
  const imgRegex = /<img[^>]+src="([^"]*)"[^>]*data-image-order="([^"]*)"[^>]*data-image-position="([^"]*)"[^>]*>/g;
  
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    const [, url, order, position] = match;
    const filename = url.split('/').pop() || '';
    
    images.push({
      url,
      order: parseInt(order),
      position: parseInt(position),
      filename,
      uploadedAt: new Date().toISOString()
    });
  }
  
  return images.sort((a, b) => a.order - b.order);
}

export async function uploadImageToSupabase(formData: FormData): Promise<{success: boolean, url?: string, error?: string}> {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'ファイルが選択されていません' };
  }

  const supabase = createServerAdminClient();

  try {
    // ファイル名をサニタイズ
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const sanitizedFilename = file.name
      .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .replace(/[-]{2,}/g, '-')
      .replace(/^-+|-+$/g, '') || `content-image-${Date.now()}.${fileExtension}`;
    
    const finalPath = `content/${sanitizedFilename}`;
    
    const { data, error: uploadError } = await supabase.storage
      .from('blog')
      .upload(finalPath, file);

    if (uploadError) {
      if (process.env.NODE_ENV === 'development') console.error('画像アップロードエラー:', uploadError);
      return { success: false, error: 'ファイルのアップロードに失敗しました' };
    }

    const { data: urlData } = supabase.storage
      .from('blog')
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('画像アップロードエラー:', error);
    return { success: false, error: 'サーバーエラーが発生しました' };
  }
}