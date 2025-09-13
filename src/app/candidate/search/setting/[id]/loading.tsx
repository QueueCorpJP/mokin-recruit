export default function Loading() {
  return (
    <div className='w-full bg-[#F9F9F9]'>
      <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10' style={{ background: 'linear-gradient(to top, #17856f, #229a4e)' }}>
        <div className='w-full max-w-[1280px] mx-auto'>
          <div className='flex items-center gap-4'>
            <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
            <div className='h-7 w-56 bg-white/60 rounded animate-pulse' />
          </div>
        </div>
      </div>
      <div className='w-full max-w-[1280px] mx-auto p-6 md:p-10'>
        <div className='bg-white rounded-[10px] p-6 md:p-10'>
          <div className='space-y-4'>
            <div className='h-6 w-40 bg-gray-200 rounded animate-pulse' />
            <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
            <div className='grid grid-cols-2 gap-4'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className='h-24 bg-gray-50 rounded animate-pulse' />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



