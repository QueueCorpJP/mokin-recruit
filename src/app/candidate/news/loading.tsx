export default function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-t from-[#229A4E] to-[#17856F] relative'>
      <div className='px-[16px] md:px-[80px] py-[24px] md:py-[40px]'>
        <div className='h-10 w-40 bg-white/40 rounded animate-pulse' />
      </div>
      <main className='w-full bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10 -top-[5%] pt-[75px]'>
        <div className='px-[16px] md:px-[80px] py-[40px] md:py-[75px]'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded mb-6'></div>
            <div className='space-y-4'>
              {[...Array(10)].map((_, i) => (
                <div key={i} className='flex gap-4'>
                  <div className='w-[120px] h-[80px] bg-gray-200 rounded'></div>
                  <div className='flex-1'>
                    <div className='h-4 bg-gray-200 rounded mb-2'></div>
                    <div className='h-4 bg-gray-200 rounded mb-2 w-3/4'></div>
                    <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
