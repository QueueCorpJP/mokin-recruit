'use client';

import { useState, useTransition, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signupRequestAction, SignupResult } from './actions';
import { checkRegistrationProgress } from './checkRegistrationProgress';

interface SignupClientProps {
  onSubmit?: (email: string) => void;
}

export function SignupClient({ onSubmit }: SignupClientProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [isPending, startTransition] = useTransition();
  const [isCheckingProgress, setIsCheckingProgress] = useState(false);

  // Check if user has existing progress on component mount
  useEffect(() => {
    const checkExistingProgress = async () => {
      // クッキーから認証済みユーザーIDを確認
      const signupUserId = document.cookie
        .split('; ')
        .find(row => row.startsWith('signup_user_id='))
        ?.split('=')[1];

      if (signupUserId) {
        setIsCheckingProgress(true);
        try {
          // クッキーからメールアドレスを取得
          const cookieEmail = document.cookie
            .split('; ')
            .find(row => row.startsWith('signup_email='))
            ?.split('=')[1];

          // クッキーまたはlocalStorageからメールアドレスを取得
          const emailToCheck =
            cookieEmail || localStorage.getItem('signup_email');

          if (emailToCheck) {
            const progress = await checkRegistrationProgress(emailToCheck);
            if (progress.exists && progress.nextStep !== '/signup') {
              // 途中から再開
              localStorage.setItem('signup_email', emailToCheck); // localStorageにも保存
              router.push(progress.nextStep);
              return;
            }
          }
        } catch (error) {
          console.error('Progress check error:', error);
        } finally {
          setIsCheckingProgress(false);
        }
      }

      // 認証済みユーザーでない場合、localStorageをクリア
      if (typeof window !== 'undefined') {
        localStorage.removeItem('signup_email');
      }
    };

    checkExistingProgress();
  }, [router]);

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('メールアドレスを入力してください');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('メールアドレスの形式が正しくありません');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // リアルタイムバリデーション
    if (value && !value.includes('@')) {
      setEmailError('メールアドレスの形式が正しくありません');
    } else if (value && value.includes('@') && !value.includes('.')) {
      setEmailError('メールアドレスの形式が正しくありません');
    } else if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('メールアドレスの形式が正しくありません');
    } else {
      setEmailError('');
    }

    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleAgreementChange = (checked: boolean) => {
    setAgreed(checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    if (!agreed) {
      setSubmitStatus('error');
      setMessage('利用規約・個人情報の取扱いに同意してください。');
      return;
    }

    startTransition(async () => {
      try {
        // First check if this email already has progress
        const progress = await checkRegistrationProgress(email.trim());

        // すでに本登録済み（全ステップ完了）の場合はエラー表示して弾く
        if (progress.exists && progress.completedSteps.expectationCompleted) {
          setSubmitStatus('error');
          setMessage(
            'このメールアドレスは既に本登録済みです。ログインしてください。'
          );
          return;
        }

        // 途中ステップが未完了の場合のみ途中から再開
        if (progress.exists && progress.nextStep !== '/signup') {
          localStorage.setItem('signup_email', email.trim());
          router.push(progress.nextStep);
          return;
        }

        // クッキーに認証済みユーザーIDがある場合、OTP認証をスキップしてパスワード設定へ
        const signupUserId = document.cookie
          .split('; ')
          .find(row => row.startsWith('signup_user_id='))
          ?.split('=')[1];

        if (
          signupUserId &&
          progress.exists &&
          !progress.completedSteps.passwordSet
        ) {
          localStorage.setItem('signup_email', email.trim());
          router.push('/signup/password');
          return;
        }

        const result: SignupResult = await signupRequestAction({
          email: email.trim(),
        });

        if (result.success) {
          // メールアドレスをローカルストレージに保存
          if (typeof window !== 'undefined') {
            localStorage.setItem('signup_email', email.trim());
          }

          // コールバック実行
          if (onSubmit) {
            onSubmit(email.trim());
          }

          // 成功時に直接verifyページに遷移
          router.push('/signup/verify');
        } else {
          setSubmitStatus('error');
          // エラーメッセージをチェックして適切なメッセージを設定
          if (result.error && result.error.includes('already registered')) {
            setMessage('このメールアドレスは既に登録されています');
          } else if (result.error && result.error.includes('既に登録')) {
            setMessage('このメールアドレスは既に登録されています');
          } else {
            setMessage(result.error || '会員登録要求の送信に失敗しました。');
          }
        }
      } catch (error) {
        console.error('Signup request error:', error);
        setSubmitStatus('error');
        setMessage(
          'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
        );
      }
    });
  };

  const isFormValid = email && agreed;

  // Show loading state while checking progress
  if (isCheckingProgress) {
    return (
      <div className='flex flex-col gap-6 items-center w-full text-center'>
        <p className='text-[#323232] text-[16px]'>...登録状況を確認中</p>
      </div>
    );
  }

  return (
    <>
      {/* ヘッダー - 見出し */}
      <div className='flex flex-col gap-6 items-center w-full text-center'>
        <div
          className='text-[#0f9058] text-[32px] font-bold w-full'
          style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '1.6',
            letterSpacing: '3.2px',
          }}
        >
          <p className='block leading-[1.6]'>新規会員登録</p>
        </div>
      </div>

      {/* フォーム */}
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-[40px] items-center w-full'
      >
        {/* エラーメッセージ */}
        {submitStatus === 'error' && (
          <div className='flex items-center gap-2 text-red-600 text-sm'>
            <AlertCircle className='w-4 h-4' />
            <span>{message}</span>
          </div>
        )}

        {/* メールアドレス入力 */}
        <div className='flex flex-col md:flex-row gap-4 items-start justify-start w-full'>
          <div className='flex flex-row gap-2.5 items-center justify-center pb-0 pt-[11px] px-0'>
            <div
              className='font-bold text-[#323232] text-[16px] text-nowrap tracking-[1.6px]'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              <p className='block leading-[2] whitespace-pre'>メールアドレス</p>
            </div>
          </div>
          <div className='flex flex-col gap-2 items-start justify-start w-full md:w-[400px]'>
            <input
              type='email'
              value={email}
              onChange={handleEmailChange}
              placeholder='name@example.com'
              className='bg-white border border-[#999999] border-solid rounded-[5px] cursor-pointer flex flex-row gap-2.5 items-center justify-start overflow-visible p-[11px] w-full font-medium text-[16px] tracking-[1.6px] focus:outline-none focus:border-[#0f9058]'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 500,
              }}
              required
              disabled={isPending}
            />
            {emailError && (
              <div className='mt-1 text-xs text-red-500 flex items-center'>
                <AlertCircle className='w-3 h-3 mr-1' />
                {emailError}
              </div>
            )}
          </div>
        </div>

        {/* 同意チェックボックス */}
        <div className='flex flex-row gap-2 items-center justify-center w-full '>
          <Checkbox
            checked={agreed}
            onChange={handleAgreementChange}
            disabled={isPending}
          />
          <div className='flex flex-wrap items-center justify-start'>
            <a
              href='/candidate/terms'
              target='_blank'
              rel='noopener noreferrer'
              className='font-bold text-[#323232] text-[14px] tracking-[1.4px] underline mr-1'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              利用規約
            </a>
            <span
              className='font-bold text-[#323232] text-[14px] tracking-[1.4px] mr-1'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              ・
            </span>
            <a
              href='/candidate/privacy'
              target='_blank'
              rel='noopener noreferrer'
              className='font-bold text-[#323232] text-[14px] tracking-[1.4px] underline mr-1'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              個人情報の取扱い
            </a>
            <span
              className='font-bold text-[#323232] text-[14px] tracking-[1.4px]'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              に同意する
            </span>
          </div>
        </div>

        {/* 送信ボタン */}
        <div className='flex justify-center w-full'>
          <Button
            type='submit'
            disabled={isPending || !isFormValid}
            variant='green-gradient'
            size='figma-default'
            className='w-full md:w-auto min-w-40 py-[17px] text-[16px]'
          >
            {isPending ? '...送信中' : '会員登録（無料）'}
          </Button>
        </div>
      </form>
    </>
  );
}
