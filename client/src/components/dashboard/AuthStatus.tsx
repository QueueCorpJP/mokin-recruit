'use client';

import { useState, useEffect } from 'react';

export function AuthStatus() {
  const [tokenStatus, setTokenStatus] = useState<
    'loading' | 'present' | 'missing'
  >('loading');
  const [loginTime, setLoginTime] = useState<string>('');

  useEffect(() => {
    // クライアントサイドでのみ実行
    try {
      const token = localStorage.getItem('auth_token');
      setTokenStatus(token ? 'present' : 'missing');

      // ログイン時刻を現在時刻として設定（実際の実装では、トークンから取得またはセッションストレージを使用）
      setLoginTime(new Date().toLocaleString('ja-JP'));
    } catch (error) {
      console.error('❌ 認証状態の確認でエラーが発生しました:', error);
      setTokenStatus('missing');
    }
  }, []);

  const getTokenStatusDisplay = () => {
    switch (tokenStatus) {
      case 'loading':
        return '🔄 確認中...';
      case 'present':
        return '✅ 保存済み';
      case 'missing':
        return '❌ 未保存';
      default:
        return '❓ 不明';
    }
  };

  const getTokenStatusColor = () => {
    switch (tokenStatus) {
      case 'present':
        return 'text-green-600';
      case 'missing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className='bg-gray-100 rounded-lg p-4 mb-6'>
      <h3 className='text-lg font-medium text-gray-900 mb-2'>認証情報</h3>
      <div className='text-sm text-gray-700'>
        <p className='mb-1'>
          <span className='font-medium'>トークン:</span>{' '}
          <span className={`font-mono ${getTokenStatusColor()}`}>
            {getTokenStatusDisplay()}
          </span>
        </p>
        <p>
          <span className='font-medium'>ログイン時刻:</span>{' '}
          {tokenStatus === 'loading' ? '確認中...' : loginTime}
        </p>
        {tokenStatus === 'missing' && (
          <p className='mt-2 text-xs text-red-600'>
            ⚠️
            認証トークンが見つかりません。再ログインが必要な可能性があります。
          </p>
        )}
      </div>
    </div>
  );
}
