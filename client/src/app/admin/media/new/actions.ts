'use server';

import { redirect } from 'next/navigation';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

export async function saveArticle(formData: FormData) {
  const title = formData.get('title') as string;
  const categoryId = formData.get('categoryId') as string;
  const tags = formData.get('tags') as string;
  const content = formData.get('content') as string;
  const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
  const thumbnail = formData.get('thumbnail') as File;

  if (!title.trim()) {
    throw new Error('タイトルを入力してください');
  }

  const supabase = createServerAdminClient();

  try {
    // サムネイルをアップロード（ある場合）
    let thumbnailUrl = '';
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

    // 記事を作成
    const { data: article, error: createError } = await supabase
      .from('articles')
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
      throw new Error(`記事の作成に失敗しました: ${createError.message}`);
    }

    // カテゴリを関連付け
    if (categoryId) {
      const { error: categoryError } = await supabase
        .from('article_category_relations')
        .upsert({ article_id: article.id, category_id: categoryId });

      if (categoryError) {
        throw new Error(`カテゴリの関連付けに失敗しました: ${categoryError.message}`);
      }
    }

    // タグを処理
    if (tags.trim()) {
      const tagNames = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      for (const tagName of tagNames) {
        // 既存のタグを検索
        const { data: existingTag } = await supabase
          .from('article_tags')
          .select('*')
          .eq('name', tagName)
          .single();

        let tagId;
        if (existingTag) {
          tagId = existingTag.id;
        } else {
          // 新しいタグを作成
          const { data: newTag, error: tagError } = await supabase
            .from('article_tags')
            .insert({ name: tagName })
            .select()
            .single();

          if (tagError) {
            throw new Error(`タグの作成に失敗しました: ${tagError.message}`);
          }
          tagId = newTag.id;
        }

        // タグを関連付け
        const { error: tagRelationError } = await supabase
          .from('article_tag_relations')
          .upsert({ article_id: article.id, tag_id: tagId });

        if (tagRelationError) {
          throw new Error(`タグの関連付けに失敗しました: ${tagRelationError.message}`);
        }
      }
    }

    redirect('/admin/media');
  } catch (error) {
    console.error('記事の保存に失敗:', error);
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
      console.error('画像アップロードエラー:', uploadError);
      return { success: false, error: 'ファイルのアップロードに失敗しました' };
    }

    const { data: urlData } = supabase.storage
      .from('blog')
      .getPublicUrl(data.path);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('画像アップロードエラー:', error);
    return { success: false, error: 'サーバーエラーが発生しました' };
  }
}