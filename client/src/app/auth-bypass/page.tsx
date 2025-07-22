'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Building2,
  LogIn,
  LogOut,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserInfo {
  id: string;
  email: string;
  userType: 'candidate' | 'company';
  fullName?: string;
  companyName?: string;
}

export default function AuthBypassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // 本番環境では表示しない
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    return (
      <div className='min-h-screen bg-red-50 flex items-center justify-center'>
        <div className='bg-white p-10 rounded-lg shadow-lg border border-red-200'>
          <div className='flex items-center gap-4 mb-6'>
            <AlertTriangle className='w-8 h-8 text-red-500' />
            <h1 className='text-3xl font-bold text-red-600'>アクセス拒否</h1>
          </div>
          <p className='text-lg text-gray-700'>
            この機能は開発環境でのみ利用可能です。
          </p>
        </div>
      </div>
    );
  }

  // 現在のログイン状態をチェック
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setCurrentUser(data.user);
        }
      }
    } catch (error) {
      console.error('セッション確認エラー:', error);
    }
  };

  const handleBypassLogin = async (userType: 'candidate' | 'company') => {
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
        setMessage(
          `✅ ${userType === 'candidate' ? '候補者' : '企業'}としてログインしました`
        );
        setCurrentUser(data.user);

        // 適切なページにリダイレクト
        setTimeout(() => {
          if (userType === 'candidate') {
            router.push('/candidate');
          } else {
            router.push('/company/job'); // 修正: jobs → job
          }
        }, 1500);
      } else {
        setError(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('認証バイパスエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setCurrentUser(null);
        setMessage('✅ ログアウトしました');
        localStorage.removeItem('dev-auth-token');
        localStorage.removeItem('dev-user-info');
      } else {
        setError('ログアウトに失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('ログアウトエラー:', error);
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
        setMessage('✅ テストデータを生成しました');
      } else {
        setError(data.error || 'テストデータの生成に失敗しました');
      }
    } catch (error) {
      setError('通信エラーが発生しました');
      console.error('テストデータ生成エラー:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-green-50'>
      {/* ヘッダー */}
      <div className='bg-white shadow-sm border-b'>
        <div className='max-w-4xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
                <LogIn className='w-5 h-5 text-white' />
              </div>
              <h1 className='text-2xl font-bold text-gray-800'>認証バイパス</h1>
              <span className='px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-full'>
                開発専用
              </span>
            </div>

            {currentUser && (
              <button
                onClick={handleLogout}
                disabled={loading}
                className='flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 border border-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors'
              >
                <LogOut className='w-4 h-4' />
                ログアウト
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-10'>
        {/* 現在のログイン状態 */}
        {currentUser && (
          <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-8'>
            <div className='flex items-center gap-3 mb-3'>
              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              <h2 className='text-lg font-bold text-green-800'>ログイン中</h2>
            </div>
            <div className='flex items-center gap-4'>
              {currentUser.userType === 'candidate' ? (
                <User className='w-8 h-8 text-green-600' />
              ) : (
                <Building2 className='w-8 h-8 text-green-600' />
              )}
              <div>
                <p className='text-base font-bold text-gray-800'>
                  {currentUser.fullName ||
                    currentUser.companyName ||
                    'ユーザー名'}
                </p>
                <p className='text-sm text-gray-600'>{currentUser.email}</p>
                <p className='text-sm text-green-600 font-bold'>
                  {currentUser.userType === 'candidate'
                    ? '候補者アカウント'
                    : '企業アカウント'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* メッセージ・エラー表示 */}
        {message && (
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6'>
            <p className='text-blue-800 font-bold'>{message}</p>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <p className='text-red-800 font-bold'>{error}</p>
          </div>
        )}

        {/* 認証バイパスボタン */}
        <div className='grid md:grid-cols-2 gap-8 mb-10'>
          {/* 候補者としてログイン */}
          <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-200'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <User className='w-7 h-7 text-blue-600' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>
                  候補者アカウント
                </h3>
                <p className='text-sm text-gray-600'>求職者としてログイン</p>
              </div>
            </div>

            <div className='space-y-3 mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm text-gray-700'>プロフィール管理</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm text-gray-700'>求人検索・応募</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm text-gray-700'>メッセージ機能</span>
              </div>
            </div>

            <button
              onClick={() => handleBypassLogin('candidate')}
              disabled={loading || currentUser?.userType === 'candidate'}
              className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
            >
              {loading ? (
                <RefreshCw className='w-5 h-5 animate-spin' />
              ) : (
                <LogIn className='w-5 h-5' />
              )}
              {currentUser?.userType === 'candidate'
                ? 'ログイン済み'
                : '候補者としてログイン'}
            </button>
          </div>

          {/* 企業としてログイン */}
          <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-200'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <Building2 className='w-7 h-7 text-green-600' />
              </div>
              <div>
                <h3 className='text-xl font-bold text-gray-800'>
                  企業アカウント
                </h3>
                <p className='text-sm text-gray-600'>
                  採用担当者としてログイン
                </p>
              </div>
            </div>

            <div className='space-y-3 mb-6'>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm text-gray-700'>求人管理</span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm text-gray-700'>
                  候補者検索・スカウト
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                <span className='text-sm text-gray-700'>応募管理</span>
              </div>
            </div>

            <button
              onClick={() => handleBypassLogin('company')}
              disabled={loading || currentUser?.userType === 'company'}
              className='w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity'
            >
              {loading ? (
                <RefreshCw className='w-5 h-5 animate-spin' />
              ) : (
                <LogIn className='w-5 h-5' />
              )}
              {currentUser?.userType === 'company'
                ? 'ログイン済み'
                : '企業としてログイン'}
            </button>
          </div>
        </div>

        {/* 開発ツール */}
        <div className='bg-white rounded-lg shadow-lg p-8 border border-gray-200'>
          <h3 className='text-xl font-bold text-gray-800 mb-6'>開発ツール</h3>

          <div className='grid md:grid-cols-2 gap-4'>
            <button
              onClick={handleGenerateTestData}
              disabled={loading}
              className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity'
            >
              {loading ? (
                <RefreshCw className='w-5 h-5 animate-spin' />
              ) : (
                <RefreshCw className='w-5 h-5' />
              )}
              テストデータ生成
            </button>

            <a
              href='/dev-tools'
              className='flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-lg hover:opacity-90 transition-opacity'
            >
              詳細開発ツール
            </a>
          </div>
        </div>

        {/* 注意事項 */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8'>
          <div className='flex items-center gap-3 mb-3'>
            <AlertTriangle className='w-5 h-5 text-yellow-600' />
            <h4 className='text-lg font-bold text-yellow-800'>注意事項</h4>
          </div>
          <ul className='space-y-2 text-sm text-yellow-800'>
            <li>• この機能は開発環境でのみ利用可能です</li>
            <li>• 本番環境では自動的に無効化されます</li>
            <li>• テストデータは定期的にクリーンアップされます</li>
            <li>• 実際のユーザーデータには影響しません</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
