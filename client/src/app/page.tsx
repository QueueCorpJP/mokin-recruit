import Link from 'next/link';
import { Navigation } from '@/components/ui/navigation';
import { Logo } from '@/components/ui/logo';
import { HeroSection } from '@/components/ui/hero-section';
import { Footer } from '@/components/ui/footer';

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
      <Footer />
    </div>
  );
}
