export default function Loading() {
  return (
    <div className='bg-[#f9f9f9]'>
      {/* ヘッダー */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{ background: 'linear-gradient(to top, #17856f, #229a4e)' }}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className='h-4 w-40 bg-white/50 rounded animate-pulse' />
            <div className='w-2 h-2 bg-white/70 rounded-full' />
            <div className='h-4 w-48 bg-white/50 rounded animate-pulse' />
            <div className='w-2 h-2 bg-white/70 rounded-full' />
            <div className='h-4 w-40 bg-white/50 rounded animate-pulse' />
            <div className='w-2 h-2 bg-white/70 rounded-full' />
            <div className='h-4 w-40 bg-white/50 rounded animate-pulse' />
          </div>
          <div className="flex items-center gap-4">
            <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
            <div className='h-7 w-56 bg白/60 rounded animate-pulse' />
          </div>
        </div>
      </div>

      {/* 本文 */}
      <div className='flex-1 px-20 pt-10 pb-20'>
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='bg-white rounded-[10px] p-10'>
            <div className='flex flex-col gap-2'>
              {[...Array(5)].map((_, i) => (
                <div key={i} className='flex gap-6'>
                  <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 min-h-[102px] flex items-center'>
                    <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='flex-1 flex items-center'>
                    <div className='h-5 w-64 bg-gray-200 rounded animate-pulse' />
                  </div>
                </div>
              ))}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 min-h-[102px] flex items-center'>
                  <div className='h-5 w-12 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className='flex-1'>
                  <div className='h-[200px] w-full bg-gray-100 rounded animate-pulse' />
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-center gap-6 mt-10'>
            <div className='h-10 w-40 border border-[#0f9058] rounded-[32px] animate-pulse' />
            <div className='h-10 w-40 bg-[#D2F1DA] rounded-[32px] animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
}


