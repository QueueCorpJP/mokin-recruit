'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { signupVerifyAction, resendVerificationCodeAction } from './actions';

export function SignupVerifyClient() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [codeError, setCodeError] = useState('');

  const maskEmail = (email: string): string => {
    if (!email) return '~~~~~~~~~~~~~~';

    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;

    if (localPart.length <= 2) {
      return `${localPart[0]}*******@${domain}`;
    }

    const maskedLocal = `${localPart[0]}${'*'.repeat(7)}`;
    return `${maskedLocal}@${domain}`;
  };

  // ローカルストレージからメールアドレスを取得
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('signup_email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, []);

  const validateCode = (code: string): boolean => {
    if (!code) {
      setCodeError('認証コードは必須です');
      return false;
    }
    if (code.length !== 6) {
      setCodeError('認証コードは6桁で入力してください');
      return false;
    }
    setCodeError('');
    return true;
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setVerificationCode(value);
    if (codeError) {
      setCodeError('');
    }
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateCode(verificationCode)) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const result = await signupVerifyAction({
        verificationCode: verificationCode,
        email: email,
      });

      if (result.success) {
        // ユーザーIDをローカルストレージとクッキーに保存
        if (typeof window !== 'undefined' && result.userId) {
          localStorage.setItem('signup_user_id', result.userId);
          // クッキーにも保存（ページ間での共有を確実にするため）
          document.cookie = `signup_user_id=${result.userId}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;
        }

        // 成功時に直接パスワード設定ページに遷移
        router.push('/signup/password');
      } else {
        setSubmitStatus('error');
        setMessage(result.error || '認証に失敗しました。');
      }
    } catch (error) {
      console.error('Signup verify error:', error);
      setSubmitStatus('error');
      setMessage(
        'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      setSubmitStatus('error');
      setMessage(
        'メールアドレスが見つかりません。最初からやり直してください。'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await resendVerificationCodeAction(email);

      if (result.success) {
        setSubmitStatus('idle');
        setMessage(result.message || '新しい認証コードを送信しました。');
      } else {
        setSubmitStatus('error');
        setMessage(result.error || '認証コードの再送信に失敗しました。');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      setSubmitStatus('error');
      setMessage('ネットワークエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-full max-w-none md:min-w-auto flex flex-col items-center relative bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-6 md:gap-10 items-center justify-start relative w-full mx-auto px-6 md:px-20 py-10 md:py-20'>
        {/* ヘッダー - 見出し+説明 */}
        <div className='flex flex-col gap-4 md:gap-6 items-center w-full text-center'>
          <div
            className='text-[#0f9058] text-[24px] md:text-[32px] font-bold w-full'
            style={{
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 700,
              lineHeight: '1.6',
              letterSpacing: '2.4px',
            }}
          >
            <p className='block leading-[1.6] md:tracking-[3.2px]'>
              認証コードの入力
            </p>
          </div>
          <div
            className='text-[#323232] text-[14px] md:text-[16px] w-full'
            style={{
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 700,
              lineHeight: '2',
              letterSpacing: '1.4px',
            }}
          >
            <p className='block mb-0 md:tracking-[1.6px]'>
              認証コードを{maskEmail(email)}に送りました。
            </p>
            <p className='block md:tracking-[1.6px]'>
              メールアドレスに届いた6桁の半角英数字を入力してください。
            </p>
          </div>
        </div>

        {/* フォーム */}
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-8 md:gap-10 items-center w-full'
        >
          {/* エラーメッセージ */}
          {submitStatus === 'error' && (
            <div className='flex items-center gap-2 text-red-600 text-sm'>
              <AlertCircle className='w-4 h-4' />
              <span>{message}</span>
            </div>
          )}

          {/* 入力フィールド - レスポンシブ対応 */}
          <div className='flex flex-col md:flex-row gap-4 items-start justify-start w-full'>
            <div className='flex flex-row gap-2.5 items-center justify-center pb-0 pt-[11px] px-0'>
              <div
                className='font-bold text-[#323232] text-[16px] text-nowrap tracking-[1.6px]'
                style={{
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}
              >
                <p className='block leading-[2] whitespace-pre'>認証コード</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 items-start justify-start w-full md:w-[400px]'>
              <input
                type='text'
                placeholder='6桁の半角英数字'
                value={verificationCode}
                onChange={handleCodeChange}
                maxLength={6}
                className='bg-white border border-[#999999] border-solid rounded-[5px] cursor-pointer flex flex-row gap-2.5 items-center justify-start overflow-visible p-[11px] w-full font-medium text-[16px] tracking-[1.6px] focus:outline-none focus:border-[#0f9058]'
                style={{
                  fontFamily: 'Noto Sans JP, sans-serif',
                  fontWeight: 500,
                }}
                required
                disabled={isLoading}
              />
              {codeError && (
                <div className='mt-1 text-xs text-red-500 flex items-center'>
                  <AlertCircle className='w-3 h-3 mr-1' />
                  {codeError}
                </div>
              )}
            </div>
          </div>
          <div className='flex flex-col gap-1 items-center justify-start w-full'>
            <div
              className='font-bold text-[#323232] text-[14px] text-center tracking-[1.4px] leading-[1.6] w-full'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              <p className='block leading-[1.6]'>
                認証コードが受け取れなかった場合は、新規のコードを発行してください。
              </p>
            </div>
            <button
              type='button'
              onClick={e => handleResendCode(e)}
              disabled={isLoading || !email}
              className='flex items-center justify-center p-0 w-full md:w-36 text-[#323232] underline font-bold text-[14px] tracking-[1.4px] disabled:opacity-50 hover:text-[#0f9058] transition-colors'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
              }}
            >
              <p className='block leading-[1.6] text-[14px] whitespace-pre'>
                新しいコードを発行する
              </p>
            </button>
          </div>
          {/* 送信ボタン - レスポンシブ対応 */}
          <div className='flex justify-center w-full'>
            <Button
              type='submit'
              disabled={isLoading || !verificationCode}
              variant='green-gradient'
              size='figma-default'
              className='w-full sm:max-w-[313px] md:max-w-[170px] py-[17px] text-[16px]'
            >
              {isLoading ? '...認証中' : '認証する'}
            </Button>
          </div>
        </form>

        {/* 再送信セクション - フォーム外に移動 */}
      </div>
    </div>
  );
}
