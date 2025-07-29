'use client';

import { useState } from 'react';

export default function TestFavoritePage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<any>(null);

  // データベース状況確認
  const checkDatabaseStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/database-status');
      const data = await response.json();
      setDbStatus(data);
    } catch (error) {
      console.error('データベース状況確認エラー:', error);
      setDbStatus({ success: false, error: 'エラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  // テストデータ作成
  const createTestData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/database-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'create-test-job' }),
      });
      const data = await response.json();
      setResult(data);
      
      // 作成後にデータベース状況を再確認
      if (data.success) {
        await checkDatabaseStatus();
      }
    } catch (error) {
      console.error('テストデータ作成エラー:', error);
      setResult({ success: false, error: 'エラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  // お気に入り追加テスト
  const testAddFavorite = async () => {
    setLoading(true);
    try {
      // まずテスト用の認証トークンを取得（実際の実装では適切な認証が必要）
      const response = await fetch('/api/candidate/favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 注意: 実際の実装では適切な認証トークンが必要
        },
        body: JSON.stringify({
          job_posting_id: '4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91'
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('お気に入り追加テストエラー:', error);
      setResult({ success: false, error: 'エラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  // お気に入り一覧取得テスト
  const testGetFavorites = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/candidate/favorite?page=1&limit=10');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('お気に入り一覧取得テストエラー:', error);
      setResult({ success: false, error: 'エラーが発生しました' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">お気に入り機能テストページ</h1>
      
      <div className="space-y-6">
        {/* データベース状況確認 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">データベース状況確認</h2>
          <button
            onClick={checkDatabaseStatus}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '確認中...' : 'データベース状況を確認'}
          </button>
          
          {dbStatus && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">データベース状況:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(dbStatus, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* テストデータ作成 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">テストデータ作成</h2>
          <button
            onClick={createTestData}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? '作成中...' : 'テスト求人データを作成'}
          </button>
        </div>

        {/* お気に入り機能テスト */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">お気に入り機能テスト</h2>
          <div className="space-x-4">
            <button
              onClick={testAddFavorite}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'テスト中...' : 'お気に入り追加テスト'}
            </button>
            <button
              onClick={testGetFavorites}
              disabled={loading}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'テスト中...' : 'お気に入り一覧取得テスト'}
            </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>注意: お気に入り機能のテストには適切な認証が必要です。</p>
            <p>テスト求人ID: 4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91</p>
          </div>
        </div>

        {/* 結果表示 */}
        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">テスト結果</h2>
            <div className={`p-4 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <p className="font-semibold">
                {result.success ? '✅ 成功' : '❌ 失敗'}
              </p>
              {result.message && <p className="mt-2">{result.message}</p>}
              {result.error && <p className="mt-2">エラー: {result.error}</p>}
            </div>
            
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">詳細結果を表示</summary>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96 mt-2">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* 修正内容の説明 */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold mb-4 text-yellow-800">修正内容</h2>
          <ul className="space-y-2 text-yellow-700">
            <li>• テーブル存在確認の追加</li>
            <li>• より詳細なエラーメッセージの実装</li>
            <li>• 適切なHTTPステータスコードの設定</li>
            <li>• デバッグ情報の追加</li>
            <li>• TypeScriptエラーの修正</li>
            <li>• データベース状況確認APIの追加</li>
          </ul>
        </div>
      </div>
    </div>
  );
}