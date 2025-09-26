'use client';

import React from 'react';

export interface CandidateData {
  id: number;
  candidateId?: string; // 実テーブルの候補者UUID（スライドメニュー用）
  isPickup: boolean;
  isHidden: boolean;
  isAttention: boolean;
  badgeType?: 'change' | 'professional' | 'multiple';
  badgeText?: string;
  lastLogin: string;
  companyName: string;
  department: string;
  position: string;
  location: string;
  age: string;
  gender: string;
  salary: string;
  university: string;
  degree: string;
  experienceJobs: string[];
  experienceIndustries: string[];
  careerHistory: Array<{
    period: string;
    company: string;
    role: string;
  }>;
  selectionCompanies: Array<{
    company: string;
    detail: string;
  }>;
  updatedAt?: string; // 追加
  createdAt?: string; // 追加
}

interface CandidateCardProps {
  candidate: CandidateData;
  onTogglePickup?: (id: number) => void;
  onToggleHidden?: (id: number) => void;
  showActions?: boolean;
  onCandidateClick?: (candidate: CandidateData) => void;
}

export function CandidateCard({
  candidate,
  onTogglePickup,
  onToggleHidden,
  showActions = true,
  onCandidateClick,
}: CandidateCardProps) {
  return (
    <div
      className={`rounded-[10px] p-6 ${
        candidate.isHidden
          ? 'bg-[#efefef]'
          : 'bg-white shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className='flex gap-6'>
        {/* Actions */}
        {showActions && (
          <div className='flex flex-col gap-6 w-8'>
            <button
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onTogglePickup?.(candidate.id);
              }}
              className='w-8 h-8 flex items-center justify-center'
            >
              {candidate.isPickup ? (
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                    fill='#FFDA5F'
                  />
                </svg>
              ) : (
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129898 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                    fill='#DCDCDC'
                  />
                </svg>
              )}
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                onToggleHidden?.(candidate.id);
              }}
              className='w-8 h-8 flex items-center justify-center'
            >
              {candidate.isHidden ? (
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M1.94025 3.43918C1.42026 3.02869 0.665269 3.1238 0.255277 3.64442C-0.154716 4.16504 -0.0597179 4.92094 0.460273 5.33143L30.0598 28.5591C30.5797 28.9696 31.3347 28.8745 31.7447 28.3538C32.1547 27.8332 32.0597 27.0773 31.5397 26.6668L26.2798 22.5419C28.2598 20.5095 29.5998 18.2318 30.2747 16.6149C30.4397 16.2194 30.4397 15.7789 30.2747 15.3834C29.5298 13.5963 27.9648 10.9932 25.6248 8.82058C23.2749 6.62797 20.0399 4.78578 16 4.78578C12.5901 4.78578 9.75011 6.10235 7.53515 7.8294L1.94025 3.43918ZM11.1551 10.6678C12.4301 9.50139 14.135 8.79055 16 8.79055C19.9749 8.79055 23.1999 12.0194 23.1999 15.9991C23.1999 17.2456 22.8849 18.417 22.3299 19.4382L20.3999 17.9264C20.8199 16.9603 20.9299 15.854 20.6399 14.7576C20.0849 12.6802 18.25 11.2835 16.21 11.1984C15.92 11.1884 15.75 11.5038 15.84 11.7841C15.945 12.1045 16.005 12.4449 16.005 12.8003C16.005 13.3109 15.885 13.7915 15.675 14.217L11.1601 10.6728L11.1551 10.6678ZM18.65 22.7021C17.83 23.0275 16.935 23.2077 16 23.2077C12.0251 23.2077 8.80013 19.9789 8.80013 15.9991C8.80013 15.6537 8.82512 15.3183 8.87012 14.9879L4.15521 11.2685C3.01523 12.7553 2.20024 14.237 1.72525 15.3834C1.56025 15.7789 1.56025 16.2194 1.72525 16.6149C2.47024 18.402 4.03521 21.0051 6.37517 23.1777C8.72513 25.3703 11.9601 27.2125 16 27.2125C18.39 27.2125 20.4949 26.5667 22.3099 25.5855L18.65 22.7021Z'
                    fill='#999999'
                  />
                </svg>
              ) : (
                <svg
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M1.94025 3.43918C1.42026 3.02869 0.665269 3.1238 0.255277 3.64442C-0.154716 4.16504 -0.0597179 4.92094 0.460273 5.33143L30.0598 28.5591C30.5797 28.9696 31.3347 28.8745 31.7447 28.3538C32.1547 27.8332 32.0597 27.0773 31.5397 26.6668L26.2798 22.5419C28.2598 20.5095 29.5998 18.2318 30.2747 16.6149C30.4397 16.2194 30.4397 15.7789 30.2747 15.3834C29.5298 13.5963 27.9648 10.9932 25.6248 8.82058C23.2749 6.62797 20.0399 4.78578 16 4.78578C12.5901 4.78578 9.75011 6.10235 7.53515 7.8294L1.94025 3.43918ZM11.1551 10.6678C12.4301 9.50139 14.135 8.79055 16 8.79055C19.9749 8.79055 23.1999 12.0194 23.1999 15.9991C23.1999 17.2456 22.8849 18.417 22.3299 19.4382L20.3999 17.9264C20.8199 16.9603 20.9299 15.854 20.6399 14.7576C20.0849 12.6802 18.25 11.2835 16.21 11.1984C15.92 11.1884 15.75 11.5038 15.84 11.7841C15.945 12.1045 16.005 12.4449 16.005 12.8003C16.005 13.3109 15.885 13.7915 15.675 14.217L11.1601 10.6728L11.1551 10.6678ZM18.65 22.7021C17.83 23.0275 16.935 23.2077 16 23.2077C12.0251 23.2077 8.80013 19.9789 8.80013 15.9991C8.80013 15.6537 8.82512 15.3183 8.87012 14.9879L4.15521 11.2685C3.01523 12.7553 2.20024 14.237 1.72525 15.3834C1.56025 15.7789 1.56025 16.2194 1.72525 16.6149C2.47024 18.402 4.03521 21.0051 6.37517 23.1777C8.72513 25.3703 11.9601 27.2125 16 27.2125C18.39 27.2125 20.4949 26.5667 22.3099 25.5855L18.65 22.7021Z'
                    fill='#DCDCDC'
                  />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Candidate Info */}
        <div
          className='flex-1'
          onClick={() => onCandidateClick?.(candidate)}
          style={{ cursor: onCandidateClick ? 'pointer' : 'default' }}
        >
          {/* Badges */}
          <div className='flex items-center gap-2 mb-2'>
            {candidate.isAttention && (
              <div className='bg-[#ff9d00] px-5 py-0 h-8 rounded-[100px] flex items-center justify-center'>
                <span
                  className='text-white text-[12px] font-bold tracking-[1.2px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  注目
                </span>
              </div>
            )}
            {candidate.badgeType === 'change' && (
              <div className='bg-[#44b0ef] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M2.97062 6.24841C3.22734 5.53293 3.64409 4.86011 4.23088 4.28575C6.31465 2.23448 9.69202 2.23448 11.7758 4.28575L12.3459 4.85026H11.2023C10.6122 4.85026 10.1354 5.3196 10.1354 5.90052C10.1354 6.48144 10.6122 6.95077 11.2023 6.95077H14.9198H14.9331C15.5232 6.95077 16 6.48144 16 5.90052V2.22464C16 1.64372 15.5232 1.17438 14.9331 1.17438C14.343 1.17438 13.8662 1.64372 13.8662 2.22464V3.37991L13.2828 2.80227C10.3655 -0.0695081 5.63784 -0.0695081 2.72057 2.80227C1.90706 3.60309 1.32028 4.54503 0.9602 5.55262C0.763492 6.10072 1.05689 6.69805 1.61034 6.89169C2.16378 7.08533 2.77391 6.79651 2.97062 6.25169V6.24841ZM0.766826 9.09394C0.600125 9.14317 0.440092 9.23178 0.310065 9.36307C0.176703 9.49435 0.0866848 9.65188 0.0400084 9.82255C0.0300063 9.86193 0.0200042 9.9046 0.0133361 9.94727C0.00333401 10.0031 0 10.0589 0 10.1147V13.7774C0 14.3583 0.476766 14.8277 1.06689 14.8277C1.65701 14.8277 2.13378 14.3583 2.13378 13.7774V12.6254L2.72057 13.1998C5.63784 16.0683 10.3655 16.0683 13.2794 13.1998C14.0929 12.3989 14.6831 11.457 15.0431 10.4494C15.2398 9.90132 14.9464 9.30399 14.393 9.11035C13.8396 8.91671 13.2294 9.20553 13.0327 9.75034C12.776 10.4658 12.3592 11.1386 11.7725 11.713C9.68869 13.7643 6.31132 13.7643 4.22755 11.713L4.22421 11.7097L3.65409 11.1518H4.801C5.39112 11.1518 5.86789 10.6824 5.86789 10.1015C5.86789 9.5206 5.39112 9.05127 4.801 9.05127H1.08023C1.02688 9.05127 0.973536 9.05455 0.920192 9.06112C0.866847 9.06768 0.816837 9.07753 0.766826 9.09394Z'
                    fill='white'
                  />
                </svg>

                <span
                  className='text-white text-[12px] font-bold tracking-[1.2px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {candidate.badgeText}
                </span>
              </div>
            )}
            {candidate.badgeType === 'professional' && (
              <div className='bg-[#b687e8] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z'
                    fill='white'
                  />
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 1.33333C4.31803 1.33333 1.33333 4.31803 1.33333 8C1.33333 11.682 4.31803 14.6667 8 14.6667C11.682 14.6667 14.6667 11.682 14.6667 8C14.6667 4.31803 11.682 1.33333 8 1.33333Z'
                    fill='white'
                  />
                  <path d='M7.33333 2V4H8.66667V2H7.33333Z' fill='white' />
                  <path d='M7.33333 12V14H8.66667V12H7.33333Z' fill='white' />
                  <path d='M2 7.33333H4V8.66667H2V7.33333Z' fill='white' />
                  <path d='M12 7.33333H14V8.66667H12V7.33333Z' fill='white' />
                </svg>
                <span
                  className='text-white text-[12px] font-bold tracking-[1.2px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {candidate.badgeText}
                </span>
              </div>
            )}
            {candidate.badgeType === 'multiple' && (
              <div className='bg-[#f182b4] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M0 0V6H2V2.94118L5.52941 6.47059L6.47059 5.52941L2.94118 2H6V0H0Z'
                    fill='white'
                  />
                  <path
                    d='M10 0V2H13.0588L9.52941 5.52941L10.4706 6.47059L14 2.94118V6H16V0H10Z'
                    fill='white'
                  />
                  <path
                    d='M2 13.0588V10H0V16H6V14H2.94118L6.47059 10.4706L5.52941 9.52941L2 13.0588Z'
                    fill='white'
                  />
                  <path
                    d='M13.0588 14H10V16H16V10H14V13.0588L10.4706 9.52941L9.52941 10.4706L13.0588 14Z'
                    fill='white'
                  />
                </svg>
                <span
                  className='text-white text-[12px] font-bold tracking-[1.2px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {candidate.badgeText}
                </span>
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className='flex gap-10'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 flex-wrap'>
                <h3
                  className='text-[#0f9058] text-[18px] font-bold tracking-[1.8px] truncate'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    maxWidth: '323px',
                  }}
                >
                  {candidate.companyName}
                </h3>
                <div className='border-l border-[#dcdcdc] h-7'></div>
                <span
                  className='text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    maxWidth: '200px',
                  }}
                >
                  {candidate.department}
                </span>
                <div className='border-l border-[#dcdcdc] h-7'></div>
                <span
                  className='text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate'
                  style={{
                    fontFamily: 'Noto Sans JP, sans-serif',
                    maxWidth: '300px',
                  }}
                >
                  {candidate.position}
                </span>
              </div>
              <div className='flex gap-10 mt-2'>
                <span
                  className='text-[#323232] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {candidate.location}／{candidate.age}／{candidate.gender}／
                  {candidate.salary}
                </span>
                <span
                  className='text-[#323232] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {candidate.degree}／{candidate.university}
                </span>
              </div>
            </div>
            <div
              className='text-[#999999] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              最終ログイン：{candidate.lastLogin}
            </div>
          </div>

          {/* Experience */}
          <div className='flex gap-5 xl:gap-10 my-6 flex-col xl:flex-row'>
            <div className='flex-1'>
              <div className='flex gap-6 items-center'>
                <span
                  className='text-[#999999] text-[12px] font-bold tracking-[1.2px] w-[65px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  経験職種
                </span>
                <div className='flex gap-2 flex-wrap'>
                  {candidate.experienceJobs.map((job, index) =>
                    typeof job === 'string' && job.includes('未設定') ? (
                      <span
                        key={index}
                        className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                        }}
                      >
                        {typeof job === 'string'
                          ? job
                          : typeof job === 'object' && job.name
                            ? job.name
                            : String(job)}
                      </span>
                    ) : (
                      <div
                        key={index}
                        className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                      >
                        <span
                          className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'
                          style={{
                            fontFamily: 'Noto Sans JP, sans-serif',
                          }}
                        >
                          {typeof job === 'string'
                            ? job
                            : typeof job === 'object' && job.name
                              ? job.name
                              : String(job)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
            <div className='flex-1'>
              <div className='flex gap-6 items-center'>
                <span
                  className='text-[#999999] text-[12px] font-bold tracking-[1.2px] w-[65px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  経験業種
                </span>
                <div className='flex gap-2 flex-wrap'>
                  {candidate.experienceIndustries.map((industry, index) =>
                    typeof industry === 'string' &&
                    industry.includes('未設定') ? (
                      <span
                        key={index}
                        className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                        }}
                      >
                        {typeof industry === 'string'
                          ? industry
                          : typeof industry === 'object' && industry.name
                            ? industry.name
                            : String(industry)}
                      </span>
                    ) : (
                      <div
                        key={index}
                        className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                      >
                        <span
                          className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'
                          style={{
                            fontFamily: 'Noto Sans JP, sans-serif',
                          }}
                        >
                          {typeof industry === 'string'
                            ? industry
                            : typeof industry === 'object' && industry.name
                              ? industry.name
                              : String(industry)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className='border-t border-[#dcdcdc] mb-6'></div>

          {/* Selection Companies */}
          <div className='flex gap-5 xl:gap-10 flex-col xl:flex-row'>
            <div className='flex-1'>
              <div className='flex gap-4'>
                <span
                  className='text-[#999999] text-[12px] font-bold tracking-[1.2px]'
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  選考中企業
                </span>
                <div className='flex flex-col gap-2'>
                  {candidate.selectionCompanies.map((selection, index) =>
                    typeof selection.company === 'string' &&
                    selection.company.includes('未設定') ? (
                      <span
                        key={index}
                        className='text-[#999999] text-[12px] font-medium tracking-[1.2px]'
                        style={{
                          fontFamily: 'Noto Sans JP, sans-serif',
                        }}
                      >
                        {selection.company}
                      </span>
                    ) : (
                      <div key={index} className='flex gap-4 items-start'>
                        <span
                          className='text-[#0f9058] text-[12px] font-bold tracking-[1.2px] underline w-40 truncate cursor-pointer hover:opacity-70'
                          style={{
                            fontFamily: 'Noto Sans JP, sans-serif',
                          }}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(
                              `https://www.google.com/search?q=${encodeURIComponent(selection.company)}`,
                              '_blank'
                            );
                          }}
                        >
                          {selection.company}
                        </span>
                        <span
                          className='text-[#323232] text-[12px] font-medium tracking-[1.2px] flex-1 truncate xl:max-w-[220px] 2xl:max-w-[300px]'
                          style={{
                            fontFamily: 'Noto Sans JP, sans-serif',
                          }}
                        >
                          {selection.detail}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
