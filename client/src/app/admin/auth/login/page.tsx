'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [errorStage, setErrorStage] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorDetail(null);
    setErrorStage(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType: 'admin' }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        // クッキーはAPI側でセットされる
        router.push('/admin'); // 管理ダッシュボード等にリダイレクト
      } else {
        setError(data.message || 'ログインに失敗しました');
        if (data.errorDetail) {
          setErrorDetail(
            typeof data.errorDetail === 'string'
              ? data.errorDetail
              : JSON.stringify(data.errorDetail)
          );
        }
        if (data.errorStage) {
          setErrorStage(data.errorStage);
        }
      }
    } catch (err) {
      setError('システムエラーが発生しました');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4 flex-col items-start justify-start'>
      <div className='w-full'>
        <div className='text-center mb-[40px] mt-[100px]'>
          <h1 className='text-[32px] font-bold text-[#323232] mb-[16px] Noto_Sans_JP'>
            管理画面ログイン
          </h1>
          <div className='space-y-2 Noto_Sans_JP font-[14px] text-[#323232] font-bold'>
            <p>Cue Point管理画面のログインページです。</p>
            <p>
              ログイン情報をご入力いただき、「ログインする」からログインが可能です。
            </p>
          </div>
        </div>

        <form
          onSubmit={handleLogin}
          className='space-y-6 flex flex-col items-center'
        >
          {error && <div className='text-red-600 font-bold mb-2'>{error}</div>}
          {errorStage && (
            <div className='text-xs text-yellow-700 mb-2'>
              エラー種別: {errorStage}
            </div>
          )}
          {errorDetail && (
            <pre className='text-xs text-red-400 mb-2'>{errorDetail}</pre>
          )}
          <div>
            <input
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='メールアドレスを入力してください。'
              className='w-[360px] px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500'
              required
            />
          </div>

          <div>
            <input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='パスワードを入力してください。'
              className='w-[360px] px-4 py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500'
              required
            />
          </div>

          <div className='pt-2'>
            <Button
              variant='green-gradient'
              className='px-[40px] h-[48px] text-[16px] font-bold rounded-[100px]'
            >
              ログインする
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
