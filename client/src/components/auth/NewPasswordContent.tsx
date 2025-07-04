'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [debugInfo, setDebugInfo] = useState<Record<string, string>>({});
  const [parameterError, setParameterError] = useState<string | null>(null);
  const [isParametersReady, setIsParametersReady] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [allParams, setAllParams] = useState<Record<string, string>>({});

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

      // フラグメントパラメータ（#以降）を収集（クライアントサイドでのみ）
      if (typeof window !== 'undefined') {
        const fragment = window.location.hash;
        Object.assign(fragmentParams, parseFragmentParams(fragment));
        setCurrentUrl(window.location.href);
      }

      // 全パラメータをマージ（フラグメントパラメータを優先）
      const combinedParams = { ...queryParams, ...fragmentParams };
      setAllParams(combinedParams);
      setDebugInfo(combinedParams);

      // 必須パラメータの存在確認
      const tokenHash = combinedParams.token_hash || combinedParams.token;
      const code = combinedParams.code;
      const accessToken = combinedParams.access_token;
      const refreshToken = combinedParams.refresh_token;
      const type = combinedParams.type;
      const error = combinedParams.error;

      // エラーパラメータがある場合の処理
      if (error) {
        let errorMessage = 'パスワードリセットリンクでエラーが発生しました。';

        switch (error) {
          case 'access_denied':
            errorMessage =
              'アクセスが拒否されました。新しいパスワードリセットを要求してください。';
            break;
          case 'invalid_request':
            errorMessage =
              '無効なリクエストです。正しいリンクを使用してください。';
            break;
          case 'expired_token':
            errorMessage =
              'リンクの有効期限が切れています。新しいパスワードリセットを要求してください。';
            break;
          default:
            if (combinedParams.error_description) {
              errorMessage = `エラー: ${combinedParams.error_description}`;
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
          '無効なリンクです。パスワードリセットを再度お試しください。\n' +
            '（認証パラメータが見つかりません）'
        );
      }

      setIsParametersReady(true);

      // 開発環境でのデバッグログ（クライアントサイドでのみ実行）
      if (
        process.env.NODE_ENV === 'development' &&
        typeof window !== 'undefined'
      ) {
        console.log('🔍 Password Reset URL Parameters Analysis:', {
          queryParams,
          fragmentParams,
          combinedParams,
          hasValidParams,
          fullUrl: window.location.href,
          fragment: window.location.hash,
        });
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        console.error('❌ Parameter processing error:', error);
      }
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

        // クライアントサイドでのみデバッグログ出力
        if (typeof window !== 'undefined') {
          console.log('🔍 Password reset parameters (詳細):', {
            tokenHash: tokenHash ? `${tokenHash.substring(0, 10)}...` : null,
            type,
            accessToken: accessToken
              ? `${accessToken.substring(0, 10)}...`
              : null,
            refreshToken: refreshToken
              ? `${refreshToken.substring(0, 10)}...`
              : null,
            code: code ? `${code.substring(0, 10)}...` : null,
            state,
            allParams: Object.keys(allParams),
          });
        }

        // 必須パラメータの最終確認
        if (!tokenHash && !code && !accessToken) {
          throw new Error(
            '無効なリンクです。パスワードリセットを再度お試しください。\n' +
              '（認証トークンが見つかりません）'
          );
        }

        // APIリクエストのペイロード構築
        const requestBody = {
          // 従来のパラメータ
          tokenHash,
          type,
          accessToken,
          refreshToken,
          // 新しい形式のパラメータ
          code,
          state,
          // パスワード情報
          password,
          confirmPassword,
        };

        if (typeof window !== 'undefined') {
          console.log('🚀 Sending password reset request...');
        }

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          if (typeof window !== 'undefined') {
            console.error('❌ Password reset API error:', data);
          }
          throw new Error(data.error || 'パスワードの設定に失敗しました');
        }

        if (typeof window !== 'undefined') {
          console.log('✅ Password reset successful');
        }

        // 成功時は完了ページにリダイレクト
        router.push('/auth/reset-password/complete');
      } catch (error) {
        if (typeof window !== 'undefined') {
          console.error('❌ Password reset error:', error);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, allParams, parameterError]
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
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center space-y-4'>
          <h2 className='text-[#0F9058] font-bold text-xl'>
            パスワードリセットエラー
          </h2>

          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription className='whitespace-pre-line'>
              {parameterError}
            </AlertDescription>
          </Alert>

          {/* 開発環境でのデバッグ情報表示 */}
          {process.env.NODE_ENV === 'development' && (
            <Alert>
              <AlertDescription>
                <div className='text-left text-xs'>
                  <strong>デバッグ情報:</strong>
                  <pre className='mt-2 overflow-auto'>
                    {JSON.stringify(
                      {
                        currentUrl: currentUrl,
                        allParams: allParams,
                        fragmentPresent:
                          typeof window !== 'undefined'
                            ? !!window.location.hash
                            : false,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className='space-y-4'>
            <p className='text-[#323232] font-medium text-base leading-8'>
              以下の方法をお試しください：
            </p>
            <ul className='text-left text-[#323232] text-sm space-y-2'>
              <li>• メールから再度リンクをクリックしてください</li>
              <li>• 新しいパスワードリセットを要求してください</li>
              <li>• リンクの有効期限（1時間）を確認してください</li>
            </ul>

            <div className='flex justify-center gap-4 mt-6'>
              <button
                onClick={() => router.push('/auth/reset-password')}
                className='bg-[#0F9058] text-white px-6 py-2 rounded-md hover:bg-[#0D7A4A] transition-colors'
              >
                新しいリセットを要求
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className='border border-[#0F9058] text-[#0F9058] px-6 py-2 rounded-md hover:bg-[#0F9058] hover:text-white transition-colors'
              >
                ログインページに戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正常時はパスワードリセットフォームを表示
  return (
    <div className='w-full max-w-md space-y-6'>
      <div className='text-center space-y-4'>
        <h2 className='text-[#0F9058] font-bold text-xl'>
          新しいパスワードを設定
        </h2>
        <p className='text-[#323232] font-medium text-base leading-8'>
          新しいパスワードを入力してください
        </p>
      </div>

      <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
