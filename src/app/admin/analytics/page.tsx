import React from 'react';
import ScoutTable from '@/components/ui/ScoutTable';
import RegistrationTable from '@/components/ui/RegistrationTable';
import { getAnalyticsData } from './actions';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const { scoutTableData, registrationTableData } = await getAnalyticsData();

  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>企業・候補者分析</h1>
      <p className='text-red-500 mb-8'>
        企業全体、候補者全体の流通量での確認が可能
      </p>
      <h2 className='text-xl font-bold mb-4'>スカウト利用状況</h2>
      <ScoutTable data={scoutTableData} />
      <h2 className='text-xl font-bold mt-8 mb-4'>候補者・企業登録数</h2>
      <RegistrationTable data={registrationTableData} />
    </div>
  );
}
