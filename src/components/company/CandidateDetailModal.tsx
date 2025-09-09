'use client';

import React, { useState } from 'react';
import type { CandidateData } from '@/components/company/CandidateCard';
import { Button } from '@/components/ui/button';
import CandidateDetailTabDetail from './CandidateDetailTabDetail';
import CandidateDetailTabProgress from './CandidateDetailTabProgress';

interface CandidateDetailModalProps {
  candidate: CandidateData;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
}) => {
  const [isPickupActive, setIsPickupActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'detail' | 'progress'>('detail');
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
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* 左端：スカウト送信 */}
          <Button
            variant='blue-gradient'
            size='figma-default'
            style={{
              padding: '14px 40px',
              fontSize: 16,
              lineHeight: 2,
              letterSpacing: '0.1em',
              fontWeight: 'bold',
              fontFamily: 'Noto Sans JP, sans-serif',
            }}
          >
            スカウト送信
          </Button>
          {/* 右端：ピックアップ＋非表示 */}
          <div style={{ display: 'flex', gap: 16 }}>
            {/* ピックアップボタン（省略：現状のまま） */}
            <Button
              variant={isPickupActive ? 'yellow-gradient' : undefined}
              size='figma-default'
              style={{
                padding: '14px 40px',
                fontSize: 16,
                lineHeight: 2,
                letterSpacing: '0.1em',
                fontWeight: 'bold',
                fontFamily: 'Noto Sans JP, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: isPickupActive ? undefined : '#DCDCDC',
                color: '#fff',
              }}
              onClick={() => setIsPickupActive(v => !v)}
              disabled={!isPickupActive && false}
            >
              <svg
                width='16'
                height='16'
                viewBox='0 0 32 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                  fill='#fff'
                />
              </svg>
              ピックアップ
            </Button>
            {/* 非表示ボタン（省略：現状のまま） */}
            <Button
              variant='outline'
              size='figma-default'
              style={{
                padding: '14px 40px',
                fontSize: 16,
                lineHeight: 2,
                letterSpacing: '0.1em',
                fontWeight: 'bold',
                fontFamily: 'Noto Sans JP, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#999999',
                borderColor: '#999999',
              }}
            >
              <svg
                width='16'
                height='14'
                viewBox='0 0 16 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M0.970123 0.721543C0.710128 0.516298 0.332635 0.563855 0.127638 0.824165C-0.0773581 1.08447 -0.0298589 1.46242 0.230136 1.66767L15.0299 13.2815C15.2899 13.4867 15.6674 13.4392 15.8724 13.1789C16.0774 12.9186 16.0299 12.5406 15.7699 12.3354L13.1399 10.2729C14.1299 9.2567 14.7999 8.11784 15.1374 7.30938C15.2199 7.11165 15.2199 6.89139 15.1374 6.69365C14.7649 5.80009 13.9824 4.49854 12.8124 3.41224C11.6374 2.31594 10.02 1.39484 8 1.39484C6.29503 1.39484 4.87505 2.05313 3.76757 2.91666L0.970123 0.721543ZM5.57754 4.33584C6.21503 3.75265 7.06752 3.39723 8 3.39723C9.98746 3.39723 11.5999 5.01165 11.5999 7.00152C11.5999 7.62476 11.4424 8.21045 11.1649 8.72106L10.2 7.96516C10.41 7.48209 10.465 6.92893 10.32 6.38078C10.0425 5.34204 9.12498 4.64371 8.105 4.60116C7.96 4.59615 7.875 4.75384 7.92 4.89401C7.9725 5.0542 8.0025 5.2244 8.0025 5.40211C8.0025 5.65742 7.9425 5.8977 7.8375 6.11046L5.58004 4.33835L5.57754 4.33584ZM9.32498 10.353C8.91498 10.5157 8.46749 10.6058 8 10.6058C6.01254 10.6058 4.40006 8.99138 4.40006 7.00152C4.40006 6.82881 4.41256 6.66111 4.43506 6.49591L2.0776 4.6362C1.50761 5.37959 1.10012 6.12047 0.862625 6.69365C0.780127 6.89139 0.780127 7.11165 0.862625 7.30938C1.23512 8.20295 2.01761 9.5045 3.18758 10.5908C4.36256 11.6871 5.98004 12.6082 8 12.6082C9.19498 12.6082 10.2475 12.2853 11.1549 11.7947L9.32498 10.353Z'
                  fill='#999999'
                />
              </svg>
              非表示
            </Button>
          </div>
        </div>
        {/* --- タブUIここから --- */}
        <div style={{ marginTop: 24, display: 'flex', gap: 0 }}>
          <div
            onClick={() => setActiveTab('detail')}
            style={{
              width: 460,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
              cursor: 'pointer',
              background: activeTab === 'detail' ? '#D2F1DA' : '#fff',
              color: activeTab === 'detail' ? '#0F9058' : '#999999',
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'Noto Sans JP, sans-serif',
              border: '1px solid #D2F1DA',
              borderRight: 'none',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            詳細情報
          </div>
          <div
            onClick={() => setActiveTab('progress')}
            style={{
              width: 460,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0,
              cursor: 'pointer',
              background: activeTab === 'progress' ? '#D2F1DA' : '#fff',
              color: activeTab === 'progress' ? '#0F9058' : '#999999',
              fontSize: 16,
              fontWeight: 'bold',
              fontFamily: 'Noto Sans JP, sans-serif',
              border: '1px solid #D2F1DA',
              borderLeft: 'none',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            進捗・メモ
          </div>
        </div>
        {/* --- タブUIここまで --- */}
        {/* --- タブ内容表示 --- */}
        <div style={{ width: 920, minHeight: 200, margin: '0 auto' }}>
          {activeTab === 'detail' ? (
            <CandidateDetailTabDetail candidate={candidate} />
          ) : (
            <CandidateDetailTabProgress candidate={candidate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailModal;
