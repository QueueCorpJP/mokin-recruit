export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* ヘッダー */}
      <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 md:px-20 py-6 md:py-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/40 rounded animate-pulse" />
          <div className="h-7 w-40 bg-white/60 rounded animate-pulse" />
        </div>
      </div>

      {/* 本文 */}
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] p-4 md:p-10">
          <div className="flex flex-col gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:gap-6">
                <div className="w-full md:w-[200px] flex-shrink-0">
                  <div className="bg-[#f9f9f9] rounded-[5px] px-6 py-3 w-full">
                    <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex-1 py-4 md:py-6 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse" />
                    </div>
                    <div className="h-[44px] w-48 border border-[#0f9058] rounded-[32px] animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



