'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Loading } from '@/components/ui/Loading';
import { candidateResetPasswordRequestAction } from './actions';

interface ForgotPasswordFormData {
  email: string;
}

export function CandidateResetPasswordClient() {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError('メールアドレスは必須です');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ email: value });
    if (emailError) {
      setEmailError('');
    }
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      // userTypeをローカルストレージに保存（リダイレクト後の復元用）
      if (typeof window !== 'undefined') {
        localStorage.setItem('password_reset_user_type', 'candidate');
      }

      const result = await candidateResetPasswordRequestAction({
        email: formData.email,
      });

      if (result.success) {
        setSubmitStatus('success');
        setMessage(
          result.message ||
            'パスワード再設定のご案内のメールをお送りいたします。'
        );
      } else {
        setSubmitStatus('error');
        setMessage(
          result.error || 'パスワードリセット要求の送信に失敗しました。'
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Password reset request error:', error);
      setSubmitStatus('error');
      setMessage(
        'ネットワークエラーが発生しました。しばらくしてから再度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className='w-full max-w-none md:min-w-auto flex flex-col items-center relative bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
        <div className='flex flex-col gap-6 md:gap-10 items-center justify-start relative w-full mx-auto px-6 md:px-20 py-10 md:py-20'>
          {/* 成功ヘッダー */}
          <div className='flex flex-col gap-4 md:gap-6 items-center w-full text-center'>
            <div className='mx-auto w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-5 h-5 md:w-6 md:h-6 text-green-600' />
            </div>
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
                送信完了
              </p>
            </div>
            <div
              className='text-[#323232] text-[14px] md:text-[16px] w-full'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 500,
                lineHeight: '2',
                letterSpacing: '1.4px',
              }}
            >
              <p className='block mb-0 md:tracking-[1.6px]'>{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-reset-password-page
      className='w-full max-w-none md:min-w-auto flex flex-col items-center relative bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'
    >
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
              パスワードの再設定
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
              サービスに登録されているメールアドレスを入力してください。
            </p>
            <p className='block md:tracking-[1.6px]'>
              パスワード再設定のご案内のメールをお送りいたします。
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
          <div className='flex justify-center w-full'>
            <div className='flex flex-col gap-2 w-full max-w-[400px]'>
              <div className='bg-white border border-[#999999] border-solid rounded-[5px] cursor-pointer relative w-full'>
                <div className='flex items-center w-full h-full'>
                  <div className='flex items-center justify-start p-[11px] w-full gap-2.5'>
                    <input
                      type='email'
                      placeholder='メールアドレスを入力'
                      value={formData.email}
                      onChange={handleEmailChange}
                      className='grow min-w-0 bg-transparent text-[#323232] font-medium text-[14px] md:text-[16px] outline-none placeholder-[#999999]'
                      style={{
                        fontFamily: 'Noto Sans JP, sans-serif',
                        fontWeight: 500,
                        lineHeight: '2',
                        letterSpacing: '1.4px',
                        padding: 0,
                      }}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              {emailError && (
                <div className='mt-1 text-xs text-red-500 flex items-center'>
                  <AlertCircle className='w-3 h-3 mr-1' />
                  {emailError}
                </div>
              )}
            </div>
          </div>

          {/* 送信ボタン - レスポンシブ対応 */}
          <div className='flex justify-center w-full'>
            <button
              type='submit'
              disabled={isLoading || !formData.email}
              className='flex items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:max-w-[170px] px-6 sm:px-10 py-3 md:py-3.5 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#0f9058] to-[#229a4e] text-white font-bold text-[14px] md:text-[16px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0px_8px_15px_0px_rgba(0,0,0,0.2)] transition-all duration-200 gap-2.5'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
                lineHeight: '1.6',
                letterSpacing: '1.4px',
              }}
            >
              {isLoading ? (
                <>
                  <Loading inline size='sm' variant='white' />
                  送信中
                </>
              ) : (
                <p className='block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre md:tracking-[1.6px]'>
                  送信する
                </p>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
