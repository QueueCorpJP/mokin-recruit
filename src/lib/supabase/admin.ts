import { createClient as createSupabaseClient } from '@supabase/supabase-js';

let supabaseAdminClient: ReturnType<typeof createSupabaseClient> | null = null;

export function createAdminClient() {
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('Environment check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseServiceRoleKey,
    url: supabaseUrl?.substring(0, 30) + '...',
  });

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Missing environment variables:', {
      NEXT_PUBLIC_SUPABASE_URL: !!supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY: !!supabaseServiceRoleKey,
    });
    throw new Error(`Missing Supabase admin environment variables: URL=${!!supabaseUrl}, KEY=${!!supabaseServiceRoleKey}`);
  }

  try {
    supabaseAdminClient = createSupabaseClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
    });

    console.log('Admin client created successfully');
    return supabaseAdminClient;
  } catch (error) {
    console.error('Failed to create admin client:', error);
    throw error;
  }
}