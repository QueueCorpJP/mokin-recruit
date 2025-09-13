export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full'>
          {/* 左: 会社プロフィール */}
          <section className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
            <div className='bg-white rounded-xl p-6 shadow-sm mb-6'>
              <div className='flex items-center gap-4'>
                <div className='w-16 h-16 rounded-full bg-gray-200 animate-pulse' />
                <div className='flex-1'>
                  <div className='h-6 w-40 bg-gray-200 rounded animate-pulse mb-2' />
                  <div className='h-4 w-64 bg-gray-100 rounded animate-pulse' />
                </div>
              </div>
            </div>
            <div className='bg-white rounded-xl p-6 shadow-sm'>
              <div className='h-5 w-24 bg-gray-200 rounded animate-pulse mb-4' />
              <div className='space-y-3'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                ))}
              </div>
            </div>
          </section>

          {/* 右: グループ/メンバー */}
          <aside className='w-full md:w-[360px] min-w-[280px]'>
            <div className='bg-white rounded-xl p-6 shadow-sm'>
              <div className='h-5 w-28 bg-gray-200 rounded animate-pulse mb-4' />
              <div className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center justify-between'>
                    <div className='h-4 w-32 bg-gray-100 rounded animate-pulse' />
                    <div className='h-6 w-16 bg-gray-200 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


