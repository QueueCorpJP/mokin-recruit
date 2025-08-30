import Link from 'next/link';

export function CandidateHeroSection() {
  return (
    <section className='bg-gradient-to-br from-green-50 to-emerald-100 py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl'>
            あなたの可能性を
            <span className='text-green-600'> 最大化する</span>
          </h1>
          <p className='mt-6 text-xl text-gray-600 max-w-3xl mx-auto'>
            CuePointで理想の転職を実現。
            あなたのスキルと経験を活かせる最適な企業からスカウトを受け取りましょう。
          </p>
          <div className='mt-10 flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/candidate/auth/login'
              className='bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors'
            >
              転職活動を始める
            </Link>
            <Link
              href='/candidate/auth/login'
              className='border border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors'
            >
              キャリア診断
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
