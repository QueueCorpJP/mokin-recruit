export default function Loading() {
  return (
    <div className='relative w-full'>
      {/* Hero */}
      <div className='w-full h-[320px] md:h-[520px] bg-gradient-to-t from-[#17856f] to-[#229a4e] animate-pulse' />
      {/* Sections skeleton */}
      <div className='px-4 md:px-20 py-10 space-y-10 bg-[#F9F9F9]'>
        {[...Array(5)].map((_, i) => (
          <div key={i} className='bg-white rounded-[10px] p-6 shadow-sm'>
            <div className='h-6 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {[...Array(3)].map((_, j) => (
                <div
                  key={j}
                  className='h-24 bg-gray-100 rounded animate-pulse'
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
