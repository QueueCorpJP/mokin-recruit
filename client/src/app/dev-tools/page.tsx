'use client';

import { useState, useEffect } from 'react';

interface TestUser {
  id: string;
  email: string;
  userType: string;
  fullName: string;
  createdAt: string;
  lastSignIn?: string;
}

interface AuthBypassStatus {
  enabled: boolean;
  environment: string;
  predefinedUsers: Array<{
    type: string;
    email: string;
    description: string;
    data: any;
  }>;
}

export default function DevToolsPage() {
  const [authBypassStatus, setAuthBypassStatus] =
    useState<AuthBypassStatus | null>(null);
  const [testUsers, setTestUsers] = useState<TestUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 初期データ読み込み
  useEffect(() => {
    loadAuthBypassStatus();
  }, []);

  const loadAuthBypassStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test/auth-bypass');
      const data = await response.json();

      if (data.success) {
        setAuthBypassStatus(data.authBypass);
        setTestUsers(data.testData.availableUsers || []);
      } else {
        setError(data.error || 'データの取得に失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('Error loading auth bypass status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBypassLogin = async (userType: string) => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await fetch('/api/test/auth-bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'bypass-login',
          userType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        // トークンをローカルストレージに保存（開発用）
        localStorage.setItem('dev-auth-token', data.token);
        localStorage.setItem('dev-user-info', JSON.stringify(data.user));
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('Error during bypass login:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestData = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await fetch('/api/test/auth-bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate-test-data',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ テストデータの生成が完了しました');
        await loadAuthBypassStatus(); // データを再読み込み
      } else {
        setError(data.error || 'テストデータの生成に失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('Error generating test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanupTestData = async () => {
    if (
      !confirm('すべてのテストデータを削除しますか？この操作は元に戻せません。')
    ) {
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await fetch('/api/test/auth-bypass', {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ テストデータのクリーンアップが完了しました');
        await loadAuthBypassStatus(); // データを再読み込み
      } else {
        setError(data.error || 'クリーンアップに失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('Error cleaning up test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTestUser = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await fetch('/api/test/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'new-test-user@test.local',
          password: 'TestPassword123!',
          fullName: '新規テストユーザー',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ 新規テストユーザーが作成されました');
        await loadAuthBypassStatus(); // データを再読み込み
      } else {
        setError(data.error || 'ユーザー作成に失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('Error creating test user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-md'>
          <h1 className='text-2xl font-bold text-red-600 mb-4'>アクセス拒否</h1>
          <p>この機能は開発環境でのみ利用可能です。</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>
          🛠️ 開発者ツール - 認証テストダッシュボード
        </h1>

        {/* メッセージ表示 */}
        {message && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
            {message}
          </div>
        )}

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        {/* ローディング状態 */}
        {loading && (
          <div className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4'>
            処理中...
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* 認証バイパス機能 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              🔓 認証バイパス機能
            </h2>

            {authBypassStatus && (
              <div className='mb-4'>
                <p className='text-sm text-gray-600'>
                  状態: {authBypassStatus.enabled ? '✅ 有効' : '❌ 無効'}
                </p>
                <p className='text-sm text-gray-600'>
                  環境: {authBypassStatus.environment}
                </p>
              </div>
            )}

            <div className='space-y-3'>
              <button
                onClick={() => handleBypassLogin('candidate')}
                disabled={loading}
                className='w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50'
              >
                👤 候補者としてログイン
              </button>

              <button
                onClick={() => handleBypassLogin('company_user')}
                disabled={loading}
                className='w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50'
              >
                🏢 企業ユーザーとしてログイン
              </button>

              <button
                onClick={() => handleBypassLogin('admin')}
                disabled={loading}
                className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50'
              >
                👑 管理者としてログイン
              </button>
            </div>

            <div className='mt-4 p-3 bg-gray-100 rounded text-sm'>
              <p className='font-medium'>使用方法:</p>
              <p>1. 上記ボタンでバイパスログイン</p>
              <p>2. トークンが自動でローカルストレージに保存</p>
              <p>3. 認証が必要なページにアクセス可能</p>
            </div>
          </div>

          {/* テストデータ管理 */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              🧪 テストデータ管理
            </h2>

            <div className='space-y-3'>
              <button
                onClick={handleGenerateTestData}
                disabled={loading}
                className='w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50'
              >
                🎯 包括的テストデータ生成
              </button>

              <button
                onClick={handleCreateTestUser}
                disabled={loading}
                className='w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50'
              >
                ➕ 単発テストユーザー作成
              </button>

              <button
                onClick={handleCleanupTestData}
                disabled={loading}
                className='w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50'
              >
                🗑️ テストデータクリーンアップ
              </button>
            </div>

            <div className='mt-4 p-3 bg-yellow-100 rounded text-sm'>
              <p className='font-medium text-yellow-800'>注意:</p>
              <p className='text-yellow-700'>
                クリーンアップは全てのテストユーザーを削除します
              </p>
            </div>
          </div>

          {/* 既存テストユーザー一覧 */}
          <div className='bg-white rounded-lg shadow-md p-6 lg:col-span-2'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              📋 既存テストユーザー一覧
            </h2>

            {testUsers.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        メールアドレス
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        ユーザータイプ
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        氏名
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        作成日時
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        最終ログイン
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {testUsers.map(user => (
                      <tr key={user.id}>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {user.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.userType === 'candidate'
                                ? 'bg-blue-100 text-blue-800'
                                : user.userType === 'company_user'
                                  ? 'bg-green-100 text-green-800'
                                  : user.userType === 'admin'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.userType}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {user.fullName}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {new Date(user.createdAt).toLocaleString('ja-JP')}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {user.lastSignIn
                            ? new Date(user.lastSignIn).toLocaleString('ja-JP')
                            : '未ログイン'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                テストユーザーが見つかりません
              </div>
            )}
          </div>

          {/* 定義済みユーザー */}
          {authBypassStatus?.predefinedUsers && (
            <div className='bg-white rounded-lg shadow-md p-6 lg:col-span-2'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                🎭 定義済みバイパスユーザー
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {authBypassStatus.predefinedUsers.map((user, index) => (
                  <div key={index} className='border rounded-lg p-4'>
                    <h3 className='font-medium text-gray-800'>{user.type}</h3>
                    <p className='text-sm text-gray-600'>{user.email}</p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {user.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APIテスト */}
          <div className='bg-white rounded-lg shadow-md p-6 lg:col-span-2'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4'>
              🔧 APIテスト
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <a
                href='/api/health'
                target='_blank'
                rel='noopener noreferrer'
                className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center'
              >
                <div className='font-medium text-gray-800'>ヘルスチェック</div>
                <div className='text-sm text-gray-600'>GET /api/health</div>
              </a>

              <a
                href='/api/test/password-reset'
                target='_blank'
                rel='noopener noreferrer'
                className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center'
              >
                <div className='font-medium text-gray-800'>
                  パスワードリセットテスト
                </div>
                <div className='text-sm text-gray-600'>
                  GET /api/test/password-reset
                </div>
              </a>

              <a
                href='/api/admin/env-audit'
                target='_blank'
                rel='noopener noreferrer'
                className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-center'
              >
                <div className='font-medium text-gray-800'>環境変数監査</div>
                <div className='text-sm text-gray-600'>
                  GET /api/admin/env-audit
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className='mt-8 text-center text-sm text-gray-500'>
          <p>🚧 このページは開発環境でのみ利用可能です</p>
          <p>本番環境では自動的に無効化されます</p>
        </div>
      </div>
    </div>
  );
}
