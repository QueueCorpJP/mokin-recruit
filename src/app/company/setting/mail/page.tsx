'use client';

import React, { useState } from 'react';

import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendVerificationCode } from './actions';
import { Button } from '@/components/ui/button';

export default function MailChangePage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await sendVerificationCode(email);
      
      if (result.error) {
        setError(result.error);
      } else {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('verificationEmail', email);
        }
        router.push('/company/setting/mail/verify');
      }
    } catch (error) {
      setError('認証コードの送信に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: 'プロフィール・設定', href: '/company/setting' },
          { label: 'メールアドレス変更' }
        ]}
        title="メールアドレス変更"
        icon={<img src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[10px] p-4 md:p-10">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="pt-[11px]">
                <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                  変更後のメールアドレス
                </label>
              </div>
              
              <div className="w-full md:w-[400px] flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-[11px] border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs md:text-sm text-[#999999] tracking-[1.2px] md:tracking-[1.4px]">
                  入力されたメールアドレス宛に認証コードをお送りします。
                </p>
                {error && (
                  <p className="text-xs md:text-sm text-red-500 tracking-[1.2px] md:tracking-[1.4px]">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mt-10">
            <Link
              href="/company/setting"
              className="px-6 md:px-10 py-3.5 min-w-[120px] md:min-w-[160px] border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px] text-center hover:bg-[#0F9058]/20 transition-colors duration-200"
            >
              変更せず戻る
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              variant="green-gradient"
              size="figma-default"
              className="min-w-[120px] md:min-w-[160px] text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px]"
            >
              {isLoading ? '送信中...' : '認証コードを送信'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';