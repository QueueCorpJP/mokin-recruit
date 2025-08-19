'use client';

import React, { useState, useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { verifyCode, sendVerificationCode } from '../actions';

export default function MailVerifyPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const verificationEmail = sessionStorage.getItem('verificationEmail');
    if (!verificationEmail) {
      router.push('/candidate/setting/mail');
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
      
      if (result.error) {
        setError(result.error);
      } else {
        sessionStorage.removeItem('verificationEmail');
        // メールアドレス変更が完了したので、完了ページに移動
        router.push('/candidate/setting/mail/complete');
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
      
      if (result.error) {
        setError(result.error);
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
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'メールアドレス変更', href: '/candidate/setting/mail' },
          { label: '認証コードの入力' }
        ]}
        title="メールアドレス変更"
        icon={<Mail className="w-8 h-8" />}
      />
      
      <div className="px-20 py-10">
        <div className="bg-white rounded-[10px] p-10">
          <div className="flex flex-col gap-10 items-center">
            <div className="text-center w-full">
              <h2 className="text-[32px] font-bold text-[#0f9058] tracking-[3.2px] mb-6">
                認証コードの入力
              </h2>
              <div className="text-base font-bold text-[#323232] tracking-[1.6px] leading-8">
                <p>認証コードをメールアドレスに送りました。</p>
                <p>メールアドレスに届いた4桁の半角英数字を入力してください。</p>
                <p className="text-sm text-[#666666] mt-2">変更先: {email}</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex gap-4 items-start justify-center">
                <div className="pt-[11px]">
                  <label className="font-bold text-base text-[#323232] tracking-[1.6px] whitespace-nowrap">
                    認証コード
                  </label>
                </div>
                
                <div className="w-[400px] flex flex-col gap-2">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="4桁の半角英数字"
                    className="w-full p-[11px] border border-[#999999] rounded-[5px] text-base text-[#323232] placeholder:text-[#999999] tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                    maxLength={4}
                    required
                    disabled={isLoading}
                  />
                  {error && (
                    <p className="text-sm text-red-500 tracking-[1.4px]">
                      {error}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-center mt-6">
                <p className="text-sm font-bold text-[#323232] tracking-[1.4px] mb-1">
                  認証コードが受け取れなかった場合は、新規のコードを発行してください。
                </p>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-sm font-bold text-[#323232] tracking-[1.4px] underline hover:text-[#0f9058] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? '送信中...' : '新しいコードを発行する'}
                </button>
              </div>
              
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-3.5 min-w-[160px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white font-bold text-base tracking-[1.6px] text-center shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '認証中...' : '認証する'}
                </button>
              </div>
            </form>
            
            <div className="w-full border-t border-[#e0e0e0] pt-6">
              <div className="text-center w-[572px] mx-auto">
                <h3 className="text-[20px] font-bold text-[#0f9058] tracking-[2px] mb-[18px]">
                  認証コードが届かない場合
                </h3>
                <div className="text-sm font-bold text-[#323232] tracking-[1.4px] leading-[1.6]">
                  <p>「@example.com」からのメールを受信できる設定になっているか、</p>
                  <p>メールが迷惑メールボックスに振り分けられていないかをご確認の上、</p>
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