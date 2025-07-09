import { Navigation } from '@/components/ui/navigation';
import { CandidateHeroSection } from '@/components/ui/candidate-hero-section';
import { Footer } from '@/components/ui/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '転職・キャリアアップ支援 | CuePoint',
  description:
    '理想の転職を実現。CuePointの候補者向けキャリア支援サービスで、あなたの可能性を最大化',
  keywords: ['転職', 'キャリアアップ', '求人', '候補者向け', 'キャリア支援'],
};

export default function CandidateLandingPage() {
  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Navigation variant='candidate' />

      {/* Hero Section */}
      <CandidateHeroSection />

      {/* Additional Content Sections */}
      <main className='bg-white'>
        {/* Services Features Section */}
        <section className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                あなたのキャリアを加速させる
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                理想の転職を実現するためのサポート機能
              </p>
            </div>

            {/* Features Grid */}
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  スカウト受信
                </h3>
                <p className='mt-2 text-gray-600'>
                  あなたのスキルに興味を持った企業から直接スカウトを受け取れます。
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  キャリア分析
                </h3>
                <p className='mt-2 text-gray-600'>
                  あなたのスキルと経験を分析し、最適なキャリアパスを提案します。
                </p>
              </div>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  面接サポート
                </h3>
                <p className='mt-2 text-gray-600'>
                  面接対策から条件交渉まで、転職活動を全面的にサポートします。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Candidate Benefits Section */}
        <section className='py-16 bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                CuePointで理想の転職を実現
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                転職成功を支える3つの特徴
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
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  個別最適化
                </h3>
                <p className='text-gray-600'>
                  あなたのスキルと希望に合わせた、個別最適化されたキャリア提案
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
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  企業直接アプローチ
                </h3>
                <p className='text-gray-600'>
                  厳選された企業から直接スカウトを受け、効率的な転職活動を実現
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
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                  スピード転職
                </h3>
                <p className='text-gray-600'>
                  効率的なマッチングで、最短での転職成功をサポート
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Success Stories Section */}
        <section className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
                転職成功事例
              </h2>
              <p className='mt-4 text-lg text-gray-600'>
                CuePointを利用して転職に成功した方々の声
              </p>
            </div>

            <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-semibold text-gray-600'>
                      A.T
                    </span>
                  </div>
                  <div className='ml-4'>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      エンジニア → テックリード
                    </h4>
                    <p className='text-sm text-gray-600'>年収 +150万円</p>
                  </div>
                </div>
                <p className='text-gray-600'>
                  「スカウト機能で理想の企業と出会えました。技術力を正当に評価してもらい、大幅な年収アップを実現できました。」
                </p>
              </div>

              <div className='bg-white rounded-lg shadow-md p-6'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center'>
                    <span className='text-sm font-semibold text-gray-600'>
                      M.S
                    </span>
                  </div>
                  <div className='ml-4'>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      営業 → プロダクトマネージャー
                    </h4>
                    <p className='text-sm text-gray-600'>
                      キャリアチェンジ成功
                    </p>
                  </div>
                </div>
                <p className='text-gray-600'>
                  「キャリア分析機能で自分の強みを再発見。未経験分野への転職も、的確なサポートで成功できました。」
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
