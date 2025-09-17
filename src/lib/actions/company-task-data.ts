'use server';

import { createClient } from '@/lib/supabase/server';

export interface CompanyAccountData {
  plan: string;
  scoutLimit: number;
  nextUpdateDate: string;
}

export async function getCompanyAccountData(
  companyUserId: string
): Promise<CompanyAccountData | null> {
  try {
    const supabase = await createClient();

    const { data: companyAccountData, error } = await supabase
      .from('company_users')
      .select(
        `
        company_account_id,
        company_accounts!company_account_id (
          id,
          company_name,
          plan,
          scout_limit,
          created_at
        )
      `
      )
      .eq('id', companyUserId)
      .single();

    if (error) {
      console.error('Error fetching company account data:', error);
      return null;
    }

    const account = Array.isArray(companyAccountData?.company_accounts)
      ? companyAccountData.company_accounts[0]
      : companyAccountData?.company_accounts;

    if (!account) {
      console.error('Company account not found');
      return null;
    }

    return {
      plan: account.plan,
      scoutLimit: account.scout_limit,
      nextUpdateDate: new Date(
        new Date(account.created_at).setMonth(
          new Date(account.created_at).getMonth() + 1
        )
      ).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    };
  } catch (error) {
    console.error('Error in getCompanyAccountData:', error);
    return null;
  }
}
