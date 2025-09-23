'use server';

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function getAnalyticsData() {
  // ビルドフェーズはSupabaseへ接続せずスタブを返す
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    const zeroScout = {
      sent: 0,
      opened: 0,
      replied: 0,
      applied: 0,
    };
    return {
      scoutTableData: {
        last7Days: { ...zeroScout },
        last30Days: { ...zeroScout },
        total: { ...zeroScout },
      },
      registrationTableData: {
        candidates: { total: 0, thisMonth: 0, lastMonth: 0 },
        companies: { total: 0, thisMonth: 0, lastMonth: 0 },
      },
    };
  }

  const supabase = getSupabaseAdminClient();
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  try {
    // スカウトメール分析データ取得
    const [
      { count: sent7Days },
      { count: sent30Days },
      { count: sentTotal },
      { count: opened7Days },
      { count: opened30Days },
      { count: openedTotal },
      { count: replied7Days },
      { count: replied30Days },
      { count: repliedTotal },
      { count: applied7Days },
      { count: applied30Days },
      { count: appliedTotal },
    ] = await Promise.all([
      // 送信数
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('messages').select('*', { count: 'exact', head: true }),

      // 開封数 (スタブ - 実際の開封追跡ロジックに置き換え)
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
        .not('read_at', 'is', null),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('read_at', 'is', null),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .not('read_at', 'is', null),

      // 返信数 (スタブ - 実際の返信追跡ロジックに置き換え)
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
        .not('replied_at', 'is', null),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('replied_at', 'is', null),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .not('replied_at', 'is', null),

      // 応募数 (スタブ - 実際の応募追跡ロジックに置き換え)
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString())
        .not('applied_at', 'is', null),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
        .not('applied_at', 'is', null),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .not('applied_at', 'is', null),
    ]);

    // 登録者数分析データ取得
    const [
      { count: candidatesTotal },
      { count: candidatesThisMonth },
      { count: candidatesLastMonth },
      { count: companiesTotal },
      { count: companiesThisMonth },
      { count: companiesLastMonth },
    ] = await Promise.all([
      // 候補者数
      supabase.from('candidates').select('*', { count: 'exact', head: true }),
      supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfThisMonth.toISOString()),
      supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString()),

      // 企業数
      supabase
        .from('company_accounts')
        .select('*', { count: 'exact', head: true }),
      supabase
        .from('company_accounts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfThisMonth.toISOString()),
      supabase
        .from('company_accounts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfLastMonth.toISOString())
        .lte('created_at', endOfLastMonth.toISOString()),
    ]);

    return {
      scoutTableData: {
        last7Days: {
          sent: sent7Days || 0,
          opened: opened7Days || 0,
          replied: replied7Days || 0,
          applied: applied7Days || 0,
        },
        last30Days: {
          sent: sent30Days || 0,
          opened: opened30Days || 0,
          replied: replied30Days || 0,
          applied: applied30Days || 0,
        },
        total: {
          sent: sentTotal || 0,
          opened: openedTotal || 0,
          replied: repliedTotal || 0,
          applied: appliedTotal || 0,
        },
      },
      registrationTableData: {
        candidates: {
          total: candidatesTotal || 0,
          thisMonth: candidatesThisMonth || 0,
          lastMonth: candidatesLastMonth || 0,
        },
        companies: {
          total: companiesTotal || 0,
          thisMonth: companiesThisMonth || 0,
          lastMonth: companiesLastMonth || 0,
        },
      },
    };
  } catch (error) {
    console.error('Analytics data fetch error:', error);
    // エラー時はゼロデータを返す
    const zeroScout = {
      sent: 0,
      opened: 0,
      replied: 0,
      applied: 0,
    };
    return {
      scoutTableData: {
        last7Days: { ...zeroScout },
        last30Days: { ...zeroScout },
        total: { ...zeroScout },
      },
      registrationTableData: {
        candidates: { total: 0, thisMonth: 0, lastMonth: 0 },
        companies: { total: 0, thisMonth: 0, lastMonth: 0 },
      },
    };
  }
}
