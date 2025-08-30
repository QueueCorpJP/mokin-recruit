'use client';

import React, { useState } from 'react';
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
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';

export default function CandidateNewClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetType: 'industry' | 'jobtype' | null;
    targetIndex: number | null;
  }>({ isOpen: false, targetType: null, targetIndex: null });
  const [skillInput, setSkillInput] = useState('');

  // Initialize form data for new candidate
  const [formData, setFormData] = useState({
    // Basic info
    email: '',
    lastName: '',
    firstName: '',
    lastNameKana: '',
    firstNameKana: '',
    gender: 'unspecified',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    prefecture: '',
    phoneNumber: '',
    currentIncome: '',
    
    // Career status
    hasCareerChange: 'no',
    jobChangeTiming: '',
    currentActivityStatus: '',
    
    // Recent job
    recentJobCompanyName: '',
    recentJobDepartmentPosition: '',
    recentJobStartYear: '',
    recentJobStartMonth: '',
    recentJobEndYear: '',
    recentJobEndMonth: '',
    recentJobIsCurrentlyWorking: false,
    recentJobDescription: '',
    recentJobIndustries: [] as string[],
    recentJobTypes: [] as string[],
    
    // Summary
    jobSummary: '',
    selfPr: '',
  });

  // 職歴データ
  const [workExperience, setWorkExperience] = useState([
    { industry_name: '', experience_years: 0 }
  ]);
  
  // 職種経験データ  
  const [jobTypeExperience, setJobTypeExperience] = useState([
    { job_type_name: '', experience_years: 0 }
  ]);
  
  // 学歴データ
  const [education, setEducation] = useState({
    final_education: '',
    school_name: '',
    department: '',
    graduation_year: null,
    graduation_month: null,
  });
  
  // スキルデータ
  const [skills, setSkills] = useState({
    english_level: 'none',
    qualifications: '',
    skills_tags: [] as string[]
  });

  // Selection entries (経験企業名の候補)
  const [selectionEntries, setSelectionEntries] = useState([
    {
      companyName: '',
      industries: [] as string[],
      jobTypes: [] as string[]
    }
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEducationChange = (field: string, value: any) => {
    setEducation(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (field: string, value: any) => {
    setSkills(prev => ({ ...prev, [field]: value }));
  };

  const addWorkExperience = () => {
    setWorkExperience(prev => [...prev, { industry_name: '', experience_years: 0 }]);
  };

  const updateWorkExperience = (index: number, field: 'industry_name' | 'experience_years', value: string | number) => {
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

  const updateJobTypeExperience = (index: number, field: 'job_type_name' | 'experience_years', value: string | number) => {
    setJobTypeExperience(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeJobTypeExperience = (index: number) => {
    if (jobTypeExperience.length > 1) {
      setJobTypeExperience(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addSelectionEntry = () => {
    setSelectionEntries(prev => [
      ...prev,
      { companyName: '', industries: [], jobTypes: [] }
    ]);
  };

  const updateSelectionEntry = (index: number, field: string, value: any) => {
    setSelectionEntries(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const removeSelectionEntry = (index: number) => {
    if (selectionEntries.length > 1) {
      setSelectionEntries(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleIndustryConfirm = (selectedIndustries: string[]) => {
    if (modalState.targetIndex !== null) {
      if (modalState.targetIndex === -1) {
        // 最新の職歴の業界を更新
        handleInputChange('recentJobIndustries', selectedIndustries);
      } else {
        // Selection entriesの業界を更新
        updateSelectionEntry(modalState.targetIndex, 'industries', selectedIndustries);
      }
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleJobTypeConfirm = (selectedJobTypes: string[]) => {
    if (modalState.targetIndex !== null) {
      if (modalState.targetIndex === -1) {
        // 最新の職歴の職種を更新
        handleInputChange('recentJobTypes', selectedJobTypes);
      } else {
        // Selection entriesの職種を更新
        updateSelectionEntry(modalState.targetIndex, 'jobTypes', selectedJobTypes);
      }
    }
    setModalState({ isOpen: false, targetType: null, targetIndex: null });
  };

  const handleSkillTagAdd = () => {
    if (skillInput.trim() && !skills.skills_tags.includes(skillInput.trim())) {
      setSkills(prev => ({
        ...prev,
        skills_tags: [...prev.skills_tags, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleSkillTagRemove = (tagToRemove: string) => {
    setSkills(prev => ({
      ...prev,
      skills_tags: prev.skills_tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for confirmation page
      const confirmData = {
        updateData: {
          // Basic info
          email: formData.email,
          last_name: formData.lastName,
          first_name: formData.firstName,
          last_name_kana: formData.lastNameKana,
          first_name_kana: formData.firstNameKana,
          gender: formData.gender,
          birth_date: formData.birthYear && formData.birthMonth && formData.birthDay ? 
            `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}` : null,
          prefecture: formData.prefecture,
          phone_number: formData.phoneNumber,
          current_income: formData.currentIncome,
          
          // Career status
          has_career_change: formData.hasCareerChange,
          job_change_timing: formData.jobChangeTiming,
          current_activity_status: formData.currentActivityStatus,
          
          // Recent job
          recent_job_company_name: formData.recentJobCompanyName,
          recent_job_department_position: formData.recentJobDepartmentPosition,
          recent_job_start_year: formData.recentJobStartYear,
          recent_job_start_month: formData.recentJobStartMonth,
          recent_job_end_year: formData.recentJobEndYear,
          recent_job_end_month: formData.recentJobEndMonth,
          recent_job_is_currently_working: formData.recentJobIsCurrentlyWorking,
          recent_job_description: formData.recentJobDescription,
          recent_job_industries: formData.recentJobIndustries,
          recent_job_types: formData.recentJobTypes,
          
          // Summary
          job_summary: formData.jobSummary,
          self_pr: formData.selfPr,
        },
        education,
        workExperience: workExperience.filter(exp => exp.industry_name),
        jobTypeExperience: jobTypeExperience.filter(exp => exp.job_type_name),
        skills,
        selectionEntries: selectionEntries.filter(entry => entry.companyName)
      };

      // Navigate to confirmation page with data
      const params = new URLSearchParams();
      params.set('data', JSON.stringify(confirmData));
      router.push(`/admin/candidate/new/confirm?${params.toString()}`);
      
    } catch (error) {
      console.error('Error preparing candidate data:', error);
      alert('データの準備に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        {/* Header */}
        <div className="p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            新規候補者追加
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={(e) => e.preventDefault()}>
            {/* メールアドレス */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                メールアドレス
              </span>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-8 mb-6">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* 基本情報 */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                基本情報
              </span>
            </div>

            <div className="mb-12 space-y-6">
              {/* 氏名 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  氏名
                </label>
                <div className="flex-1 flex gap-4">
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="姓"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="名"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* フリガナ */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  フリガナ
                </label>
                <div className="flex-1 flex gap-4">
                  <input
                    type="text"
                    value={formData.lastNameKana}
                    onChange={(e) => handleInputChange('lastNameKana', e.target.value)}
                    placeholder="セイ"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={formData.firstNameKana}
                    onChange={(e) => handleInputChange('firstNameKana', e.target.value)}
                    placeholder="メイ"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* 性別 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  性別
                </label>
                <div className="flex-1">
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    {GENDER_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 生年月日 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  生年月日
                </label>
                <div className="flex-1 flex gap-4 items-center">
                  <select
                    value={formData.birthYear}
                    onChange={(e) => handleInputChange('birthYear', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">年</option>
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <span className="text-[16px] text-[#323232]">年</span>
                  <select
                    value={formData.birthMonth}
                    onChange={(e) => handleInputChange('birthMonth', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">月</option>
                    {generateMonthOptions().map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <span className="text-[16px] text-[#323232]">月</span>
                  <select
                    value={formData.birthDay}
                    onChange={(e) => handleInputChange('birthDay', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">日</option>
                    {generateDayOptions().map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <span className="text-[16px] text-[#323232]">日</span>
                </div>
              </div>

              {/* 現在の住まい */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  現在の住まい
                </label>
                <div className="flex-1">
                  <select
                    value={formData.prefecture}
                    onChange={(e) => handleInputChange('prefecture', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">都道府県を選択</option>
                    {PREFECTURES.map(prefecture => (
                      <option key={prefecture} value={prefecture}>{prefecture}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 電話番号 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  電話番号
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 現在の年収 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  現在の年収
                </label>
                <div className="flex-1">
                  <select
                    value={formData.currentIncome}
                    onChange={(e) => handleInputChange('currentIncome', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">年収を選択</option>
                    {INCOME_RANGES.map(income => (
                      <option key={income.value} value={income.value}>{income.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 転職経験 */}
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
            </div>

            <div className="mb-12 space-y-6">
              {/* 転職経験 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  転職経験
                </label>
                <div className="flex-1 flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasCareerChange"
                      value="yes"
                      checked={formData.hasCareerChange === 'yes'}
                      onChange={(e) => handleInputChange('hasCareerChange', e.target.value)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-[16px] text-[#323232]">あり</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasCareerChange"
                      value="no"
                      checked={formData.hasCareerChange === 'no'}
                      onChange={(e) => handleInputChange('hasCareerChange', e.target.value)}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-[16px] text-[#323232]">なし</span>
                  </label>
                </div>
              </div>

              {/* 転職希望時期 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  転職希望時期
                </label>
                <div className="flex-1">
                  <select
                    value={formData.jobChangeTiming}
                    onChange={(e) => handleInputChange('jobChangeTiming', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="immediately">すぐにでも</option>
                    <option value="within_3months">3ヶ月以内</option>
                    <option value="within_6months">6ヶ月以内</option>
                    <option value="within_1year">1年以内</option>
                    <option value="undecided">未定</option>
                  </select>
                </div>
              </div>

              {/* 現在の活動状況 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  現在の活動状況
                </label>
                <div className="flex-1">
                  <select
                    value={formData.currentActivityStatus}
                    onChange={(e) => handleInputChange('currentActivityStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="">選択してください</option>
                    <option value="active">積極的に活動中</option>
                    <option value="passive">良い求人があれば</option>
                    <option value="not_active">活動していない</option>
                  </select>
                </div>
              </div>

              {/* Selection Entries */}
              <div className="space-y-4">
                <div className="flex items-center gap-8">
                  <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                    経験企業名
                  </label>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={addSelectionEntry}
                      className="px-4 py-2 text-sm bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-colors"
                    >
                      追加
                    </button>
                  </div>
                </div>

                {selectionEntries.map((entry, index) => (
                  <div key={index} className="ml-40 border border-gray-200 rounded-[5px] p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-[#323232]">企業情報 {index + 1}</h4>
                      {selectionEntries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSelectionEntry(index)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          削除
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <CompanyNameInput
                        value={entry.companyName}
                        onChange={(value) => updateSelectionEntry(index, 'companyName', value)}
                        placeholder="会社名を入力してください"
                      />
                      
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => setModalState({ isOpen: true, targetType: 'industry', targetIndex: index })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-left hover:border-blue-400 transition-colors"
                        >
                          <span className="text-[#666]">業界: </span>
                          <span className="text-[#323232]">
                            {entry.industries.length > 0 ? entry.industries.join(', ') : '選択してください'}
                          </span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setModalState({ isOpen: true, targetType: 'jobtype', targetIndex: index })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-left hover:border-blue-400 transition-colors"
                        >
                          <span className="text-[#666]">職種: </span>
                          <span className="text-[#323232]">
                            {entry.jobTypes.length > 0 ? entry.jobTypes.join(', ') : '選択してください'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 直近の職歴 */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                直近の職歴
              </span>
            </div>

            <div className="mb-12 space-y-6">
              {/* 会社名 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  会社名
                </label>
                <div className="flex-1">
                  <CompanyNameInput
                    value={formData.recentJobCompanyName}
                    onChange={(value) => handleInputChange('recentJobCompanyName', value)}
                    placeholder="会社名を入力してください"
                  />
                </div>
              </div>

              {/* 部署・役職 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  部署・役職
                </label>
                <input
                  type="text"
                  value={formData.recentJobDepartmentPosition}
                  onChange={(e) => handleInputChange('recentJobDepartmentPosition', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* 在籍期間 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  在籍期間
                </label>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4 items-center">
                    <select
                      value={formData.recentJobStartYear}
                      onChange={(e) => handleInputChange('recentJobStartYear', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                      style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                    >
                      <option value="">年</option>
                      {generateYearOptions(1970).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-[16px] text-[#323232]">年</span>
                    <select
                      value={formData.recentJobStartMonth}
                      onChange={(e) => handleInputChange('recentJobStartMonth', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                      style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                    >
                      <option value="">月</option>
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <span className="text-[16px] text-[#323232]">月〜</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.recentJobIsCurrentlyWorking}
                        onChange={(e) => handleInputChange('recentJobIsCurrentlyWorking', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-[16px] text-[#323232]">現在も在籍中</span>
                    </label>
                  </div>

                  {!formData.recentJobIsCurrentlyWorking && (
                    <div className="flex gap-4 items-center">
                      <select
                        value={formData.recentJobEndYear}
                        onChange={(e) => handleInputChange('recentJobEndYear', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                        style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                      >
                        <option value="">年</option>
                        {generateYearOptions(1970).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <span className="text-[16px] text-[#323232]">年</span>
                      <select
                        value={formData.recentJobEndMonth}
                        onChange={(e) => handleInputChange('recentJobEndMonth', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                        style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                      >
                        <option value="">月</option>
                        {generateMonthOptions().map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                      <span className="text-[16px] text-[#323232]">月まで</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 業界・職種 */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  業界・職種
                </label>
                <div className="flex-1 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: true, targetType: 'industry', targetIndex: -1 })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-left hover:border-blue-400 transition-colors"
                  >
                    <span className="text-[#666]">業界: </span>
                    <span className="text-[#323232]">
                      {formData.recentJobIndustries.length > 0 ? formData.recentJobIndustries.join(', ') : '選択してください'}
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setModalState({ isOpen: true, targetType: 'jobtype', targetIndex: -1 })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-left hover:border-blue-400 transition-colors"
                  >
                    <span className="text-[#666]">職種: </span>
                    <span className="text-[#323232]">
                      {formData.recentJobTypes.length > 0 ? formData.recentJobTypes.join(', ') : '選択してください'}
                    </span>
                  </button>
                </div>
              </div>

              {/* 職務内容 */}
              <div className="flex items-start gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0 pt-2">
                  職務内容
                </label>
                <textarea
                  value={formData.recentJobDescription}
                  onChange={(e) => handleInputChange('recentJobDescription', e.target.value)}
                  rows={4}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="職務内容を入力してください"
                />
              </div>
            </div>

            {/* 学歴・経験業種/職種 */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                学歴・経験業種/職種
              </span>
            </div>

            <div className="mb-12 space-y-8">
              {/* 学歴 */}
              <div className="space-y-6">
                <h3 className="text-[16px] font-bold text-[#323232] tracking-[1.6px]">学歴</h3>
                
                <div className="flex items-center gap-8">
                  <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                    最終学歴
                  </label>
                  <div className="flex-1">
                    <select
                      value={education.final_education}
                      onChange={(e) => handleEducationChange('final_education', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                      style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
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

                <div className="flex items-center gap-8">
                  <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                    学校名
                  </label>
                  <input
                    type="text"
                    value={education.school_name}
                    onChange={(e) => handleEducationChange('school_name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="学校名を入力してください"
                  />
                </div>

                <div className="flex items-center gap-8">
                  <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                    学部・学科
                  </label>
                  <input
                    type="text"
                    value={education.department}
                    onChange={(e) => handleEducationChange('department', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="学部・学科を入力してください"
                  />
                </div>

                <div className="flex items-center gap-8">
                  <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                    卒業年月
                  </label>
                  <div className="flex-1 flex gap-4 items-center">
                    <select
                      value={education.graduation_year || ''}
                      onChange={(e) => handleEducationChange('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
                      className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                      style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                    >
                      <option value="">年</option>
                      {generateYearOptions(1960).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-[16px] text-[#323232]">年</span>
                    <select
                      value={education.graduation_month || ''}
                      onChange={(e) => handleEducationChange('graduation_month', e.target.value ? parseInt(e.target.value) : null)}
                      className="px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                      style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                    >
                      <option value="">月</option>
                      {generateMonthOptions().map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <span className="text-[16px] text-[#323232]">月</span>
                  </div>
                </div>
              </div>

              {/* 業種経験 */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-[#323232] tracking-[1.6px]">業種経験</h3>
                  <button
                    type="button"
                    onClick={addWorkExperience}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-colors"
                  >
                    追加
                  </button>
                </div>

                {workExperience.map((exp, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-[5px]">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={exp.industry_name}
                        onChange={(e) => updateWorkExperience(index, 'industry_name', e.target.value)}
                        placeholder="業界名を入力してください"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={exp.experience_years}
                        onChange={(e) => updateWorkExperience(index, 'experience_years', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-[16px] text-[#323232]">年</span>
                    {workExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 職種経験 */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-[16px] font-bold text-[#323232] tracking-[1.6px]">職種経験</h3>
                  <button
                    type="button"
                    onClick={addJobTypeExperience}
                    className="px-4 py-2 text-sm bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-colors"
                  >
                    追加
                  </button>
                </div>

                {jobTypeExperience.map((exp, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-[5px]">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={exp.job_type_name}
                        onChange={(e) => updateJobTypeExperience(index, 'job_type_name', e.target.value)}
                        placeholder="職種名を入力してください"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        value={exp.experience_years}
                        onChange={(e) => updateJobTypeExperience(index, 'experience_years', parseInt(e.target.value) || 0)}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <span className="text-[16px] text-[#323232]">年</span>
                    {jobTypeExperience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeJobTypeExperience(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 資格・語学・スキル */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                資格・語学・スキル
              </span>
            </div>

            <div className="mb-12 space-y-6">
              {/* 英語レベル */}
              <div className="flex items-center gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0">
                  英語レベル
                </label>
                <div className="flex-1">
                  <select
                    value={skills.english_level}
                    onChange={(e) => handleSkillsChange('english_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-right-3 bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23666' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")`,
                      backgroundSize: '12px' 
                    }}
                  >
                    <option value="none">なし</option>
                    <option value="basic">日常会話レベル</option>
                    <option value="business">ビジネスレベル</option>
                    <option value="native">ネイティブレベル</option>
                  </select>
                </div>
              </div>

              {/* スキル */}
              <div className="flex items-start gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0 pt-2">
                  スキル
                </label>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSkillTagAdd();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="スキルを入力してEnterキーで追加"
                    />
                    <button
                      type="button"
                      onClick={handleSkillTagAdd}
                      className="px-4 py-2 bg-blue-500 text-white rounded-[5px] hover:bg-blue-600 transition-colors"
                    >
                      追加
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.skills_tags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleSkillTagRemove(tag)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 保有資格 */}
              <div className="flex items-start gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0 pt-2">
                  保有資格
                </label>
                <textarea
                  value={skills.qualifications}
                  onChange={(e) => handleSkillsChange('qualifications', e.target.value)}
                  rows={4}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="保有資格を入力してください"
                />
              </div>
            </div>

            {/* 職務要約・自己PR */}
            <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6 mb-8">
              <div className="flex-1 h-px relative">
                <div className="absolute inset-[-1px_-0.3%]">
                  <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                  </svg>
                </div>
              </div>
              <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                職務要約・自己PR
              </span>
            </div>

            <div className="mb-12 space-y-6">
              {/* 職務要約 */}
              <div className="flex items-start gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0 pt-2">
                  職務要約
                </label>
                <textarea
                  value={formData.jobSummary}
                  onChange={(e) => handleInputChange('jobSummary', e.target.value)}
                  rows={4}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="職務要約を入力してください"
                />
              </div>

              {/* 自己PR・その他 */}
              <div className="flex items-start gap-8">
                <label className="text-[16px] font-bold text-[#323232] tracking-[1.6px] w-32 text-right shrink-0 pt-2">
                  自己PR・その他
                </label>
                <textarea
                  value={formData.selfPr}
                  onChange={(e) => handleInputChange('selfPr', e.target.value)}
                  rows={4}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-[5px] text-[16px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="自己PRやその他の情報を入力してください"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <AdminButton 
                text={isSubmitting ? "準備中..." : "確認へ進む"} 
                variant="green-gradient" 
                size="figma-default"
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
          initialSelected={[]}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'jobtype' && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={() => setModalState({ isOpen: false, targetType: null, targetIndex: null })}
          onConfirm={handleJobTypeConfirm}
          initialSelected={[]}
        />
      )}
    </>
  );
}