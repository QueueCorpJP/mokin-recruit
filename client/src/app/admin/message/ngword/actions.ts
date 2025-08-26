"use server";
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';

export async function addNGKeyword(keyword: string): Promise<{ success: boolean; error?: string }> {
  if (!keyword || !keyword.trim()) {
    return { success: false, error: 'キーワードは必須です' };
  }
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from('ng_keywords')
    .insert([{ keyword }]);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath('/admin/message/ngword');
  return { success: true };
}

export async function deleteNGKeyword(id: string): Promise<{ success: boolean; error?: string }> {
  if (!id) {
    return { success: false, error: 'IDは必須です' };
  }
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from('ng_keywords')
    .update({ is_active: false })
    .eq('id', id);
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath('/admin/message/ngword');
  return { success: true };
}
