import Link from 'next/link';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CuePoint - ダイレクトリクルーティングプラットフォーム',
  description: '企業と候補者を直接つなぐ新しいリクルーティングプラットフォーム',
  keywords: ['リクルーティング', '転職', '採用', 'ダイレクトリクルーティング'],
};

export default function RootPage() {
  return (
    <div className='min-h-screen'>
      {/* Header */}
      <Navigation />

      {/* Hero Section */}
      <section className='bg-gradient-to-br from-gray-50 to-blue-50 py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl'>
              新しい採用の
              <span className='text-blue-600'> カタチ</span>
            </h1>
            <p className='mt-6 text-xl text-gray-600 max-w-3xl mx-auto'>
              CuePointは企業と候補者を直接つなぐ、
              次世代のダイレクトリクルーティングプラットフォームです。
            </p>

            {/* Development Auth Bypass Link */}
            {process.env.NODE_ENV === 'development' && (
              <div className='mt-8'>
                <Link
                  href='/auth-bypass'
                  className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 text-sm font-bold rounded-lg border border-yellow-300 hover:bg-yellow-200 transition-colors'
                >
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                  開発用: 認証バイパス
                </Link>
              </div>
            )}

            {/* Role Selection */}
            <div className='mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl mx-auto'>
              {/* Company Card */}
              <div className='bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow'>
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
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  企業の方
                </h3>
                <p className='text-gray-600 mb-6'>
                  優秀な人材を効率的に発見・採用。
                  ダイレクトリクルーティングで採用課題を解決。
                </p>
                <Link
                  href='/company'
                  className='inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full text-center'
                >
                  企業向けサービス
                </Link>
              </div>

              {/* Candidate Card */}
              <div className='bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow'>
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
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                  転職をお考えの方
                </h3>
                <p className='text-gray-600 mb-6'>
                  理想の転職を実現。
                  あなたのスキルに興味を持った企業から直接スカウト。
                </p>
                <Link
                  href='/candidate'
                  className='inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors w-full text-center'
                >
                  候補者向けサービス
                </Link>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
              CuePointの特徴
            </h2>
            <p className='mt-4 text-lg text-gray-600'>
              企業と候補者の双方にメリットをもたらす新しいプラットフォーム
            </p>
          </div>

          <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
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
                    d='M13 10V3L4 14h7v7l9-11h-7z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                高速マッチング
              </h3>
              <p className='text-gray-600'>
                AIを活用した高精度なマッチングで、最適な出会いを実現
              </p>
            </div>

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
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                品質保証
              </h3>
              <p className='text-gray-600'>
                厳選されたデータベースで、質の高いマッチングを保証
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
                専門チームが成功まで全面的にサポート
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
