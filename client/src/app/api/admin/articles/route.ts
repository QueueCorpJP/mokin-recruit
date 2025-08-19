import { NextRequest, NextResponse } from 'next/server';
import { createServerAdminClient } from '@/lib/supabase/server-admin';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Article Creation API Started ===');
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const categoryId = formData.get('categoryId') as string;
    const tags = formData.get('tags') as string;
    const content = formData.get('content') as string;
    const status = formData.get('status') as 'DRAFT' | 'PUBLISHED';
    const thumbnail = formData.get('thumbnail') as File;

    console.log('Received data:', {
      title: title?.substring(0, 50) + '...',
      categoryId,
      tags,
      contentLength: content?.length || 0,
      status,
      hasThumbnail: !!thumbnail && thumbnail.size > 0
    });

    if (!title.trim()) {
      return NextResponse.json(
        { error: 'タイトルを入力してください' },
        { status: 400 }
      );
    }

    const supabase = createServerAdminClient();
    console.log('Supabase client created');

    // サムネイルをアップロード（ある場合）
    let thumbnailUrl = '';
    if (thumbnail && thumbnail.size > 0) {
      const fileExtension = thumbnail.name.split('.').pop() || 'jpg';
      
      // ファイル名をサニタイズ
      const sanitizedFilename = thumbnail.name
        .replace(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .replace(/[-]{2,}/g, '-')
        .replace(/^-+|-+$/g, '') || `image-${Date.now()}.${fileExtension}`;
      
      const finalPath = `thumbnails/${sanitizedFilename}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('articles')
        .upload(finalPath, thumbnail);

      if (uploadError) {
        return NextResponse.json(
          { error: `ファイルのアップロードに失敗しました: ${uploadError.message}` },
          { status: 500 }
        );
      }

      const { data: urlData } = supabase.storage
        .from('articles')
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

    // 記事を作成
    const { data: article, error: createError } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        content, // HTMLコンテンツをそのまま保存
        status,
        thumbnail_url: thumbnailUrl,
        excerpt: content.replace(/<[^>]*>/g, '').substring(0, 200),
        published_at: status === 'PUBLISHED' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (createError) {
      console.error('記事作成エラーの詳細:', createError);
      return NextResponse.json(
        { error: `記事の作成に失敗しました: ${createError.message}` },
        { status: 500 }
      );
    }

    // カテゴリを関連付け
    if (categoryId) {
      const { error: categoryError } = await supabase
        .from('article_category_relations')
        .upsert({ article_id: article.id, category_id: categoryId });

      if (categoryError) {
        console.error('カテゴリの関連付けに失敗:', categoryError);
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
            console.error('タグの作成に失敗:', tagError);
            continue;
          }
          tagId = newTag.id;
        }

        // タグを関連付け
        const { error: tagRelationError } = await supabase
          .from('article_tag_relations')
          .upsert({ article_id: article.id, tag_id: tagId });

        if (tagRelationError) {
          console.error('タグの関連付けに失敗:', tagRelationError);
        }
      }
    }

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('記事の保存に失敗:', error);
    return NextResponse.json(
      { error: '記事の保存に失敗しました' },
      { status: 500 }
    );
  }
}