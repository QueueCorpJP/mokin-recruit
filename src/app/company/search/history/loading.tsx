export default function Loading() {
  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      {/* ヘッダー */}
      <div className='px-20 py-10'>
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='flex items-center gap-4 mb-6'>
            <div className='w-8 h-8 bg-[#dcdcdc] rounded animate-pulse' />
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse' />
          </div>
          <div className='bg-white rounded-[10px] p-6 min-[1200px]:p-10'>
            <div className='flex flex-col min-[1200px]:flex-row gap-6 min-[1200px]:gap-10 items-start'>
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <div className='h-5 w-16 bg-gray-200 rounded animate-pulse' />
                <div className='h-10 w-60 bg-gray-100 rounded-[10px] animate-pulse' />
              </div>
              <div className='flex flex-col min-[1200px]:flex-row items-start min-[1200px]:items-center gap-2 min-[1200px]:gap-4 w-full min-[1200px]:w-auto'>
                <div className='h-5 w-40 bg-gray-200 rounded animate-pulse' />
                <div className='flex gap-2 w-full min-[1200px]:w-auto'>
                  <div className='h-10 flex-1 min-[1200px]:w-60 bg-gray-100 rounded-[10px] animate-pulse' />
                  <div className='h-8 w-20 bg-[#D2F1DA] rounded animate-pulse' />
                </div>
              </div>
            </div>
            <div className='mt-6'>
              <div className='h-5 w-28 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>

      {/* 本文 */}
      <div className='px-20 pb-20'>
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='flex justify-between items-center mb-10'>
            <div className='h-[42px] w-[160px] rounded-[32px] bg-[#BFDFF5] animate-pulse' />
            <div className='flex items-center gap-2'>
              <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>

          {/* テーブルヘッダー */}
          <div className='flex items-center px-10 pb-2 border-b border-[#dcdcdc]'>
            <div className='w-[18px]' />
            <div className='w-[164px] h-5 bg-gray-200 rounded animate-pulse ml-4' />
            <div className='w-[500px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
            <div className='w-[160px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
            <div className='w-[100px] h-5 bg-gray-200 rounded animate-pulse ml-6' />
            <div className='w-[24px] ml-6' />
          </div>

          {/* 行 */}
          <div className='flex flex-col gap-2 mt-2'>
            {[...Array(10)].map((_, i) => (
              <div key={i} className='bg-white rounded-[10px] px-10 py-5 flex items-center shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
                <div className='w-[18px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[164px] h-5 bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] ml-4 animate-pulse' />
                <div className='w-[500px] h-5 bg-gray-100 rounded ml-6 animate-pulse' />
                <div className='w-[160px] h-5 bg-gray-200 rounded ml-6 animate-pulse' />
                <div className='w-[100px] h-5 bg-gray-200 rounded ml-6 animate-pulse' />
                <div className='w-[24px] h-6 bg-gray-200 rounded ml-auto animate-pulse' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


