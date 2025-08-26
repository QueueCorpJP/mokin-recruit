import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // スカウト利用状況データ
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('*, company_groups(company_name), candidates(first_name, last_name)')
      .eq('message_type', 'SCOUT')
      .order('created_at', { ascending: false });

    if (messagesError) throw messagesError;

    // 候補者登録数
    const { count: candidatesCount, error: candidatesCountError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true });

    if (candidatesCountError) throw candidatesCountError;

    // 企業登録数
    const { count: companiesCount, error: companiesCountError } = await supabase
      .from('company_accounts')
      .select('*', { count: 'exact', head: true });

    if (companiesCountError) throw companiesCountError;

    // 今月の新規候補者数
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: newCandidatesCount, error: newCandidatesError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    if (newCandidatesError) throw newCandidatesError;

    // 今月の新規企業数
    const { count: newCompaniesCount, error: newCompaniesError } = await supabase
      .from('company_accounts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString());

    if (newCompaniesError) throw newCompaniesError;

    // スカウト統計
    const scoutStats = {
      totalSent: messages?.length || 0,
      read: messages?.filter(m => m.status === 'READ' || m.status === 'REPLIED').length || 0,
      replied: messages?.filter(m => m.status === 'REPLIED').length || 0,
    };

    // スカウト利用状況テーブルデータ
    const scoutUsageData = messages?.slice(0, 10).map(message => ({
      id: message.id,
      companyName: message.company_groups?.company_name || '不明',
      candidateName: message.candidates ? 
        `${message.candidates.last_name || ''} ${message.candidates.first_name || ''}`.trim() || '不明' 
        : '不明',
      sentDate: new Date(message.created_at).toLocaleDateString('ja-JP'),
      status: message.status === 'SENT' ? '未読' : 
              message.status === 'READ' ? '既読' : 
              message.status === 'REPLIED' ? '返信済み' : message.status,
      readDate: message.read_at ? new Date(message.read_at).toLocaleDateString('ja-JP') : '-',
      repliedDate: message.replied_at ? new Date(message.replied_at).toLocaleDateString('ja-JP') : '-',
    })) || [];

    return NextResponse.json({
      scoutStats,
      scoutUsageData,
      registrationStats: {
        totalCandidates: candidatesCount || 0,
        totalCompanies: companiesCount || 0,
        newCandidatesThisMonth: newCandidatesCount || 0,
        newCompaniesThisMonth: newCompaniesCount || 0,
      }
    });
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}