export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-6' />
        <div className='flex items-center gap-3 mb-6'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-8 w-24 bg-gray-200 rounded animate-pulse' />
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='bg-white rounded-xl p-6 shadow-sm'>
              <div className='h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-3' />
              <div className='space-y-2 mb-4'>
                <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse' />
              </div>
              <div className='flex items-center gap-2'>
                {[...Array(3)].map((_, j) => (
                  <div key={j} className='h-6 w-16 bg-gray-200 rounded-full animate-pulse' />
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


