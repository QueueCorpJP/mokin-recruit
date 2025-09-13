export default function Loading() {
  return (
    <div className='w-full flex flex-col items-center justify-center'>
      <div className=' w-full'>
        {/* ヘッダー */}
        <div className='bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)] px-[80px] py-[40px] w-full'>
          <div className='max-w-[1280px] mx-auto w-full'>
            <div className='flex justify-between items-center mb-8'>
              <div className='flex items-center gap-4'>
                <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
                <div className='h-7 w-32 bg-white/60 rounded animate-pulse' />
              </div>
            </div>

            {/* フィルターカード */}
            <div className='bg-white rounded-[10px] p-[40px] mb-6 shadow-[0_2px_16px_0_rgba(44,151,109,0.10)]'>
              {/* 上段：ステータス・公開範囲 */}
              <div className='flex items-start gap-7 mb-6'>
                <div className='flex items-center gap-[16px]'>
                  <div className='h-8 w-[90px] bg-gray-200 rounded animate-pulse' />
                  <div className='flex border border-[#EFEFEF]'>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`py-[4px] px-[16px] text-[14px] font-bold tracking-[1.4px] leading-[24px] ${i>0 ? 'border-l border-[#EFEFEF]' : ''}`}>
                        <div className='h-5 w-12 bg-gray-100 rounded animate-pulse' />
                      </div>
                    ))}
                  </div>
                </div>
                <div className='flex items-center gap-[16px]'>
                  <div className='h-8 w-[72px] bg-gray-200 rounded animate-pulse' />
                  <div className='flex border border-[#EFEFEF]'>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`py-[4px] px-[16px] text-[14px] font-bold tracking-[1.4px] leading-[24px] ${i>0 ? 'border-l border-[#EFEFEF]' : ''}`}>
                        <div className='h-5 w-16 bg-gray-100 rounded animate-pulse' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 下段：グループと検索 */}
              <div className='flex items-center gap-12 mt-6'>
                <div className='flex items-center gap-4'>
                  <div className='h-8 w-[70px] bg-gray-200 rounded animate-pulse' />
                  <div className='h-10 w-60 bg-gray-100 rounded-lg animate-pulse' />
                </div>
                <div className='flex items-center gap-4'>
                  <div className='h-8 w-[220px] bg-gray-200 rounded animate-pulse' />
                  <div className='flex items-center gap-3'>
                    <div className='h-10 w-60 bg-gray-100 rounded-lg animate-pulse' />
                    <div className='h-12 w-28 bg-[#D2F1DA] rounded-full animate-pulse' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 本文 */}
        <div className='w-full px-[80px] py-[40px] bg-[#F9F9F9]'>
          <div className='max-w-[1280px] mx-auto w-full pb-[80px]'>
            <div className='flex w-full items-center justify-between mb-10'>
              <div className='h-[54px] w-[180px] rounded-[25px] bg-[#BFDFF5] animate-pulse' />
              <div className='flex gap-3 items-center w-auto flex-shrink-0'>
                <div className='bg-[#F0F9F3] rounded-[8px] p-4 w-[608px] animate-pulse' />
                <div className='flex flex-col justify-center gap-3 items-end min-w-[180px] h-[68px]'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='h-4 w-32 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>
            </div>

            {/* テーブルヘッダー */}
            <div className='rounded-t-lg flex flex-col items-center justify-center'>
              <div className="max-w-[1280px] w-full mx-auto flex gap-[24px] border-b border-[#DCDCDC] text-[#222] text-[14px] font-bold px-[40px] pr-[82px] pb-2">
                <div className='w-[160px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[424px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[90px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[107px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[112px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[70px] h-5 bg-gray-200 rounded animate-pulse' />
                <div className='w-[76px] h-5 bg-gray-200 rounded animate-pulse' />
              </div>
              <div className='mt-2'></div>

              {/* 行 */}
              <div className='flex flex-col gap-y-2'>
                {[...Array(10)].map((_, i) => (
                  <div key={i} className='bg-[#FFFFFF] flex gap-[24px] py-[20px] px-[24px] rounded-[10px]' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                    <div className='w-[160px] flex items-center'>
                      <div className='w-[160px] h-[32px] rounded-[8px] bg-gradient-to-r from-[#65BDAC] to-[#86C36A] animate-pulse' />
                    </div>
                    <div className='w-[424px]'>
                      <div className='flex flex-wrap gap-2 mb-2'>
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className='rounded-[8px] h-[32px] w-[136px] bg-[#D2F1DA] animate-pulse' />
                        ))}
                      </div>
                      <div className='h-5 bg-gray-200 rounded animate-pulse w-3/4' />
                    </div>
                    <div className='w-[76px] flex items-center justify-center'>
                      <div className='h-5 w-12 bg-gray-200 rounded animate-pulse' />
                    </div>
                    <div className='w-[107px] flex items-center justify-center'>
                      <div className='h-[22px] min-w-[60px] bg-[#0F9058]/40 rounded text-transparent'>xx</div>
                    </div>
                    <div className='w-[112px]'>
                      <div className='h-5 bg-gray-100 rounded animate-pulse w-full' />
                    </div>
                    <div className='w-[70px]'>
                      <div className='h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto' />
                    </div>
                    <div className='w-[76px]'>
                      <div className='h-4 w-12 bg-gray-200 rounded animate-pulse mx-auto' />
                    </div>
                    <div className='flex items-center gap-2 relative'>
                      <div className='h-8 w-8 bg-gray-200 rounded-full animate-pulse' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


