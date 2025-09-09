'use client';

import React from 'react';
import type { CandidateData } from '@/components/company/CandidateCard';

interface CandidateDetailModalProps {
  candidate: CandidateData;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 1000,
          background: '#fff',
          zIndex: 2001,
          padding: '24px 40px',
          borderRadius: '16px 0 0 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 左上に×ボタン（positionをやめて要素として配置、下に12px余白） */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: 12,
          }}
        >
          <button
            onClick={onClose}
            style={{
              fontSize: 32,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 2002,
              padding: 0,
              lineHeight: 1,
            }}
            aria-label='閉じる'
          >
            ×
          </button>
        </div>
        {/* --- ここからCandidateCardの内容 --- */}
        <div
          className={`rounded-[10px]  ${
            candidate.isHidden ? 'bg-[#efefef]' : 'bg-white'
          }`}
        >
          <div className='flex gap-6'>
            {/* Candidate Info */}
            <div className='flex-1'>
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
                    {/* ...SVG省略... */}
                    <span
                      className='text-white text-[12px] font-bold tracking-[1.2px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {candidate.badgeText}
                    </span>
                  </div>
                )}
                {/* ...他のバッジも同様に移植... */}
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
                      {candidate.location}／{candidate.age}／{candidate.gender}
                      ／{candidate.salary}
                    </span>
                  </div>
                </div>
                {/* 3つの情報を縦並び・右寄せに */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 0,
                  }}
                >
                  <div
                    className='text-[#999999] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終ログイン：{candidate.lastLogin}
                  </div>
                  <div
                    className='text-[#999999] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終更新：{candidate.updatedAt || '-'}
                  </div>
                  <div
                    className='text-[#999999] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    登録：{candidate.createdAt || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- ここまで --- */}
      </div>
    </div>
  );
};

export default CandidateDetailModal;
