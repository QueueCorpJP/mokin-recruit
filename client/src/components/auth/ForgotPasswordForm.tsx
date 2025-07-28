'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface ForgotPasswordFormProps {
  userType?: 'candidate' | 'company' | 'admin';
}

export default function ForgotPasswordForm({
  userType = 'candidate',
}: ForgotPasswordFormProps) {
  const router = useRouter();
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
      const response = await fetch('/api/auth/reset-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          userType,
        }),
      });

      const result: ForgotPasswordResponse = await response.json();

      if (response.ok) {
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
      console.error('Password reset request error:', error);
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
      <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
        <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[800px] mx-auto px-20 py-20'>
          {/* 成功ヘッダー */}
          <div className='flex flex-col gap-6 items-center w-full text-center'>
            <div className='mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
              <CheckCircle className='w-6 h-6 text-green-600' />
            </div>
            <div className='text-[#0f9058] text-[32px] font-bold w-full' style={{
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 700,
              fontSize: '32px',
              lineHeight: '1.6',
              letterSpacing: '3.2px',
            }}>
              <p className='block leading-[1.6]'>送信完了</p>
            </div>
            <div className='text-[#323232] text-[16px] w-full' style={{
              fontFamily: 'Noto Sans JP, sans-serif',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: '2',
              letterSpacing: '1.6px',
            }}>
              <p className='block mb-0'>{message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center relative w-full h-auto bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='flex flex-col gap-10 items-center justify-start relative w-full max-w-[800px] mx-auto px-20 py-20'>
        {/* ヘッダー - 見出し+説明 */}
        <div className='flex flex-col gap-6 items-center w-full text-center'>
          <div className='text-[#0f9058] text-[32px] font-bold w-full' style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            fontWeight: 700,
            fontSize: '32px',
            lineHeight: '1.6',
            letterSpacing: '3.2px',
          }}>
            <p className='block leading-[1.6]'>パスワードの再設定</p>
          </div>
          <div className='text-[#323232] text-[16px] w-full' style={{
            fontFamily: 'Noto Sans JP, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '2',
            letterSpacing: '1.6px',
          }}>
            <p className='block mb-0 '>
              サービスに登録されているメールアドレスを入力してください。
            </p>
            <p className='block'>
              パスワード再設定のご案内のメールをお送りいたします。
            </p>
          </div>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} className='flex flex-col gap-10 items-center w-full'>
          {/* エラーメッセージ */}
          {submitStatus === 'error' && (
            <div className='flex items-center gap-2 text-red-600 text-sm'>
              <AlertCircle className='w-4 h-4' />
              <span>{message}</span>
            </div>
          )}

          {/* 入力フィールド - 通常 */}
          <div className='flex justify-center w-full'>
            <div className='flex flex-col gap-2 w-[400px]'>
              <div className='bg-white border border-[#999999] border-solid rounded-[5px] cursor-pointer relative w-full'>
                <div className='flex items-center w-full h-full'>
                  <div className='flex items-center justify-start p-[11px] w-full gap-2.5'>
                    <input
                      type='email'
                      placeholder='メールアドレスを入力'
                      value={formData.email}
                      onChange={handleEmailChange}
                      className='grow min-w-0 bg-transparent text-[#999999] font-medium text-[16px] outline-none placeholder-[#999999]'
                      style={{
                        fontFamily: 'Noto Sans JP, sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '2',
                        letterSpacing: '1.6px',
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

          {/* 送信ボタン - 通常サイズ_グリーン */}
          <div className='flex justify-center w-full'>
            <button
              type='submit'
              disabled={isLoading || !formData.email}
              className='flex items-center justify-center min-w-40 px-10 py-3.5 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#0f9058] to-[#229a4e] text-white font-bold text-[16px] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0px_8px_15px_0px_rgba(0,0,0,0.2)] transition-all duration-200 gap-2.5'
              style={{
                fontFamily: 'Noto Sans JP, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '1.6',
                letterSpacing: '1.6px',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  送信中...
                </>
              ) : (
                <p className='block font-bold leading-[1.6] text-[16px] whitespace-pre'>
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
