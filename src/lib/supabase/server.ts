import { cookies } from 'next/headers';
import { getSupabaseClient } from '@/lib/server/database/supabase';

let cachedClient: ReturnType<typeof getSupabaseClient> | null = null;

export async function createClient() {
  if (cachedClient) {
    return cachedClient;
  }
  
  cachedClient = getSupabaseClient();
  return cachedClient;
}