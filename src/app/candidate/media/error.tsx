'use client';

import { useEffect } from 'react';

export default function MediaError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Media page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#17856F] to-[#229A4E] relative overflow-hidden">
      {/* ヘッダー */}
      <header className="px-[80px] py-[120px] relative z-10 h-[400px] flex items-center justify-center">
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
          <h1 className="text-[32px] font-bold text-[#FFF] Noto_Sans_JP">メディア</h1>
        </div>
      </header>

      {/* エラー表示 */}
      <main className="w-full md:px-[80px] md:py-[80px] px-[16px] py-[40px] bg-[#F9F9F9] rounded-t-[24px] md:rounded-t-[80px] overflow-hidden relative z-10">
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h2 className="text-xl font-bold text-gray-900 mb-2">エラーが発生しました</h2>
            <p className="text-gray-600 mb-6">記事の読み込み中にエラーが発生しました。</p>
            <button
              onClick={reset}
              className="bg-[#0F9058] hover:bg-[#0d7a4a] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              再試行
            </button>
            <p className="text-sm text-gray-500 mt-4">
              問題が解決しない場合は、ページを再読み込みしてください。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}