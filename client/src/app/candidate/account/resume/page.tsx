'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CandidateResumePage() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleResumeUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        setResumeFile(file);
      } else {
        alert('ファイルサイズは5MB以内にしてください。');
      }
    };
    input.click();
  };

  const handleCvUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        setCvFile(file);
      } else {
        alert('ファイルサイズは5MB以内にしてください。');
      }
    };
    input.click();
  };

  const handleSubmit = () => {
    if (!agreeToTerms) {
      alert('留意事項に同意してください。');
      return;
    }
    // TODO: Submit files to backend
    // Replace with a logging mechanism or remove if unnecessary
    // Example: Use a custom logger or comment out the line
    // logger.info('Submitting files:', { resumeFile, cvFile });
  };

  const removeResumeFile = () => {
    setResumeFile(null);
  };

  const removeCvFile = () => {
    setCvFile(null);
  };

  return (
    <>
      {/* メインコンテンツ */}
      <main className="flex-1 relative z-[2]">
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10">
          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
              {/* プロフィールアイコン */}
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
              履歴書・職務経歴書
            </h1>
          </div>
        </div>

        {/* コンテンツ部分 */}
        <div className="bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]">
          <div className="flex flex-col items-center gap-6 lg:gap-10">
            {/* 履歴書・職務経歴書表示セクション */}
            <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 lg:p-20 w-full max-w-[1280px]">
              <div className="flex flex-col items-center gap-6 lg:gap-10">
                <div className="flex flex-col items-center gap-6 text-center">
                  <h2 className="text-[#0f9058] text-[24px] lg:text-[32px] font-bold tracking-[2.4px] lg:tracking-[3.2px]">
                    履歴書・職務経歴書
                  </h2>
                  <p className="text-[#323232] text-[14px] lg:text-[16px] font-bold tracking-[1.4px] lg:tracking-[1.6px] leading-8">
                    登録内容をもとに、履歴書・職務経歴書形式で表示します。表示後は、印刷やPDFでの保存も可能です。
                    <br />
                    各項目の内容は、それぞれの編集画面からいつでも変更できます。
                  </p>
                </div>
                <div className="flex flex-col lg:flex-row gap-4">
                  <Button
                    variant="green-gradient"
                    size="figma-default"
                    onClick={() =>
                      router.push('/account/resume/rirekisyo-preview')
                    }
                    className="min-w-[160px] text-[16px] tracking-[1.6px]"
                  >
                    履歴書を表示
                  </Button>
                  <Button
                    variant="green-gradient"
                    size="figma-default"
                    onClick={() =>
                      router.push('/account/resume/shokumu-preview')
                    }
                    className="min-w-[160px] text-[16px] tracking-[1.6px]"
                  >
                    職務経歴書を表示
                  </Button>
                </div>
              </div>
            </div>

            {/* プロフィール入力代行セクション */}
            <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 lg:p-20 w-full max-w-[1280px]">
              <div className="flex flex-col items-center gap-6 lg:gap-10">
                <div className="text-center">
                  <h2 className="text-[#0f9058] text-[24px] lg:text-[32px] font-bold tracking-[2.4px] lg:tracking-[3.2px]">
                    プロフィール入力代行
                  </h2>
                </div>

                {/* 留意事項 */}
                <div className="bg-[#F9F9F9] rounded-3xl p-6 w-full">
                  <div className="w-fit mx-auto">
                    <p className="text-[#323232] text-[14px] lg:text-[16px] font-medium tracking-[1.4px] lg:tracking-[1.6px] text-center mb-4">
                      アップロードいただいた書類をもとに運営が入力代行します。
                    </p>
                    <div className="text-[#323232] text-[12px] lg:text-[14px] font-medium tracking-[1.2px] lg:tracking-[1.4px] leading-6">
                      <p className="font-bold mb-2">【留意事項】</p>
                      <p>
                        ●以下の情報が含まれる場合は削除したうえでアップロードしてください
                      </p>
                      <p className="">
                        ・マイナンバー・病歴などの登録に不要な機微情報
                      </p>
                      <p className="">・機密情報や社外秘の内容</p>
                      <p>
                        ●運営では転記のみ行います。翻訳・添削・追記等は行いません。
                      </p>
                    </div>
                  </div>
                </div>

                {/* ファイルアップロードエリア */}
                <div className="flex flex-col gap-6 w-full lg:max-w-[600px]">
                  {/* 履歴書アップロード */}
                  <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-start">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px] mb-2 lg:mb-0 lg:pt-3 lg:w-[100px]">
                      履歴書
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleResumeUpload}
                          className="border border-[#999999] text-[#323232] text-[16px] font-bold tracking-[1.6px] px-10 py-3 rounded-[32px] w-full lg:w-auto"
                        >
                          履歴書をアップロード
                        </button>
                        {resumeFile && (
                          <div className="flex items-center gap-2 bg-[#d2f1da] px-6 py-2 rounded-[10px] w-fit">
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {resumeFile.name}
                            </span>
                            <button
                              onClick={removeResumeFile}
                              className="text-[#0f9058] hover:opacity-70"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M1 1L11 11M1 11L11 1"
                                  stroke="#0f9058"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                          ※5MB内のPDFのみアップロードが可能です。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 職務経歴書アップロード */}
                  <div className="flex flex-col lg:flex-row lg:gap-4 lg:items-start">
                    <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px] mb-2 lg:mb-0 lg:pt-3 lg:w-[100px]">
                      職務経歴書
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleCvUpload}
                          className="border border-[#999999] text-[#323232] text-[16px] font-bold tracking-[1.6px] px-10 py-3 rounded-[32px] w-full lg:w-auto"
                        >
                          職務経歴書をアップロード
                        </button>
                        {cvFile && (
                          <div className="flex items-center gap-2 bg-[#d2f1da] px-6 py-2 rounded-[10px] w-fit">
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {cvFile.name}
                            </span>
                            <button
                              onClick={removeCvFile}
                              className="text-[#0f9058] hover:opacity-70"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                              >
                                <path
                                  d="M1 1L11 11M1 11L11 1"
                                  stroke="#0f9058"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                        <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                          ※5MB内のPDFのみアップロードが可能です。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* チェックボックス */}
                <div className="flex item-start lg:items-center gap-2">
                  <div
                    className="w-5 h-5 cursor-pointer mt-1"
                    onClick={() => setAgreeToTerms(!agreeToTerms)}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                        fill={agreeToTerms ? '#0F9058' : '#DCDCDC'}
                      />
                    </svg>
                  </div>
                  <label
                    className="text-[#323232] text-[14px] font-medium tracking-[1.4px] cursor-pointer"
                    onClick={() => setAgreeToTerms(!agreeToTerms)}
                  >
                    上記の留意事項を理解したうえで、職務経歴書・履歴書のアップロードに同意します。
                  </label>
                </div>

                {/* 送信ボタン */}
                <Button
                  variant="green-gradient"
                  size="figma-default"
                  onClick={handleSubmit}
                  className="w-fit lg:min-w-[300px] text-[12px] lg:text-[16px] tracking-[1.6px]"
                  disabled={!agreeToTerms || (!resumeFile && !cvFile)}
                >
                  アップした書類で入力代行を依頼する
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
