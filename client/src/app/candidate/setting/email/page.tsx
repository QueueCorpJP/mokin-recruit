'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailSettingPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    // メール変更処理
    router.push('/candidate/setting/email/verify');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
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
  );
}