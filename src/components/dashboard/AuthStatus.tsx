'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function AuthStatus() {
  const { user, accessToken, loading } = useAuth();
  const [loginTime, setLoginTime] = useState<string>('');

  useEffect(() => {
    if (user && user.last_sign_in_at) {
      setLoginTime(new Date(user.last_sign_in_at).toLocaleString('ja-JP'));
    } else if (user) {
      setLoginTime(new Date().toLocaleString('ja-JP'));
    }
  }, [user]);

  const getTokenStatusDisplay = () => {
    if (loading) {
      return '🔄 確認中...';
    }
    return accessToken ? '✅ 保存済み' : '❌ 未保存';
  };

  const getTokenStatusColor = () => {
    if (loading) {
      return 'text-gray-600';
    }
    return accessToken ? 'text-green-600' : 'text-red-600';
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
          {loading ? '確認中...' : loginTime}
        </p>
        {!loading && !accessToken && (
          <p className='mt-2 text-xs text-red-600'>
            ⚠️
            認証トークンが見つかりません。再ログインが必要な可能性があります。
          </p>
        )}
      </div>
    </div>
  );
}
