export default function Loading() {
  return (
    <>
      {/* ヒーロー */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{ background: 'linear-gradient(to top, #17856f, #229a4e)' }}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className='h-4 w-48 bg-white/50 rounded animate-pulse' />
            <div className='w-2 h-2 bg-white/70 rounded-full' />
            <div className='h-4 w-56 bg-white/50 rounded animate-pulse' />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='w-8 h-8 bg白/40 rounded animate-pulse' />
              <div className='h-7 w-72 bg白/60 rounded animate-pulse' />
            </div>
          </div>
        </div>
      </div>

      {/* 本文 */}
      <div className='bg-[#f9f9f9] flex-1 px-20 pt-10 pb-20'>
        <div className='flex justify-end pb-10'>
          <div className='h-10 w-28 bg-[#FEF0F0] rounded-[32px] animate-pulse' />
        </div>
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='bg-white rounded-[10px] p-10'>
            <div className='flex flex-col gap-2'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='flex gap-6 items-center'>
                  <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 min-h-[102px] flex items-center'>
                    <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='flex-1'>
                    <div className='max-w-[400px]'>
                      <div className='h-10 w-full bg-gray-100 rounded-[5px] animate-pulse' />
                      <div className='h-4 w-48 bg-gray-100 rounded mt-2 animate-pulse' />
                    </div>
                  </div>
                </div>
              ))}
              <div className='flex gap-6 items-start'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 min-h-[102px] flex items-center'>
                  <div className='h-5 w-12 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className='flex-1 py-6'>
                  <div className='border border-[#999999] rounded-[5px] p-3 bg-white'>
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className='h-7 w-32 border border-[#0f9058] rounded-full animate-pulse' />
                      ))}
                    </div>
                    <div className='h-[300px] w-full bg-gray-100 rounded animate-pulse' />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-center gap-4 m-10'>
            <div className='h-10 w-40 border border-[#0f9058] rounded-[32px] animate-pulse' />
            <div className='h-10 w-40 bg-[#D2F1DA] rounded-[32px] animate-pulse' />
          </div>
        </div>
      </div>
    </>
  );
}


