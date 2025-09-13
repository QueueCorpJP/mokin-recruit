export default function Loading() {
  return (
    <div className='min-h-screen bg-[#f9f9f9] overflow-x-hidden'>
      <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 md:px-20 py-6 md:py-10'>
        <div className='flex items-center gap-4'>
          <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
          <div className='h-7 w-64 bg-white/60 rounded animate-pulse' />
        </div>
      </div>
      <div className='bg-[#f9f9f9] box-border flex flex-col gap-10 items-center pb-20 pt-10 px-4 md:px-20 w-full'>
        <div className='bg-white flex flex-col gap-4 items-start p-4 md:p-[40px] rounded-[10px] w-full'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='flex flex-col md:flex-row gap-4 items-start w-full'>
              <div className='text-[#323232] text-sm md:text-[16px] font-medium min-w-[120px]'>
                <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
              </div>
              <div className='flex flex-col md:flex-row gap-4 items-start w-full'>
                {[...Array(2)].map((_, j) => (
                  <div key={j} className='flex items-center gap-2'>
                    <div className='w-4 h-4 rounded-full border border-gray-300 animate-pulse' />
                    <div className='h-4 w-20 bg-gray-100 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='flex flex-col md:flex-row gap-4 justify-center w-full md:w-auto'>
          <div className='min-w-40 w-full md:w-auto h-[56px] border border-[#0f9058] rounded-full animate-pulse' />
          <div className='min-w-40 w-full md:w-auto h-[56px] bg-[#D2F1DA] rounded-full animate-pulse' />
        </div>
      </div>
    </div>
  );
}



