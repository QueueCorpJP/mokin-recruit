export default function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#17856F] to-[#229A4E] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        {/* ロゴ */}
        <div className='w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg'>
          <div className='w-16 h-16 bg-gradient-to-r from-[#17856F] to-[#229A4E] rounded-full animate-pulse' />
        </div>

        {/* スピナー */}
        <div className='relative'>
          <div className='w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin' />
        </div>

        {/* テキスト */}
        <div className='text-center'>
          <p className='text-white text-xl font-bold mb-2'>読み込み中...</p>
          <p className='text-white/80 text-sm'>しばらくお待ちください</p>
        </div>
      </div>
    </div>
  );
}
