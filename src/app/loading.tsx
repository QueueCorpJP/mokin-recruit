export default function AppLoading() {
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      <div className='h-[80px] bg-white border-b border-gray-50 flex items-center px-4'>
        <div className='animate-pulse bg-gray-200 rounded w-32 h-6' />
      </div>
      <div className='flex-1 bg-[#F9F9F9] flex items-start justify-center pt-16'>
        <div className='animate-pulse bg-gray-200 rounded w-16 h-4' />
      </div>
    </div>
  );
}
