import Link from 'next/link';
import { Navigation } from '@/components/ui/navigation';
import { Logo } from '@/components/ui/logo';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <Navigation />

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl'>
            理想の転職を
            <span className='text-indigo-600'>実現</span>
          </h2>
          <p className='mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl'>
            ダイレクトリクルーティングで、あなたにぴったりの企業と出会える転職プラットフォーム
          </p>
          <div className='mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8'>
            <div className='rounded-md shadow'>
              <Link
                href='/signup'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
              >
                無料で始める
              </Link>
            </div>
            <div className='mt-3 rounded-md shadow sm:mt-0 sm:ml-3'>
              <Link
                href='/search'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10'
              >
                求人を探す
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className='mt-20'>
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
