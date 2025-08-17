'use client';

import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setPasswordAction } from './actions';
import { Button } from '@/components/ui/button';

interface PasswordFormCardProps {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}

function PasswordFormCard({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
  isLoading,
  error,
}: PasswordFormCardProps) {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 p-6 md:p-[80px] rounded-3xl md:rounded-[40px] w-full max-w-[480px] md:w-[800px] md:min-w-[720px]">
      <div className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold items-center justify-start leading-[0] p-0 relative shrink-0 text-center w-full gap-6">
        <div className="relative shrink-0 text-[#0f9058] w-full text-[24px] md:text-[32px] tracking-[2.4px] md:tracking-[3.2px]">
          <p className="block leading-[1.6]">パスワード</p>
        </div>
        <div className="relative shrink-0 text-[#323232] text-[14px] md:text-[16px] tracking-[1.4px] md:tracking-[1.6px] w-full leading-[2]">
          <p className="block leading-[2]">
            半角英数字・記号のみ、8文字以上でパスワードを設定してください
          </p>
        </div>
      </div>

      <div className="box-border content-stretch flex flex-col gap-6 items-end justify-center p-0 relative shrink-0">
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm w-full">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="box-border content-stretch flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0 md:w-48">
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[14px] md:text-[16px] text-left text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
              <p className="block leading-[2] whitespace-pre">新規パスワード</p>
            </div>
          </div>
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative flex-1">
            <div className="bg-[#ffffff] box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="半角英数字・記号のみ、8文字以上"
                className="flex-1 font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[14px] md:text-[16px] text-left tracking-[1.4px] md:tracking-[1.6px] bg-transparent outline-none"
                disabled={isLoading}
              />
              <button
                onClick={onTogglePasswordVisibility}
                type="button"
                className="aspect-[120/120] box-border content-stretch flex flex-row gap-2.5 h-full items-center justify-start p-0 relative shrink-0"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        <div className="box-border content-stretch flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-start p-0 relative shrink-0 w-full">
          <div className="box-border content-stretch flex flex-row items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0 md:w-48">
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[14px] md:text-[16px] text-left text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
              <p className="block leading-[2] whitespace-pre">新規パスワード再入力</p>
            </div>
          </div>
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative flex-1">
            <div className="bg-[#ffffff] box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                placeholder="確認のためもう一度入力"
                className="flex-1 font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[14px] md:text-[16px] text-left tracking-[1.4px] md:tracking-[1.6px] bg-transparent outline-none"
                disabled={isLoading}
              />
              <button
                onClick={onToggleConfirmPasswordVisibility}
                type="button"
                className="aspect-[120/120] box-border content-stretch flex flex-row gap-2.5 h-full items-center justify-start p-0 relative shrink-0"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Button
        onClick={onSubmit}
        variant="green-gradient"
        size="figma-default"
        className="min-w-40 w-full md:w-auto text-[14px] md:text-[16px] tracking-[1.4px] md:tracking-[1.6px]"
        disabled={isLoading || !password || !confirmPassword}
      >
        {isLoading ? '設定中...' : '設定する'}
      </Button>
    </div>
  );
}

export default function SignupPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');

  // ローカルストレージからユーザーIDを取得
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('signup_user_id');
      if (savedUserId) {
        setUserId(savedUserId);
      } else {
        // ユーザーIDがない場合は最初のページに戻る
        router.push('/signup');
      }
    }
  }, [router]);

  const validatePasswords = useCallback((): boolean => {
    if (!password) {
      setError('パスワードは必須です');
      return false;
    }
    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      return false;
    }
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return false;
    }
    setError('');
    return true;
  }, [password, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    if (!validatePasswords() || !userId) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await setPasswordAction({
        password,
        confirmPassword,
        userId,
      });

      if (result.success) {
        // ユーザーIDを保持したままプロフィール入力ページに遷移
        router.push('/signup/profile');
      } else {
        setError(result.error || 'パスワードの設定に失敗しました。');
      }
    } catch (error) {
      console.error('Set password error:', error);
      setError('ネットワークエラーが発生しました。しばらくしてから再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [validatePasswords, userId, router]);

  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleToggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword(!showConfirmPassword);
  }, [showConfirmPassword]);

  return (
    <CandidateAuthBackground>
      <main className='md:flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] pb-20 md:pb-[460px] mb-0 flex justify-center items-start relative w-full'>
        <PasswordFormCard
          password={password}
          confirmPassword={confirmPassword}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onTogglePasswordVisibility={handleTogglePasswordVisibility}
          onToggleConfirmPasswordVisibility={handleToggleConfirmPasswordVisibility}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </CandidateAuthBackground>
  );
}