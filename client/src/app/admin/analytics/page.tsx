'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";

export default function AnalyticsPage() {
  // スカウト利用状況データ
  const scoutData = [
    {
      period: '過去7日合計',
      sends: 0,
      opens: 0,
      replies: 0,
      applications: 0
    },
    {
      period: '過去30日間合計',
      sends: 0,
      opens: 0,
      replies: 0,
      applications: 0
    },
    {
      period: '累計',
      sends: 0,
      opens: 0,
      replies: 0,
      applications: 0
    }
  ];

  // 候補者・企業登録数データ
  const registrationData = [
    {
      period: '過去7日合計',
      newCandidates: 0,
      newCompanies: 0,
      newJobs: 0
    },
    {
      period: '過去30日間合計',
      newCandidates: 0,
      newCompanies: 0,
      newJobs: 0
    },
    {
      period: '累計',
      newCandidates: 0,
      newCompanies: 0,
      newJobs: 0
    }
  ];

  return (
    <div className="min-h-screen space-y-8">
      {/* スカウト利用状況セクション */}
      <div>
        <div className="mb-4">
          <p className="text-red-500 text-sm mb-2">
            企業全体、候補者各自への活用状況での課題分析可能
          </p>
          <h2 style={{
            fontFamily: 'Inter',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.6,
            color: '#000'
          }}>
            スカウト利用状況
          </h2>
        </div>

        <div className="bg-white border border-gray-300 rounded">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="border-r border-gray-300 px-3 py-2">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    {/* 期間列 */}
                  </span>
                </TableHead>
                <TableHead className="border-r border-gray-300 px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    スカウト送信数
                  </span>
                </TableHead>
                <TableHead className="border-r border-gray-300 px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    開封数（開封率）
                  </span>
                </TableHead>
                <TableHead className="border-r border-gray-300 px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    返信数（返信率）
                  </span>
                </TableHead>
                <TableHead className="px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    応募数（応募率）
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scoutData.map((data, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.period}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.sends}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.opens}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.replies}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
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
        <div className="mb-4">
          <h2 style={{
            fontFamily: 'Inter',
            fontSize: '32px',
            fontWeight: 700,
            lineHeight: 1.6,
            color: '#000'
          }}>
            候補者・企業登録数
          </h2>
        </div>

        <div className="bg-white border border-gray-300 rounded">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="border-r border-gray-300 px-3 py-2">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    {/* 期間列 */}
                  </span>
                </TableHead>
                <TableHead className="border-r border-gray-300 px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    新規候補者登録数
                  </span>
                </TableHead>
                <TableHead className="border-r border-gray-300 px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    新規企業登録数
                  </span>
                </TableHead>
                <TableHead className="px-3 py-2 text-center">
                  <span style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: '#000'
                  }}>
                    新規求人作成数
                  </span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationData.map((data, index) => (
                <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <TableCell className="border-r border-gray-200 px-3 py-4" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.period}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.newCandidates}
                  </TableCell>
                  <TableCell className="border-r border-gray-200 px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
                    {data.newCompanies}
                  </TableCell>
                  <TableCell className="px-3 py-4 text-center" style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: 1.6
                  }}>
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