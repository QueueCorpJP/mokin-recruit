export default function Loading() {
  return (
    <div className='flex flex-col min-h-screen isolate'>
      <main className='flex-1 relative z-[2]'>
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 bg-white/40 rounded animate-pulse' />
            <div className='h-7 w-56 bg-white/60 rounded animate-pulse' />
          </div>
        </div>
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <div className='flex flex-col items-center gap-6 lg:gap-10'>
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              <div className='space-y-4'>
                <div className='h-10 w-full bg-gray-100 rounded animate-pulse' />
                <div className='h-40 w-full bg-gray-100 rounded animate-pulse' />
                <div className='h-10 w-48 bg-[#D2F1DA] rounded-full animate-pulse mx-auto' />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



