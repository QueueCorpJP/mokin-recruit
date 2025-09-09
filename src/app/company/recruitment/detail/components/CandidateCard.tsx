import React from 'react';
import { CandidateData } from '@/lib/server/candidate/recruitment-queries';

interface CandidateCardProps {
  candidate: CandidateData;
  onClick: (candidate: CandidateData) => void;
}

export function CandidateCard({ candidate, onClick }: CandidateCardProps) {
  return (
    <div
      className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] flex flex-col min-[1440px]:flex-row gap-4 cursor-pointer hover:shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] transition-shadow duration-200'
      onClick={() => onClick(candidate)}
    >
      {/* Left Section - Candidate Info */}
      <div className='w-full min-[1440px]:w-[356px] flex flex-col gap-6 flex-shrink-0'>
        <div className='flex flex-col gap-1 w-full min-[1440px]:w-[356px]'>
          <div
            className='text-[#0f9058] text-[18px] font-bold leading-[160%] tracking-[1.8px] w-full min-[1440px]:w-[356px] h-[29px] truncate'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {candidate.company}
          </div>
          <div
            className='text-[#323232] text-[16px] font-bold leading-[200%] tracking-[1.6px] w-full min-[1440px]:w-[356px] h-[32px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {candidate.name}
          </div>
          <div
            className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] w-full min-[1440px]:w-[356px] h-[22px]'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            {candidate.location}／{candidate.age}歳／{candidate.gender}
          </div>
        </div>

        <div className='flex flex-col gap-2 w-full min-[1440px]:w-[356px]'>
          <div className='flex gap-6 w-full min-[1440px]:w-[356px] h-auto min-[1440px]:h-[48px]'>
            <span
              className='text-[#999999] text-[14px] font-bold leading-[160%] tracking-[1.4px] w-[65px] h-[22px] flex-shrink-0'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              経験職種
            </span>
            <div className='flex flex-wrap gap-0 flex-1 min-[1440px]:w-[267px] h-auto min-[1440px]:h-[48px]'>
              {candidate.experience.map((exp, index) => (
                <React.Fragment key={index}>
                  <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                    {exp}
                  </span>
                  {index < candidate.experience.length - 1 && (
                    <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                      、
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='flex gap-6 w-full min-[1440px]:w-[356px] h-auto min-[1440px]:h-[48px]'>
            <span
              className='text-[#999999] text-[14px] font-bold leading-[160%] tracking-[1.4px] w-[65px] h-[22px] flex-shrink-0'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              経験業種
            </span>
            <div className='flex flex-wrap gap-0 flex-1 min-[1440px]:w-[267px] h-auto min-[1440px]:h-[48px]'>
              {candidate.industry.map((ind, index) => (
                <React.Fragment key={index}>
                  <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                    {ind}
                  </span>
                  {index < candidate.industry.length - 1 && (
                    <span className='text-[#323232] text-[14px] font-medium leading-[160%] tracking-[1.4px] text-center'>
                      、
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className='flex gap-6 w-full min-[1440px]:w-[356px] h-auto min-[1440px]:h-[52px]'>
          <span
            className='text-[#999999] text-[14px] font-bold leading-[160%] tracking-[1.4px] w-[76px] h-[22px] whitespace-nowrap flex-shrink-0'
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            選考中企業
          </span>
          <div className='flex flex-col gap-2 flex-1 min-[1440px]:w-[256px] h-auto min-[1440px]:h-[52px] justify-center'>
            <span className='text-[#323232] text-[14px] font-bold leading-[160%] tracking-[1.4px] underline w-full min-[1440px]:w-[256px] h-[22px] truncate'>
              {candidate.targetCompany}
            </span>
            {candidate.targetCompany && (
              <span className='text-[#323232] text-[14px] font-bold leading-[160%] tracking-[1.4px] underline w-full min-[1440px]:w-[256px] h-[22px] truncate'>
                {candidate.targetCompany}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section - Progress and Status */}
      <div className='w-full min-[1440px]:w-[860px] flex flex-col gap-4'>
        {/* Group and Job */}
        <div className='flex flex-col sm:flex-row gap-[18px] items-stretch sm:items-center w-full min-[1440px]:w-[860px] h-auto sm:h-[38px]'>
          <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-full sm:w-[240px] h-[38px] flex items-center justify-center flex-shrink-0'>
            <span
              className='text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] text-center w-full sm:w-[200px] h-[22px] truncate'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              {candidate.group}
            </span>
          </div>
          <div
            className='flex-1 flex gap-4 items-center w-full sm:w-[602px] h-[38px]'
            onClick={e => e.stopPropagation()}
          >
            <div className='bg-white border border-[#999999] rounded-[5px] px-[11px] py-1 w-full text-[#323232] text-[16px] tracking-[1.6px] h-[38px] flex items-center'>
              {candidate.targetJob || '未選択'}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2'>
          {/* 応募 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              応募
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[10px] font-bold tracking-[1px]'>
              {candidate.applicationDate || 'yyyy/mm/dd'}
            </div>
          </div>

          {/* 書類選考 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              書類選考
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            {candidate.firstScreening ? (
              <button
                className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                style={{
                  background:
                    'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}
              >
                合否登録
              </button>
            ) : (
              <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                -
              </div>
            )}
          </div>

          {/* 一次面接 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              一次面接
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>

          {/* 二次以降 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              二次以降
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>

          {/* 最終面接 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              最終面接
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>

          {/* 内定 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              内定
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            {candidate.offer ? (
              <button
                className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                style={{
                  background:
                    'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                  fontFamily: 'Noto Sans JP, sans-serif',
                }}
              >
                合否登録
              </button>
            ) : (
              <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                -
              </div>
            )}
          </div>

          {/* 入社 */}
          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
              入社
            </div>
            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
              -
            </div>
          </div>
        </div>

        {/* Assigned Users */}
        <div className='h-[66px] flex items-center'>
          <p className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
            やりとりしている担当者：{candidate.assignedUsers.join('、')}
          </p>
        </div>
      </div>
    </div>
  );
}