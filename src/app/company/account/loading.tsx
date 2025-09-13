export default function Loading() {
  return (
    <div className='bg-[#f9f9f9]'>
      {/* ヘッダー */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{ background: 'linear-gradient(to top, #17856f, #229a4e)' }}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <div className='w-8 h-8 bg-white/40 rounded animate-pulse' />
            <div className='h-7 w-48 bg-white/60 rounded animate-pulse' />
          </div>
        </div>
      </div>

      {/* メイン */}
      <div className="px-20 pt-10 pb-20">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* 企業情報カード */}
          <div className="bg-white rounded-[10px] p-10 mb-6 relative">
            <div className="absolute top-10 right-10 h-12 w-40 bg-[#D2F1DA] rounded-full animate-pulse" />

            <div className="flex flex-col gap-2">
              {/* 会社名 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center py-6">
                  <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              {/* URL 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex flex-col py-6 gap-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <div className='h-5 w-28 bg-gray-200 rounded animate-pulse' />
                      <div className='h-5 w-64 bg-gray-100 rounded animate-pulse' />
                    </div>
                  ))}
                </div>
              </div>

              {/* アイコン画像 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-start py-6">
                  <div className="w-[100px] h-[100px] rounded-full bg-gray-200 border-2 border-gray-300 animate-pulse" />
                </div>
              </div>

              {/* 代表者 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center py-6 gap-2">
                  <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                  <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>

              {/* 設立年 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className='flex items-center py-6 gap-2'>
                  <div className='h-5 w-16 bg-gray-200 rounded animate-pulse' />
                  <div className='h-5 w-6 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>

              {/* 資本金 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className='flex items-center py-6 gap-2'>
                  <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                  <div className='h-5 w-10 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>

              {/* 従業員数 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className='flex items-center py-6 gap-2'>
                  <div className='h-5 w-16 bg-gray-200 rounded animate-pulse' />
                  <div className='h-5 w-6 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>

              {/* 業種 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center py-6">
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-[#d2f1da] rounded-[5px] w-[80px] h-[28px] animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>

              {/* 事業内容 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 py-6">
                  <div className='space-y-2'>
                    <div className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                    <div className='h-4 w-5/6 bg-gray-100 rounded animate-pulse' />
                    <div className='h-4 w-4/6 bg-gray-100 rounded animate-pulse' />
                  </div>
                </div>
              </div>

              {/* 所在地 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 py-6">
                  <div className='space-y-1'>
                    <div className='h-4 w-40 bg-gray-200 rounded animate-pulse' />
                    <div className='h-4 w-64 bg-gray-100 rounded animate-pulse' />
                  </div>
                </div>
              </div>

              {/* 企業フェーズ 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className='flex items-center py-6'>
                  <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                </div>
              </div>

              {/* イメージ画像 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className='flex items-start py-6 gap-4 flex-wrap'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-[200px] h-[133px] bg-gray-200 rounded-[5px] border-2 border-gray-300 animate-pulse" />
                  ))}
                </div>
              </div>

              {/* 企業の魅力 行 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex-1 py-6">
                  <div className='space-y-6'>
                    {[...Array(2)].map((_, i) => (
                      <div key={i}>
                        <div className='h-5 w-40 bg-gray-200 rounded animate-pulse mb-2' />
                        <div className='space-y-2'>
                          <div className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                          <div className='h-4 w-5/6 bg-gray-100 rounded animate-pulse' />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* グループ管理セクション */}
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className='w-8 h-8 bg-[#0f9058]/20 rounded animate-pulse' />
                <div className='h-7 w-40 bg-gray-200 rounded animate-pulse' />
              </div>
              <div className='h-12 w-40 bg-white border border-[#0f9058] rounded-[32px] animate-pulse' />
            </div>

            <div className="flex flex-col gap-6">
              {[...Array(3)].map((_, gi) => (
                <div key={gi} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className='h-6 w-40 bg-[#0f9058]/20 rounded animate-pulse' />
                      <div className='h-6 w-6 rounded animate-pulse bg-[#dcdcdc]' />
                    </div>
                    <div className='h-10 w-36 border border-[#0f9058] rounded-[32px] animate-pulse' />
                  </div>
                  <div className="h-[1px] bg-[#999] w-full mb-2"></div>
                  <div className="flex flex-col gap-2">
                    {[...Array(3)].map((_, mi) => (
                      <div key={mi} className="bg-white flex items-center gap-6 px-10 py-5 rounded-[10px]">
                        <div className='flex-1 h-5 bg-gray-100 rounded animate-pulse' />
                        <div className='w-60 h-5 bg-gray-100 rounded animate-pulse' />
                        <div className='w-60 h-10 bg-gray-100 rounded-lg animate-pulse' />
                        <div className='h-5 w-10 bg-gray-200 rounded animate-pulse' />
                      </div>
                    ))}
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


