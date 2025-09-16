export default function Loading() {
  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 md:px-20 py-6 md:py-10'>
        <div className='flex items-center gap-4'>
          <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
          <div className='h-7 w-56 bg-white/60 rounded animate-pulse' />
        </div>
      </div>
      <div className='bg-[#f9f9f9] flex flex-col gap-10 items-center pb-20 pt-10 px-4 md:px-20 w-full'>
        <div className='bg-white flex flex-col gap-6 items-start p-6 md:p-[40px] rounded-[10px] w-full'>
          <div className='h-12 w-full bg-gray-100 rounded animate-pulse' />
          <div className='flex flex-col gap-2 w-full max-w-[400px]'>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className='bg-[#d2f1da] rounded-[10px] px-6 py-2 h-10 animate-pulse'
              />
            ))}
          </div>
        </div>
        <div className='flex gap-4 justify-center'>
          <div className='min-w-40 h-[56px] border border-[#0f9058] rounded-full animate-pulse' />
          <div className='min-w-40 h-[56px] bg-[#D2F1DA] rounded-full animate-pulse' />
        </div>
      </div>
    </div>
  );
}
