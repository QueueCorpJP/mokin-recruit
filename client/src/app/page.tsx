import Link from 'next/link';
import { Navigation } from '@/components/ui/navigation';
import { Logo } from '@/components/ui/logo';
import { HeroSection } from '@/components/ui/hero-section';

export default function Home() {
  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Additional Content Sections */}
      <main className='bg-white'>
        {/* Services Features Section */}
        <section className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                サービスの特徴
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                革新的なダイレクトリクルーティングで理想の転職を実現
              </p>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  スカウト機能
                </h3>
                <p className='mt-2 text-gray-600'>
                  企業から直接スカウトが届く。あなたのスキルを評価してくれる企業と出会えます。
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  詳細な求人情報
                </h3>
                <p className='mt-2 text-gray-600'>
                  職種、業種、勤務条件など詳細な情報で、理想の求人を見つけられます。
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  転職サポート
                </h3>
                <p className='mt-2 text-gray-600'>
                  履歴書作成から面接対策まで、転職活動を全面的にサポートします。
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='bg-gray-800 text-white mt-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8'>
            <Logo className='invert' width={180} height={38} />
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div>
              <h4 className='font-semibold mb-4'>サービス</h4>
              <ul className='space-y-2'>
                <li>
                  <Link href='/search' className='hover:text-gray-300'>
                    求人検索
                  </Link>
                </li>
                <li>
                  <Link href='/signup' className='hover:text-gray-300'>
                    会員登録
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>サポート</h4>
              <ul className='space-y-2'>
                <li>
                  <Link href='/contact' className='hover:text-gray-300'>
                    お問い合わせ
                  </Link>
                </li>
                <li>
                  <Link href='/news' className='hover:text-gray-300'>
                    お知らせ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>法的情報</h4>
              <ul className='space-y-2'>
                <li>
                  <Link href='/terms' className='hover:text-gray-300'>
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link href='/privacy' className='hover:text-gray-300'>
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link href='/tokusho' className='hover:text-gray-300'>
                    特定商取引法
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className='font-semibold mb-4'>企業向け</h4>
              <ul className='space-y-2'>
                <li>
                  <Link href='/contact' className='hover:text-gray-300'>
                    サービス申請
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className='mt-8 pt-8 border-t border-gray-700 text-center'>
            <p>&copy; 2024 Mokin Recruit Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
