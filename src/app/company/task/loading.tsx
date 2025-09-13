export default function Loading() {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10">
      <main className="w-full max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start">
          {/* 左カラム: やることリスト */}
          <div className="max-w-[880px] md:px-6 flex-1 box-border w-full">
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='space-y-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='bg-white rounded-[10px] p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.05)]'>
                  <div className='h-5 w-64 bg-gray-200 rounded animate-pulse mb-3' />
                  <div className='space-y-2'>
                    <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                    <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse' />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右カラム: サイドバー */}
          <aside className="w-full md:w-[360px] min-w-[280px]">
            <div className='bg-white rounded-[10px] p-6 shadow-[0_0_20px_0_rgba(0,0,0,0.05)]'>
              <div className='h-5 w-32 bg-gray-200 rounded animate-pulse mb-4' />
              <div className='space-y-3'>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


