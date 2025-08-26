'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export interface Notice {
  id: string;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  created_at: string;
  updated_at?: string;
  published_at?: string;
}

export async function getNotice(id: string): Promise<Notice | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('お知らせ取得エラー:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('お知らせ取得エラー:', error);
    return null;
  }
}

export async function getAllNotices(limit: number = 50, offset: number = 0): Promise<Notice[]> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('お知らせ一覧取得エラー:', error);
    return [];
  }
}

export async function createNotice(notice: Omit<Notice, 'id' | 'created_at' | 'updated_at'>): Promise<Notice | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('notices')
      .insert(notice)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('お知らせ作成エラー:', error);
    throw error;
  }
}

export async function updateNotice(id: string, notice: Partial<Notice>): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('notices')
      .update({ ...notice, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('お知らせ更新エラー:', error);
    throw error;
  }
}

export async function deleteNotice(id: string): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('notices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('お知らせ削除エラー:', error);
    throw error;
  }
}