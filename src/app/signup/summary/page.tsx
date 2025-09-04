'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { saveSummaryData } from './actions';

export default function SignupSummaryPage() {
  const router = useRouter();
  const [jobSummary, setJobSummary] = useState('');
  const [selfPR, setSelfPR] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await saveSummaryData({
        jobSummary: jobSummary || undefined,
        selfPR: selfPR || undefined,
      });
      // リダイレクトはServer Action内で処理される
    } catch (error) {
      console.error('Summary data save error:', error);
      // エラーの場合は手動でページ遷移
      router.push('/signup/complete');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* PC Version */}
      <main
        className='hidden lg:flex relative py-20 flex-col items-center justify-start'
        style={{
          backgroundImage: "url('/background-pc.svg')",
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Container */}
        <div className='bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center'>
          {/* Title */}
          <div className='flex flex-col gap-6 items-center w-full'>
            <h1 className='text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center'>
              会員情報
            </h1>
          </div>

          {/* Progress Tabs */}
          <div className='flex flex-row w-full h-[45px]'>
            <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]'>
              <div className='w-6 h-6 flex items-center justify-center'>
                <svg
                  width='24'
                  height='23'
                  viewBox='0 0 24 23'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M8.625 2.5H15.375C15.5813 2.5 15.75 2.66875 15.75 2.875V4.75H8.25V2.875C8.25 2.66875 8.41875 2.5 8.625 2.5ZM6 2.875V4.75H3C1.34531 4.75 0 6.09531 0 7.75V12.25H9H15H24V7.75C24 6.09531 22.6547 4.75 21 4.75H18V2.875C18 1.42656 16.8234 0.25 15.375 0.25H8.625C7.17656 0.25 6 1.42656 6 2.875ZM24 13.75H15V15.25C15 16.0797 14.3297 16.75 13.5 16.75H10.5C9.67031 16.75 9 16.0797 9 15.25V13.75H0V19.75C0 21.4047 1.34531 22.75 3 22.75H21C22.6547 22.75 24 21.4047 24 19.75V13.75Z'
                    fill='#DCDCDC'
                  />
                </svg>
              </div>
              <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                経歴詳細
              </span>
            </div>
            <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]'>
              <div className='w-6 h-6 flex items-center justify-center'>
                <svg
                  width='25'
                  height='25'
                  viewBox='0 0 25 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M16.6687 2.45833L22.6582 8.44427C25.1139 10.8979 25.1139 14.8422 22.6582 17.2959L17.4092 22.5411C16.9733 22.9763 16.261 22.9809 15.8204 22.5503C15.3799 22.1198 15.3752 21.4161 15.8111 20.9809L21.0554 15.7357C22.6441 14.1478 22.6441 11.597 21.0554 10.009L15.0706 4.0231C14.6347 3.58793 14.6394 2.88425 15.08 2.4537C15.5205 2.02316 16.2329 2.02779 16.6687 2.46296V2.45833ZM0.5 11.2729V4.3518C0.5 3.12498 1.50762 2.12964 2.74956 2.12964H9.756C10.5527 2.12964 11.3166 2.43981 11.879 2.99535L19.7525 10.7729C20.9241 11.9303 20.9241 13.8052 19.7525 14.9626L13.4959 21.143C12.3243 22.3004 10.4262 22.3004 9.25454 21.143L1.38108 13.3654C0.814001 12.8099 0.5 12.0599 0.5 11.2729ZM7.24868 7.31467C7.24868 6.92177 7.09068 6.54496 6.80943 6.26714C6.52818 5.98931 6.14672 5.83324 5.74897 5.83324C5.35123 5.83324 4.96977 5.98931 4.68852 6.26714C4.40727 6.54496 4.24927 6.92177 4.24927 7.31467C4.24927 7.70758 4.40727 8.08439 4.68852 8.36221C4.96977 8.64003 5.35123 8.79611 5.74897 8.79611C6.14672 8.79611 6.52818 8.64003 6.80943 8.36221C7.09068 8.08439 7.24868 7.70758 7.24868 7.31467Z'
                    fill='#DCDCDC'
                  />
                </svg>
              </div>
              <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                語学・スキル
              </span>
            </div>
            <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]'>
              <div className='w-6 h-6 flex items-center justify-center'>
                <svg
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M4.48576 2C4.48576 1.17031 3.81427 0.5 2.98311 0.5C2.15196 0.5 1.48047 1.17031 1.48047 2V3.5V17.75V23C1.48047 23.8297 2.15196 24.5 2.98311 24.5C3.81427 24.5 4.48576 23.8297 4.48576 23V17L7.50514 16.2453C9.4351 15.7625 11.4778 15.9875 13.2575 16.8734C15.333 17.9094 17.7419 18.0359 19.9114 17.2203L21.5408 16.6109C22.1278 16.3906 22.5175 15.8328 22.5175 15.2047V3.59375C22.5175 2.51562 21.3811 1.8125 20.4138 2.29531L19.963 2.52031C17.7889 3.60781 15.2297 3.60781 13.0555 2.52031C11.4073 1.69531 9.51493 1.48906 7.72584 1.93438L4.48576 2.75V2Z'
                    fill='#DCDCDC'
                  />
                </svg>
              </div>
              <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                希望条件
              </span>
            </div>
            <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]'>
              <div className='w-6 h-6 flex items-center justify-center'>
                <svg
                  width='24'
                  height='25'
                  viewBox='0 0 24 25'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M6.26322 0.5H14.2377H14.8552L15.292 0.935984L21.3296 6.97353L21.7656 7.40989V8.02747V20.4734C21.7656 22.6933 19.9593 24.5 17.7391 24.5H6.26317C4.04374 24.5 2.23745 22.6933 2.23745 20.4734V4.52572C2.2375 2.30581 4.04374 0.5 6.26322 0.5ZM3.72827 20.4734C3.72827 21.8738 4.8632 23.0092 6.26317 23.0092H17.7391C19.1395 23.0092 20.2748 21.8738 20.2748 20.4734V8.02752H16.3505C15.1841 8.02752 14.2377 7.08144 14.2377 5.91467V1.99072H6.26317C4.8632 1.99072 3.72827 3.12612 3.72827 4.52567V20.4734Z'
                    fill='#0F9058'
                  />
                  <path
                    d='M7.93766 7.97266C8.2971 8.22423 8.73472 8.37283 9.20572 8.37283C9.6771 8.37283 10.1143 8.22423 10.4742 7.97266C11.1032 8.24336 11.4895 8.71806 11.7252 9.13736C12.0383 9.69348 11.7928 10.4807 11.2521 10.4807C10.7107 10.4807 9.20572 10.4807 9.20572 10.4807C9.20572 10.4807 7.70113 10.4807 7.15968 10.4807C6.61865 10.4807 6.37279 9.69348 6.68624 9.13736C6.92197 8.71802 7.30832 8.24336 7.93766 7.97266Z'
                    fill='#0F9058'
                  />
                  <path
                    d='M9.20538 7.84598C8.28086 7.84598 7.53222 7.09734 7.53222 6.17325V5.77228C7.53222 4.84903 8.28086 4.09912 9.20538 4.09912C10.1295 4.09912 10.8789 4.84903 10.8789 5.77228V6.17325C10.8789 7.09734 10.1294 7.84598 9.20538 7.84598Z'
                    fill='#0F9058'
                  />
                  <path
                    d='M6.65731 12.7046H17.457V13.7532H6.65731V12.7046Z'
                    fill='#0F9058'
                  />
                  <path
                    d='M6.60262 15.8508H17.4023V16.8999H6.60262V15.8508Z'
                    fill='#0F9058'
                  />
                  <path
                    d='M6.64308 18.9976H14.2031V20.0458H6.64308V18.9976Z'
                    fill='#0F9058'
                  />
                </svg>
              </div>
              <span className='text-[#0f9058] text-[18px] font-bold tracking-[1.8px]'>
                職務要約
              </span>
            </div>
          </div>

          {/* Description */}
          <div className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold'>
            <p>
              あなたのご経験や強みを簡潔にまとめることで、スカウトの精度が高まります。
            </p>
            <p>
              自由にご記入ください。あとから編集も可能ですので、まずは書ける範囲で、箇条書きでも構いません。
            </p>
          </div>

          {/* Form Fields */}
          <div className='flex flex-col gap-6 w-fit items-end'>
            {/* Job Summary */}
            <div className='flex flex-row gap-4 items-start w-full'>
              <div className='pt-[11px] min-w-[130px] text-right'>
                <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                  職務要約
                </label>
              </div>
              <div className='w-[400px]'>
                <textarea
                  value={jobSummary}
                  onChange={e => setJobSummary(e.target.value)}
                  placeholder='例）大手メーカーにて事業企画を担当。国内外の市場調査や新規事業の事業性評価、既存事業のKPI分析・改善提案などを行ってきました。その後、経営企画部門に異動し、中期経営計画の策定や全社横断の施策推進にも携わっています。'
                  className='leading-[200%] w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] min-h-[214px] resize-none'
                />
              </div>
            </div>

            {/* Self PR / Other */}
            <div className='flex flex-row gap-4 items-start w-full'>
              <div className='pt-[11px] min-w-[130px] text-right'>
                <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                  自己PR・その他
                </label>
              </div>
              <div className='w-[400px]'>
                <textarea
                  value={selfPR}
                  onChange={e => setSelfPR(e.target.value)}
                  placeholder='例）目標に向けて周囲を巻き込みながら推進するのが得意です。直近では〇〇プロジェクトで〜を達成しました。'
                  className='leading-[200%] w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] min-h-[147px] resize-none'
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='button'
            onClick={handleSubmit}
            disabled={isSubmitting}
            variant='green-gradient'
            size='figma-default'
            className='min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? '送信中...' : '次へ'}
          </Button>
        </div>
      </main>

      {/* SP (Mobile) Version */}
      <main
        className='lg:hidden flex relative pt-6 pb-20 flex-col items-center px-4'
        style={{
          backgroundImage: "url('/background-sp.svg')",
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        {/* Container */}
        <div className='bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 mx-4 w-full flex flex-col gap-10 items-center'>
          {/* Progress Indicator */}
          <div className='flex flex-row gap-4 items-center w-full pb-4 border-b border-[#efefef]'>
            <div className='relative w-[72px] h-[72px]'>
              <svg width='72' height='72' viewBox='0 0 72 72' fill='none'>
                <circle
                  cx='36'
                  cy='36'
                  r='28.8'
                  stroke='#e0e0e0'
                  strokeWidth='7.2'
                  fill='none'
                  strokeLinecap='round'
                  transform='rotate(-90 36 36)'
                />
                <circle
                  cx='36'
                  cy='36'
                  r='28.8'
                  stroke='#0f9058'
                  strokeWidth='7.2'
                  fill='none'
                  strokeLinecap='round'
                  strokeDasharray='180.96 0'
                  transform='rotate(-90 36 36)'
                />
              </svg>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='text-center'>
                  <span className='text-[#0f9058] text-[24px] font-bold tracking-[2.4px]'>
                    4
                  </span>
                  <span className='text-[#999999] text-[17px] font-bold tracking-[1.7px]'>
                    /4
                  </span>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <p className='text-[#999999] text-[16px] font-bold tracking-[1.6px]'>
                会員情報
              </p>
              <p className='text-[#0f9058] text-[20px] font-bold tracking-[2px]'>
                職務要約
              </p>
            </div>
          </div>

          {/* Description */}
          <div className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold'>
            <p>
              あなたのご経験や強みを簡潔にまとめることで、スカウトの精度が高まります。
              <br />
              自由にご記入ください。あとから編集も可能ですので、まずは書ける範囲で、箇条書きでも構いません。
            </p>
          </div>

          {/* Form Fields */}
          <div className='flex flex-col gap-6 w-full'>
            {/* Job Summary */}
            <div className='flex flex-col gap-2'>
              <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                職務要約
              </label>
              <textarea
                value={jobSummary}
                onChange={e => setJobSummary(e.target.value)}
                placeholder='例）大手メーカーにて事業企画を担当。国内外の市場調査や新規事業の事業性評価、既存事業のKPI分析・改善提案などを行ってきました。その後、経営企画部門に異動し、中期経営計画の策定や全社横断の施策推進にも携わっています。'
                className='leading-[200%] w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] min-h-[246px] resize-none'
              />
            </div>

            {/* Self PR / Other */}
            <div className='flex flex-col gap-2'>
              <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                自己PR・その他
              </label>
              <textarea
                value={selfPR}
                onChange={e => setSelfPR(e.target.value)}
                placeholder='例）目標に向けて周囲を巻き込みながら推進するのが得意です。直近では〇〇プロジェクトで〜を達成しました。'
                className='leading-[200%] w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] min-h-[148px] resize-none'
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type='button'
            onClick={handleSubmit}
            variant='green-gradient'
            size='figma-default'
            className='w-full text-[16px] tracking-[1.6px]'
          >
            次へ
          </Button>
        </div>
      </main>
    </>
  );
}
