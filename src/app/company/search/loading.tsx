export default function Loading() {
  return (
    <div className="w-full bg-[#F9F9F9]">
      {/* ヘッダー（グラデーション・アイコン・タイトル） */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{ background: 'linear-gradient(to top, #17856f, #229a4e)' }}
      >
        <div className="w-full max-w-[1280px] mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-white/40 rounded animate-pulse" />
            <div className="h-7 w-40 bg-white/50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* 本文（検索フォームカード） */}
      <div className="w-full max-w-[1280px] mx-auto p-10">
        <div className="bg-white rounded-[10px]">
          <div className="p-10">
            <div className="flex flex-col gap-2">
              {/* SearchConditionForm セクション相当 */}
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 flex flex-wrap gap-3">
                      <div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* DesiredConditionForm セクション相当 */}
              <div className="mt-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                    <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 flex flex-wrap gap-3">
                      <div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
                      <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>

              {/* 下部ボタン行 */}
              <div className="flex justify-start gap-4 border-t-[2px] border-[#EFEFEF] pt-6 mt-5">
                <div className="h-10 w-40 bg-[#D2F1DA] rounded-[32px] animate-pulse" />
                <div className="h-10 w-48 bg-white border border-[#0f9058] rounded-[32px] animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
