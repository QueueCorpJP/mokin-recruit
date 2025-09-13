export default function Loading() {
  return (
    <div className='flex flex-col min-h-screen isolate'>
      <main className='flex-1 relative z-[2]'>
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 bg-white/40 rounded animate-pulse' />
            <div className='h-7 w-40 bg-white/60 rounded animate-pulse' />
          </div>
        </div>
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <div className='flex flex-col items-center gap-6 lg:gap-10'>
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              <div className='mb-6'>
                <div className='h-6 w-24 bg-gray-200 rounded animate-pulse' />
              </div>
              <div className='space-y-6 lg:space-y-2'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='flex flex-col lg:flex-row lg:gap-6'>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                      <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                    </div>
                    <div className='px-4 lg:px-0 lg:py-6 lg:flex-1'>
                      <div className='flex flex-wrap gap-2'>
                        {[...Array(4)].map((_, j) => (
                          <div key={j} className='h-7 w-20 bg-[#d2f1da] rounded animate-pulse' />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className='h-[60px] w-[200px] border border-[#0f9058] rounded-full animate-pulse' />
          </div>
        </div>
      </main>
    </div>
  );
}



