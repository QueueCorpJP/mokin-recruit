import React from 'react';
import Analytics from './Analytics';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  return (
    <div className='p-8'>
      <h1 className='text-2xl font-bold mb-4'>企業・候補者分析</h1>
      <Analytics />
    </div>
  );
}
