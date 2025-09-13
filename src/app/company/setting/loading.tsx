export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* ヘッダー */}
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] p-4 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className='w-8 h-8 bg-[#dcdcdc] rounded animate-pulse' />
            <div className='h-7 w-32 bg-gray-200 rounded animate-pulse' />
          </div>

          {/* プロフィール行 */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="w-full md:w-[200px] flex-shrink-0 flex">
              <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 w-full">
                <div className='h-5 w-20 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
            <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                  <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className="h-[42px] w-48 border border-[#0f9058] rounded-[32px] animate-pulse" />
              </div>
            </div>
          </div>

          {/* ログイン情報 */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="w-full md:w-[200px] flex-shrink-0 flex">
              <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 w-full">
                <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
            <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                  <div className='h-5 w-40 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className="h-[42px] w-48 border border-[#0f9058] rounded-[32px] animate-pulse" />
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex-1">
                  <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                </div>
                <div className="h-[42px] w-48 border border-[#0f9058] rounded-[32px] animate-pulse" />
              </div>
            </div>
          </div>

          {/* 通知メール配信設定 */}
          <div className="flex flex-col md:flex-row md:gap-6">
            <div className="w-full md:w-[200px] flex-shrink-0 flex">
              <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 w-full">
                <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
              </div>
            </div>
            <div className="flex-1 py-4 md:py-6 flex flex-col gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="font-bold w-[160px] text-right">
                    <div className='h-5 w-24 bg-gray-200 rounded animate-pulse ml-auto' />
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className='h-5 w-20 bg-gray-100 rounded animate-pulse' />
                    <div className='h-5 w-24 bg-gray-100 rounded animate-pulse' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


