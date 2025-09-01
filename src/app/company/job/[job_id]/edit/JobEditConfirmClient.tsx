'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/mo-dal';
import { updateJob } from '../../actions';
import AttentionBanner from '@/components/ui/AttentionBanner';

interface JobData {
  id: string;
  title: string;
  jobDescription: string;
  positionSummary: string;
  requiredSkills: string;
  preferredSkills: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryNote: string;
  employmentType: string;
  workLocation: string[];
  locationNote: string;
  employmentTypeNote: string;
  workingHours: string;
  overtimeInfo: string;
  holidays: string;
  remoteWorkAvailable: boolean;
  jobType: string[];
  industry: string[];
  selectionProcess: string;
  appealPoints: string[];
  smokingPolicy: string;
  smokingPolicyNote: string;
  requiredDocuments: string[];
  internalMemo: string;
  publicationType: string;
  imageUrls: string[];
  groupName: string;
  groupId: string;
  status: string;
  applicationDeadline: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

interface JobEditData {
  title: string;
  jobDescription: string;
  positionSummary: string;
  requiredSkills: string;
  preferredSkills: string;
  salaryMin: string;
  salaryMax: string;
  salaryNote: string;
  employmentType: string;
  work_locations: string[];
  location_note: string;
  employment_type_note: string;
  working_hours: string;
  overtime_info: string;
  holidays: string;
  remote_work_available: boolean;
  job_types: string[];
  industries: string[];
  selection_process: string;
  appeal_points: string[];
  smoking_policy: string;
  smoking_policy_note: string;
  required_documents: string[];
  internal_memo: string;
  publication_type: string;
  images: (File | string)[];
  groupId: string;
  applicationDeadline: string;
}

interface JobEditConfirmClientProps {
  jobData: JobData;
  jobId: string;
  editData: JobEditData;
  onBackToEdit: () => void;
}

export default function JobEditConfirmClient({ 
  jobData, 
  jobId, 
  editData,
  onBackToEdit
}: JobEditConfirmClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleBackToEdit = () => {
    onBackToEdit();
  };

  const handleConfirmUpdate = async () => {
    setIsLoading(true);
    try {
      // Navigate to scope page instead of saving directly
      router.push(`/company/job/${jobId}/scope`);
    } catch (error) {
      console.error('Error navigating to scope:', error);
      setModalMessage('ページの遷移に失敗しました');
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ステータス表示の設定
  const getStatusDisplay = () => {
    switch (jobData.status) {
      case 'DRAFT':
        return { text: '下書き', color: '#999999' };
      case 'PENDING_APPROVAL':
        return { text: '掲載待ち(承認待ち)', color: '#FF5B5B' };
      case 'PUBLISHED':
        return { text: '掲載済', color: '#0F9058' };
      case 'CLOSED':
        return { text: '停止', color: '#F56C6C' };
      default:
        return { text: '不明', color: '#999999' };
    }
  };

  // 公開範囲の表示
  const getPublicationTypeLabel = () => {
    switch (editData.publicationType) {
      case 'public':
        return '一般公開';
      case 'members':
        return '登録会員限定';
      case 'scout':
        return 'スカウト限定';
      default:
        return '一般公開';
    }
  };

  // 雇用形態の日本語表示
  const getEmploymentTypeLabel = () => {
    switch (editData.employmentType) {
      case 'FULL_TIME':
      case '正社員':
        return '正社員';
      case 'PART_TIME':
      case 'パート・アルバイト':
        return 'パート・アルバイト';
      case 'CONTRACT':
      case '契約社員':
        return '契約社員';
      case 'INTERN':
      case 'インターン':
        return 'インターン';
      default:
        return editData.employmentType;
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <>
      {/* ヘッダー部分 */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className="w-full max-w-[1280px] mx-auto ">
          {/* タイトルとステータス */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-white text-[16px] font-medium tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    求人編集
                  </span>
                  <svg 
                    width="6" 
                    height="8" 
                    viewBox="0 0 6 8" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="mx-1"
                  >
                    <path 
                      d="M5.11804 3.59656C5.34118 3.8197 5.34118 4.18208 5.11804 4.40522L1.69061 7.83264C1.46747 8.05579 1.10509 8.05579 0.881954 7.83264C0.658815 7.60951 0.658815 7.24713 0.881954 7.02399L3.90594 4L0.883739 0.976012C0.6606 0.752873 0.6606 0.390494 0.883739 0.167355C1.10688 -0.0557849 1.46926 -0.0557849 1.6924 0.167355L5.11982 3.59478L5.11804 3.59656Z" 
                      fill="white"
                    />
                  </svg>
                  <span
                    className="text-white text-[16px] font-medium tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    確認画面
                  </span>
                </div>
                <h1
                  className="text-white text-[24px] font-bold tracking-[2.4px]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  {editData.title}
                </h1>
              </div>
            </div>
          </div>

          {/* ステータスバッジとボタン */}
          <div className="flex items-center justify-start gap-6">
            <div className="flex items-center gap-1">
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="4" cy="4" r="4" fill={statusDisplay.color} />
              </svg>
              <span className="text-[#fff] text-[16px] font-bold">
                {statusDisplay.text}
              </span>
            </div>
            <span className="text-[#0F9058] text-[16px] font-bold bg-white w-[107px] flex items-center justify-center rounded-[5px]">
              {getPublicationTypeLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-[#f9f9f9] px-20 pt-10 pb-20">
        <div className='w-full max-w-[1280px] mx-auto mb-10'>
          <AttentionBanner 
           title='求人内容の編集についてのご注意'
           content='この求人は現在公開中です。すでに応募・スカウト済みの候補者がいる場合、内容変更により誤解やトラブルが発生する可能性があります。
変更内容は慎重にご確認の上、必要に応じて応募者へのご連絡をお願いいたします。'
          />
        </div>
        <div className="w-full max-w-[1280px] mx-auto mb-10">
          {/* 詳細情報セクション */}
          <div className="bg-white rounded-[10px] p-10">
            <div className="flex flex-col gap-2">
              {/* グループ */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    グループ
                  </div>
                </div>
                <div className="flex items-center py-6">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {jobData.groupName}
                  </div>
                </div>
              </div>

              {/* 求人名/求人タイトル */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    求人タイトル
                  </div>
                </div>
                <div className="flex items-center py-6">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {editData.title}
                  </div>
                </div>
              </div>

              {/* イメージ画像 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    イメージ画像
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex gap-4">
                    {editData.images && editData.images.length > 0 ? (
                      editData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border rounded overflow-hidden bg-gray-100"
                          style={{ width: '200px', height: '133px' }}
                        >
                          {typeof image === 'string' ? (
                            <Image
                              src={image}
                              alt={`イメージ画像${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              新しい画像
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-[#999999] py-4">
                        画像が設定されていません
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 職種 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    職種
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  {editData.job_types && editData.job_types.length > 0 ? (
                    editData.job_types.map((jobType, index) => (
                      <div key={index} className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                        <span
                          className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          {jobType}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                      <span
                        className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        職種未設定
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 業種 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    業種
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  {editData.industries && editData.industries.length > 0 ? (
                    editData.industries.map((industry, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] rounded-[5px] px-3 py-1"
                      >
                        <span
                          className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          {industry}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                      <span
                        className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        業種未設定
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* ポジション概要 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    ポジション概要
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-6">
                    {/* 業務内容サブセクション */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2.5 items-center">
                        <div
                          className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          業務内容
                        </div>
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.jobDescription || '業務内容が設定されていません'}
                      </div>
                    </div>

                    {/* 当ポジションの魅力サブセクション */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2.5 items-center">
                        <div
                          className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          当ポジションの魅力
                        </div>
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.positionSummary || 'ポジションの魅力が設定されていません'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 求める人材像 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    求める人材像
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-6">
                    {/* スキル・経験サブセクション */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2.5 items-center">
                        <div
                          className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          スキル・経験
                        </div>
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.requiredSkills || '必要スキルが設定されていません'}
                      </div>
                    </div>

                    {/* その他・求める人物像などサブセクション */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2.5 items-center">
                        <div
                          className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          その他・求める人物像など
                        </div>
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.preferredSkills || '人物像が設定されていません'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 条件・待遇 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    条件・待遇
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-6">
                    {/* 想定年収 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        想定年収
                      </div>
                      <div className="flex gap-6 items-center">
                        <div className="flex gap-2 items-center">
                          <span
                            className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {editData.salaryMin ? `${editData.salaryMin}万円` : '下限未設定'}
                          </span>
                          <span
                            className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            〜
                          </span>
                          <span
                            className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {editData.salaryMax ? `${editData.salaryMax}万円` : '上限未設定'}
                          </span>
                        </div>
                        <div className="flex gap-2 items-start">
                          <span
                            className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            応相談
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 年収補足 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        年収補足
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2] w-[400px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.salaryNote || '年収補足が設定されていません'}
                      </div>
                    </div>

                    {/* 区切り線 */}
                    <div className="h-0 w-full relative">
                      <div className="absolute top-[-0.5px] bottom-[-0.5px] left-0 right-0 border-t border-[#EFEFEF]"></div>
                    </div>

                    {/* 勤務地 */}
                    <div className="flex gap-4">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        勤務地
                      </div>
                      <div className="flex flex-col gap-2 w-[400px]">
                        <div className="flex flex-wrap gap-2">
                          {editData.work_locations && editData.work_locations.length > 0 ? (
                            editData.work_locations.map((location, index) => (
                              <div key={index} className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                                <span
                                  className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                                >
                                  {location}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-[#999999] py-1">
                              勤務地が設定されていません
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 勤務地補足 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        勤務地補足
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2] w-[400px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.locationNote || '勤務地補足が設定されていません'}
                      </div>
                    </div>

                    {/* 区切り線 */}
                    <div className="h-0 w-full relative">
                      <div className="absolute top-[-0.5px] bottom-[-0.5px] left-0 right-0 border-t border-[#EFEFEF]"></div>
                    </div>

                    {/* 雇用形態 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        雇用形態
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {getEmploymentTypeLabel()}
                      </div>
                    </div>

                    {/* 雇用形態補足 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        雇用形態補足
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.employmentTypeNote || '雇用形態補足が設定されていません'}
                      </div>
                    </div>

                    {/* 区切り線 */}
                    <div className="h-0 w-full relative">
                      <div className="absolute top-[-0.5px] bottom-[-0.5px] left-0 right-0 border-t border-[#EFEFEF]"></div>
                    </div>

                    {/* 就業時間 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        就業時間
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.workingHours || '就業時間が設定されていません'}
                      </div>
                    </div>

                    {/* 所定外労働の有無 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        所定外労働の有無
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.overtimeInfo || '未設定'}
                      </div>
                    </div>

                    {/* 備考（勤務時間関連） */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        備考
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        備考が設定されていません
                      </div>
                    </div>

                    {/* 休日・休暇 */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        休日・休暇
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.holidays || '休日・休暇が設定されていません'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 選考情報 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    選考情報
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.selectionProcess || '選考情報が設定されていません'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* アピールポイント */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-2 shrink-0 min-h-[50px] flex items-center flex-col justify-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    アピールポイント
                  </div>
                  <div
                    className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最大6つまで選択可能
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-6">
                    {/* 業務・ポジション */}
                    <div className="flex flex-col gap-2">
                      <div
                        className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        業務・ポジション
                      </div>
                      <div className="flex flex-wrap gap-1 items-start">
                        {editData.appeal_points && editData.appeal_points.length > 0 ? (
                          editData.appeal_points.map((point, index) => (
                            <span
                              key={index}
                              className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {point}{index < editData.appeal_points.length - 1 && '、'}
                            </span>
                          ))
                        ) : (
                          <span
                            className="text-[16px] font-medium text-[#999999] tracking-[1.6px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            アピールポイントが設定されていません
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 受動喫煙防止措置 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    受動喫煙防止措置
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {editData.smoking_policy || '未設定'}
                      </div>
                      {editData.smoking_policy_note && (
                        <div
                          className="text-[14px] font-medium text-[#999999] tracking-[1.4px] leading-[1.6]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          {editData.smoking_policy_note}
                        </div>
                      )}
                      <div
                        className="text-[14px] font-medium text-[#999999] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        就業場所が屋外である、就業場所によって対策内容が異なる、対策内容を断言できないなどの場合は、「その他」を選択し、面談・面接時に候補者にお伝えください。
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 応募時のレジュメ提出 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    応募時のレジュメ
                    <br />
                    提出
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap gap-1 items-start w-[400px]">
                        {editData.required_documents && editData.required_documents.length > 0 ? (
                          editData.required_documents.map((doc, index) => (
                            <span key={index}>
                              <span
                                className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                              >
                                {doc}
                              </span>
                              {index < editData.required_documents.length - 1 && (
                                <span
                                  className="text-[16px] font-medium text-[#323232] tracking-[1.6px]"
                                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                                >
                                  、
                                </span>
                              )}
                            </span>
                          ))
                        ) : (
                          <span
                            className="text-[16px] font-medium text-[#999999] tracking-[1.6px]"
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            提出書類が設定されていません
                          </span>
                        )}
                      </div>
                      <div
                        className="text-[14px] font-medium text-[#999999] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        応募後に別途提出を依頼することも可能です。
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 社内メモ */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[50px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    社内メモ
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col gap-2">
                      <div className="bg-white border border-[#999999] rounded-[5px] p-[11px] min-h-[78px] w-full">
                        <div
                          className="text-[16px] font-medium text-[#999999] tracking-[1.6px] leading-[2]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          {editData.internalMemo || '社内メモが設定されていません'}
                        </div>
                      </div>
                      <div
                        className="text-[14px] font-medium text-[#999999] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        社内メモは候補者に共有されません。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
            <div className="flex justify-center gap-4">
          <Button
            variant="green-outline"
            size="figma-outline"
            onClick={handleBackToEdit}
            disabled={isLoading}
            className="min-w-[160px]"
          >
            修正する
          </Button>
          <Button
            variant="green-gradient"
            size="figma-default"
            onClick={handleConfirmUpdate}
            disabled={isLoading}
            className="min-w-[160px]"
          >
            {isLoading ? '更新中...' : '変更を反映する'}
          </Button>
        </div>
      </div>

      {/* エラーモーダル */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="エラー"
      >
        <div className="p-4">
          <p className="text-gray-700">{modalMessage}</p>
          <div className="mt-4 text-right">
            <Button
              variant="primary"
              onClick={() => setShowModal(false)}
            >
              閉じる
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}