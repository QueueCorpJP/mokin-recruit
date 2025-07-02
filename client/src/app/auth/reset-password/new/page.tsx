'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useState } from 'react';
import { Navigation } from '@/components/ui/navigation';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';

function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (password: string, confirmPassword: string) => {
      setIsLoading(true);

      try {
        const token = searchParams.get('token');
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token || !tokenHash || type !== 'recovery') {
          throw new Error(
            '無効なリンクです。パスワードリセットを再度お試しください。'
          );
        }

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            tokenHash,
            type,
            password,
            confirmPassword,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'パスワードの設定に失敗しました');
        }

        // 成功時は完了ページにリダイレクト
        router.push('/auth/reset-password/complete');
      } catch (error) {
        console.error('Password reset error:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, searchParams]
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

          {/* フォーム */}
          <div className='flex justify-center'>
            <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className='bg-[#323232] text-white py-12'>
        <div className='max-w-6xl mx-auto px-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {/* 会社情報 */}
            <div className='space-y-4'>
              <h3 className='font-bold text-lg'>株式会社Mokin</h3>
              <div className='space-y-2 text-sm'>
                <p>〒100-0000</p>
                <p>東京都千代田区丸の内1-1-1</p>
                <p>TEL: 03-0000-0000</p>
                <p>FAX: 03-0000-0001</p>
              </div>
            </div>

            {/* サービス */}
            <div className='space-y-4'>
              <h3 className='font-bold text-lg'>サービス</h3>
              <div className='space-y-2 text-sm'>
                <p>転職支援サービス</p>
                <p>キャリア相談</p>
                <p>企業紹介</p>
                <p>面接対策</p>
              </div>
            </div>

            {/* サポート */}
            <div className='space-y-4'>
              <h3 className='font-bold text-lg'>サポート</h3>
              <div className='space-y-2 text-sm'>
                <p>よくある質問</p>
                <p>お問い合わせ</p>
                <p>利用規約</p>
                <p>プライバシーポリシー</p>
              </div>
            </div>
          </div>

          <div className='border-t border-gray-600 mt-8 pt-8 text-center text-sm'>
            <p>&copy; 2024 Mokin Recruit. All rights reserved.</p>
          </div>
        </div>
      </footer>
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
