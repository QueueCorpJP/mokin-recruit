import { cookies } from 'next/headers';
import { getSupabaseClient } from '@/lib/server/database/supabase';

let cachedClient: ReturnType<typeof getSupabaseClient> | null = null;

async function createClient() {
  if (cachedClient) {
    return cachedClient;
  }
  
  cachedClient = getSupabaseClient();
  return cachedClient;
}

export { createClient };