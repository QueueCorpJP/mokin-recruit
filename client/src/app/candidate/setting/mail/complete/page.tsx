'use client';

import React from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Mail } from 'lucide-react';
import Link from 'next/link';

export default function MailCompletePage() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'メールアドレス変更', href: '/candidate/setting/mail' },
          { label: '完了' }
        ]}
        title="メールアドレス変更"
        icon={<Mail className="w-8 h-8" />}
      />
      
      <div className="px-20 py-10">
        <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-10">
          <div className="text-center py-20">
            <h2 className="text-[32px] font-bold text-[#0f9058] tracking-[3.2px] mb-6">
              メールアドレスの変更が完了しました。
            </h2>
            <p className="text-base font-bold text-[#323232] tracking-[1.6px] leading-8">
              今後は変更後のメールアドレスでログインが可能です。
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Link
            href="/candidate/setting"
            className="px-10 py-3.5 min-w-[160px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white font-bold text-base tracking-[1.6px] text-center shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
          >
            各種設定ページへ
          </Link>
        </div>
      </div>
    </div>
  );
}