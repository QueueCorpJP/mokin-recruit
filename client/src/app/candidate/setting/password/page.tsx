'use client';

import React, { useState } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { changePassword } from './actions';
import { Button } from '@/components/ui/button';

export default function PasswordChangePage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 新規パスワードと再入力パスワードの一致確認
      if (newPassword !== confirmPassword) {
        setError('新規パスワードと再入力パスワードが一致しません');
        setIsLoading(false);
        return;
      }

      // パスワードの最小長チェック
      if (newPassword.length < 8) {
        setError('新規パスワードは8文字以上である必要があります');
        setIsLoading(false);
        return;
      }

      // パスワード変更処理
      const result = await changePassword(currentPassword, newPassword);
      
      if (result.error) {
        setError(result.error);
      } else {
        // 成功時は完了ページへ遷移
        router.push('/candidate/setting/password/complete');
      }
    } catch (error) {
      setError('パスワードの変更に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'パスワード変更' }
        ]}
        title="パスワード変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[10px] p-4 md:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[5px]">
                <p className="text-sm text-red-600 tracking-[1.4px]">{error}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-4 items-start w-full md:w-[591px]">
                <div className="w-full md:flex-1 md:flex md:justify-end pt-[11px]">
                  <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                    現在のパスワード
                  </label>
                </div>
                <div className="w-full md:w-[400px]">
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="半角英数字・記号のみ、8文字以上"
                      className="w-full h-[50px] p-[11px] pr-12 border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      minLength={8}
                      disabled={isLoading}
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
              
              <div className="flex flex-col md:flex-row gap-4 items-start w-full md:w-[591px]">
                <div className="w-full md:flex-1 md:flex md:justify-end pt-[11px]">
                  <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                    新規パスワード
                  </label>
                </div>
                <div className="w-full md:w-[400px]">
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="半角英数字・記号のみ、8文字以上"
                      className="w-full h-[50px] p-[11px] pr-12 border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      minLength={8}
                      disabled={isLoading}
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
              
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="pt-[11px]">
                  <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                    新規パスワード再入力
                  </label>
                </div>
                <div className="w-full md:w-[400px]">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="半角英数字・記号のみ、8文字以上"
                      className="w-full h-[50px] p-[11px] pr-12 border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      minLength={8}
                      disabled={isLoading}
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
          
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-10">
            <Link
              href="/candidate/setting"
              className="px-6 md:px-10 py-3.5 min-w-[120px] md:min-w-[160px] border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px] text-center hover:bg-[#0F9058]/20 transition-colors duration-200"
            >
              保存せず戻る
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              variant="green-gradient"
              size="figma-default"
              className="min-w-[120px] md:min-w-[160px] text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px]"
            >
              {isLoading ? '変更中...' : '変更を保存'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}