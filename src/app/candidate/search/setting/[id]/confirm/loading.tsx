export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10'>
      <main className='w-full max-w-[960px] mx-auto'>
        <div className='h-7 w-56 bg-gray-200 rounded animate-pulse mb-4' />
        <div className='bg-white rounded-xl p-6 shadow-sm'>
          <div className='space-y-4'>
            <div className='h-5 w-1/2 bg-gray-200 rounded animate-pulse' />
            <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse' />
            <div className='grid grid-cols-2 gap-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-24 bg-gray-50 rounded animate-pulse' />
              ))}
            </div>
            <div className='flex gap-4 justify-center pt-4'>
              <div className='h-12 w-40 border border-[#0f9058] rounded-full animate-pulse' />
              <div className='h-12 w-40 bg-[#D2F1DA] rounded-full animate-pulse' />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



