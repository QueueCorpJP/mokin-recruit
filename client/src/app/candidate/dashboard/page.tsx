'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser, useAuthIsAuthenticated, useAuthIsLoading } from '@/contexts/AuthContext';

export default function CandidateDashboard() {
  const router = useRouter();
  const user = useAuthUser();
  const isAuthenticated = useAuthIsAuthenticated();
  const isLoading = useAuthIsLoading();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/candidate/auth/login');
        return;
      }
      
      if (user?.userType !== 'candidate') {
        router.push('/company');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.userType !== 'candidate') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            ダッシュボード
          </h1>
          <p className="mt-2 text-gray-600">
            こんにちは、{user?.name}さん
          </p>
        </div>

        {/* メインコンテンツエリア */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側のメニュー */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">メニュー</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => router.push('/candidate/search/setting')}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  求人検索
                </button>
                <button
                  onClick={() => router.push('/candidate/job/favorite')}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  お気に入り求人
                </button>
                <button
                  onClick={() => router.push('/message')}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  メッセージ
                </button>
              </nav>
            </div>
          </div>

          {/* 右側のメインコンテンツ */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* 最近の活動 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">最近の活動</h2>
                <div className="text-gray-600">
                  最近の活動はありません
                </div>
              </div>

              {/* おすすめ求人 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">おすすめ求人</h2>
                <div className="text-gray-600">
                  <p className="mb-4">あなたにおすすめの求人を表示します。</p>
                  <button
                    onClick={() => router.push('/candidate/search/setting')}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    求人を探す
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}