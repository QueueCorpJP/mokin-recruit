'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { loginAction } from '@/app/admin/auth/login/actions';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('userType', 'admin');
      
      await loginAction(formData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 flex-col items-start justify-start">
      <div className="w-full">
        <div className="text-center mb-[40px] mt-0">
          <h1 className="text-[32px] font-bold text-[#323232] mb-[16px] Noto_Sans_JP">
            管理画面ログイン
          </h1>
          <div className="space-y-2 Noto_Sans_JP font-[14px] text-[#323232] font-bold">
            <p>Cue Point管理画面のログインページです。</p>
            <p>ログイン情報をご入力いただき、「ログインする」からログインが可能です。</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 flex flex-col items-center">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力してください。"
              className="w-[360px] px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力してください。"
              className="w-[360px] px-4 py-3 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm placeholder-gray-500"
              required
            />
          </div>

          <div className="pt-2">
            <Button 
              variant="green-gradient" 
              className="px-[40px] h-[48px] text-[16px] font-bold rounded-[100px]"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'ログイン中...' : 'ログインする'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}