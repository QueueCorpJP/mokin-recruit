'use client';

import React, { useState } from 'react';
import { CandidateDetailData } from '../page';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { 
  GENDER_OPTIONS, 
  INCOME_RANGES, 
  PREFECTURES, 
  generateYearOptions, 
  generateMonthOptions, 
  generateDayOptions 
} from '@/constants/profile';
import { UpdateCandidateData, EducationData, WorkExperienceData, JobTypeExperienceData, SkillsData } from './actions';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';

interface Props {
  candidate: CandidateDetailData;
}

export default function CandidateEditClient({ candidate }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [memo, setMemo] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetType: 'industry' | 'jobtype' | null;
    targetIndex: number | null;
  }>({ isOpen: false, targetType: null, targetIndex: null });

  // Initialize form data with candidate data
  const [formData, setFormData] = useState<UpdateCandidateData>({
    email: candidate.email || '',
    last_name: candidate.last_name || '',
    first_name: candidate.first_name || '',
    last_name_kana: candidate.last_name_kana || '',
    first_name_kana: candidate.first_name_kana || '',
    gender: candidate.gender || 'unspecified',
    birth_date: candidate.birth_date || '',
    prefecture: candidate.prefecture || '',
    phone_number: candidate.phone_number || '',
    current_income: candidate.current_income || '',
    has_career_change: candidate.has_career_change || '',
    job_change_timing: candidate.job_change_timing || '',
    current_activity_status: candidate.current_activity_status || '',
    recent_job_company_name: candidate.recent_job_company_name || '',
    recent_job_department_position: candidate.recent_job_department_position || '',
    recent_job_start_year: candidate.recent_job_start_year || '',
    recent_job_start_month: candidate.recent_job_start_month || '',
    recent_job_end_year: candidate.recent_job_end_year || '',
    recent_job_end_month: candidate.recent_job_end_month || '',
    recent_job_is_currently_working: candidate.recent_job_is_currently_working || false,
    recent_job_description: candidate.recent_job_description || '',
    job_summary: candidate.job_summary || '',
    self_pr: candidate.self_pr || '',
    recent_job_industries: candidate.work_experience?.map(exp => 
      typeof exp.industry_name === 'object' 
        ? (exp.industry_name.name || exp.industry_name.id || JSON.stringify(exp.industry_name))
        : exp.industry_name
    ).filter(Boolean) || [],
    recent_job_types: candidate.job_type_experience?.map(exp => 
      typeof exp.job_type_name === 'object' 
        ? (exp.job_type_name.name || exp.job_type_name.id || JSON.stringify(exp.job_type_name))
        : exp.job_type_name
    ).filter(Boolean) || [],
  });

  // Education data
  const [education, setEducation] = useState<EducationData>({
    final_education: candidate.education[0]?.final_education || '',
    school_name: candidate.education[0]?.school_name || '',
    department: candidate.education[0]?.department || '',
    graduation_year: candidate.education[0]?.graduation_year || null,
    graduation_month: candidate.education[0]?.graduation_month || null,
  });

  // Work experience data
  const [workExperience, setWorkExperience] = useState<WorkExperienceData[]>(
    candidate.work_experience.length > 0 ? candidate.work_experience.map(exp => ({
      industry_name: typeof exp.industry_name === 'object' 
        ? (exp.industry_name.name || exp.industry_name.id || JSON.stringify(exp.industry_name))
        : exp.industry_name,
      experience_years: exp.experience_years
    })) : [{ industry_name: '', experience_years: 0 }]
  );

  // Job type experience data
  const [jobTypeExperience, setJobTypeExperience] = useState<JobTypeExperienceData[]>(
    candidate.job_type_experience.length > 0 ? candidate.job_type_experience.map(exp => ({
      job_type_name: typeof exp.job_type_name === 'object' 
        ? (exp.job_type_name.name || exp.job_type_name.id || JSON.stringify(exp.job_type_name))
        : exp.job_type_name,
      experience_years: exp.experience_years
    })) : [{ job_type_name: '', experience_years: 0 }]
  );

  // Skills data
  const [skills, setSkills] = useState<SkillsData>({
    english_level: candidate.skills[0]?.english_level || '',
    other_languages: candidate.skills[0]?.other_languages || null,
    skills_list: candidate.skills[0]?.skills_list ? candidate.skills[0].skills_list.map(skill =>
      typeof skill === 'object' 
        ? (skill.name || skill.id || JSON.stringify(skill))
        : skill
    ) : [],
    qualifications: candidate.skills[0]?.qualifications || '',
  });

  const handleInputChange = (field: keyof UpdateCandidateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: keyof EducationData, value: any) => {
    setEducation(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (field: keyof SkillsData, value: any) => {
    setSkills(prev => ({ ...prev, [field]: value }));
  };

  const addWorkExperience = () => {
    setWorkExperience(prev => [...prev, { industry_name: '', experience_years: 0 }]);
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperienceData, value: string | number) => {
    setWorkExperience(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeWorkExperience = (index: number) => {
    if (workExperience.length > 1) {
      setWorkExperience(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addJobTypeExperience = () => {
    setJobTypeExperience(prev => [...prev, { job_type_name: '', experience_years: 0 }]);
  };

  const updateJobTypeExperience = (index: number, field: keyof JobTypeExperienceData, value: string | number) => {
    setJobTypeExperience(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeJobTypeExperience = (index: number) => {
    if (jobTypeExperience.length > 1) {
      setJobTypeExperience(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleIndustryConfirm = (selectedIndustries: string[]) => {
    handleInputChange('recent_job_industries', selectedIndustries);
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleJobTypeConfirm = (selectedJobTypes: string[]) => {
    handleInputChange('recent_job_types', selectedJobTypes);
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for confirmation page
      const confirmData = {
        updateData: formData,
        education,
        workExperience: workExperience.filter(exp => exp.industry_name),
        jobTypeExperience: jobTypeExperience.filter(exp => exp.job_type_name),
        skills
      };

      // Navigate to confirmation page with data
      const params = new URLSearchParams();
      params.set('data', JSON.stringify(confirmData));
      router.push(`/admin/candidate/${candidate.id}/edit/confirm?${params.toString()}`);
      
    } catch (error) {
      console.error('Error preparing candidate data:', error);
      alert('データの準備に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse birth date for form display
  const birthDate = formData.birth_date ? new Date(formData.birth_date) : null;
  const birthYear = birthDate ? birthDate.getFullYear().toString() : '';
  const birthMonth = birthDate ? (birthDate.getMonth() + 1).toString() : '';
  const birthDay = birthDate ? birthDate.getDate().toString() : '';

  return (
    <>
    <div className="min-h-screen">
      <div className="p-8">
        {/* 候補者分析 */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
            候補者分析
          </h2>
          <div className="bg-white p-4 rounded border">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div className="font-semibold">スカウト統計</div>
              <div className="font-semibold">スカウト受信</div>
              <div className="font-semibold">開封数</div>
              <div className="font-semibold">返信数</div>
              <div className="font-semibold">応募数</div>
            </div>
            <div className="grid grid-cols-5 gap-4 text-center mt-2">
              <div>過去7日</div>
              <div>{candidate.scout_stats.scout_received_7days}</div>
              <div>{candidate.scout_stats.scout_opened_7days}</div>
              <div>{candidate.scout_stats.scout_replied_7days}</div>
              <div>{candidate.scout_stats.applications_7days}</div>
            </div>
            <div className="grid grid-cols-5 gap-4 text-center mt-2">
              <div>過去30日</div>
              <div>{candidate.scout_stats.scout_received_30days}</div>
              <div>{candidate.scout_stats.scout_opened_30days}</div>
              <div>{candidate.scout_stats.scout_replied_30days}</div>
              <div>{candidate.scout_stats.applications_30days}</div>
            </div>
          </div>
        </section>

        {/* 運営メモ */}
        <section className="mb-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">運営メモ</h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none"
            placeholder="自由にメモを記入できます。同一グループ内の方が閲覧可能です。"
          />
        </section>

        <form onSubmit={(e) => e.preventDefault()}>
          {/* メールアドレス */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              メールアドレス
            </h3>
            <div className="flex items-center gap-8">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                メールアドレス
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
              />
            </div>
          </section>

          {/* 基本情報 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              基本情報
            </h3>
            {/* Name Fields */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                氏名
              </label>
              <div className="w-[400px] flex gap-4">
                <input
                  type="text"
                  placeholder="姓"
                  autoComplete="off"
                  value={formData.last_name}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
                <input
                  type="text"
                  placeholder="名"
                  autoComplete="off"
                  value={formData.first_name}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Furigana Fields */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                フリガナ
              </label>
              <div className="w-[400px] flex gap-4">
                <input
                  type="text"
                  placeholder="セイ"
                  autoComplete="off"
                  value={formData.last_name_kana}
                  onChange={(e) => handleInputChange('last_name_kana', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
                <input
                  type="text"
                  placeholder="メイ"
                  autoComplete="off"
                  value={formData.first_name_kana}
                  onChange={(e) => handleInputChange('first_name_kana', e.target.value)}
                  className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                性別
              </label>
              <div className="w-[400px] flex gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange('gender', option.value)}
                    className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                      formData.gender === option.value
                        ? 'bg-[#0f9058] border-[#0f9058] text-white'
                        : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Address */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                現在の住まい
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.prefecture}
                    onChange={(e) => handleInputChange('prefecture', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    {PREFECTURES.map((prefecture) => (
                      <option
                        key={prefecture}
                        value={prefecture}
                      >
                        {prefecture}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Birth Date */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                生年月日
              </label>
              <div className="w-[400px] flex gap-4 items-center">
                <div className="relative flex-1">
                  <select
                    value={birthYear}
                    onChange={(e) => {
                      const newDate = `${e.target.value}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
                      handleInputChange('birth_date', e.target.value && birthMonth && birthDay ? newDate : '');
                    }}
                    className="w-full py-3 pl-3 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">年</option>
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  年
                </span>
                <div className="relative flex-1">
                  <select
                    value={birthMonth}
                    onChange={(e) => {
                      const newDate = `${birthYear}-${e.target.value.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
                      handleInputChange('birth_date', birthYear && e.target.value && birthDay ? newDate : '');
                    }}
                    className="w-full py-3 pl-3 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">月</option>
                    {generateMonthOptions().map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  月
                </span>
                <div className="relative flex-1">
                  <select
                    value={birthDay}
                    onChange={(e) => {
                      const newDate = `${birthYear}-${birthMonth.padStart(2, '0')}-${e.target.value.padStart(2, '0')}`;
                      handleInputChange('birth_date', birthYear && birthMonth && e.target.value ? newDate : '');
                    }}
                    className="w-full py-3 pl-3 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">日</option>
                    {generateDayOptions().map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  日
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                連絡先電話番号
              </label>
              <input
                type="tel"
                placeholder="08011112222"
                autoComplete="off"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
              />
            </div>

            {/* Current Income */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                現在の年収
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.current_income}
                    onChange={(e) => handleInputChange('current_income', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    {INCOME_RANGES.map((income) => (
                      <option key={income.value} value={income.value}>
                        {income.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 転職活動状況 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              転職活動状況
            </h3>
            {/* 転職経験 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                転職経験
              </label>
              <div className="w-[400px] flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasCareerChange"
                    value="yes"
                    checked={formData.has_career_change === 'yes'}
                    onChange={(e) => handleInputChange('has_career_change', e.target.value)}
                  />
                  <span>あり</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="hasCareerChange"
                    value="no"
                    checked={formData.has_career_change === 'no'}
                    onChange={(e) => handleInputChange('has_career_change', e.target.value)}
                  />
                  <span>なし</span>
                </label>
              </div>
            </div>

            {/* 転職希望時期 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                転職希望時期
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.job_change_timing}
                    onChange={(e) => handleInputChange('job_change_timing', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">選択してください</option>
                    <option value="immediately">すぐにでも</option>
                    <option value="within_3months">3ヶ月以内</option>
                    <option value="within_6months">6ヶ月以内</option>
                    <option value="within_1year">1年以内</option>
                    <option value="undecided">未定</option>
                  </select>
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 現在の活動状況 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                現在の活動状況
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={formData.current_activity_status}
                    onChange={(e) => handleInputChange('current_activity_status', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">選択してください</option>
                    <option value="active">積極的に活動中</option>
                    <option value="passive">良い求人があれば</option>
                    <option value="not_active">活動していない</option>
                  </select>
                  <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 職務経歴 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務経歴
            </h3>
            {/* 会社名 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                会社名
              </label>
              <input
                type="text"
                value={formData.recent_job_company_name}
                onChange={(e) => handleInputChange('recent_job_company_name', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
              />
            </div>

            {/* 部署・役職 */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                部署・役職
              </label>
              <input
                type="text"
                value={formData.recent_job_department_position}
                onChange={(e) => handleInputChange('recent_job_department_position', e.target.value)}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
              />
            </div>

            {/* 在籍期間 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                在籍期間
              </label>
              <div className="w-[400px] space-y-4">
                <div className="flex gap-4 items-center">
                  <select
                    value={formData.recent_job_start_year}
                    onChange={(e) => handleInputChange('recent_job_start_year', e.target.value)}
                    className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">年</option>
                    {generateYearOptions(1970).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                  <select
                    value={formData.recent_job_start_month}
                    onChange={(e) => handleInputChange('recent_job_start_month', e.target.value)}
                    className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    <option value="">月</option>
                    {generateMonthOptions().map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月〜</span>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.recent_job_is_currently_working}
                      onChange={(e) => handleInputChange('recent_job_is_currently_working', e.target.checked)}
                    />
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">現在も在籍中</span>
                  </label>
                </div>

                {!formData.recent_job_is_currently_working && (
                  <div className="flex gap-4 items-center">
                    <select
                      value={formData.recent_job_end_year}
                      onChange={(e) => handleInputChange('recent_job_end_year', e.target.value)}
                      className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      <option value="">年</option>
                      {generateYearOptions(1970).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                    <select
                      value={formData.recent_job_end_month}
                      onChange={(e) => handleInputChange('recent_job_end_month', e.target.value)}
                      className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                    >
                      <option value="">月</option>
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月まで</span>
                  </div>
                )}
              </div>
            </div>

            {/* 職務内容 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                職務内容
              </label>
              <textarea
                value={formData.recent_job_description}
                onChange={(e) => handleInputChange('recent_job_description', e.target.value)}
                rows={4}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                placeholder="職務内容を入力してください"
              />
            </div>
          </section>

          {/* 学歴・経験業種/職種 */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              学歴・経験業種/職種
            </h3>
            {/* Education Form Fields */}
            <div className="space-y-8">
              {/* Final Education */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  最終学歴
                </label>
                <div className="w-[400px]">
                  <div className="relative">
                    <select
                      value={education.final_education}
                      onChange={(e) => handleEducationChange('final_education', e.target.value)}
                      className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      <option value="中学校卒業">中学校卒業</option>
                      <option value="高等学校卒業">高等学校卒業</option>
                      <option value="高等専門学校卒業">高等専門学校卒業</option>
                      <option value="短期大学卒業">短期大学卒業</option>
                      <option value="専門学校卒業">専門学校卒業</option>
                      <option value="大学卒業（学士）">大学卒業（学士）</option>
                      <option value="大学院修士課程修了（修士）">大学院修士課程修了（修士）</option>
                      <option value="大学院博士課程修了（博士）">大学院博士課程修了（博士）</option>
                      <option value="海外大学卒業（学士）">海外大学卒業（学士）</option>
                      <option value="海外大学院修了（修士・博士含む）">海外大学院修了（修士・博士含む）</option>
                      <option value="その他">その他</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                      >
                        <path
                          d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                          fill="#0F9058"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* School Name */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  学校名
                </label>
                <div className="w-[400px]">
                  <input
                    type="text"
                    placeholder="学校名を入力"
                    value={education.school_name}
                    onChange={(e) => handleEducationChange('school_name', e.target.value)}
                    className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                  />
                </div>
              </div>

              {/* Department/Major */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  学部学科専攻
                </label>
                <div className="w-[400px]">
                  <input
                    type="text"
                    placeholder="学部学科専攻を入力"
                    value={education.department}
                    onChange={(e) => handleEducationChange('department', e.target.value)}
                    className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                  />
                </div>
              </div>

              {/* Graduation Date */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                  卒業年月
                </label>
                <div className="w-[400px] flex gap-4 items-center">
                  <div className="relative flex-1">
                    <select
                      value={education.graduation_year || ''}
                      onChange={(e) => handleEducationChange('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-[11px] py-[11px] pl-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {generateYearOptions(1960).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                      >
                        <path
                          d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                          fill="#0F9058"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                  <div className="relative flex-1">
                    <select
                      value={education.graduation_month || ''}
                      onChange={(e) => handleEducationChange('graduation_month', e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-[11px] py-[11px] pl-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="10"
                        viewBox="0 0 14 10"
                        fill="none"
                      >
                        <path
                          d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                          fill="#0F9058"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">月</span>
                </div>
              </div>

              {/* Industry */}
              <div className="flex items-center gap-8 mb-6">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  業種
                </label>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: true, targetType: 'industry', targetIndex: -2 })}
                    className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                  >
                    業種を選択
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {formData.recent_job_industries.map((industry, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {industry}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newIndustries = formData.recent_job_industries.filter((_, i) => i !== index);
                            handleInputChange('recent_job_industries', newIndustries);
                          }}
                          className="w-3 h-3"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M1 1L11 11M1 11L11 1"
                              stroke="#0f9058"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Type */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  職種
                </label>
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: true, targetType: 'jobtype', targetIndex: -2 })}
                    className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                  >
                    職種を選択
                  </button>
                  <div className="flex flex-wrap gap-2">
                    {formData.recent_job_types.map((jobType, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {jobType}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newJobTypes = formData.recent_job_types.filter((_, i) => i !== index);
                            handleInputChange('recent_job_types', newJobTypes);
                          }}
                          className="w-3 h-3"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M1 1L11 11M1 11L11 1"
                              stroke="#0f9058"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 資格・語学・スキル */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              資格・語学・スキル
            </h3>
            {/* English */}
            <div className="flex items-center gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                英語
              </label>
              <div className="w-[400px]">
                <div className="relative">
                  <select
                    value={skills.english_level}
                    onChange={(e) => handleSkillsChange('english_level', e.target.value)}
                    className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    <option value="">レベルを選択</option>
                    <option value="native">ネイティブ</option>
                    <option value="business">ビジネスレベル</option>
                    <option value="conversation">日常会話</option>
                    <option value="basic">基礎会話</option>
                    <option value="none">なし</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      fill="none"
                    >
                      <path
                        d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Input */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                スキル
              </label>
              <div className="w-[400px]">
                <textarea
                  placeholder="業務で活かしたスキル・ツール・得意分野を入力してください"
                  className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[80px] resize-none"
                />
                <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-2">
                  ※最低3つ以上のキーワードを選択/登録してください。
                </p>
                {skills.skills_list.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {skills.skills_list.map((skill, index) => (
                      <div
                        key={index}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5 w-fit"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {skill}
                        </span>
                        <button
                          type="button"
                          className="w-3 h-3"
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M1 1L11 11M1 11L11 1"
                              stroke="#0f9058"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Qualifications */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                保有資格
              </label>
              <div className="w-[400px]">
                <textarea
                  value={skills.qualifications}
                  onChange={(e) => handleSkillsChange('qualifications', e.target.value)}
                  placeholder="例）TOEIC850点、簿記2級、中小企業診断士など"
                  className="w-full px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[147px] resize-none"
                />
                <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-2">
                  ※履歴書・職務経歴書をアップロードした場合、記載内容に追記されます。
                </p>
              </div>
            </div>
          </section>

          {/* 職務要約・自己PR */}
          <section className="mb-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務要約・自己PR
            </h3>
            {/* 職務要約 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                職務要約
              </label>
              <textarea
                value={formData.job_summary}
                onChange={(e) => handleInputChange('job_summary', e.target.value)}
                rows={4}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                placeholder="職務要約を入力してください"
              />
            </div>

            {/* 自己PR・その他 */}
            <div className="flex items-start gap-8 mb-6">
              <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                自己PR・その他
              </label>
              <textarea
                value={formData.self_pr}
                onChange={(e) => handleInputChange('self_pr', e.target.value)}
                rows={4}
                className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                placeholder="自己PRやその他の情報を入力してください"
              />
            </div>
          </section>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 pt-8">
           
            <AdminButton 
              text={isSubmitting ? "準備中..." : "確認する"}
              variant="green-gradient"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>

    {/* Modals */}
    {modalState.isOpen && modalState.targetType === 'industry' && (
      <IndustrySelectModal
        isOpen={true}
        onClose={() => setModalState({ isOpen: false, targetType: null, targetIndex: null })}
        onConfirm={handleIndustryConfirm}
        initialSelected={formData.recent_job_industries}
      />
    )}

    {modalState.isOpen && modalState.targetType === 'jobtype' && (
      <JobTypeSelectModal
        isOpen={true}
        onClose={() => setModalState({ isOpen: false, targetType: null, targetIndex: null })}
        onConfirm={handleJobTypeConfirm}
        initialSelected={formData.recent_job_types}
      />
    )}
  </>
  );
}