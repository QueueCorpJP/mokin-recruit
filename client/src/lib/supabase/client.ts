import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  // ハードコードされた値を使用（本番環境では環境変数を使用すべき）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjhqeagxibsklugikyma.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMjY1MzcsImV4cCI6MjA2NTkwMjUzN30.pNWyWJ1OxchoKfEJTsn7KC1yduaR6S6xETmfbrUdHIk';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
  });

  return supabaseClient;
}