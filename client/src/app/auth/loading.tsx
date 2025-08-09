export default function AuthLoading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex items-center justify-center'>
      <div className='bg-white rounded-lg p-8 shadow-lg max-w-md w-full mx-4'>
        <div className='flex flex-col items-center gap-4'>
          {/* ロゴスケルトン */}
          <div className='w-32 h-8 bg-gray-200 rounded animate-pulse' />

          {/* フォームスケルトン */}
          <div className='w-full space-y-4 mt-6'>
            <div className='space-y-2'>
              <div className='w-24 h-4 bg-gray-200 rounded animate-pulse' />
              <div className='w-full h-10 bg-gray-200 rounded animate-pulse' />
            </div>
            <div className='space-y-2'>
              <div className='w-20 h-4 bg-gray-200 rounded animate-pulse' />
              <div className='w-full h-10 bg-gray-200 rounded animate-pulse' />
            </div>
            <div className='w-full h-10 bg-gray-300 rounded animate-pulse mt-6' />
          </div>

          {/* テキストスケルトン */}
          <div className='flex flex-col items-center gap-2 mt-4'>
            <div className='w-40 h-4 bg-gray-200 rounded animate-pulse' />
            <div className='w-32 h-4 bg-gray-200 rounded animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
}
