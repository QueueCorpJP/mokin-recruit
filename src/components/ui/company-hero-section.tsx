import Link from 'next/link';

export function CompanyHeroSection() {
  return (
    <section className='bg-gradient-to-br from-blue-50 to-indigo-100 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl'>
            理想の人材を
            <span className='text-blue-600'> 効率的に発見</span>
          </h1>
          <p className='mt-6 text-xl text-gray-600 max-w-3xl mx-auto'>
            CuePointのダイレクトリクルーティングで、採用課題を解決。
            優秀な候補者に直接アプローチし、採用成功率を向上させましょう。
          </p>
          <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/company/auth/login'
              className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
            >
              今すぐ始める
            </Link>
            <Link
              href='/company/auth/login'
              className='border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
            >
              サービス詳細
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
