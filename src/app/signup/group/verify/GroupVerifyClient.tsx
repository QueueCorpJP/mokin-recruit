'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BaseInput } from '@/components/ui/base-input';
import { useRouter } from 'next/navigation';
import { verifyGroupSignupCode } from '../actions';

interface GroupVerifyClientProps {
  email: string;
}

export function GroupVerifyClient({ email }: GroupVerifyClientProps) {
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!email) {
      router.push('/signup/group');
    }
  }, [email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!code || code.length !== 4) {
      setMessage({
        type: 'error',
        text: '4桁の認証コードを入力してください。',
      });
      setIsSubmitting(false);
      return;
    }

    if (!email) {
      setMessage({
        type: 'error',
        text: 'メールアドレスが指定されていません。',
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await verifyGroupSignupCode(email, code);

      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        // 認証成功とアカウント作成完了 - ログインページに遷移
        router.push('/company/auth/login');
      }
    } catch (error) {
      console.error('認証エラー:', error);
      setMessage({ type: 'error', text: 'システムエラーが発生しました。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    // 新しいコード送信は元のページに戻る
    router.push(`/signup/group?resend=true&email=${encodeURIComponent(email)}`);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full'>
      {/* メッセージ表示 */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 入力項目エリア */}
      <div className='flex flex-col gap-6 w-full'>
        {/* 認証コード input */}
        <div className='flex w-full justify-center'>
          <div
            className='flex flex-row justify-center gap-4 w-full max-w-[620px]'
            style={{ alignItems: 'center' }}
          >
            <span
              className='font-bold text-right'
              style={{
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
                width: '160px',
              }}
            >
              認証コード
            </span>
            <BaseInput
              id='code'
              value={code}
              onChange={e => {
                // 4桁までの数字のみ許可
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
                setCode(value);
              }}
              placeholder='4桁の認証コードを入力してください'
              className='w-full'
              style={{ maxWidth: '400px' }}
              type='text'
              inputMode='numeric'
              maxLength={4}
              required
            />
          </div>
        </div>
        {/* 認証コード再発行案内テキスト */}
        <div
          className='flex flex-row justify-center gap-2 w-full max-w-[620px]'
          style={{ marginTop: '8px' }}
        >
          <span
            className='font-bold text-center'
            style={{
              fontSize: '14px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
              minWidth: '160px',
            }}
          >
            認証コードが受け取れなかった場合は、新規のコードを発行してください。
            <br />
            <button
              type='button'
              onClick={handleResendCode}
              style={{
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
                fontWeight: 'bold',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                color: 'inherit',
                fontSize: 'inherit',
                padding: 0,
              }}
            >
              新しいコードを発行する
            </button>
          </span>
        </div>
      </div>
      {/* 送信ボタン */}
      <div className='flex w-full justify-center mt-10'>
        <Button
          type='submit'
          variant='green-gradient'
          disabled={isSubmitting || code.length !== 4}
          style={{
            width: '160px',
            height: '60px',
            borderRadius: '9999px',
          }}
        >
          {isSubmitting ? '認証中...' : '認証する'}
        </Button>
      </div>
    </form>
  );
}
