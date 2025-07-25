import { Metadata, Viewport } from 'next';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { ResetPasswordCompleteContent } from '@/components/auth/ResetPasswordCompleteContent';

export const metadata: Metadata = {
  title: 'パスワード再設定完了 | CuePoint',
  description: 'パスワードの再設定が完了しました',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

// Server Component (メタデータ、SEO、静的コンテンツ)
export default function ResetPasswordCompletePage() {
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col'>
      {/* ナビゲーション */}
      <Navigation />

      {/* メインコンテンツ */}
      <main className='min-h-[730px] flex flex-col relative px-4 pt-20'>
        {/* 背景装飾（Figmaの曲線） */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute left-[-224px] top-[395px] w-[1889.89px] h-[335px]'>
            <svg
              className='w-full h-full'
              fill='none'
              preserveAspectRatio='none'
              viewBox='0 0 1890 335'
            >
              <path
                d='M944.943 0C1303.11 0 1631.96 125.532 1889.89 335H0C257.931 125.532 586.776 0 944.943 0Z'
                fill='url(#paint0_linear_4387_76076)'
              />
              <defs>
                <linearGradient
                  gradientUnits='userSpaceOnUse'
                  id='paint0_linear_4387_76076'
                  x1='944.943'
                  x2='944.943'
                  y1='335'
                  y2='0'
                >
                  <stop stopColor='#198D76' />
                  <stop offset='1' stopColor='#1CA74F' />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* カードコンテナ */}
        <div className='relative w-full max-w-[800px] bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 mx-auto'>
          <div className='flex flex-col gap-10 items-center justify-start w-full'>
            {/* 見出し+説明 */}
            <div className='flex flex-col gap-6 items-center justify-start text-center w-full'>
              <div className='text-[#0f9058] text-[32px] tracking-[3.2px] w-full'>
                <p className='block leading-[1.6] font-bold font-[family-name:var(--font-noto-sans-jp)]'>パスワードの再設定</p>
              </div>
              <div className='text-[#323232] text-[16px] tracking-[1.6px] w-full font-bold font-[family-name:var(--font-noto-sans-jp)]'>
                <p className='block mb-0 leading-[2]'>パスワードの再設定が完了しました。</p>
                <p className='block leading-[2]'>セキュリティのため、定期的な変更をおすすめします。</p>
              </div>
            </div>
            
            {/* Client Component でインタラクティブ機能を処理 */}
            <ResetPasswordCompleteContent />
          </div>
        </div>
      </main>

      {/* フッター */}
      <Footer variant='login-before' />
    </div>
  );
}
