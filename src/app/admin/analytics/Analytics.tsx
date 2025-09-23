import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/admin/ui/table';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

interface ScoutData {
  period: string;
  sends: number;
  opens: number;
  replies: number;
  applications: number;
}

interface RegistrationData {
  period: string;
  newCandidates: number;
  newCompanies: number;
  newJobs: number;
}

async function getScoutData(): Promise<ScoutData[]> {
  const supabase = getSupabaseAdminClient();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // スカウト送信数（7日間、30日間、累計）
  const [sevenDaySends, thirtyDaySends, totalSends] = await Promise.all([
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .gte('sent_at', sevenDaysAgo.toISOString()),
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .gte('sent_at', thirtyDaysAgo.toISOString()),
    supabase.from('scout_sends').select('*', { count: 'exact' }),
  ]);

  // 開封数（status = 'read' または 'replied'）
  const [sevenDayOpens, thirtyDayOpens, totalOpens] = await Promise.all([
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .in('status', ['read', 'replied'])
      .gte('sent_at', sevenDaysAgo.toISOString()),
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .in('status', ['read', 'replied'])
      .gte('sent_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .in('status', ['read', 'replied']),
  ]);

  // 返信数（status = 'replied'）
  const [sevenDayReplies, thirtyDayReplies, totalReplies] = await Promise.all([
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .eq('status', 'replied')
      .gte('sent_at', sevenDaysAgo.toISOString()),
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .eq('status', 'replied')
      .gte('sent_at', thirtyDaysAgo.toISOString()),
    supabase
      .from('scout_sends')
      .select('*', { count: 'exact' })
      .eq('status', 'replied'),
  ]);

  // 応募数（application テーブルから）
  const [sevenDayApplications, thirtyDayApplications, totalApplications] =
    await Promise.all([
      supabase
        .from('application')
        .select('*', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabase
        .from('application')
        .select('*', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('application').select('*', { count: 'exact' }),
    ]);

  return [
    {
      period: '過去7日合計',
      sends: sevenDaySends.count || 0,
      opens: sevenDayOpens.count || 0,
      replies: sevenDayReplies.count || 0,
      applications: sevenDayApplications.count || 0,
    },
    {
      period: '過去30日間合計',
      sends: thirtyDaySends.count || 0,
      opens: thirtyDayOpens.count || 0,
      replies: thirtyDayReplies.count || 0,
      applications: thirtyDayApplications.count || 0,
    },
    {
      period: '累計',
      sends: totalSends.count || 0,
      opens: totalOpens.count || 0,
      replies: totalReplies.count || 0,
      applications: totalApplications.count || 0,
    },
  ];
}

async function getRegistrationData(): Promise<RegistrationData[]> {
  const supabase = getSupabaseAdminClient();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // 候補者登録数
  const [sevenDayCandidates, thirtyDayCandidates, totalCandidates] =
    await Promise.all([
      supabase
        .from('candidates')
        .select('*', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabase
        .from('candidates')
        .select('*', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('candidates').select('*', { count: 'exact' }),
    ]);

  // 企業登録数
  const [sevenDayCompanies, thirtyDayCompanies, totalCompanies] =
    await Promise.all([
      supabase
        .from('company_accounts')
        .select('*', { count: 'exact' })
        .gte('created_at', sevenDaysAgo.toISOString()),
      supabase
        .from('company_accounts')
        .select('*', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString()),
      supabase.from('company_accounts').select('*', { count: 'exact' }),
    ]);

  // 求人作成数
  const [sevenDayJobs, thirtyDayJobs, totalJobs] = await Promise.all([
    supabase
      .from('job_postings')
      .select('*', { count: 'exact' })
      .gte('created_at', sevenDaysAgo.toISOString()),
    supabase
      .from('job_postings')
      .select('*', { count: 'exact' })
      .gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('job_postings').select('*', { count: 'exact' }),
  ]);

  return [
    {
      period: '過去7日合計',
      newCandidates: sevenDayCandidates.count || 0,
      newCompanies: sevenDayCompanies.count || 0,
      newJobs: sevenDayJobs.count || 0,
    },
    {
      period: '過去30日間合計',
      newCandidates: thirtyDayCandidates.count || 0,
      newCompanies: thirtyDayCompanies.count || 0,
      newJobs: thirtyDayJobs.count || 0,
    },
    {
      period: '累計',
      newCandidates: totalCandidates.count || 0,
      newCompanies: totalCompanies.count || 0,
      newJobs: totalJobs.count || 0,
    },
  ];
}

export default async function Analytics() {
  const [scoutData, registrationData] = await Promise.all([
    getScoutData(),
    getRegistrationData(),
  ]);

  return (
    <div className='min-h-screen space-y-8'>
      {/* スカウト利用状況セクション */}
      <div>
        <div className='mb-4'>
          <h2
            style={{
              fontFamily: 'Inter',
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: 1.6,
              color: '#323232',
            }}
          >
            スカウト利用状況
          </h2>
        </div>

        <div className='bg-white border border-gray-300 rounded'>
          <Table>
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className='border-r border-gray-300 px-3 py-2'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    {/* 期間列 */}
                  </span>
                </TableHead>
                <TableHead className='border-r border-gray-300 px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    スカウト送信数
                  </span>
                </TableHead>
                <TableHead className='border-r border-gray-300 px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    開封数（開封率）
                  </span>
                </TableHead>
                <TableHead className='border-r border-gray-300 px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    返信数（返信率）
                  </span>
                </TableHead>
                <TableHead className='px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    応募数（応募率）
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoutData.map((data, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.period}
                  </TableCell>
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.sends}
                  </TableCell>
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.opens}
                  </TableCell>
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.replies}
                  </TableCell>
                  <TableCell
                    className='px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.applications}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 候補者・企業登録数セクション */}
      <div>
        <div className='mb-4'>
          <h2
            style={{
              fontFamily: 'Inter',
              fontSize: '32px',
              fontWeight: 700,
              lineHeight: 1.6,
              color: '#323232',
            }}
          >
            候補者・企業登録数
          </h2>
        </div>

        <div className='bg-white border border-gray-300 rounded'>
          <Table>
            <TableHeader className='bg-gray-100'>
              <TableRow>
                <TableHead className='border-r border-gray-300 px-3 py-2'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    {/* 期間列 */}
                  </span>
                </TableHead>
                <TableHead className='border-r border-gray-300 px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    新規候補者登録数
                  </span>
                </TableHead>
                <TableHead className='border-r border-gray-300 px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    新規企業登録数
                  </span>
                </TableHead>
                <TableHead className='px-3 py-2 text-center'>
                  <span
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                      color: '#323232',
                    }}
                  >
                    新規求人作成数
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationData.map((data, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.period}
                  </TableCell>
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.newCandidates}
                  </TableCell>
                  <TableCell
                    className='border-r border-gray-200 px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.newCompanies}
                  </TableCell>
                  <TableCell
                    className='px-3 py-4 text-center'
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.6,
                    }}
                  >
                    {data.newJobs}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
