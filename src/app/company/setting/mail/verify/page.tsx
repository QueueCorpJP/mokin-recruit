'use client';

import React, { useState, useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { useRouter } from 'next/navigation';
import { verifyCode, sendVerificationCode } from '../actions';
import { Button } from '@/components/ui/button';

export default function MailVerifyPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;

    const verificationEmail = sessionStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      router.push('/company/setting/mail');
      return;
    }
    setEmail(verificationEmail);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await verifyCode(verificationCode);

      if ((result as any).error) {
        setError((result as any).error || '認証が必要です');
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('verificationEmail');
        }
        // メールアドレス変更が完了したので、完了ページに移動
        router.push('/company/setting/mail/complete');
      }
    } catch (error) {
      setError('認証に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsResending(true);
    setError('');

    try {
      const result = await sendVerificationCode(email);

      if ((result as any).error) {
        setError((result as any).error || '認証が必要です');
      } else {
        setError('');
        alert('新しい認証コードを送信しました');
      }
    } catch (error) {
      setError('認証コードの再送信に失敗しました');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      <SettingsHeader
        breadcrumbs={[
          { label: 'プロフィール・設定', href: '/company/setting' },
          { label: 'メールアドレス変更', href: '/company/setting/mail' },
          { label: '認証コード入力' },
        ]}
        title='認証コード入力'
        icon={
          <img src='/images/setting.svg' alt='設定' width={32} height={32} />
        }
      />

      <div className='px-4 md:px-20 py-10'>
        <div className='bg-white rounded-[10px] p-4 md:p-10'>
          <div className='flex flex-col gap-6 md:gap-10 items-center'>
            <div className='text-center w-full'>
              <h2 className='text-xl md:text-[32px] font-bold text-[#0f9058] tracking-[1.8px] md:tracking-[3.2px] mb-4 md:mb-6'>
                認証コードの入力
              </h2>
              <div className='text-sm md:text-base font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.6px] leading-6 md:leading-8'>
                <p>認証コードをメールアドレスに送りました。</p>
                <p>メールアドレスに届いた4桁の半角英数字を入力してください。</p>
                <p className='text-xs md:text-sm text-[#666666] mt-2'>
                  変更先: {email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className='w-full'>
              <div className='flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-center'>
                <div className='pt-0 md:pt-[11px] w-full md:w-auto'>
                  <label className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap'>
                    認証コード
                  </label>
                </div>

                <div className='w-full md:w-[400px] flex flex-col gap-2'>
                  <input
                    type='text'
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    placeholder='4桁の半角英数字'
                    className='w-full p-[11px] border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent'
                    maxLength={4}
                    required
                    disabled={isLoading}
                  />
                  {error && (
                    <p className='text-xs md:text-sm text-red-500 tracking-[1.2px] md:tracking-[1.4px]'>
                      {error}
                    </p>
                  )}
                </div>
              </div>

              <div className='text-center mt-4 md:mt-6'>
                <p className='text-xs md:text-sm font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.4px] mb-1'>
                  認証コードが受け取れなかった場合は、新規のコードを発行してください。
                </p>
                <button
                  type='button'
                  onClick={handleResendCode}
                  disabled={isResending}
                  className='text-xs md:text-sm font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.4px] underline hover:text-[#0f9058] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isResending ? '送信中...' : '新しいコードを発行する'}
                </button>
              </div>

              <div className='flex justify-center mt-4 md:mt-6'>
                <Button
                  type='submit'
                  disabled={isLoading}
                  variant='green-gradient'
                  size='figma-default'
                  className='min-w-[120px] md:min-w-[160px] w-full md:w-auto text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px]'
                >
                  {isLoading ? '認証中...' : '認証する'}
                </Button>
              </div>
            </form>

            <div className='w-full border-t border-[#e0e0e0] pt-4 md:pt-6'>
              <div className='text-center max-w-full md:max-w-[572px] mx-auto px-4 md:px-0'>
                <h3 className='text-lg md:text-[20px] font-bold text-[#0f9058] tracking-[1.6px] md:tracking-[2px] mb-3 md:mb-[18px]'>
                  認証コードが届かない場合
                </h3>
                <div className='text-xs md:text-sm font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.4px] leading-[1.6]'>
                  <p>
                    「@example.com」からのメールを受信できる設定になっているか、
                  </p>
                  <p>
                    メールが迷惑メールボックスに振り分けられていないかをご確認の上、
                  </p>
                  <p>新しい認証コードを再度送信してください。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
