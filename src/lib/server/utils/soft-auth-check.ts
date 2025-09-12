import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

type SoftCheckOptions = {
  expectedCompanyUserId?: string;
};

/**
 * Soft re-authorization check.
 * - Never throws or blocks. Only logs useful diagnostics for future hardening.
 */
export async function softReauthorizeForCompany(
  tag: string,
  opts: SoftCheckOptions = {}
) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      console.warn(`[softReauth:${tag}] No authenticated user`, error?.message);
      return;
    }

    const user = data.user;
    console.log(`[softReauth:${tag}] user=${user.id} email=${user.email}`);

    if (opts.expectedCompanyUserId) {
      try {
        const admin = getSupabaseAdminClient();
        const { data: cu, error: cuErr } = await admin
          .from('company_users')
          .select('id, email')
          .eq('id', opts.expectedCompanyUserId)
          .single();
        if (cuErr || !cu) {
          console.warn(
            `[softReauth:${tag}] company_user not found for expected id`,
            opts.expectedCompanyUserId
          );
        } else {
          const match =
            user.email &&
            cu.email &&
            user.email.toLowerCase() === cu.email.toLowerCase();
          console.log(
            `[softReauth:${tag}] expectedCompanyUserId match=${match}`
          );
        }
      } catch (e) {
        console.warn(`[softReauth:${tag}] company_user verification failed`);
      }
    }
  } catch (e) {
    console.warn(`[softReauth:${tag}] unexpected error`);
  }
}
