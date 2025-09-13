export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          {/* 左カラム（やること・メッセージ・おすすめ求人） */}
          <div className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
            {/* セクション見出し */}
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            {/* やることリストカード群 */}
            <div className='flex flex-col gap-2 mt-2 mb-10'>
              {[0,1,2].map(i => (
                <div key={i} className='w-full bg-white px-6 py-4 rounded-lg' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                  <div className='flex items-start gap-4'>
                    <div className='w-12 h-12 bg-gray-200 rounded animate-pulse' />
                    <div className='flex-1'>
                      <div className='h-5 w-1/3 bg-gray-200 rounded animate-pulse mb-2' />
                      <div className='h-3 w-2/3 bg-gray-100 rounded animate-pulse' />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 新着メッセージ見出し */}
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='bg-white rounded-[10px] p-6 shadow-sm mb-10'>
              <div className='space-y-3'>
                {[0,1,2].map(i => (
                  <div key={i} className='h-16 w-full bg-gray-50 rounded animate-pulse' />
                ))}
              </div>
            </div>

            {/* おすすめ求人見出し */}
            <div className='h-7 w-56 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='flex flex-col gap-4'>
              {[0,1,2].map(i => (
                <div key={i} className='bg-white rounded-[10px] p-4 shadow-sm flex gap-4 items-start'>
                  <div className='w-[104px] h-[69px] bg-gray-200 rounded animate-pulse' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-5 w-2/3 bg-gray-200 rounded animate-pulse' />
                    <div className='flex gap-2'>
                      <div className='h-6 w-20 bg-[#D2F1DA] rounded animate-pulse' />
                      <div className='h-6 w-24 bg-[#D2F1DA] rounded animate-pulse' />
                      <div className='h-6 w-16 bg-[#D2F1DA] rounded animate-pulse' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右カラム（お知らせ・バナー・FAQ） */}
          <div className='w-full md:max-w-[320px] md:flex-none'>
            {/* お知らせ一覧 */}
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='space-y-3 mb-6'>
              {[0,1,2].map(i => (
                <div key={i} className='bg-white p-4 rounded-lg' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                  <div className='h-3 w-24 bg-gray-100 rounded animate-pulse mb-2' />
                  <div className='h-5 w-3/4 bg-gray-200 rounded animate-pulse' />
                </div>
              ))}
              <div className='bg-white p-4 rounded-lg flex items-center justify-between' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                <div className='h-5 w-40 bg-[#D2F1DA] rounded animate-pulse' />
                <div className='h-3 w-3 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>

            {/* バナー */}
            <div className='w-full h-[200px] bg-gray-200 rounded-lg animate-pulse mb-20' />

            {/* FAQ */}
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='space-y-3'>
              {[0,1].map(i => (
                <div key={i} className='bg-white p-4 rounded-lg' style={{ boxShadow: "0 0 20px rgba(0,0,0,0.05)" }}>
                  <div className='h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-2' />
                  <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse' />
                </div>
              ))}
              <div className='bg-white p-4 rounded-lg flex items-center justify-between' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                <div className='h-5 w-40 bg-[#D2F1DA] rounded animate-pulse' />
                <div className='h-3 w-3 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}