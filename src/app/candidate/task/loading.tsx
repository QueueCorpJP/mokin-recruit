export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          <div className='max-w-[880px] md:px-6 flex-1 box-border w-full'>
            {/* SectionHeadingのスケルトン（バナー部分） */}
            <div
              className='flex flex-row items-center gap-3 pb-2 border-b-2 border-[#DCDCDC] mb-4'
              style={{ marginBottom: '8px' }}
            >
              <div className='w-6 h-6 bg-gray-200 rounded animate-pulse' />
              <div className='h-6 w-36 bg-gray-200 rounded animate-pulse' />
            </div>

            {/* TaskListのスケルトン */}
            <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
              <div className='animate-pulse space-y-4'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className='flex items-center p-4 border border-gray-200 rounded'
                  >
                    <div className='w-4 h-4 bg-gray-200 rounded mr-4'></div>
                    <div className='flex-1'>
                      <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                      <div className='h-3 bg-gray-200 rounded w-1/2'></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右カラム: サイドバー */}
          <div className='w-full md:max-w-[320px] md:flex-none'>
            {/* バナー画像のスケルトン */}
            <div className='w-full aspect-[320/200] bg-gray-200 rounded-lg animate-pulse mb-20' />

            {/* よくある質問セクションのスケルトン */}
            <div className='flex flex-col gap-2'>
              {/* よくある質問見出しのスケルトン（バナー部分） */}
              <div className='flex flex-row items-center gap-3 pb-2 border-b-2 border-[#DCDCDC] mb-4'>
                <div className='w-6 h-6 bg-gray-200 rounded animate-pulse' />
                <div className='h-6 w-32 bg-gray-200 rounded animate-pulse' />
              </div>

              {/* FAQ項目のスケルトン */}
              <div className='space-y-2'>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className='bg-white rounded-lg p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.05)]'
                  >
                    <div className='h-4 w-full bg-gray-200 rounded animate-pulse mb-2' />
                    <div className='h-3 w-3/4 bg-gray-100 rounded animate-pulse' />
                  </div>
                ))}
              </div>

              {/* Q&A一覧リンクのスケルトン */}
              <div className='bg-white rounded-lg p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] flex items-center justify-between'>
                <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                <div className='w-4 h-4 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
