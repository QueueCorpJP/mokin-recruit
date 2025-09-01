'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchClientSimple() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">検索結果</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <p>URLパラメータ: {searchParams.toString()}</p>
        <p>簡略版SearchClientが正常に動作しています。</p>
      </div>
    </div>
  );
}