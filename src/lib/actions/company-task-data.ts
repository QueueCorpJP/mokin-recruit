'use server';

import { createClient } from '@/lib/supabase/server';

export interface CompanyAccountData {
  plan: string;
  scoutLimit: number;
  remainingTickets?: number;
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
          remaining_tickets,
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

    // 残りチケット数を直接取得
    const remainingTickets = account.remaining_tickets || 0;
    const nextMonthStart = new Date();
    nextMonthStart.setMonth(nextMonthStart.getMonth() + 1, 1);
    nextMonthStart.setHours(0, 0, 0, 0);

    console.log('[getCompanyAccountData] Data from database:', {
      companyUserId,
      accountId: account.id,
      scoutLimit: account.scout_limit,
      remainingTickets,
    });

    return {
      plan: account.plan,
      scoutLimit: account.scout_limit,
      remainingTickets,
      nextUpdateDate: nextMonthStart
        .toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '-'),
    };
  } catch (error) {
    console.error('Error in getCompanyAccountData:', error);
    return null;
  }
}
