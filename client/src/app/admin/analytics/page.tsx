import React from 'react';
import Table from '@/components/ui/Table';

export default function AnalyticsPage() {
  return (
    <div className="bg-white p-8">
      <h1 className="text-2xl font-bold mb-4">企業・候補者分析</h1>
      <p className="text-red-500 mb-8">企業全体、候補者全体の流通量での確認が可能</p>
      <h2 className="text-xl font-bold mb-4">スカウト利用状況</h2>
      <Table />
      <h2 className="text-xl font-bold mt-8 mb-4">候補者・企業登録数</h2>
      <Table />
    </div>
  );
}
