'use client';

import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/ui/navigation';
import { Button } from '@/components/ui/button';

export default function ResetPasswordCompletePage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  const handleHomeRedirect = () => {
    router.push('/');
  };

  return (
    <div className='min-h-screen flex flex-col'>
      {/* ヘッダー */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='flex-1 bg-gradient-to-b from-[#17856F] to-[#229A4E] flex items-center justify-center px-4 py-12'>
        {/* 背景装飾 */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -left-56 top-[395px] w-[1889.89px] h-[335px] bg-gradient-to-b from-[#198D76] to-[#1CA74F] rounded-full opacity-30'></div>
        </div>

        {/* カードコンテナ */}
        <div className='relative bg-white rounded-[10px] shadow-lg p-8 md:p-12 lg:p-20 w-full max-w-[800px]'>
          <div className='text-center space-y-8'>
            {/* 成功アイコン */}
            <div className='flex justify-center'>
              <div className='w-16 h-16 bg-[#0F9058] rounded-full flex items-center justify-center'>
                <svg
                  className='w-8 h-8 text-white'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
            </div>

            {/* 見出し */}
            <h1 className='text-[#0F9058] font-bold text-[32px] leading-[51.2px] tracking-[0.1em]'>
              パスワード再設定完了
            </h1>

            {/* 説明 */}
            <p className='text-[#323232] font-medium text-base leading-8'>
              パスワードの再設定が完了しました。
              <br />
              新しいパスワードでログインしてください。
            </p>

            {/* ボタン */}
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                onClick={handleLoginRedirect}
                className='bg-[#0F9058] text-white px-8 py-3 rounded-md hover:bg-[#0D7A4A] transition-colors'
              >
                ログインページへ
              </Button>
              <Button
                onClick={handleHomeRedirect}
                variant='outline'
                className='border border-[#0F9058] text-[#0F9058] px-8 py-3 rounded-md hover:bg-[#0F9058] hover:text-white transition-colors'
              >
                ホームページへ
              </Button>
            </div>
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
