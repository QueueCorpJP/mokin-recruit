export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="w-96 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex flex-col gap-3">
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            ))}
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex gap-4">
              {[...Array(8)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-100 rounded flex-1 animate-pulse"></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}