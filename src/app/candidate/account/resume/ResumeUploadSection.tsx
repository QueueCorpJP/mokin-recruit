'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { uploadResumeFiles } from './actions';

export default function ResumeUploadSection() {
  const router = useRouter();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleResumeUpload = () => {
    if (typeof document === 'undefined') {
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = e => {
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
    if (typeof document === 'undefined') {
      return;
    }
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = e => {
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

  const handleSubmit = async () => {
    if (!agreeToTerms) {
      alert('留意事項に同意してください。');
      return;
    }

    if (!resumeFile && !cvFile) {
      alert('少なくとも1つのファイルをアップロードしてください。');
      return;
    }

    try {
      const formData = new FormData();
      if (resumeFile) {
        formData.append('resumeFile', resumeFile);
      }
      if (cvFile) {
        formData.append('careerSummaryFile', cvFile);
      }
      formData.append('agreement', 'true');

      const result = await uploadResumeFiles(formData);

      if (result.success) {
        alert(result.message);
        // ファイルをクリア
        setResumeFile(null);
        setCvFile(null);
        setAgreeToTerms(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'アップロードに失敗しました';
      alert(errorMessage);
    }
  };

  const removeResumeFile = () => {
    setResumeFile(null);
  };

  const removeCvFile = () => {
    setCvFile(null);
  };

  return (
    <>
      {/* 履歴書・職務経歴書表示セクション */}
      <div className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 lg:p-20 w-full max-w-[1280px] mb-6 lg:mb-10'>
        <div className='flex flex-col items-center gap-6 lg:gap-10'>
          <div className='flex flex-col items-center gap-6 text-center'>
            <h2 className='text-[#0f9058] text-[24px] lg:text-[32px] font-bold tracking-[2.4px] lg:tracking-[3.2px]'>
              履歴書・職務経歴書
            </h2>
            <p className='text-[#323232] text-[14px] lg:text-[16px] font-bold tracking-[1.4px] lg:tracking-[1.6px] leading-8'>
              登録内容をもとに、履歴書・職務経歴書形式で表示します。表示後は、印刷やPDFでの保存も可能です。
              <br />
              各項目の内容は、それぞれの編集画面からいつでも変更できます。
            </p>
          </div>
          <div className='flex flex-col lg:flex-row gap-4'>
            <Button
              variant='green-gradient'
              size='figma-default'
              onClick={() =>
                router.push('/candidate/account/resume/rirekisyo-preview')
              }
              className='min-w-[160px] text-[16px] tracking-[1.6px]'
            >
              履歴書を表示
            </Button>
            <Button
              variant='green-gradient'
              size='figma-default'
              onClick={() =>
                router.push('/candidate/account/resume/shokumu-preview')
              }
              className='min-w-[160px] text-[16px] tracking-[1.6px]'
            >
              職務経歴書を表示
            </Button>
          </div>
        </div>
      </div>

      {/* プロフィール入力代行セクション */}
      <div className='bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 lg:p-20 w-full max-w-[1280px]'>
        <div className='flex flex-col items-center gap-6 lg:gap-10'>
          <div className='text-center'>
            <h2 className='text-[#0f9058] text-[24px] lg:text-[32px] font-bold tracking-[2.4px] lg:tracking-[3.2px]'>
              プロフィール入力代行
            </h2>
          </div>

          {/* 留意事項 */}
          <div className='bg-[#F9F9F9] rounded-3xl p-6 w-full'>
            <div className='w-fit mx-auto'>
              <p className='text-[#323232] text-[14px] lg:text-[16px] font-medium tracking-[1.4px] lg:tracking-[1.6px] text-center mb-4'>
                アップロードいただいた書類をもとに運営が入力代行します。
              </p>
              <div className='text-[#323232] text-[12px] lg:text-[14px] font-medium tracking-[1.2px] lg:tracking-[1.4px] leading-6'>
                <p className='font-bold mb-2'>【留意事項】</p>
                <p>
                  ●以下の情報が含まれる場合は削除したうえでアップロードしてください
                </p>
                <p className=''>
                  ・マイナンバー・病歴などの登録に不要な機微情報
                </p>
                <p className=''>・機密情報や社外秘の内容</p>
                <p>
                  ●運営では転記のみ行います。翻訳・添削・追記等は行いません。
                </p>
              </div>
            </div>
          </div>

          {/* ファイルアップロードエリア */}
          <div className='flex flex-col gap-6 w-full lg:max-w-[600px]'>
            {/* 履歴書アップロード */}
            <div className='flex flex-col lg:flex-row lg:gap-4 lg:items-start'>
              <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] mb-2 lg:mb-0 lg:pt-3 lg:w-[100px]'>
                履歴書
              </div>
              <div className='flex-1'>
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={handleResumeUpload}
                    className='border border-[#999999] text-[#323232] text-[16px] font-bold tracking-[1.6px] px-10 py-3 rounded-[32px] w-full lg:w-auto'
                  >
                    履歴書をアップロード
                  </button>
                  {resumeFile && (
                    <div className='flex items-center gap-2 bg-[#d2f1da] px-6 py-2 rounded-[10px] w-fit'>
                      <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                        {resumeFile.name}
                      </span>
                      <button
                        onClick={removeResumeFile}
                        className='text-[#0f9058] hover:opacity-70'
                      >
                        <svg
                          width='12'
                          height='12'
                          viewBox='0 0 12 12'
                          fill='none'
                        >
                          <path
                            d='M1 1L11 11M1 11L11 1'
                            stroke='#0f9058'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                    ※5MB内のPDFのみアップロードが可能です。
                  </p>
                </div>
              </div>
            </div>

            {/* 職務経歴書アップロード */}
            <div className='flex flex-col lg:flex-row lg:gap-4 lg:items-start'>
              <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] mb-2 lg:mb-0 lg:pt-3 lg:w-[100px]'>
                職務経歴書
              </div>
              <div className='flex-1'>
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={handleCvUpload}
                    className='border border-[#999999] text-[#323232] text-[16px] font-bold tracking-[1.6px] px-10 py-3 rounded-[32px] w-full lg:w-auto'
                  >
                    職務経歴書をアップロード
                  </button>
                  {cvFile && (
                    <div className='flex items-center gap-2 bg-[#d2f1da] px-6 py-2 rounded-[10px] w-fit'>
                      <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                        {cvFile.name}
                      </span>
                      <button
                        onClick={removeCvFile}
                        className='text-[#0f9058] hover:opacity-70'
                      >
                        <svg
                          width='12'
                          height='12'
                          viewBox='0 0 12 12'
                          fill='none'
                        >
                          <path
                            d='M1 1L11 11M1 11L11 1'
                            stroke='#0f9058'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                  <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                    ※5MB内のPDFのみアップロードが可能です。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* チェックボックス */}
          <div className='flex item-start lg:items-center gap-2'>
            <div
              className='w-5 h-5 cursor-pointer mt-1'
              onClick={() => setAgreeToTerms(!agreeToTerms)}
            >
              <svg
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z'
                  fill={agreeToTerms ? '#0F9058' : '#DCDCDC'}
                />
              </svg>
            </div>
            <label
              className='text-[#323232] text-[14px] font-medium tracking-[1.4px] cursor-pointer'
              onClick={() => setAgreeToTerms(!agreeToTerms)}
            >
              上記の留意事項を理解したうえで、職務経歴書・履歴書のアップロードに同意します。
            </label>
          </div>

          {/* 送信ボタン */}
          <Button
            variant='green-gradient'
            size='figma-default'
            onClick={handleSubmit}
            className='w-fit lg:min-w-[300px] text-[12px] lg:text-[16px] tracking-[1.6px]'
            disabled={!agreeToTerms || (!resumeFile && !cvFile)}
          >
            アップした書類で入力代行を依頼する
          </Button>
        </div>
      </div>
    </>
  );
}
