'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// 候補者_転職活動状況確認ページ
export default function CandidateCareerStatusPage() {
  const router = useRouter();

  const handleEdit = () => {
    // TODO: 編集ページへの遷移
    router.push('/account/career-status/edit');
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
            >
              <path
                d="M6.11828 3.59656C6.34142 3.8197 6.34142 4.18208 6.11828 4.40522L2.69086 7.83264C2.46772 8.05579 2.10534 8.05579 1.8822 7.83264C1.65906 7.60951 1.65906 7.24713 1.8822 7.02399L4.90619 4L1.88398 0.976012C1.66084 0.752873 1.66084 0.390494 1.88398 0.167355C2.10712 -0.0557849 2.4695 -0.0557849 2.69264 0.167355L6.12007 3.59478L6.11828 3.59656Z"
                fill="white"
              />
            </svg>

            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              転職活動状況
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
              {/* 転職アイコン */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z"
                  fill="white"
                />
                <path
                  d="M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z"
                  fill="white"
                />
                <path
                  d="M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z"
                  fill="white"
                />
                <path
                  d="M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z"
                  fill="white"
                />
                <path
                  d="M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z"
                  fill="white"
                />
                <path
                  d="M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]">
              転職活動状況
            </h1>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className="bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]">
          <div className="flex flex-col items-center gap-6 lg:gap-10">
            <div className="bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]">
              {/* 転職活動状況セクション */}
              <div className="mb-6 lg:mb-6">
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    転職活動状況
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-6 lg:space-y-2">
                  {/* 転職希望時期 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        転職希望時期
                      </div>
                    </div>
                    <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                      <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                        テキストが入ります。
                      </div>
                    </div>
                  </div>

                  {/* 現在の活動状況 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        現在の活動状況
                      </div>
                    </div>
                    <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                      <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                        テキストが入ります。
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 選考状況セクション */}
              <div>
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    選考状況
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-4">
                  {/* 企業1のブロック */}
                  <div className="relative border border-[#dcdcdc] rounded-[10px] p-4 lg:p-6">
                    {/* 削除ボタン */}

                    <div className="space-y-6 lg:space-y-2">
                      {/* 公開範囲 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            公開範囲
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            企業名を非公開（面接・選択のみ公開）
                          </div>
                        </div>
                      </div>

                      {/* 選考 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            選考
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              面接テキスト
                            </span>
                            <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              面接テキスト
                            </span>
                            <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              面接テキスト
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 企業名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            企業名
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>

                      {/* 部署名・役職名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            部署名・役職名
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>

                      {/* 選択状況 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            選択状況
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>

                      {/* 評価理由 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            評価理由
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 企業2のブロック */}
                  <div className="relative border border-[#dcdcdc] rounded-[10px] p-4 lg:p-6">
                    <div className="space-y-6 lg:space-y-2">
                      {/* 公開範囲 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            公開範囲
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            企業名を非公開（面接・選択のみ公開）
                          </div>
                        </div>
                      </div>

                      {/* 選考 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            選考
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="flex flex-wrap gap-2">
                            <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              面接テキスト
                            </span>
                            <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              面接テキスト
                            </span>
                            <span className="bg-[#d2f1da] px-3 py-1 rounded-[5px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              面接テキスト
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 企業名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            企業名
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>

                      {/* 部署名・役職名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            部署名・役職名
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>

                      {/* 選択状況 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            選択状況
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>

                      {/* 評価理由 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            評価理由
                          </div>
                        </div>
                        <div className="px-4 lg:px-0 lg:py-6 lg:flex-1">
                          <div className="text-[16px] text-[#323232] font-medium tracking-[1.6px]">
                            テキストが入ります。
                          </div>
                        </div>
                      </div>
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
