import React from 'react';
import { createClient } from '@supabase/supabase-js';
import ScoutTable from '@/components/ui/ScoutTable';
import RegistrationTable from '@/components/ui/RegistrationTable';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAnalyticsData() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // スカウトメッセージデータ（過去7日）
  const { data: messages7Days } = await supabase
    .from('messages')
    .select('*')
    .eq('message_type', 'SCOUT')
    .gte('created_at', sevenDaysAgo.toISOString());

  // スカウトメッセージデータ（過去30日）
  const { data: messages30Days } = await supabase
    .from('messages')
    .select('*')
    .eq('message_type', 'SCOUT')
    .gte('created_at', thirtyDaysAgo.toISOString());

  // スカウトメッセージデータ（全期間）
  const { data: messagesTotal } = await supabase
    .from('messages')
    .select('*')
    .eq('message_type', 'SCOUT');

  // 応募数データ（過去7日）
  const { count: applications7Days } = await supabase
    .from('application')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', sevenDaysAgo.toISOString());

  // 応募数データ（過去30日）
  const { count: applications30Days } = await supabase
    .from('application')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', thirtyDaysAgo.toISOString());

  // 応募数データ（全期間）
  const { count: applicationsTotal } = await supabase
    .from('application')
    .select('*', { count: 'exact', head: true });

  // 候補者登録数
  const { count: candidatesTotal } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true });

  const { count: candidatesThisMonth } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfThisMonth.toISOString());

  const { count: candidatesLastMonth } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString());

  // 企業登録数
  const { count: companiesTotal } = await supabase
    .from('company_accounts')
    .select('*', { count: 'exact', head: true });

  const { count: companiesThisMonth } = await supabase
    .from('company_accounts')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfThisMonth.toISOString());

  const { count: companiesLastMonth } = await supabase
    .from('company_accounts')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startOfLastMonth.toISOString())
    .lte('created_at', endOfLastMonth.toISOString());

  // スカウトテーブルデータ
  const scoutTableData = {
    last7Days: {
      sent: messages7Days?.length || 0,
      opened: messages7Days?.filter(m => m.status === 'READ' || m.status === 'REPLIED').length || 0,
      replied: messages7Days?.filter(m => m.status === 'REPLIED').length || 0,
      applied: applications7Days || 0,
    },
    last30Days: {
      sent: messages30Days?.length || 0,
      opened: messages30Days?.filter(m => m.status === 'READ' || m.status === 'REPLIED').length || 0,
      replied: messages30Days?.filter(m => m.status === 'REPLIED').length || 0,
      applied: applications30Days || 0,
    },
    total: {
      sent: messagesTotal?.length || 0,
      opened: messagesTotal?.filter(m => m.status === 'READ' || m.status === 'REPLIED').length || 0,
      replied: messagesTotal?.filter(m => m.status === 'REPLIED').length || 0,
      applied: applicationsTotal || 0,
    },
  };

  // 登録数テーブルデータ
  const registrationTableData = {
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
  };

  return {
    scoutTableData,
    registrationTableData,
  };
}

export default async function AnalyticsPage() {
  const { scoutTableData, registrationTableData } = await getAnalyticsData();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">企業・候補者分析</h1>
      <p className="text-red-500 mb-8">企業全体、候補者全体の流通量での確認が可能</p>
      <h2 className="text-xl font-bold mb-4">スカウト利用状況</h2>
      <ScoutTable data={scoutTableData} />
      <h2 className="text-xl font-bold mt-8 mb-4">候補者・企業登録数</h2>
      <RegistrationTable data={registrationTableData} />
    </div>
  );
}