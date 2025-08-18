'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Image from 'next/image';

export default function EmailSettingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // メール変更処理
    router.push('/candidate/setting/email/verify');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'メールアドレス変更' }
        ]}
        title="メールアドレス変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      <div className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full">
        <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-start justify-start p-[40px] relative rounded-[10px] shrink-0 w-full max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">メールアドレス変更</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新しいメールアドレス
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            確認メールを送信
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}