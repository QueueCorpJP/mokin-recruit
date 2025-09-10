'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function SimpleLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('ログインに失敗しました');
      }

      const data = await response.json();

      if (data.success) {
        // トークンをlocalStorageに保存
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
        }
        // ログイン成功時の処理 - Next.jsのルーターを使用
        router.push('/dashboard');
      } else {
        setError(data.message || 'ログインに失敗しました');
      }
    } catch {
      setError('ログインに失敗しました');
    }
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[592px] mx-auto px-20 py-20'>
        <div className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          ログイン
        </CardTitle>
        <CardDescription className='text-center'>
          アカウントにログインしてください
        </CardDescription>
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-4 w-full'>
          {error && (
            <Alert variant='destructive'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>メールアドレス</Label>
            <Input
              id='email'
              type='email'
              placeholder='your@email.com'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>パスワード</Label>
            <Input
              id='password'
              type='password'
              placeholder='パスワードを入力'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={!isFormValid}
          >
            ログイン
          </Button>

          <div className='text-center text-sm'>
            <a
              href='/auth/reset-password'
              className='text-primary hover:underline'
            >
              パスワードをお忘れですか？
            </a>
          </div>

          <div className='text-center text-sm text-muted-foreground'>
            アカウントをお持ちでない方は{' '}
            <a
              href='/auth/register'
              className='text-primary hover:underline font-medium'
            >
              新規登録
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
