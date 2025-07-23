import Link from 'next/link';

export default function RootPage() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-white'>
      <div className='flex flex-col items-center'>
        <div className='w-20 h-20 flex items-center justify-center rounded-full bg-black mb-8'>
          <svg
            className='w-10 h-10 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 18l6-6-6-6M8 6l-6 6 6 6'
            />
          </svg>
        </div>
        <h1 className='text-4xl font-bold text-gray-900 mb-4'>
          Code Generator
        </h1>
        <p className='text-lg text-gray-600 mb-8'>開発中です</p>
        <Link
          href='/'
          className='flex items-center text-gray-700 hover:text-blue-600 text-base'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M15 19l-7-7 7-7'
            />
          </svg>
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}
