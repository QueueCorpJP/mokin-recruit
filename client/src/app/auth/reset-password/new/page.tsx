'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Note: metadata and viewport exports should be in a separate file for client components
// For now, we'll handle viewport in the component itself

// ローディング画面コンポーネント
function LoadingScreen({ message = '読み込み中...' }: { message?: string }) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
      <Navigation />
      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20'>
          <div className='text-center space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワードの再設定
            </h1>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
            <p className='text-[#323232] font-medium'>{message}</p>
          </div>
        </div>
      </main>
      <Footer variant='login-before' />
    </div>
  );
}

// メインコンテンツコンポーネント
function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, string>>({});
  const [parameterError, setParameterError] = useState<string | null>(null);
  const [isParametersReady, setIsParametersReady] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  // URLパラメータの安全な取得と検証
  useEffect(() => {
    try {
      const params: Record<string, string> = {};
      let hasValidParams = false;

      // すべてのURLパラメータを収集
      for (const [key, value] of searchParams.entries()) {
        params[key] = value;
      }

      setDebugInfo(params);

      // クライアントサイドでのみURLを取得
      if (typeof window !== 'undefined') {
        setCurrentUrl(window.location.href);
      }

      // 必須パラメータの存在確認
      const tokenHash = params.token_hash || params.token;
      const code = params.code;
      const accessToken = params.access_token;
      const error = params.error;

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
            if (params.error_description) {
              errorMessage = `エラー: ${params.error_description}`;
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
        console.log('🔍 Password Reset URL Parameters:', params);
        console.log('🔍 Has Valid Params:', hasValidParams);
        console.log('🔍 Full URL:', window.location.href);
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
        // Supabaseの様々なパラメータ形式に対応
        const tokenHash =
          searchParams.get('token_hash') || searchParams.get('token');
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const code = searchParams.get('code');
        const state = searchParams.get('state');

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
            allParams: debugInfo,
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
          type: type || 'recovery',
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
    [router, searchParams, debugInfo, parameterError]
  );

  // パラメータの準備ができていない場合はローディング表示
  if (!isParametersReady) {
    return <LoadingScreen message='パラメータを確認中...' />;
  }

  // パラメータエラーがある場合はエラー表示
  if (parameterError) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
        <Navigation />
        <main className='flex-1 flex items-center justify-center px-4 py-12'>
          <div className='w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20'>
            <div className='text-center space-y-6'>
              <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
                パスワードリセットエラー
              </h1>

              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription className='whitespace-pre-line'>
                  {parameterError}
                </AlertDescription>
              </Alert>

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
        </main>
        <Footer variant='login-before' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex flex-col'>
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20'>
          {/* 見出し+説明 */}
          <div className='text-center mb-10 space-y-6'>
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワードの再設定
            </h1>
            <p className='text-[#323232] font-bold text-base leading-8 tracking-[0.1em]'>
              半角英数字・記号のみ、8文字以上でパスワードを設定してください。
            </p>
          </div>

          {/* 開発環境でのデバッグ情報表示 */}
          {process.env.NODE_ENV === 'development' &&
            Object.keys(debugInfo).length > 0 && (
              <div className='mb-6 p-4 bg-gray-100 rounded-lg'>
                <h3 className='text-sm font-bold mb-2'>
                  🔍 Debug Info (開発環境のみ):
                </h3>
                <pre className='text-xs overflow-x-auto'>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}

          {/* フォーム */}
          <div className='flex justify-center'>
            <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </div>
  );
}

// Next.js 15推奨パターン: 単一のデフォルトエクスポート関数でSuspenseを使用
export default function NewPasswordPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <NewPasswordContent />
    </Suspense>
  );
}
