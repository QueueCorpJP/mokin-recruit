export default function Loading() {
  return (
    <div className='bg-[#f9f9f9] min-h-screen pb-20 pt-6 px-4 lg:pt-10 lg:px-20'>
      <div className='max-w-[1280px] mx-auto overflow-hidden'>
        {/* ヘッダー部分のスケルトン */}
        <div className='flex flex-col gap-6 items-start justify-start w-full mb-10'>
          {/* 求人タイトル */}
          <div className='h-6 lg:h-7 w-3/4 bg-gray-200 rounded animate-pulse' />

          {/* 企業情報 */}
          <div className='flex flex-row gap-4 items-center justify-start w-full'>
            <div className='w-10 h-10 bg-gray-200 rounded-full animate-pulse' />
            <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start w-full max-w-full'>
          {/* 求人詳細部分 */}
          <div className='order-1 flex flex-col gap-10 items-start justify-start lg:flex-1 min-w-0 max-w-full overflow-hidden'>
            {/* 画像部分 */}
            <div className='relative aspect-[300/200] rounded-[10px] md:rounded-3xl w-full bg-gray-200 animate-pulse' />

            {/* ポジション概要セクション */}
            <div className='flex flex-col gap-4 items-start justify-start w-full'>
              <div className='h-6 w-32 bg-gray-200 rounded animate-pulse' />
              <div className='space-y-2 w-full'>
                <div className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                <div className='h-4 w-4/5 bg-gray-100 rounded animate-pulse' />
                <div className='h-4 w-3/5 bg-gray-100 rounded animate-pulse' />
              </div>
            </div>

            {/* 条件・待遇セクション */}
            <div className='flex flex-col gap-4 w-full'>
              <div className='h-6 w-24 bg-gray-200 rounded animate-pulse' />
              <div className='bg-white rounded-[10px] p-6 space-y-4'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className='flex flex-col gap-2'>
                    <div className='h-4 w-20 bg-gray-200 rounded animate-pulse' />
                    <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* サイドバー部分 */}
          <div className='order-2 lg:order-1 w-full lg:w-[320px] bg-white rounded-[10px] p-6'>
            <div className='flex flex-col gap-6 items-start justify-start'>
              <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className='flex flex-col gap-2 w-full'>
                  <div className='h-4 w-16 bg-gray-200 rounded animate-pulse' />
                  <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* お気に入り・応募ボタン */}
        <div className='fixed left-2 right-2 lg:left-10 lg:right-10 bottom-4 lg:bottom-[20px] z-50'>
          <div className='bg-white/90 rounded-[24px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-4 lg:px-16 py-4 lg:py-5'>
            <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-center'>
              <div className='h-12 lg:h-14 w-full lg:w-40 bg-gray-200 rounded-[32px] animate-pulse' />
              <div className='h-12 lg:h-14 w-full lg:w-56 bg-gradient-to-r from-gray-300 to-gray-400 rounded-[32px] animate-pulse' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
