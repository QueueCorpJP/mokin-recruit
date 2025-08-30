'use server';

import { createServerAdminClient } from '@/lib/supabase/server-admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface NoticeFormData {
  title: string;
  excerpt: string;
  content: any;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  thumbnail_url?: string;
  categories: string[];
}

// お知らせ作成
export async function createNotice(formData: NoticeFormData) {
  const supabase = createServerAdminClient();
  
  try {
    // スラッグを生成
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now();

    // お知らせを作成
    const { data: notice, error: noticeError } = await supabase
      .from('notices')
      .insert({
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        status: formData.status,
        thumbnail_url: formData.thumbnail_url || null,
        published_at: formData.status === 'PUBLISHED' ? new Date().toISOString() : null,
        views_count: 0
      })
      .select()
      .single();

    if (noticeError) throw noticeError;

    // カテゴリーとの関連を作成
    if (formData.categories && formData.categories.length > 0) {
      // カテゴリー名からIDを取得
      const { data: categories, error: categoryError } = await supabase
        .from('notice_categories')
        .select('id, name')
        .in('name', formData.categories);

      if (categoryError) throw categoryError;

      // 関連テーブルにデータを挿入
      if (categories && categories.length > 0) {
        const relations = categories.map(cat => ({
          notice_id: notice.id,
          category_id: cat.id
        }));

        const { error: relationError } = await supabase
          .from('notice_category_relations')
          .insert(relations);

        if (relationError) throw relationError;
      }
    }

    // キャッシュをクリア
    revalidatePath('/admin/notice');
    revalidatePath('/notice');
    
    return { success: true, data: notice };
  } catch (error) {
    console.error('お知らせ作成エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'お知らせの作成に失敗しました' 
    };
  }
}

// お知らせ更新
export async function updateNotice(noticeId: string, formData: NoticeFormData) {
  const supabase = createServerAdminClient();
  
  try {
    // 既存のお知らせ情報を取得
    const { data: existingNotice, error: fetchError } = await supabase
      .from('notices')
      .select('published_at')
      .eq('id', noticeId)
      .single();

    if (fetchError) throw fetchError;

    // お知らせを更新
    const updateData: any = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      status: formData.status,
      thumbnail_url: formData.thumbnail_url || null,
    };

    // ステータスが公開に変更された場合、published_atを設定
    if (formData.status === 'PUBLISHED' && !existingNotice.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data: notice, error: noticeError } = await supabase
      .from('notices')
      .update(updateData)
      .eq('id', noticeId)
      .select()
      .single();

    if (noticeError) throw noticeError;

    // 既存のカテゴリー関連を削除
    const { error: deleteError } = await supabase
      .from('notice_category_relations')
      .delete()
      .eq('notice_id', noticeId);

    if (deleteError) throw deleteError;

    // 新しいカテゴリー関連を作成
    if (formData.categories && formData.categories.length > 0) {
      const { data: categories, error: categoryError } = await supabase
        .from('notice_categories')
        .select('id, name')
        .in('name', formData.categories);

      if (categoryError) throw categoryError;

      if (categories && categories.length > 0) {
        const relations = categories.map(cat => ({
          notice_id: noticeId,
          category_id: cat.id
        }));

        const { error: relationError } = await supabase
          .from('notice_category_relations')
          .insert(relations);

        if (relationError) throw relationError;
      }
    }

    // キャッシュをクリア
    revalidatePath('/admin/notice');
    revalidatePath(`/admin/notice/${noticeId}`);
    revalidatePath('/notice');
    revalidatePath(`/notice/${noticeId}`);
    
    return { success: true, data: notice };
  } catch (error) {
    console.error('お知らせ更新エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'お知らせの更新に失敗しました' 
    };
  }
}

// お知らせ削除
export async function deleteNotice(noticeId: string) {
  const supabase = createServerAdminClient();
  
  try {
    // カテゴリー関連を先に削除
    const { error: relationError } = await supabase
      .from('notice_category_relations')
      .delete()
      .eq('notice_id', noticeId);

    if (relationError) throw relationError;

    // お知らせを削除
    const { error: noticeError } = await supabase
      .from('notices')
      .delete()
      .eq('id', noticeId);

    if (noticeError) throw noticeError;

    // キャッシュをクリア
    revalidatePath('/admin/notice');
    revalidatePath('/notice');
    
    return { success: true };
  } catch (error) {
    console.error('お知らせ削除エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'お知らせの削除に失敗しました' 
    };
  }
}

// サムネイル画像アップロード
export async function uploadNoticeThumbnail(file: FormData) {
  const supabase = createServerAdminClient();
  
  try {
    const thumbnail = file.get('thumbnail') as File;
    if (!thumbnail) {
      throw new Error('画像ファイルが見つかりません');
    }

    // ファイル名を生成
    const fileExt = thumbnail.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `notice-thumbnails/${fileName}`;

    // Supabase Storageにアップロード
    const { data, error } = await supabase.storage
      .from('blog')
      .upload(filePath, thumbnail, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // 公開URLを取得
    const { data: { publicUrl } } = supabase.storage
      .from('blog')
      .getPublicUrl(filePath);

    return { 
      success: true, 
      url: publicUrl 
    };
  } catch (error) {
    console.error('サムネイルアップロードエラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'サムネイルのアップロードに失敗しました' 
    };
  }
}

// お知らせ一覧取得（管理画面用）
export async function getAdminNotices() {
  const supabase = createServerAdminClient();
  
  try {
    const { data: notices, error } = await supabase
      .from('notices')
      .select(`
        id,
        title,
        excerpt,
        status,
        published_at,
        created_at,
        views_count,
        notice_category_relations(
          notice_categories(name)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // データを変換
    const transformedNotices = notices?.map((notice: any) => ({
      ...notice,
      categories: notice.notice_category_relations?.map((rel: any) => 
        rel.notice_categories?.name
      ).filter(Boolean) || []
    })) || [];

    return { 
      success: true, 
      data: transformedNotices 
    };
  } catch (error) {
    console.error('お知らせ一覧取得エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'お知らせ一覧の取得に失敗しました',
      data: []
    };
  }
}

// ステータス一括更新
export async function updateNoticeStatus(noticeId: string, status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') {
  const supabase = createServerAdminClient();
  
  try {
    const updateData: any = { status };
    
    // 公開ステータスに変更された場合
    if (status === 'PUBLISHED') {
      const { data: notice } = await supabase
        .from('notices')
        .select('published_at')
        .eq('id', noticeId)
        .single();
      
      if (!notice?.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { error } = await supabase
      .from('notices')
      .update(updateData)
      .eq('id', noticeId);

    if (error) throw error;

    // キャッシュをクリア
    revalidatePath('/admin/notice');
    revalidatePath(`/admin/notice/${noticeId}`);
    revalidatePath('/notice');
    
    return { success: true };
  } catch (error) {
    console.error('ステータス更新エラー:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'ステータスの更新に失敗しました' 
    };
  }
}