export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[800px] mx-auto space-y-6'>
        <div className='h-7 w-56 bg-gray-200 rounded animate-pulse' />
        <section className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='space-y-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className='h-4 w-28 bg-gray-200 rounded animate-pulse mb-2' />
                <div className='h-10 w-full bg-gray-100 rounded-lg animate-pulse' />
              </div>
            ))}
          </div>
          <div className='mt-6 flex justify-end gap-3'>
            <div className='h-10 w-24 bg-gray-200 rounded-lg animate-pulse' />
            <div className='h-10 w-32 bg-gray-200 rounded-lg animate-pulse' />
          </div>
        </section>
      </main>
    </div>
  );
}


