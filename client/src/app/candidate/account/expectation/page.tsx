'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// 候補者_希望条件確認ページ
export default function CandidateExpectationPage() {
  const router = useRouter();

  const handleEdit = () => {
    router.push('/account/expectation/edit');
  };

  return (
    <>

      {/* メインコンテンツ */}
      <main className="flex-1 relative z-[2]">
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10">
          {/* パンくずリスト */}
          <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-4">
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              プロフィール確認・編集
            </span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M3 1L6 4L3 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              希望条件
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
              {/* プロフィールアイコン */}
              <svg
                width="28"
                height="32"
                viewBox="0 0 28 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.34868 0H16.9813H17.8047L18.3871 0.581312L26.4372 8.63138L27.0186 9.21319V10.0366V26.6313C27.0186 29.5911 24.6102 32 21.6498 32H6.34862C3.38936 32 0.98099 29.5911 0.98099 26.6313V5.36763C0.981053 2.40775 3.38937 0 6.34868 0ZM2.96874 26.6313C2.96874 28.4984 4.48199 30.0123 6.34862 30.0123H21.6498C23.517 30.0123 25.0308 28.4984 25.0308 26.6313V10.0367H19.7984C18.2432 10.0367 16.9813 8.77525 16.9813 7.21956V1.98763H6.34862C4.48199 1.98763 2.96874 3.5015 2.96874 5.36756V26.6313Z"
                  fill="white"
                />
                <path
                  d="M8.58029 9.96484C9.05954 10.3003 9.64304 10.4984 10.271 10.4984C10.8995 10.4984 11.4825 10.3003 11.9624 9.96484C12.801 10.3258 13.3161 10.9587 13.6304 11.5178C14.0478 12.2593 13.7205 13.309 12.9996 13.309C12.2777 13.309 10.271 13.309 10.271 13.309C10.271 13.309 8.26492 13.309 7.54298 13.309C6.8216 13.309 6.49379 12.2593 6.91173 11.5178C7.22604 10.9587 7.74117 10.3258 8.58029 9.96484Z"
                  fill="white"
                />
                <path
                  d="M10.2711 9.79659C9.03838 9.79659 8.04019 8.79841 8.04019 7.56628V7.03166C8.04019 5.80066 9.03838 4.80078 10.2711 4.80078C11.5032 4.80078 12.5024 5.80066 12.5024 7.03166V7.56628C12.5024 8.79841 11.5031 9.79659 10.2711 9.79659Z"
                  fill="white"
                />
                <path
                  d="M6.87283 16.2734H21.2725V17.6716H6.87283V16.2734Z"
                  fill="white"
                />
                <path
                  d="M6.80008 20.4688H21.1997V21.8675H6.80008V20.4688Z"
                  fill="white"
                />
                <path
                  d="M6.85304 24.6641H16.9331V26.0618H6.85304V24.6641Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]">
              希望条件
            </h1>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className="bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]">
          <div className="flex flex-col items-center gap-6 lg:gap-10">
            <div className="bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]">
              {/* 希望条件セクション */}
              <div className="space-y-6 lg:space-y-2">
                {/* 希望年収 */}
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                      希望年収
                    </div>
                  </div>
                  <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                    <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                      700万円
                    </div>
                  </div>
                </div>

                {/* 希望業種 */}
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                      希望業種
                    </div>
                  </div>
                  <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        業種テキスト
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        業種テキスト
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        業種テキスト
                      </span>
                    </div>
                  </div>
                </div>

                {/* 希望職種 */}
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                      希望職種
                    </div>
                  </div>
                  <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        職種テキスト
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        職種テキスト
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        職種テキスト
                      </span>
                    </div>
                  </div>
                </div>

                {/* 希望勤務地 */}
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                      希望勤務地
                    </div>
                  </div>
                  <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        東京都
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        大阪府
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        神奈川県
                      </span>
                    </div>
                  </div>
                </div>

                {/* 興味のある働き方 */}
                <div className="flex flex-col lg:flex-row lg:gap-6">
                  <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0">
                      興味のある働き方
                    </div>
                  </div>
                  <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        リモートワーク
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        フレックスタイム
                      </span>
                      <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                        副業可
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 編集ボタン */}
            <Button
              variant="green-gradient"
              size="figma-default"
              onClick={handleEdit}
              className="min-w-[160px] w-full lg:w-auto text-[16px] tracking-[1.6px]"
            >
              編集する
            </Button>
          </div>
        </div>
      </main>

    </>
  );
}
