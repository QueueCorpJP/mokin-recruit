import { createClient } from '@/lib/supabase/server';
import { requireCompanyAuthForAction } from '@/lib/auth/server';

export type CompanyGroupRecord = {
  id: string;
  group_name: string;
  description?: string;
};

// Get groups that the current company user has any permission for
export async function getCompanyGroupsForCurrentUser(): Promise<
  | { success: true; data: CompanyGroupRecord[] }
  | { success: false; error: string }
> {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return { success: false, error: auth.error };
  }

  const { companyUserId } = auth.data;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('company_user_group_permissions')
    .select(
      `company_group:company_groups (
        id,
        group_name,
        description
      )`
    )
    .eq('company_user_id', companyUserId);

  if (error) {
    return { success: false, error: error.message };
  }

  const groups: CompanyGroupRecord[] = (data || [])
    .map((perm: any) => perm.company_group)
    .filter((g: any) => g && g.id && g.group_name)
    .map((g: any) => ({
      id: g.id,
      group_name: g.group_name,
      description: g.description || '',
    }));

  return { success: true, data: groups };
}
