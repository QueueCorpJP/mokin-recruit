export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[960px] mx-auto space-y-6'>
        <div className='h-7 w-40 bg-gray-200 rounded animate-pulse' />
        <section className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='h-5 w-32 bg-gray-200 rounded animate-pulse mb-4' />
          <div className='space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center justify-between'>
                <div className='h-4 w-40 bg-gray-100 rounded animate-pulse' />
                <div className='h-6 w-12 bg-gray-200 rounded-full animate-pulse' />
              </div>
            ))}
          </div>
        </section>
        <section className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='h-5 w-32 bg-gray-200 rounded animate-pulse mb-4' />
          <div className='space-y-3'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-4 w-full bg-gray-100 rounded animate-pulse' />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


