'use client';

import React, { useState } from 'react';
import { CandidateDetailData } from '../page';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import {
  GENDER_OPTIONS,
  INCOME_RANGES,
  PREFECTURES,
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/constants/profile';
import { updateCandidateData } from './actions';

interface Props {
  candidate: CandidateDetailData;
}

export default function CandidateEditClient({ candidate }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data with existing candidate data
  const [formData, setFormData] = useState({
    // Basic info
    email: candidate.email || '',
    lastName: candidate.last_name || '',
    firstName: candidate.first_name || '',
    lastNameKana: candidate.last_name_kana || '',
    firstNameKana: candidate.first_name_kana || '',
    gender: candidate.gender || 'unspecified',
    birthYear: candidate.birth_date ? new Date(candidate.birth_date).getFullYear().toString() : '',
    birthMonth: candidate.birth_date ? (new Date(candidate.birth_date).getMonth() + 1).toString() : '',
    birthDay: candidate.birth_date ? new Date(candidate.birth_date).getDate().toString() : '',
    prefecture: candidate.prefecture || '',
    phoneNumber: candidate.phone_number || '',
    currentIncome: candidate.current_income || '',
    currentCompany: candidate.current_company || '',
    currentPosition: candidate.current_position || '',
    
    // Career status
    hasCareerChange: candidate.has_career_change || '',
    jobChangeTiming: candidate.job_change_timing || '',
    currentActivityStatus: candidate.current_activity_status || '',
    
    // Recent job
    recentJobCompanyName: candidate.recent_job_company_name || '',
    recentJobDepartmentPosition: candidate.recent_job_department_position || '',
    recentJobStartYear: candidate.recent_job_start_year || '',
    recentJobStartMonth: candidate.recent_job_start_month || '',
    recentJobEndYear: candidate.recent_job_end_year || '',
    recentJobEndMonth: candidate.recent_job_end_month || '',
    recentJobIsCurrentlyWorking: candidate.recent_job_is_currently_working || false,
    recentJobDescription: candidate.recent_job_description || '',
    
    // Summary
    jobSummary: candidate.job_summary || '',
    selfPr: candidate.self_pr || '',
  });

  // 職歴データ
  const [workExperience, setWorkExperience] = useState(
    candidate.work_experience || []
  );
  
  // 職種経験データ
  const [jobTypeExperience, setJobTypeExperience] = useState(
    candidate.job_type_experience || []
  );
  
  // 学歴データ
  const [education, setEducation] = useState(
    candidate.education && candidate.education.length > 0 ? candidate.education[0] : {
      final_education: '',
      school_name: '',
      department: '',
      graduation_year: null,
      graduation_month: null,
    }
  );
  
  // スキルデータ
  const [skills, setSkills] = useState(
    candidate.skills && candidate.skills.length > 0 ? candidate.skills[0] : {
      english_level: '',
      other_languages: null,
      skills_list: [],
      qualifications: '',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Create birth_date from components
      let birth_date = null;
      if (formData.birthYear && formData.birthMonth && formData.birthDay) {
        birth_date = `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`;
      }

      const updateData = {
        email: formData.email,
        last_name: formData.lastName,
        first_name: formData.firstName,
        last_name_kana: formData.lastNameKana,
        first_name_kana: formData.firstNameKana,
        gender: formData.gender as 'male' | 'female' | 'unspecified',
        birth_date: birth_date || '',
        prefecture: formData.prefecture,
        phone_number: formData.phoneNumber,
        current_income: formData.currentIncome,
        has_career_change: formData.hasCareerChange,
        job_change_timing: formData.jobChangeTiming,
        current_activity_status: formData.currentActivityStatus,
        recent_job_company_name: formData.recentJobCompanyName,
        recent_job_department_position: formData.recentJobDepartmentPosition,
        recent_job_start_year: formData.recentJobStartYear,
        recent_job_start_month: formData.recentJobStartMonth,
        recent_job_end_year: formData.recentJobEndYear,
        recent_job_end_month: formData.recentJobEndMonth,
        recent_job_is_currently_working: formData.recentJobIsCurrentlyWorking,
        recent_job_description: formData.recentJobDescription,
        job_summary: formData.jobSummary,
        self_pr: formData.selfPr,
      };

      // Prepare data for confirmation page
      const confirmData = {
        updateData,
        education,
        workExperience,
        jobTypeExperience,
        skills
      };

      // Navigate to confirmation page
      const dataParam = encodeURIComponent(JSON.stringify(confirmData));
      router.push(`/admin/candidate/${candidate.id}/edit/confirm?data=${dataParam}`);
    } catch (error) {
      console.error('Error preparing confirmation data:', error);
      alert('データの準備に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          候補者情報編集
        </h1>
        <p className="text-gray-600">
          ユーザーID: {candidate.id}
        </p>
      </div>

      <div className="p-8">
        {/* 候補者分析 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
            候補者分析
          </h2>
          <div className="bg-white relative rounded-[4px] w-full">
            <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-full">
              {/* ヘッダー行 */}
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">&nbsp;</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">スカウト受信数</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">開封数（開封率）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">返信数（返信率）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">応募数（応募率）</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* データ行 */}
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">現在月</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0（0%）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0（0%）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0（0%）</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">累計</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0（0%）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0（0%）</p>
                    </div>
                  </div>
                </div>
                <div className="basis-0 bg-white content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                  <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                  <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                    <div className="basis-0 grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                      <p className="leading-[1.3]">0（0%）</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <form onSubmit={handleSubmit}>
          {/* メールアドレス */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              メールアドレス
            </h3>
            <div className="px-4 py-4">
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    メールアドレス
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="メールアドレスを入力"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 基本情報 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              基本情報
            </h3>
            <div className="px-4 py-4 space-y-6">
              {/* Name Fields */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    氏名
                  </label>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        placeholder="姓"
                        autoComplete="off"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        placeholder="名"
                        autoComplete="off"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                      />
                    </div>
                  </div>
                  <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                    ※登録後の変更は不可となっております。
                  </p>
                </div>
              </div>

              {/* Furigana Fields */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    フリガナ
                  </label>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap gap-2">
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        placeholder="セイ"
                        autoComplete="off"
                        value={formData.lastNameKana}
                        onChange={(e) => handleInputChange('lastNameKana', e.target.value)}
                        className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                      />
                    </div>
                    <div className="flex-1 min-w-[120px]">
                      <input
                        type="text"
                        placeholder="メイ"
                        autoComplete="off"
                        value={formData.firstNameKana}
                        onChange={(e) => handleInputChange('firstNameKana', e.target.value)}
                        className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender Field */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    性別
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    {GENDER_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prefecture Field */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    現在の住まい
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    value={formData.prefecture}
                    onChange={(e) => handleInputChange('prefecture', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">選択してください</option>
                    {PREFECTURES.map((prefecture) => (
                      <option key={prefecture.value} value={prefecture.value}>
                        {prefecture.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Birth Date */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    生年月日
                  </label>
                </div>
                <div className="flex-1 flex gap-2">
                  <select
                    value={formData.birthYear}
                    onChange={(e) => handleInputChange('birthYear', e.target.value)}
                    className="px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    {generateYearOptions().map((yearOption) => (
                      <option key={yearOption.value} value={yearOption.value}>
                        {yearOption.label}{yearOption.value ? '年' : ''}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => handleInputChange('birthMonth', e.target.value)}
                    className="px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    {generateMonthOptions().map((monthOption) => (
                      <option key={monthOption.value} value={monthOption.value}>
                        {monthOption.label}{monthOption.value ? '月' : ''}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => handleInputChange('birthDay', e.target.value)}
                    className="px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    {generateDayOptions(formData.birthYear, formData.birthMonth).map((dayOption) => (
                      <option key={dayOption.value} value={dayOption.value}>
                        {dayOption.label}{dayOption.value ? '日' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    電話番号
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="ハイフンなしで入力"
                  />
                </div>
              </div>

              {/* Current Income */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    現在の年収
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    value={formData.currentIncome}
                    onChange={(e) => handleInputChange('currentIncome', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">選択してください</option>
                    {INCOME_RANGES.map((income) => (
                      <option key={income.value} value={income.value}>
                        {income.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
            <div className="flex-1 h-px relative">
              <div className="absolute inset-[-1px_-0.3%]">
                <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
              転職経験
            </span>
            <div className="flex-1 h-px relative">
              <div className="absolute inset-[-1px_-0.3%]">
                <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 space-y-6 mb-8">
            {/* Career Change Experience */}
            <div className="flex flex-row gap-4 items-start w-fit mx-auto mb-4">
              <div className="pt-[11px] min-w-[130px] text-right">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  転職経験
                </label>
              </div>
              <div className="flex flex-col gap-2 w-[400px]">
                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasCareerChange', 'yes')}
                    className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                      formData.hasCareerChange === 'yes'
                        ? 'bg-[#0f9058] border-[#0f9058] text-white'
                        : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                    }`}
                  >
                    あり
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('hasCareerChange', 'no')}
                    className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                      formData.hasCareerChange === 'no'
                        ? 'bg-[#0f9058] border-[#0f9058] text-white'
                        : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                    }`}
                  >
                    なし
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
            <div className="flex-1 h-px relative">
              <div className="absolute inset-[-1px_-0.3%]">
                <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                </svg>
              </div>
            </div>
            <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
              転職活動状況
            </span>
            <div className="flex-1 h-px relative">
              <div className="absolute inset-[-1px_-0.3%]">
                <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                  <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full items-end px-4 py-4 mb-8">
            {/* Job Change Timing */}
            <div className="flex flex-row gap-4 items-start w-fit mx-auto mt-4">
              <div className="pt-[11px] min-w-[130px] text-right">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  転職希望時期
                </label>
              </div>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.jobChangeTiming}
                    onChange={(e) => handleInputChange('jobChangeTiming', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] font-bold tracking-[1.6px] appearance-none cursor-pointer text-[#323232]"
                  >
                    <option value="">未選択</option>
                    <option value="immediately">すぐにでも</option>
                    <option value="within_3months">3ヶ月以内</option>
                    <option value="within_6months">6ヶ月以内</option>
                    <option value="within_1year">1年以内</option>
                    <option value="undecided">未定</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z" fill="#0F9058" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Activity Status */}
            <div className="flex flex-row gap-4 items-start w-fit mx-auto mb-4">
              <div className="pt-[11px] min-w-[130px] text-right">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  現在の活動状況
                </label>
              </div>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.currentActivityStatus}
                    onChange={(e) => handleInputChange('currentActivityStatus', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] font-bold tracking-[1.6px] appearance-none cursor-pointer text-[#323232]"
                  >
                    <option value="">未選択</option>
                    <option value="active">積極的に活動中</option>
                    <option value="passive">良い求人があれば</option>
                    <option value="not_active">活動していない</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z" fill="#0F9058" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 職務経歴 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務経歴
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    会社名
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.recentJobCompanyName}
                    onChange={(e) => handleInputChange('recentJobCompanyName', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="会社名を入力"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    部署・役職
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.recentJobDepartmentPosition}
                    onChange={(e) => handleInputChange('recentJobDepartmentPosition', e.target.value)}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="部署・役職を入力"
                  />
                </div>
              </div>
              
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    在籍期間
                  </label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.recentJobStartYear}
                    onChange={(e) => handleInputChange('recentJobStartYear', e.target.value)}
                    className="w-20 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="年"
                  />
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                  <input
                    type="text"
                    value={formData.recentJobStartMonth}
                    onChange={(e) => handleInputChange('recentJobStartMonth', e.target.value)}
                    className="w-20 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="月"
                  />
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月 〜</span>
                  {!formData.recentJobIsCurrentlyWorking && (
                    <>
                      <input
                        type="text"
                        value={formData.recentJobEndYear}
                        onChange={(e) => handleInputChange('recentJobEndYear', e.target.value)}
                        className="w-20 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                        placeholder="年"
                      />
                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                      <input
                        type="text"
                        value={formData.recentJobEndMonth}
                        onChange={(e) => handleInputChange('recentJobEndMonth', e.target.value)}
                        className="w-20 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                        placeholder="月"
                      />
                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月</span>
                    </>
                  )}
                  <label className="flex items-center ml-4">
                    <input
                      type="checkbox"
                      checked={formData.recentJobIsCurrentlyWorking}
                      onChange={(e) => handleInputChange('recentJobIsCurrentlyWorking', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">現在も在籍中</span>
                  </label>
                </div>
              </div>
              
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    職務内容
                  </label>
                </div>
                <div className="flex-1">
                  <textarea
                    value={formData.recentJobDescription}
                    onChange={(e) => handleInputChange('recentJobDescription', e.target.value)}
                    rows={4}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] resize-none"
                    placeholder="職務内容を入力してください"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 学歴・経験業種/職種 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              学歴・経験業種/職種
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    最終学歴
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    value={education.final_education || ''}
                    onChange={(e) => setEducation({ ...education, final_education: e.target.value })}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">選択してください</option>
                    <option value="high_school">高校卒</option>
                    <option value="vocational">専門学校卒</option>
                    <option value="junior_college">短大卒</option>
                    <option value="university">大学卒</option>
                    <option value="graduate">大学院卒</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    学校名
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={education.school_name || ''}
                    onChange={(e) => setEducation({ ...education, school_name: e.target.value })}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="学校名を入力"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    学部・学科
                  </label>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={education.department || ''}
                    onChange={(e) => setEducation({ ...education, department: e.target.value })}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="学部・学科を入力"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    卒業年月
                  </label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="number"
                    value={education.graduation_year || ''}
                    onChange={(e) => setEducation({ ...education, graduation_year: parseInt(e.target.value) || null })}
                    className="w-24 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="年"
                  />
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                  <input
                    type="number"
                    value={education.graduation_month || ''}
                    onChange={(e) => setEducation({ ...education, graduation_month: parseInt(e.target.value) || null })}
                    className="w-20 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                    placeholder="月"
                    min="1"
                    max="12"
                  />
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月</span>
                </div>
              </div>

              {/* 業種経験 */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    業種経験
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={exp.industry_name}
                        onChange={(e) => {
                          const updated = [...workExperience];
                          updated[index] = { ...exp, industry_name: e.target.value };
                          setWorkExperience(updated);
                        }}
                        className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                        placeholder="業種名"
                      />
                      <input
                        type="number"
                        value={exp.experience_years}
                        onChange={(e) => {
                          const updated = [...workExperience];
                          updated[index] = { ...exp, experience_years: parseInt(e.target.value) || 0 };
                          setWorkExperience(updated);
                        }}
                        className="w-24 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                        placeholder="年"
                      />
                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                      <button
                        type="button"
                        onClick={() => {
                          setWorkExperience(workExperience.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700 text-[16px] font-bold tracking-[1.6px]"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setWorkExperience([...workExperience, { industry_name: '', experience_years: 0 }]);
                    }}
                    className="text-green-600 hover:text-green-700 text-[16px] font-bold tracking-[1.6px]"
                  >
                    + 業種経験を追加
                  </button>
                </div>
              </div>

              {/* 職種経験 */}
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    職種経験
                  </label>
                </div>
                <div className="flex-1 space-y-4">
                  {jobTypeExperience.map((exp, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={exp.job_type_name}
                        onChange={(e) => {
                          const updated = [...jobTypeExperience];
                          updated[index] = { ...exp, job_type_name: e.target.value };
                          setJobTypeExperience(updated);
                        }}
                        className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                        placeholder="職種名"
                      />
                      <input
                        type="number"
                        value={exp.experience_years}
                        onChange={(e) => {
                          const updated = [...jobTypeExperience];
                          updated[index] = { ...exp, experience_years: parseInt(e.target.value) || 0 };
                          setJobTypeExperience(updated);
                        }}
                        className="w-24 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                        placeholder="年"
                      />
                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                      <button
                        type="button"
                        onClick={() => {
                          setJobTypeExperience(jobTypeExperience.filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700 text-[16px] font-bold tracking-[1.6px]"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setJobTypeExperience([...jobTypeExperience, { job_type_name: '', experience_years: 0 }]);
                    }}
                    className="text-green-600 hover:text-green-700 text-[16px] font-bold tracking-[1.6px]"
                  >
                    + 職種経験を追加
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 資格・語学・スキル */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              資格・語学・スキル
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    英語レベル
                  </label>
                </div>
                <div className="flex-1">
                  <select
                    value={skills.english_level || ''}
                    onChange={(e) => setSkills({ ...skills, english_level: e.target.value })}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">選択してください</option>
                    <option value="none">なし</option>
                    <option value="basic">日常会話レベル</option>
                    <option value="business">ビジネスレベル</option>
                    <option value="native">ネイティブレベル</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    保有資格
                  </label>
                </div>
                <div className="flex-1">
                  <textarea
                    value={skills.qualifications || ''}
                    onChange={(e) => setSkills({ ...skills, qualifications: e.target.value })}
                    rows={3}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] resize-none"
                    placeholder="保有資格を入力してください"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 職務要約 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務要約
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    職務要約
                  </label>
                </div>
                <div className="flex-1">
                  <textarea
                    value={formData.jobSummary}
                    onChange={(e) => handleInputChange('jobSummary', e.target.value)}
                    rows={5}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] resize-none"
                    placeholder="職務要約を入力してください"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-4 items-start">
                <div className="w-32 pt-[11px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    自己PR・その他
                  </label>
                </div>
                <div className="flex-1">
                  <textarea
                    value={formData.selfPr}
                    onChange={(e) => handleInputChange('selfPr', e.target.value)}
                    rows={5}
                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999] resize-none"
                    placeholder="自己PRやその他の情報を入力してください"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <AdminButton 
              text={isSubmitting ? "保存中..." : "保存"} 
              variant="green-gradient" 
              size="figma-default"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
}