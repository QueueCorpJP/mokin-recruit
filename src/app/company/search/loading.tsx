export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full'>
          {/* 左: フィルター */}
          <aside className='w-full md:w-[320px] min-w-[280px]'>
            <div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
              <div className='h-6 w-32 bg-gray-200 rounded animate-pulse mb-4' />
              <div className='space-y-3'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                ))}
              </div>
            </div>
            <div className='bg-white rounded-xl p-6 shadow-sm'>
              <div className='h-6 w-24 bg-gray-200 rounded animate-pulse mb-4' />
              <div className='space-y-3'>
                {[...Array(4)].map((_, i) => (
                  <div key={i} className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                ))}
              </div>
            </div>
          </aside>

          {/* 右: 結果一覧 */}
          <section className='flex-1'>
            <div className='flex items-center justify-between mb-4'>
              <div className='h-7 w-48 bg-gray-200 rounded animate-pulse' />
              <div className='h-9 w-28 bg-gray-200 rounded animate-pulse' />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='bg-white rounded-xl p-6 shadow-sm'>
                  <div className='h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-3' />
                  <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-2' />
                  <div className='h-4 w-1/2 bg-gray-100 rounded animate-pulse' />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}


