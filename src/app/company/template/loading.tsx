export default function Loading() {
  return (
    <>
      {/* ヒーロー（グラデーション＋タイトル） */}
      <div
        className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10'
        style={{ background: 'linear-gradient(to top, #17856f, #229a4e)' }}
      >
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
            <div className='h-7 w-56 bg-white/60 rounded animate-pulse' />
          </div>
        </div>

        {/* フィルター */}
        <div className='w-full max-w-[1200px] mx-auto mt-10'>
          <div className='bg-white rounded-[10px] p-6 min-[1200px]:p-10'>
            <div className='flex flex-col min-[1200px]:flex-row gap-6 min-[1200px]:gap-10 items-start'>
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <div className='h-5 w-16 bg-gray-200 rounded animate-pulse' />
                <div className='h-10 w-60 bg-gray-100 rounded-lg animate-pulse' />
              </div>
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
                <div className='flex gap-2 w-full min-[1200px]:w-auto'>
                  <div className='h-10 flex-1 min-[1200px]:w-60 bg-gray-100 rounded-[10px] animate-pulse' />
                  <div className='h-8 w-20 bg-[#D2F1DA] rounded animate-pulse' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 本文 */}
      <div className='bg-[#f9f9f9] px-20 pt-10 pb-20 min-h-[577px]'>
        <div className='w-full max-w-[1200px] mx-auto'>
          {/* 上部アクション */}
          <div className='flex justify-between items-center mb-10'>
            <div className='min-w-[160px] h-[42px] rounded-[32px] bg-[#BFDFF5] animate-pulse' />
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 bg-gray-200 rounded animate-pulse' />
              <div className='h-4 w-28 bg-gray-200 rounded animate-pulse' />
              <div className='h-4 w-4 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>

          {/* テーブルヘッダー */}
          <div className='flex items-center px-10 pb-2 border-b border-[#dcdcdc]'>
            <div className='w-[164px] h-5 bg-gray-200 rounded animate-pulse' />
            <div className='w-[280px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
            <div className='w-[300px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
            <div className='w-[100px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
            <div className='w-[100px] h-5 bg-gray-200 rounded animate-pulse ml-6 flex-1' />
            <div className='w-[24px]' />
          </div>

          {/* 行 */}
          <div className='flex flex-col gap-2 mt-2'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='bg-white rounded-[10px] px-10 py-5 flex items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
                <div className='w-[164px] h-[28px] bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] animate-pulse' />
                <div className='w-[280px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
                <div className='w-[300px] h-5 bg-gray-100 rounded animate-pulse ml-6' />
                <div className='w-[100px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
                <div className='w-[100px] h-5 bg-gray-200 rounded animate-pulse ml-6 flex-1' />
                <div className='w-[24px] h-6 bg-gray-200 rounded ml-6 animate-pulse' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


