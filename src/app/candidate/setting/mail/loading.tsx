export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 md:px-20 py-6 md:py-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-white/40 rounded animate-pulse" />
          <div className="h-7 w-56 bg-white/60 rounded animate-pulse" />
        </div>
      </div>
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] p-4 md:p-10">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="pt-[11px] w-full md:w-[200px]">
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-full md:w-[400px] flex flex-col gap-2">
              <div className="h-[50px] w-full border border-[#999999] rounded-[5px] bg-gray-100 animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-10">
          <div className="h-[50px] md:h-[56px] w-[160px] border border-[#0f9058] rounded-[32px] animate-pulse" />
          <div className="h-[50px] md:h-[56px] w-[200px] bg-[#D2F1DA] rounded-[32px] animate-pulse" />
        </div>
      </div>
    </div>
  );
}



