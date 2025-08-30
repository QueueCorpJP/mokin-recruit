'use client';

import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setPasswordAction } from './actions';
import { Button } from '@/components/ui/button';
import { PasswordFormField } from '@/components/ui/password-form-field';

interface PasswordFormCardProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: string;
}

function PasswordFormCard({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
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

      <div className="box-border content-stretch flex flex-col gap-6 items-end justify-center p-0 relative shrink-0 w-full">
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm w-full">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
        
        <PasswordFormField
          value={password}
          onChange={onPasswordChange}
          label="新規パスワード"
          placeholder="半角英数字・記号のみ、8文字以上"
          className="justify-end"
          inputWidth="md:w-[350px]"
        />

        <PasswordFormField
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          label="新規パスワード再入力"
          placeholder="確認のためもう一度入力"
          className="justify-end"
          inputWidth="md:w-[350px]"
          isConfirmField={true}
          confirmTarget={password}
        />
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
    // 半角英数字・記号のみチェック
    const validCharRegex = /^[\x20-\x7E]*$/;
    if (!validCharRegex.test(password)) {
      setError('半角英数字・記号のみで入力してください');
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


  return (
    <CandidateAuthBackground>
      <main className='md:flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] pb-20 md:pb-[460px] mb-0 flex justify-center items-start relative w-full'>
        <PasswordFormCard
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error}
        />
      </main>
    </CandidateAuthBackground>
  );
}