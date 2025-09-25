'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/mo-dal';
import { LocationModal } from '@/app/company/job/LocationModal';
import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { FormFields } from '@/app/company/job/FormFields';
import { CompanyGroup } from '@/app/company/job/types';

interface JobDetail {
  id: string;
  title: string;
  company_group_id: string;
  company_account_id: string | null;
  company_accounts?: {
    id: string;
    company_name: string;
  };
  company_groups?: {
    group_name: string;
  };
  status: string;
  publication_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_note: string | null;
  work_location: string[] | null;
  location_note: string | null;
  job_type: string[] | null;
  industry: string[] | null;
  job_description: string;
  position_summary: string | null;
  required_skills: string | null;
  preferred_skills: string | null;
  employment_type: string;
  employment_type_note: string | null;
  working_hours: string | null;
  overtime: string | null;
  overtime_info: string | null;
  holidays: string | null;
  selection_process: string | null;
  company_attractions: string[] | null;
  smoking_policy: string | null;
  smoking_policy_note: string | null;
  required_documents: string[] | null;
  internal_memo: string | null;
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
}

interface AdminJobEditClientProps {
  jobDetail: JobDetail;
  companyGroups: CompanyGroup[];
  jobId: string;
}

export default function AdminJobEditClient({
  jobDetail,
  companyGroups,
  jobId,
}: AdminJobEditClientProps) {
  // フォーム状態の初期化
  const [group, setGroup] = useState(jobDetail.company_group_id);
  const [title, setTitle] = useState(jobDetail.title);
  const [images, setImages] = useState<File[]>([]);
  const [jobTypes, setJobTypes] = useState(jobDetail.job_type || []);
  const [industries, setIndustries] = useState(jobDetail.industry || []);
  const [jobDescription, setJobDescription] = useState(
    jobDetail.job_description
  );
  const [positionSummary, setPositionSummary] = useState(
    jobDetail.position_summary || ''
  );
  const [skills, setSkills] = useState(jobDetail.required_skills || '');
  const [otherRequirements, setOtherRequirements] = useState(
    jobDetail.preferred_skills || ''
  );
  const [salaryMin, setSalaryMin] = useState(
    jobDetail.salary_min?.toString() || ''
  );
  const [salaryMax, setSalaryMax] = useState(
    jobDetail.salary_max?.toString() || ''
  );
  const [salaryNote, setSalaryNote] = useState(jobDetail.salary_note || '');
  const [locations, setLocations] = useState(jobDetail.work_location || []);
  const [locationNote, setLocationNote] = useState(
    jobDetail.location_note || ''
  );
  const [selectionProcess, setSelectionProcess] = useState(
    jobDetail.selection_process || ''
  );
  const [employmentType, setEmploymentType] = useState(
    jobDetail.employment_type
  );
  const [employmentTypeNote, setEmploymentTypeNote] = useState(
    jobDetail.employment_type_note || ''
  );
  const [workingHours, setWorkingHours] = useState(
    jobDetail.working_hours || ''
  );
  const [overtime, setOvertime] = useState(jobDetail.overtime || 'なし');
  const [overtimeMemo, setOvertimeMemo] = useState(
    jobDetail.overtime_info || ''
  );
  const [holidays, setHolidays] = useState(jobDetail.holidays || '');
  const [appealPoints, setAppealPoints] = useState(
    jobDetail.company_attractions || []
  );
  const [smoke, setSmoke] = useState(jobDetail.smoking_policy || '屋内禁煙');
  const [smokeNote, setSmokeNote] = useState(
    jobDetail.smoking_policy_note || ''
  );
  const [resumeRequired, setResumeRequired] = useState(
    jobDetail.required_documents || []
  );
  const [memo, setMemo] = useState(jobDetail.internal_memo || '');

  // Modal states
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [jobTypeModalOpen, setJobTypeModalOpen] = useState(false);
  const [industryModalOpen, setIndustryModalOpen] = useState(false);

  // モーダル用のref
  const jobTypeModalRef = useRef<{ handleConfirm: () => void }>(null);
  const industryModalRef = useRef<{ handleConfirm: () => void }>(null);

  // Error state
  const [errors, _setErrors] = useState<Record<string, string>>({});
  const [showErrors, _setShowErrors] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = useCallback(async () => {
    setIsUpdating(true);
    try {
      const updateData = {
        company_group_id: group,
        title,
        job_description: jobDescription,
        position_summary: positionSummary,
        required_skills: skills,
        preferred_skills: otherRequirements,
        salary_min: salaryMin ? parseInt(salaryMin) : null,
        salary_max: salaryMax ? parseInt(salaryMax) : null,
        salary_note: salaryNote,
        employment_type: employmentType,
        employment_type_note: employmentTypeNote,
        work_location: locations,
        location_note: locationNote,
        working_hours: workingHours,
        overtime: overtime,
        overtime_info: overtimeMemo,
        holidays: holidays,
        job_type: jobTypes,
        industry: industries,
        selection_process: selectionProcess,
        company_attractions: appealPoints,
        smoking_policy: smoke,
        smoking_policy_note: smokeNote,
        required_documents: resumeRequired,
        internal_memo: memo,
      };

      const { updateJob } = await import('../../pending/actions');
      const result = await updateJob(jobId, updateData);

      if (result && !result.success) {
        throw new Error(result.error || '更新に失敗しました');
      }

      console.log('Job update successful, result:', result);

      // 成功時に確認画面にリダイレクト
      if (typeof window !== 'undefined') {
        window.location.href = `/admin/job/${jobId}/edit/confirm`;
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('更新に失敗しました');
      setIsUpdating(false);
    }
  }, [
    group,
    title,
    jobDescription,
    positionSummary,
    skills,
    otherRequirements,
    salaryMin,
    salaryMax,
    salaryNote,
    employmentType,
    employmentTypeNote,
    locations,
    locationNote,
    workingHours,
    overtime,
    overtimeMemo,
    holidays,
    jobTypes,
    industries,
    selectionProcess,
    appealPoints,
    smoke,
    smokeNote,
    resumeRequired,
    memo,
    jobId,
  ]);

  // AdminPageTitleからのイベントリスナー
  useEffect(() => {
    console.log('AdminJobEditClient: Setting up event listener');
    const handleJobEditUpdate = () => {
      console.log('AdminJobEditClient: Received job-edit-update event');
      handleUpdate();
    };

    window.addEventListener('job-edit-update', handleJobEditUpdate);

    return () => {
      window.removeEventListener('job-edit-update', handleJobEditUpdate);
    };
  }, [handleUpdate]);

  return (
    <div className='flex justify-start'>
      <div className='mr-0 max-w-5xl'>
        {/* 選考メモテーブル - 独立して中央配置 */}
        <div className='mb-6 flex justify-center w-full'>
          <table className='border-collapse border border-gray-400'>
            <tbody>
              <tr>
                <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]"></td>
                <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  スカウト送信数
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  開封数
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  返信数(返信率)
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 bg-gray-300 text-center font-['Noto_Sans_JP'] text-[12px] font-bold text-[#323232]">
                  応募数(応募率)
                </td>
              </tr>
              <tr>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                  過去7日合計
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0 (0%)
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0 (0%)
                </td>
              </tr>
              <tr>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                  過去30日合計
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0 (0%)
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0 (0%)
                </td>
              </tr>
              <tr>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#666666]">
                  累計
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0 (0%)
                </td>
                <td className="w-[220px] h-[36px] border border-gray-400 text-center font-['Noto_Sans_JP'] text-[12px] font-medium text-[#323232]">
                  0 (0%)
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 選考メモセクション */}
        <div className='w-full mb-[37px]'>
          <div className='flex items-start gap-8'>
            <div className='ml-[10px] w-[200px] flex items-center justify-start'>
              <label className='block text-[16px] font-bold text-gray-900'>
                選考メモ
              </label>
            </div>
            <div className='flex-1'>
              <div className='border p-1'>
                <textarea
                  value={memo}
                  onChange={e => setMemo(e.target.value)}
                  rows={4}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500'
                  placeholder='選考に関するメモを入力してください'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='w-full flex flex-col items-start justify-start rounded-[10px]'>
          {/* 求人詳細のヘッダー */}
          <div className='w-full mb-6'>
            <div className='h-0.5 bg-gray-300 mb-4'></div>
            <h2 className='text-2xl font-bold text-gray-900'>求人詳細</h2>
          </div>

          {/* 基本情報（読み取り専用） */}
          <div className='w-full mb-8'>
            {/* 求人ID */}
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-6'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  求人ID
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  {jobDetail.id}
                </div>
              </div>
            </div>

            {/* 承認状況 */}
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-6'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  承認状況
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  {jobDetail.status === 'DRAFT'
                    ? '下書き'
                    : jobDetail.status === 'PENDING_APPROVAL'
                      ? '承認待ち'
                      : jobDetail.status === 'PUBLISHED'
                        ? '掲載済'
                        : jobDetail.status === 'CLOSED'
                          ? '公開停止'
                          : jobDetail.status}
                </div>
              </div>
            </div>

            {/* 企業ID */}
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-6'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  企業ID
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  {jobDetail.company_account_id ||
                    jobDetail.company_accounts?.id ||
                    '不明'}
                </div>
              </div>
            </div>

            {/* 企業名 */}
            <div className='flex flex-row gap-8 items-stretch justify-start w-full mb-6'>
              <div className='bg-[#f9f9f9] flex flex-col gap-1 items-start justify-center px-6 rounded-[5px] w-[200px]'>
                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  企業名
                </div>
              </div>
              <div className='flex-1 flex flex-col gap-2.5 items-start justify-start px-0 py-6'>
                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                  {jobDetail.company_accounts?.company_name || '不明'}
                </div>
              </div>
            </div>
          </div>

          {/* 編集フォーム */}
          <div className='w-full'>
            <FormFields
              group={group}
              setGroup={setGroup}
              companyGroups={companyGroups}
              title={title}
              setTitle={setTitle}
              images={images}
              setImages={setImages}
              jobTypes={jobTypes}
              setJobTypes={setJobTypes}
              industries={industries}
              setIndustries={setIndustries}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              positionSummary={positionSummary}
              setPositionSummary={setPositionSummary}
              skills={skills}
              setSkills={setSkills}
              otherRequirements={otherRequirements}
              setOtherRequirements={setOtherRequirements}
              salaryMin={salaryMin}
              setSalaryMin={setSalaryMin}
              salaryMax={salaryMax}
              setSalaryMax={setSalaryMax}
              salaryNote={salaryNote}
              setSalaryNote={setSalaryNote}
              locations={locations}
              setLocations={setLocations}
              locationNote={locationNote}
              setLocationNote={setLocationNote}
              selectionProcess={selectionProcess}
              setSelectionProcess={setSelectionProcess}
              employmentType={employmentType}
              setEmploymentType={setEmploymentType}
              employmentTypeNote={employmentTypeNote}
              setEmploymentTypeNote={setEmploymentTypeNote}
              workingHours={workingHours}
              setWorkingHours={setWorkingHours}
              overtime={overtime}
              setOvertime={setOvertime}
              overtimeMemo={overtimeMemo}
              setOvertimeMemo={setOvertimeMemo}
              holidays={holidays}
              setHolidays={setHolidays}
              appealPoints={appealPoints}
              setAppealPoints={setAppealPoints}
              smoke={smoke}
              setSmoke={setSmoke}
              smokeNote={smokeNote}
              setSmokeNote={setSmokeNote}
              resumeRequired={resumeRequired}
              setResumeRequired={setResumeRequired}
              memo={memo}
              setMemo={setMemo}
              setLocationModalOpen={setLocationModalOpen}
              setJobTypeModalOpen={setJobTypeModalOpen}
              setIndustryModalOpen={setIndustryModalOpen}
              errors={errors}
              showErrors={showErrors}
            />
          </div>
        </div>

        {/* モーダルコンポーネント */}
        <Modal
          title='勤務地を選択'
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          onPrimaryAction={() => setLocationModalOpen(false)}
        >
          <LocationModal
            selectedLocations={locations}
            setSelectedLocations={setLocations}
          />
        </Modal>

        <Modal
          title='職種を選択'
          isOpen={jobTypeModalOpen}
          onClose={() => setJobTypeModalOpen(false)}
          onPrimaryAction={() => {
            jobTypeModalRef.current?.handleConfirm();
            setJobTypeModalOpen(false);
          }}
        >
          <JobTypeModal
            ref={jobTypeModalRef}
            selectedJobTypes={jobTypes}
            setSelectedJobTypes={setJobTypes}
            onClose={() => setJobTypeModalOpen(false)}
          />
        </Modal>

        <Modal
          title='業種を選択'
          isOpen={industryModalOpen}
          onClose={() => setIndustryModalOpen(false)}
          onPrimaryAction={() => {
            industryModalRef.current?.handleConfirm();
            setIndustryModalOpen(false);
          }}
        >
          <IndustryModal
            ref={industryModalRef}
            selectedIndustries={industries}
            onIndustriesChange={setIndustries}
            onClose={() => setIndustryModalOpen(false)}
          />
        </Modal>

        {/* 下部のボタン */}
        <div className='flex justify-center gap-4 mt-8 mb-8'>
          <Link href={`/admin/job/${jobId}`}>
            <Button
              variant='green-outline'
              size='figma-outline'
              className='px-10 py-3 rounded-[32px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10'
            >
              キャンセル
            </Button>
          </Link>
          <button
            type='button'
            className='rounded-[32px] min-w-[160px] font-bold px-10 py-3.5 bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white transition-all duration-200 ease-in-out hover:from-[#12614E] hover:to-[#1A8946] cursor-pointer disabled:opacity-50'
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? '更新中...' : '確認する'}
          </button>
        </div>
      </div>
    </div>
  );
}
