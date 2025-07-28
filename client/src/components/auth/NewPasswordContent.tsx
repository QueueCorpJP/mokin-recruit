'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';

/**
 * URLフラグメント（#以降）からパラメータを解析する関数
 */
function parseFragmentParams(fragment: string): Record<string, string> {
  const params: Record<string, string> = {};

  if (!fragment) return params;

  // #を削除
  const cleanFragment = fragment.startsWith('#') ? fragment.slice(1) : fragment;

  // &で分割してパラメータを解析
  cleanFragment.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });

  return params;
}

// Client Component (インタラクティブ機能、状態管理)
export function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [parameterError, setParameterError] = useState<string | null>(null);
  const [isParametersReady, setIsParametersReady] = useState(false);
  const [allParams, setAllParams] = useState<Record<string, string>>({});
  const [userType, setUserType] = useState<'candidate' | 'company' | null>(null);

  // URLパラメータの安全な取得と検証（クエリパラメータ + フラグメントパラメータ）
  useEffect(() => {
    try {
      const queryParams: Record<string, string> = {};
      const fragmentParams: Record<string, string> = {};
      let hasValidParams = false;

      // クエリパラメータ（?以降）を収集
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }

      // ユーザータイプの取得（URLパラメータを最優先）
      const detectedUserType = queryParams.userType as 'candidate' | 'company';
      if (detectedUserType === 'candidate' || detectedUserType === 'company') {
        setUserType(detectedUserType);
      } else {
        // ユーザータイプが指定されていない場合はデフォルトで企業ユーザーとして扱う
        setUserType('company');
      }

      // フラグメントパラメータ（#以降）を収集（クライアントサイドでのみ）
      if (typeof window !== 'undefined') {
        const fragment = window.location.hash;
        Object.assign(fragmentParams, parseFragmentParams(fragment));
      }

      // 全パラメータをマージ（フラグメントパラメータを優先）
      const combinedParams = { ...queryParams, ...fragmentParams };
      setAllParams(combinedParams);

      // 必須パラメータの存在確認
      const tokenHash = combinedParams.token_hash || combinedParams.token;
      const code = combinedParams.code;
      const accessToken = combinedParams.access_token;
      const error = combinedParams.error;

      // エラーパラメータがある場合の処理
      if (error) {
        let errorMessage = 'パスワードリセットリンクでエラーが発生しました。';

        switch (error) {
          case 'access_denied':
            if (combinedParams.error_code === 'otp_expired') {
              errorMessage =
                'パスワードリセットリンクの有効期限が切れています（1時間）。新しいリンクを要求してください。';
            } else {
              errorMessage =
                'アクセスが拒否されました。新しいパスワードリセットを要求してください。';
            }
            break;
          case 'invalid_request':
            errorMessage =
              '無効なリクエストです。正しいリンクを使用してください。';
            break;
          case 'expired_token':
          case 'otp_expired':
            errorMessage =
              'パスワードリセットリンクの有効期限が切れています（1時間）。新しいリンクを要求してください。';
            break;
          default:
            if (combinedParams.error_description) {
              errorMessage = `エラー: ${decodeURIComponent(combinedParams.error_description)}`;
            }
        }
        setParameterError(errorMessage);
        setIsParametersReady(true);
        return;
      }

      // 有効なパラメータの確認
      if (tokenHash || code || accessToken) {
        hasValidParams = true;
      }

      if (!hasValidParams) {
        setParameterError(
          '無効なリンクです。パスワードリセットを再度お試しください。'
        );
      }

      setIsParametersReady(true);
    } catch (error) {
      setParameterError('URLパラメータの処理中にエラーが発生しました。');
      setIsParametersReady(true);
    }
  }, [searchParams]);

  const handleSubmit = useCallback(
    async (password: string, confirmPassword: string) => {
      // パラメータエラーがある場合は処理しない
      if (parameterError) {
        throw new Error(parameterError);
      }

      setIsLoading(true);

      try {
        // 統合されたパラメータから認証情報を取得
        const tokenHash = allParams.token_hash || allParams.token;
        const type = allParams.type || 'recovery';
        const accessToken = allParams.access_token;
        const refreshToken = allParams.refresh_token;
        const code = allParams.code;
        const state = allParams.state;

        // 必須パラメータの最終確認
        if (!tokenHash && !code && !accessToken) {
          throw new Error(
            '無効なリンクです。パスワードリセットを再度お試しください。'
          );
        }

        // APIリクエストのペイロード構築
        const requestBody = {
          tokenHash,
          type,
          accessToken,
          refreshToken,
          code,
          state,
          password,
          confirmPassword,
        };

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'パスワードの設定に失敗しました');
        }

        // 成功時は完了ページにリダイレクト（userTypeパラメータを引き継ぐ）
        const redirectUrl = `/auth/reset-password/complete?userType=${userType}`;
        router.push(redirectUrl);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, allParams, parameterError, userType]
  );

  // パラメータの準備ができていない場合はローディング表示
  if (!isParametersReady) {
    return (
      <div className='w-full max-w-md text-center space-y-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
        <p className='text-[#323232] font-medium'>パラメータを確認中...</p>
      </div>
    );
  }

  // パラメータエラーがある場合はエラー表示
  if (parameterError) {
    return (
      <div className={`w-full max-w-md space-y-6 ${
        userType === 'candidate' 
          ? 'bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]' 
          : ''
      }`}>
        <div className='text-center space-y-4'>
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>
              {parameterError}
            </AlertDescription>
          </Alert>

          <div className='space-y-4'>
            <p className='text-[#323232] font-medium text-[14px] md:text-base leading-8'>
              以下の方法をお試しください：
            </p>
            <ul className='text-left text-[#323232] text-[12px] md:text-sm space-y-2'>
              <li>• パスワードリセットリンクは<strong>1時間で期限切れ</strong>になります</li>
              <li>• リンクは<strong>1回限り</strong>の使用です</li>
              <li>• 下記ボタンから新しいリセットを要求してください</li>
              <li>• 新しいメールが届いたら即座にリンクをクリックしてください</li>
            </ul>

            <div className='flex flex-col gap-3 mt-6'>
              <button
                onClick={() => {
                  const resetPath = userType === 'candidate' 
                    ? '/candidate/auth/reset-password' 
                    : '/company/auth/reset-password';
                  router.push(resetPath);
                }}
                className='bg-[#0F9058] text-white px-6 py-3 rounded-[25px] hover:bg-[#0D7A4A] transition-colors font-bold tracking-[0.1em] text-[14px] md:text-[16px]'
              >
                新しいリセットを要求
              </button>
              <button
                onClick={() => {
                  const loginPath = userType === 'candidate' 
                    ? '/candidate/auth/login' 
                    : '/company/auth/login';
                  router.push(loginPath);
                }}
                className='border border-[#0F9058] text-[#0F9058] px-6 py-3 rounded-[25px] hover:bg-[#0F9058] hover:text-white transition-colors font-bold tracking-[0.1em] text-[14px] md:text-[16px]'
              >
                ログインページに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正常時はパスワードリセットフォームを表示（Figmaデザインに合わせたシンプルな構成）
  return (
    <div className='w-full'>
      {userType === 'candidate' ? (
        // 候補者の場合は親でCandidateAuthBackgroundを使用するため、フォームのみ表示
        <div className='relative w-full max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]'>
          <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} userType="candidate" />
        </div>
      ) : (
        // 企業ユーザーの場合は従来通り
        <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} userType="company" />
      )}
    </div>
  );
}
