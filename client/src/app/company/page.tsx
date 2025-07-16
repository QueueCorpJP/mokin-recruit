import { Navigation } from '@/components/ui/navigation';
import { CompanyHeroSection } from '@/components/ui/company-hero-section';
import { Footer } from '@/components/ui/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '企業向けダイレクトリクルーティング | CuePoint',
  description:
    '優秀な人材を効率的に発見・採用。CuePointの企業向けダイレクトリクルーティングサービス',
  keywords: [
    '採用',
    '人材発見',
    'ダイレクトリクルーティング',
    '企業向け',
    'スカウト',
  ],
};

export default function CompanyLandingPage() {
  // TODO: 実際のログイン状態を取得するロジックを実装
  const isLoggedIn = true; // 仮の値（後で実装）
  const userInfo = {
    companyName: '株式会社サンプル',
    userName: '田中太郎',
  };

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Navigation 
        variant='company' 
        isLoggedIn={isLoggedIn}
        userInfo={userInfo}
      />

      {/* Hero Section */}
      <CompanyHeroSection />

      {/* Additional Content Sections */}
      <main className='bg-white'>
        {/* Services Features Section */}
        <section className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                企業の採用課題を解決
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                効率的なダイレクトリクルーティングで理想の人材を発見
              </p>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  ダイレクトスカウト
                </h3>
                <p className='mt-2 text-gray-600'>
                  データベースから最適な候補者を検索し、直接スカウトメッセージを送信できます。
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  詳細な候補者情報
                </h3>
                <p className='mt-2 text-gray-600'>
                  スキル、経験、希望条件など詳細な情報で、理想の人材を見つけられます。
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  採用効率化
                </h3>
                <p className='mt-2 text-gray-600'>
                  応募管理から面接調整まで、採用プロセスを全面的に効率化します。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Benefits Section */}
        <section className='py-16 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                なぜCuePointが選ばれるのか
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                企業の採用成功を支える3つの強み
              </p>
            </div>

            <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  高速マッチング
                </h3>
                <p className='text-gray-600'>
                  AIを活用した高精度なマッチングで、最短での人材発見を実現
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  品質保証
                </h3>
                <p className='text-gray-600'>
                  厳選された候補者データベースで、質の高い採用を保証
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <svg
                    className='w-8 h-8 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.196l-2.196 2.196M12 21.804l-2.196-2.196'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  専任サポート
                </h3>
                <p className='text-gray-600'>
                  採用のプロが専任でサポート。成功まで伴走します
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
