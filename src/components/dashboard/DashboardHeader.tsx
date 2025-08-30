'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { createClient } from '@/lib/supabase/client';

export function DashboardHeader() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <h1 className='text-xl font-semibold text-gray-900'>
              CuePoint Dashboard
            </h1>
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-700'>
              {loading ? 'ログイン状態を確認中...' : (user ? 'ログイン中' : '未ログイン')}
            </span>
            <button
              className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50'
              onClick={logout}
              disabled={!user}
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
