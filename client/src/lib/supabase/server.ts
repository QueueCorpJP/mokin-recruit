import { cookies } from 'next/headers';
import { getSupabaseClient } from '@/lib/server/database/supabase';

export async function createClient() {
  return getSupabaseClient();
}