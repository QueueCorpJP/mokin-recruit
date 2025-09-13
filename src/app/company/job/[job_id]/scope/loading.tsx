export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[960px] mx-auto space-y-6'>
        <div className='h-7 w-56 bg-gray-200 rounded animate-pulse' />
        <section className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='h-20 bg-gray-100 rounded-lg animate-pulse' />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


