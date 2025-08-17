'use client';

import React, { useState } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MailChangePage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/candidate/setting/mail/verify');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'メールアドレス変更' }
        ]}
        title="メールアドレス変更"
        icon={<Mail className="w-8 h-8" />}
      />
      
      <div className="px-20 py-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[10px] p-10">
            <div className="flex gap-4 items-start">
              <div className="pt-[11px]">
                <label className="font-bold text-base text-[#323232] tracking-[1.6px] whitespace-nowrap">
                  変更後のメールアドレス
                </label>
              </div>
              
              <div className="w-[400px] flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-[11px] border border-[#999999] rounded-[5px] text-base text-[#323232] placeholder:text-[#999999] tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                  required
                />
                <p className="text-sm text-[#999999] tracking-[1.4px]">
                  入力されたメールアドレス宛に認証コードをお送りします。
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6 justify-center mt-10">
            <Link
              href="/candidate/setting"
              className="px-10 py-3.5 min-w-[160px] border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-base tracking-[1.6px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
            >
              変更せず戻る
            </Link>
            <button
              type="submit"
              className="px-10 py-3.5 min-w-[160px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white font-bold text-base tracking-[1.6px] text-center shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
            >
              認証コードを送信
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}