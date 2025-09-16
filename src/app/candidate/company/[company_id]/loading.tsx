export default function Loading() {
  return (
    <div className='bg-[#F9F9F9] min-h-screen pb-20 pt-6 px-4 lg:pt-10 lg:px-20'>
      <div className='max-w-[1280px] mx-auto overflow-hidden'>
        {/* ヘッダー */}
        <div className='flex flex-row gap-4 items-center w-full mb-10'>
          <div className='rounded-full w-10 h-10 bg-gray-200 animate-pulse' />
          <div className='h-8 w-48 bg-gray-200 rounded animate-pulse' />
        </div>

        {/* 本文 */}
        <div className='flex flex-col gap-8'>
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full'>
            {/* 左側：画像＋テキスト */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-col gap-4'>
                <div className='relative w-full aspect-[3/2] bg-gray-200 rounded-[10px] md:rounded-3xl animate-pulse' />
                <div className='flex gap-1 h-2'>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className='flex-1 bg-gray-200 rounded animate-pulse'
                    />
                  ))}
                </div>
              </div>
              {[...Array(2)].map((_, i) => (
                <div key={i} className='mt-10'>
                  <div className='h-7 w-64 bg-gray-200 rounded animate-pulse mb-4 border-b-2 border-[#dcdcdc]' />
                  <div className='space-y-2'>
                    <div className='h-4 w-5/6 bg-gray-100 rounded animate-pulse' />
                    <div className='h-4 w-4/6 bg-gray-100 rounded animate-pulse' />
                  </div>
                </div>
              ))}
            </div>

            {/* 右側：サイドカード */}
            <div className='w-full lg:w-[320px] bg-white rounded-[10px] p-6'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='mb-6 last:mb-0'>
                  <div className='h-6 w-24 bg-gray-200 rounded animate-pulse mb-2 border-b border-[#dcdcdc]' />
                  <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>

          {/* 掲載求人 */}
          <div className='w-full'>
            <div className='h-8 w-32 bg-gray-200 rounded animate-pulse mb-4 border-b-2 border-[#dcdcdc]' />
            <div className='flex flex-col gap-2'>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className='bg-white border border-gray-100 rounded-[10px] shadow-sm p-6 flex gap-4'
                >
                  <div className='md:w-20 md:h-[53px] w-full h-[120px] bg-gray-200 rounded animate-pulse' />
                  <div className='flex-1 space-y-2'>
                    <div className='flex gap-2 flex-wrap'>
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className='h-6 w-16 bg-[#D2F1DA] rounded animate-pulse'
                        />
                      ))}
                    </div>
                    <div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='hidden md:block w-6 h-6 bg-gray-200 rounded-full animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
