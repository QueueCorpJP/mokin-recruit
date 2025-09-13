export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[960px] mx-auto'>
        <div className='h-7 w-48 bg-gray-200 rounded animate-pulse mb-6' />
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='bg-white rounded-xl p-6 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div className='h-5 w-1/3 bg-gray-200 rounded animate-pulse' />
                <div className='h-6 w-16 bg-gray-200 rounded-full animate-pulse' />
              </div>
              <div className='mt-3 h-4 w-2/3 bg-gray-100 rounded animate-pulse' />
              <div className='mt-4 h-4 w-1/2 bg-gray-100 rounded animate-pulse' />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


