'use client';

import React, { useState } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('新規パスワードと再入力パスワードが一致しません');
      return;
    }
    router.push('/candidate/setting/password/complete');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'パスワード変更' }
        ]}
        title="パスワード変更"
        icon={<Lock className="w-8 h-8" />}
      />
      
      <div className="px-20 py-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[10px] p-10">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 items-start justify-end w-[591px]">
                <div className="flex-1 flex justify-end pt-[11px]">
                  <label className="font-bold text-base text-[#323232] tracking-[1.6px] whitespace-nowrap">
                    現在のパスワード
                  </label>
                </div>
                <div className="w-[400px]">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="半角英数字・記号のみ、8文字以上"
                      className="w-full h-[50px] p-[11px] pr-12 border border-[#999999] rounded-[5px] text-base text-[#323232] placeholder:text-[#999999] tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#323232]"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="w-full border-t border-[#e0e0e0] my-2"></div>
              
              <div className="flex gap-4 items-start justify-end w-[591px]">
                <div className="flex-1 flex justify-end pt-[11px]">
                  <label className="font-bold text-base text-[#323232] tracking-[1.6px] whitespace-nowrap">
                    新規パスワード
                  </label>
                </div>
                <div className="w-[400px]">
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="半角英数字・記号のみ、8文字以上"
                      className="w-full h-[50px] p-[11px] pr-12 border border-[#999999] rounded-[5px] text-base text-[#323232] placeholder:text-[#999999] tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#323232]"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 items-start justify-start">
                <div className="pt-[11px]">
                  <label className="font-bold text-base text-[#323232] tracking-[1.6px] whitespace-nowrap">
                    新規パスワード再入力
                  </label>
                </div>
                <div className="w-[400px]">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="半角英数字・記号のみ、8文字以上"
                      className="w-full h-[50px] p-[11px] pr-12 border border-[#999999] rounded-[5px] text-base text-[#323232] placeholder:text-[#999999] tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#323232]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center mt-10">
            <Link
              href="/candidate/setting"
              className="px-10 py-3.5 min-w-[160px] border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-base tracking-[1.6px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
            >
              保存せず戻る
            </Link>
            <button
              type="submit"
              className="px-10 py-3.5 min-w-[160px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white font-bold text-base tracking-[1.6px] text-center shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
            >
              変更を保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}