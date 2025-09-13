export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex items-center justify-between mb-4'>
          <div className='h-7 w-40 bg-gray-200 rounded animate-pulse' />
          <div className='h-9 w-28 bg-gray-200 rounded animate-pulse' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[...Array(9)].map((_, i) => (
            <div key={i} className='bg-white rounded-xl p-6 shadow-sm'>
              <div className='h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-3' />
              <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-2' />
              <div className='h-4 w-1/2 bg-gray-100 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


