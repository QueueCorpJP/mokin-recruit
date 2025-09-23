'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { revalidatePath } from 'next/cache';

export async function addIndustry(industryName: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('custom_industries')
    .insert({ name: industryName })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/industry');
  return data;
}

export async function updateIndustry(id: string, name: string) {
  const supabase = getSupabaseAdminClient();

  const { data, error } = await supabase
    .from('custom_industries')
    .update({ name })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/industry');
  return data;
}

export async function deleteIndustry(id: string) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase
    .from('custom_industries')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/admin/industry');
  return { success: true };
}
