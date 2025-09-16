export default function Loading() {
  return (
    <div className='min-h-[80vh] w-full flex bg-white'>
      {/* 左: ルーム一覧 */}
      <aside className='hidden md:block w-[360px] border-r border-gray-50 p-4 space-y-4'>
        <div className='h-9 w-2/3 bg-gray-200 rounded animate-pulse' />
        {[...Array(8)].map((_, i) => (
          <div key={i} className='p-4 rounded-lg bg-gray-50'>
            <div className='h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-2' />
            <div className='h-3 w-2/3 bg-gray-100 rounded animate-pulse' />
          </div>
        ))}
      </aside>

      {/* 右: チャット */}
      <section className='flex-1 flex flex-col'>
        <div className='h-14 border-b border-gray-50 px-4 flex items-center'>
          <div className='h-5 w-40 bg-gray-200 rounded animate-pulse' />
        </div>
        <div className='flex-1 p-4 space-y-4 overflow-hidden'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`max-w-[60%] ${i % 2 ? 'ml-auto' : ''}`}>
              <div className='h-5 w-24 bg-gray-100 rounded animate-pulse mb-2' />
              <div className='rounded-2xl bg-gray-50 p-4'>
                <div className='h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2' />
                <div className='h-4 w-1/2 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
          ))}
        </div>
        <div className='border-t border-gray-50 p-4'>
          <div className='h-10 w-full bg-gray-100 rounded-xl animate-pulse' />
        </div>
      </section>
    </div>
  );
}
