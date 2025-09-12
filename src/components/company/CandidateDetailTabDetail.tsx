'use client';

import React from 'react';
import type { CandidateDetailData as CandidateData } from '@/lib/server/candidate/recruitment-queries';

interface CandidateDetailTabDetailProps {
  candidate: CandidateData;
}

const CandidateDetailTabDetail: React.FC<CandidateDetailTabDetailProps> = ({
  candidate,
}) => {
  const getDisplayValue = (
    value: string | null | undefined,
    defaultValue: string = '未設定'
  ) => {
    return value && value.trim() !== '' ? value : defaultValue;
  };

  const formatArray = (arr: string[] | null | undefined) => {
    if (!arr || arr.length === 0) return ['未設定'];
    return arr.filter(item => item && item.trim() !== '');
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '未設定';
    try {
      return new Date(dateString)
        .toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '/');
    } catch {
      return '未設定';
    }
  };

  const formatGender = (gender: string | null | undefined) => {
    switch (gender) {
      case 'male':
        return '男性';
      case 'female':
        return '女性';
      case 'unspecified':
        return '未指定';
      default:
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
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return `${age}歳`;
    } catch {
      return '未設定';
    }
  };

  return (
    <div
      className='bg-white border border-[#D2F1DA] p-6'
      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
    >
      {/* 基本情報 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          基本情報
        </h3>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              氏名
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.lastName)}{' '}
              {getDisplayValue(candidate.firstName)}
            </div>
            <div className='text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-1'>
              {getDisplayValue(candidate.lastNameKana)}{' '}
              {getDisplayValue(candidate.firstNameKana)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              年齢・性別
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {formatAge(candidate.birthDate)} /{' '}
              {formatGender(candidate.gender)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              居住地
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.prefecture)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              電話番号
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.phoneNumber)}
            </div>
          </div>
        </div>
      </div>

      {/* 現在の職業 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          現在の職業
        </h3>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              会社名
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.currentCompany)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              役職・ポジション
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.currentPosition)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              現在の年収
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.currentIncome)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              希望年収
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.desiredSalary)}
            </div>
          </div>
        </div>
      </div>

      {/* 最新の職歴 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          最新の職歴
        </h3>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              会社名
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.recentJobCompanyName)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              部署・役職
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.recentJobDepartmentPosition)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              在籍期間
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.recentJobStartYear)}/
              {getDisplayValue(candidate.recentJobStartMonth)} -{' '}
              {candidate.recentJobIsCurrentlyWorking
                ? '現在'
                : `${getDisplayValue(
                    candidate.recentJobEndYear
                  )}/${getDisplayValue(candidate.recentJobEndMonth)}`}
            </div>
          </div>
        </div>
        {candidate.recentJobDescription && (
          <div className='mt-4'>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              業務内容
            </span>
            <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px] mt-1 whitespace-pre-wrap'>
              {candidate.recentJobDescription}
            </div>
          </div>
        )}
      </div>

      {/* スキル・経験 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          スキル・経験
        </h3>
        <div className='mb-4'>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            経験年数
          </span>
          <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
            {candidate.experienceYears
              ? `${candidate.experienceYears}年`
              : '未設定'}
          </div>
        </div>
        <div className='mb-4'>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            スキル
          </span>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formatArray(candidate.skills).map((skill, index) =>
              skill === '未設定' ? (
                <span
                  key={index}
                  className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                >
                  {skill}
                </span>
              ) : (
                <div
                  key={index}
                  className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                >
                  <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                    {skill}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className='mb-4'>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            希望業界
          </span>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formatArray(candidate.desiredIndustries).map((industry, index) =>
              industry === '未設定' ? (
                <span
                  key={index}
                  className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                >
                  {industry}
                </span>
              ) : (
                <div
                  key={index}
                  className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                >
                  <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                    {industry}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className='mb-4'>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            希望職種
          </span>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formatArray(candidate.desiredJobTypes).map((jobType, index) =>
              jobType === '未設定' ? (
                <span
                  key={index}
                  className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                >
                  {jobType}
                </span>
              ) : (
                <div
                  key={index}
                  className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                >
                  <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                    {jobType}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div className='mb-4'>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            希望勤務地
          </span>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formatArray(candidate.desiredLocations).map((location, index) =>
              location === '未設定' ? (
                <span
                  key={index}
                  className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                >
                  {location}
                </span>
              ) : (
                <div
                  key={index}
                  className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                >
                  <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                    {location}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
        <div>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            興味のある働き方
          </span>
          <div className='flex flex-wrap gap-2 mt-2'>
            {formatArray(candidate.interestedWorkStyles).map(
              (workStyle, index) =>
                workStyle === '未設定' ? (
                  <span
                    key={index}
                    className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'
                  >
                    {workStyle}
                  </span>
                ) : (
                  <div
                    key={index}
                    className='bg-[#d2f1da] px-4 py-1 rounded-[5px]'
                  >
                    <span className='text-[#0f9058] text-[14px] font-medium tracking-[1.4px]'>
                      {workStyle}
                    </span>
                  </div>
                )
            )}
          </div>
        </div>
      </div>

      {/* 自己PR・職務経歴 */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          自己PR・職務経歴
        </h3>
        <div className='mb-4'>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            職務要約
          </span>
          <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px] mt-1 whitespace-pre-wrap'>
            {getDisplayValue(candidate.jobSummary)}
          </div>
        </div>
        <div>
          <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
            自己PR
          </span>
          <div className='text-[#323232] text-[14px] font-medium tracking-[1.4px] mt-1 whitespace-pre-wrap'>
            {getDisplayValue(candidate.selfPr)}
          </div>
        </div>
      </div>

      {/* 転職について */}
      <div className='mb-8'>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          転職について
        </h3>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              転職意欲
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.hasCareerChange)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              転職タイミング
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.jobChangeTiming)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              現在の転職活動状況
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {getDisplayValue(candidate.currentActivityStatus)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              マネジメント経験人数
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {candidate.managementExperienceCount
                ? `${candidate.managementExperienceCount}人`
                : '未設定'}
            </div>
          </div>
        </div>
      </div>

      {/* その他 */}
      <div>
        <h3 className='text-[#0F9058] text-[18px] font-bold tracking-[1.8px] mb-4'>
          その他
        </h3>
        <div className='grid grid-cols-2 gap-6'>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              スカウト受信設定
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {candidate.scoutReceptionEnabled ? '受信する' : '受信しない'}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              ステータス
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {candidate.status === 'ACTIVE'
                ? 'アクティブ'
                : candidate.status === 'INACTIVE'
                ? '非アクティブ'
                : '停止中'}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              最終ログイン
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {formatDate(candidate.lastLoginAt)}
            </div>
          </div>
          <div>
            <span className='text-[#999999] text-[14px] font-bold tracking-[1.4px]'>
              登録日
            </span>
            <div className='text-[#323232] text-[16px] font-medium tracking-[1.6px] mt-1'>
              {formatDate(candidate.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailTabDetail;
