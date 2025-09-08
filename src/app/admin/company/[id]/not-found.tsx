
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">企業が見つかりません</h2>
        <p className="text-gray-600 mb-6">
          指定された企業IDに該当する企業アカウントが存在しません。
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            戻る
          </button>
          <Link
            href="/admin/company"
            className="block w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            企業一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
