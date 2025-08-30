import React from 'react';

export default function MediaLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-t from-[#17856F] to-[#229A4E] relative overflow-hidden">
      {/* ヘッダー */}
      <header className="px-[80px] py-[120px] relative z-10 h-[400px] flex items-center justify-center">
        {/* 完全な半円背景 */}
        <div className="absolute inset-0 overflow-visible" style={{ zIndex: -1 }}>
          <div className="relative w-full h-full">
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              style={{
                width: '120vw',
                height: '60vw',
                maxWidth: '1200px',
                maxHeight: '600px',
                borderRadius: '50%',
                background: 'linear-gradient(180deg, #1CA74F 0%, #198D76 100%)'
              }}
            />
          </div>
        </div>
        <div className="text-center relative z-10">
          <div className="h-8 bg-white/20 rounded animate-pulse w-32 mx-auto"></div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="w-full md:px-[80px] md:py-[80px] px-[16px] py-[40px] bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10">
        <div className="flex flex-col lg:flex-row gap-[80px]">
          {/* 記事グリッド */}
          <div className="flex-1 animate-pulse">
            <div className="flex flex-row gap-[12px] justify-start items-center border-b-[2px] border-[#DCDCDC] pb-[8px] mb-[24px]">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[40px]">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white rounded-[10px] overflow-hidden shadow-[0_0_20px_0_rgba(0,0,0,0.05)]">
                  <div className="h-[200px] bg-gray-200"></div>
                  <div className="p-[24px] pb-[40px]">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* ページネーション */}
            <div className="flex justify-center mt-10">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-10 h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
          
          {/* サイドバー */}
          <div className="w-full lg:w-[320px] animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}