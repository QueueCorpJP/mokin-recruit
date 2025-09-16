'use client';

import React from 'react';
import type { CandidateDetailData as CandidateData } from '@/lib/server/candidate/recruitment-queries';

interface CandidateDetailTabProgressProps {
  candidate: CandidateData;
}

const CandidateDetailTabProgress: React.FC<CandidateDetailTabProgressProps> = ({
  candidate,
}) => {
  const getDisplayValue = (
    value: string | null | undefined,
    defaultValue: string = '未設定'
  ) => {
    return value && value.trim() !== '' ? value : defaultValue;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '未設定';
    try {
      return new Date(dateString)
        .toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
    } catch {
      return '未設定';
    }
  };

  return (
    <div
      className='bg-white border border-[#D2F1DA] p-6'
      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
    >
      {/* 進捗情報 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          進捗情報
        </h3>
        <div className='grid grid-cols-1 gap-4'>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              応募状況
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              応募済み
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              進捗ステータス
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              書類選考中
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              最終更新日時
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {formatDate(candidate.updatedAt)}
            </div>
          </div>
        </div>
      </div>

      {/* メモ・コメント */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          メモ・コメント
        </h3>
        <div className='bg-[#F9F9F9] p-4 rounded-[5px] min-h-[120px]'>
          <textarea
            className='w-full h-full bg-transparent border-none outline-none text-[#323232] text-[14px] font-medium tracking-[1.4px] resize-none'
            placeholder='候補者に関するメモやコメントを入力してください...'
            rows={6}
          />
        </div>
      </div>

      {/* 履歴 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          履歴
        </h3>
        <div className='space-y-4'>
          <div className='border-b border-[#DCDCDC] pb-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-[#999999] text-[12px] font-medium tracking-[1.2px]'>
                {formatDate(candidate.createdAt)}
              </span>
              <span className='text-[#0F9058] text-[12px] font-bold tracking-[1.2px]'>
                システム
              </span>
            </div>
            <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
              候補者が登録されました
            </div>
          </div>

          {candidate.lastLoginAt && (
            <div className='border-b border-[#DCDCDC] pb-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-[#999999] text-[12px] font-medium tracking-[1.2px]'>
                  {formatDate(candidate.lastLoginAt)}
                </span>
                <span className='text-[#0F9058] text-[12px] font-bold tracking-[1.2px]'>
                  システム
                </span>
              </div>
              <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                最終ログイン
              </div>
            </div>
          )}

          {candidate.careerStatusUpdatedAt && (
            <div className='border-b border-[#DCDCDC] pb-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-[#999999] text-[12px] font-medium tracking-[1.2px]'>
                  {formatDate(candidate.careerStatusUpdatedAt)}
                </span>
                <span className='text-[#0F9058] text-[12px] font-bold tracking-[1.2px]'>
                  候補者
                </span>
              </div>
              <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                転職活動状況を更新しました
              </div>
            </div>
          )}

          {candidate.recentJobUpdatedAt && (
            <div className='border-b border-[#DCDCDC] pb-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-[#999999] text-[12px] font-medium tracking-[1.2px]'>
                  {formatDate(candidate.recentJobUpdatedAt)}
                </span>
                <span className='text-[#0F9058] text-[12px] font-bold tracking-[1.2px]'>
                  候補者
                </span>
              </div>
              <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                直近の職歴情報を更新しました
              </div>
            </div>
          )}

          {candidate.resumeUploadedAt && (
            <div className='border-b border-[#DCDCDC] pb-4'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-[#999999] text-[12px] font-medium tracking-[1.2px]'>
                  {formatDate(candidate.resumeUploadedAt)}
                </span>
                <span className='text-[#0F9058] text-[12px] font-bold tracking-[1.2px]'>
                  候補者
                </span>
              </div>
              <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px]'>
                履歴書をアップロードしました
                {candidate.resumeFilename && (
                  <span className='text-[#999999] text-[12px] ml-2'>
                    ({candidate.resumeFilename})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* アクション */}
      <div className='flex gap-4'>
        <button className='bg-gradient-to-r from-[#26AF94] to-[#3A93CB] text-white px-6 py-2 rounded-[5px] text-[14px] font-bold tracking-[1.4px] hover:opacity-90 transition-opacity'>
          メモを保存
        </button>
        <button className='border border-[#999999] text-[#999999] px-6 py-2 rounded-[5px] text-[14px] font-bold tracking-[1.4px] hover:bg-[#F9F9F9] transition-colors'>
          履歴をエクスポート
        </button>
      </div>
    </div>
  );
};

export default CandidateDetailTabProgress;
