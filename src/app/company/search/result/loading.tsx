export default function Loading() {
  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      {/* 上部: 詳細検索フォーム（ヘッダー領域相当） */}
      <div className='px-20 pt-10'>
        <div className='w-full max-w-[1200px] mx-auto'>
          <div className='bg-white rounded-[10px] p-10 shadow-[0_2px_16px_0_rgba(44,151,109,0.10)]'>
            <div className='flex flex-col gap-2'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='flex gap-6 items-center'>
                  <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 min-h-[80px] flex items-center'>
                    <div className='h-5 w-24 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='flex-1'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <div className='h-10 w-60 bg-gray-100 rounded-[5px] animate-pulse' />
                      <div className='h-10 w-6 bg-transparent' />
                      <div className='h-10 w-60 bg-gray-100 rounded-[5px] animate-pulse' />
                    </div>
                  </div>
                </div>
              ))}
              <div className='border-t-[2px] border-[#EFEFEF] mt-5 mb-5' />
              <div className='flex justify-start gap-4'>
                <div className='h-10 w-40 bg-[#D2F1DA] rounded-[32px] animate-pulse' />
                <div className='h-10 w-48 border border-[#0f9058] rounded-[32px] animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 中段: フィルタチェック群 + ソートタブ + 件数表示 */}
      <div className='px-20 pt-10 pb-6'>
        <div className='w-full max-w-[1280px] mx-auto'>
          {/* チェックボックス群 */}
          <div className='flex items-center gap-6 mb-6'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='flex items-center gap-2'>
                <div className='h-5 w-5 bg-gray-200 rounded animate-pulse' />
                <div className='h-4 w-28 bg-gray-200 rounded animate-pulse' />
              </div>
            ))}
          </div>

          {/* ソートタブ + 件数 */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`px-4 py-2 border border-[#EFEFEF] ${i===0 ? 'bg-[#D2F1DA]' : 'bg-[#f9f9f9]'} rounded-none`}>
                  <div className='h-4 w-16 bg-gray-200 rounded animate-pulse' />
                </div>
              ))}
            </div>
            <div className='h-4 w-40 bg-gray-200 rounded animate-pulse' />
          </div>
        </div>
      </div>

      {/* 下段: 候補者リスト（縦並び） */}
      <div className='px-20 pb-20'>
        <div className='w-full max-w-[1280px] mx-auto space-y-2'>
          {[...Array(10)].map((_, i) => (
            <div key={i} className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
              <div className='flex gap-6'>
                {/* アクション列 */}
                <div className='flex flex-col gap-6 w-8'>
                  <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse' />
                  <div className='w-8 h-8 bg-gray-200 rounded-full animate-pulse' />
                </div>
                {/* 情報列 */}
                <div className='flex-1'>
                  {/* バッジ群 */}
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='h-8 w-16 bg-[#ff9d00]/50 rounded-[100px] animate-pulse' />
                    <div className='h-8 w-20 bg-[#b687e8]/50 rounded-[8px] animate-pulse' />
                  </div>
                  {/* タイトル/名前行 */}
                  <div className='h-5 w-1/2 bg-gray-200 rounded animate-pulse mb-2' />
                  {/* メタ情報行 */}
                  <div className='h-4 w-2/3 bg-gray-100 rounded animate-pulse mb-1' />
                  <div className='h-4 w-1/2 bg-gray-100 rounded animate-pulse' />
                </div>
              </div>
            </div>
          ))}
          {/* ページネーション */}
          <div className='flex justify-center mt-10'>
            <div className='h-8 w-64 bg-gray-100 rounded-full animate-pulse' />
          </div>
        </div>
      </div>
    </div>
  );
}


