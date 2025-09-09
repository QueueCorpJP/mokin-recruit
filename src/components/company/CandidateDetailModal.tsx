'use client';

import React, { useState } from 'react';
import type { CandidateData as RecruitmentCandidateData } from '@/lib/server/candidate/recruitment-queries';
import { Button } from '@/components/ui/button';
import CandidateDetailTabDetail from './CandidateDetailTabDetail';
import CandidateDetailTabProgress from './CandidateDetailTabProgress';

interface CandidateDetailModalProps {
  candidate: RecruitmentCandidateData;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
}) => {
  // データベース構造に基づいて値を取得、未設定の場合はデフォルト値を使用
  const getDisplayValue = (value: string | null | undefined, defaultValue: string = '未設定') => {
    return value && value.trim() !== '' ? value : defaultValue;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '未設定';
    try {
      return new Date(dateString).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');
    } catch {
      return '未設定';
    }
  };

  const formatAge = (birthDate: string | null | undefined) => {
    if (!birthDate) return '未設定';
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return `${age}歳`;
    } catch {
      return '未設定';
    }
  };

  const formatGender = (gender: string | null | undefined) => {
    switch (gender) {
      case 'male': return '男性';
      case 'female': return '女性';
      case 'unspecified': return '未指定';
      default: return '未設定';
    }
  };

  const formatArray = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) return ['未設定'];
    return arr.filter(item => item && item.trim() !== '');
  };
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
                {candidate.hasCareerChange === 'あり' && (
                  <div className='bg-[#44b0ef] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M2.97062 6.24841C3.22734 5.53293 3.64409 4.86011 4.23088 4.28575C6.31465 2.23448 9.69202 2.23448 11.7758 4.28575L12.3459 4.85026H11.2023C10.6122 4.85026 10.1354 5.3196 10.1354 5.90052C10.1354 6.48144 10.6122 6.95077 11.2023 6.95077H14.9198H14.9331C15.5232 6.95077 16 6.48144 16 5.90052V2.22464C16 1.64372 15.5232 1.17438 14.9331 1.17438C14.343 1.17438 13.8662 1.64372 13.8662 2.22464V3.37991L13.2828 2.80227C10.3655 -0.0695081 5.63784 -0.0695081 2.72057 2.80227C1.90706 3.60309 1.32028 4.54503 0.9602 5.55262C0.763492 6.10072 1.05689 6.69805 1.61034 6.89169C2.16378 7.08533 2.77391 6.79651 2.97062 6.25169V6.24841Z'
                        fill='white'
                      />
                    </svg>
                    <span
                      className='text-white text-[12px] font-bold tracking-[1.2px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      転職検討中
                    </span>
                  </div>
                )}
                {candidate.managementExperienceCount && candidate.managementExperienceCount > 0 && (
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
                      マネジメント経験あり
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
                      {getDisplayValue(candidate.currentCompany)}
                    </h3>
                    <div className='border-l border-[#dcdcdc] h-7'></div>
                    <span
                      className='text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate'
                      style={{
                        fontFamily: 'Noto Sans JP, sans-serif',
                        maxWidth: '200px',
                      }}
                    >
                      {getDisplayValue(candidate.recentJobDepartmentPosition)}
                    </span>
                    <div className='border-l border-[#dcdcdc] h-7'></div>
                    <span
                      className='text-[#323232] text-[14px] font-medium tracking-[1.4px] truncate'
                      style={{
                        fontFamily: 'Noto Sans JP, sans-serif',
                        maxWidth: '300px',
                      }}
                    >
                      {getDisplayValue(candidate.currentPosition)}
                    </span>
                  </div>
                  <div className='flex gap-10 mt-2'>
                    <span
                      className='text-[#323232] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {getDisplayValue(candidate.prefecture)}／{formatAge(candidate.birthDate)}／{formatGender(candidate.gender)}
                      ／{getDisplayValue(candidate.currentIncome)}
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
                    最終ログイン：{formatDate(candidate.lastLoginAt)}
                  </div>
                  <div
                    className='text-[#999999] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終更新：{formatDate(candidate.updatedAt)}
                  </div>
                  <div
                    className='text-[#999999] text-[12px] font-medium tracking-[1.2px] whitespace-nowrap'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    登録：{formatDate(candidate.createdAt)}
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