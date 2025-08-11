import { createClient } from '@supabase/supabase-js';

// サーバーサイド専用のSupabase Adminクライアント
export function createServerAdminClient() {
  const supabaseUrl = 'https://mjhqeagxibsklugikyma.supabase.co';
  const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qaHFlYWd4aWJza2x1Z2lreW1hIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDMyNjUzNywiZXhwIjoyMDY1OTAyNTM3fQ.WZVAdSCbl9yP5wQ2YDvFGYvo0AUHXrYV1eMaFeb6uNE';

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
  });
}