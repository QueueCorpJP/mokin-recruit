export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[720px] mx-auto text-center'>
        <div className='h-8 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-4' />
        <div className='h-5 w-64 bg-gray-100 rounded animate-pulse mx-auto mb-8' />
        <div className='h-10 w-40 bg-gray-200 rounded-lg animate-pulse mx-auto' />
      </main>
    </div>
  );
}


