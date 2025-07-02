'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState, useEffect } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';

function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, string>>({});

  // URLパラメータのデバッグ情報を収集
  useEffect(() => {
    const params: Record<string, string> = {};

    // すべてのURLパラメータを収集
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    setDebugInfo(params);

    // 開発環境でのデバッグログ
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Password Reset URL Parameters:', params);
      console.log('🔍 Full URL:', window.location.href);
    }
  }, [searchParams]);

  const handleSubmit = useCallback(
    async (password: string, confirmPassword: string) => {
      setIsLoading(true);

      try {
        // Supabaseの様々なパラメータ形式に対応
        const tokenHash =
          searchParams.get('token_hash') || searchParams.get('token');
        const type = searchParams.get('type');
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        // 追加のパラメータもチェック（Supabaseの新しいバージョン対応）
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

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
          error,
          errorDescription,
          allParams: debugInfo,
        });

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
              if (errorDescription) {
                errorMessage = `エラー: ${errorDescription}`;
              }
          }

          throw new Error(errorMessage);
        }

        // 必須パラメータの確認（複数の形式に対応）
        if (!tokenHash && !code) {
          throw new Error(
            '無効なリンクです。パスワードリセットを再度お試しください。\n' +
              '（トークンまたはコードが見つかりません）'
          );
        }

        if (type && type !== 'recovery') {
          throw new Error(
            `無効なリンクタイプです: ${type}\n` +
              'パスワードリセット用のリンクを使用してください。'
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

        console.log('🚀 Sending password reset request...');

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          console.error('❌ Password reset API error:', data);
          throw new Error(data.error || 'パスワードの設定に失敗しました');
        }

        console.log('✅ Password reset successful');

        // 成功時は完了ページにリダイレクト
        router.push('/auth/reset-password/complete');
      } catch (error) {
        console.error('❌ Password reset error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, searchParams, debugInfo]
  );

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

export default function NewPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex items-center justify-center'>
          <div className='text-white text-xl font-bold'>読み込み中...</div>
        </div>
      }
    >
      <NewPasswordContent />
    </Suspense>
  );
}
