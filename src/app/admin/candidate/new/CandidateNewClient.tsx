'use client';

import React, { useEffect, useCallback } from 'react';
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
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import {
  JOB_CHANGE_TIMING_OPTIONS,
  CURRENT_ACTIVITY_STATUS_OPTIONS,
  PROGRESS_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
} from '@/constants/career-status';
import { useCandidateData } from '@/hooks/useCandidateData';
import { useCandidateModals } from '@/hooks/useCandidateModals';

export default function CandidateNewClient() {
  const router = useRouter();
  
  // Handle language management
  const handleAddLanguage = () => {
    const currentLanguages = skills.other_languages || [];
    if (currentLanguages.length < 5) {
      updateSkills('other_languages', [...currentLanguages, { language: '', level: '' }]);
    }
  };

  const handleRemoveLanguage = (index) => {
    const currentLanguages = skills.other_languages || [];
    const newLanguages = currentLanguages.filter((_, i) => i !== index);
    updateSkills('other_languages', newLanguages);
  };

  const handleLanguageChange = (index, field, value) => {
    const currentLanguages = skills.other_languages || [];
    const newLanguages = [...currentLanguages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    updateSkills('other_languages', newLanguages);
  };

  // Handle skill input with Enter key
  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (skillInput.trim()) {
        addSkillTag();
      }
    }
  };
  
  const {
    formData,
    education,
    skills,
    selectionEntries,
    skillInput,
    memo,
    isSubmitting,
    updateFormData,
    updateEducation,
    updateSkills,
    updateSelectionEntry,
    addSelectionEntry,
    removeSelectionEntry,
    setSkillInput,
    addSkillTag,
    removeSkillTag,
    setMemo,
    setSubmitting,
    prepareConfirmationData,
    validateFormData,
    resetForm,
  } = useCandidateData();

  const {
    modalState,
    selectedIndustriesMap,
    handleIndustryConfirm,
    handleJobTypeConfirm,
    handleWorkStyleConfirm,
    openIndustryModal,
    openJobTypeModal,
    openWorkStyleModal,
    closeModal,
    removeIndustryFromSelection,
    removeRecentJobIndustry,
    removeRecentJobType,
    getModalInitialData,
  } = useCandidateModals();

  // 確認ページへの遷移処理
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    const validation = await validateFormData();
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    setSubmitting(true);
    
    try {
      const confirmData = prepareConfirmationData();
      
      // Navigate to confirmation page with data
      const params = new URLSearchParams();
      params.set('data', JSON.stringify(confirmData));
      router.push(`/admin/candidate/new/confirm?${params.toString()}`);
      
    } catch (error) {
      console.error('Error preparing candidate data:', error);
      alert('データの準備に失敗しました');
    } finally {
      setSubmitting(false);
    }
  }, [isSubmitting, validateFormData, setSubmitting, prepareConfirmationData, router]);

  useEffect(() => {
    const handleDraftSave = () => {
      // 下書き保存処理
      console.log('Saving draft...');
      alert('下書きを保存しました（実装予定）');
    };

    const handleConfirm = () => {
      // 確認処理
      handleSubmit();
    };

    window.addEventListener('candidate-new-draft', handleDraftSave);
    window.addEventListener('candidate-new-confirm', handleConfirm);

    return () => {
      window.removeEventListener('candidate-new-draft', handleDraftSave);
      window.removeEventListener('candidate-new-confirm', handleConfirm);
    };
  }, [handleSubmit]);

  return (
    <>
      <div className="min-h-screen">
        <div className="p-8">
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
                          onChange={(e) => updateFormData('email', e.target.value)}
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
                            value={formData.lastName}
                            onChange={(e) => updateFormData('lastName', e.target.value)}
                            className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                          />
                          <input
                            type="text"
                            placeholder="名"
                            autoComplete="off"
                            value={formData.firstName}
                            onChange={(e) => updateFormData('firstName', e.target.value)}
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
                            value={formData.lastNameKana}
                            onChange={(e) => updateFormData('lastNameKana', e.target.value)}
                            className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                          />
                          <input
                            type="text"
                            placeholder="メイ"
                            autoComplete="off"
                            value={formData.firstNameKana}
                            onChange={(e) => updateFormData('firstNameKana', e.target.value)}
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
                              onClick={() => updateFormData('gender', option.value)}
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
                              onChange={(e) => updateFormData('prefecture', e.target.value)}
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
                              value={formData.birthYear}
                              onChange={(e) => updateFormData('birthYear', e.target.value)}
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
                              value={formData.birthMonth}
                              onChange={(e) => updateFormData('birthMonth', e.target.value)}
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
                              value={formData.birthDay}
                              onChange={(e) => updateFormData('birthDay', e.target.value)}
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
                          value={formData.phoneNumber}
                          onChange={(e) => updateFormData('phoneNumber', e.target.value)}
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
                              value={formData.currentIncome}
                              onChange={(e) => updateFormData('currentIncome', e.target.value)}
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
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                          転職経験
                        </h4>
                        {/* 転職経験 */}
                        <div className="flex items-center gap-8 mb-6">
                          <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                            転職経験
                          </label>
                          <div className="w-[400px] flex gap-2">
                            <button
                              type="button"
                              onClick={() => updateFormData('hasCareerChange', 'yes')}
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
                              onClick={() => updateFormData('hasCareerChange', 'no')}
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
          
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                          転職活動状況
                        </h4>
                        {/* 転職希望時期 */}
                        <div className="flex items-center gap-8 mb-6">
                          <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                            転職希望時期
                          </label>
                          <div className="w-[400px]">
                            <div className="relative">
                              <select
                                value={formData.jobChangeTiming}
                                onChange={(e) => updateFormData('jobChangeTiming', e.target.value)}
                                className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                              >
                                <option value="">未選択</option>
                                {JOB_CHANGE_TIMING_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
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
          
                        {/* 現在の活動状況 */}
                        <div className="flex items-center gap-8 mb-6">
                          <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                            現在の活動状況
                          </label>
                          <div className="w-[400px]">
                            <div className="relative">
                              <select
                                value={formData.currentActivityStatus}
                                onChange={(e) => updateFormData('currentActivityStatus', e.target.value)}
                                className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                              >
                                <option value="">未選択</option>
                                {CURRENT_ACTIVITY_STATUS_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
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
                      </div>
          
                      {/* Divider */}
                      <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6">
                        <div className="flex-1 h-px relative">
                          <div className="absolute inset-[-1px_-0.3%]">
                            <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                              <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                          選考状況
                        </span>
                        <div className="flex-1 h-px relative">
                          <div className="absolute inset-[-1px_-0.3%]">
                            <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none">
                              <line x1="0" y1="0" x2="100" y2="0" stroke="#dcdcdc" strokeWidth="1" />
                          </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection Status Entries */}
                      {formData.currentActivityStatus !== 'not_started' && formData.currentActivityStatus !== 'researching' && formData.currentActivityStatus !== '' && (
                          <div className="flex flex-col gap-2 items-center w-[536px]">
                            {selectionEntries.map((entry, index) => (
                              <div
                                key={entry.id}
                                className="bg-[#f9f9f9] rounded-[10px] p-10 w-full flex flex-col gap-6 items-end relative"
                              >
                                {index > 0 && (
                                  <div
                                    className="absolute top-6 right-6 w-4 h-4 cursor-pointer"
                                    onClick={() => removeSelectionEntry(index)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                                      <path d="M14.8927 0.276093C15.2603 -0.0914467 15.8562 -0.09139 16.2238 0.276093C16.5914 0.64366 16.5914 1.23958 16.2238 1.60715L9.83123 7.99875L16.2248 14.3923L16.258 14.4275C16.5917 14.7968 16.5805 15.3672 16.2248 15.7234C15.8688 16.0793 15.2984 16.091 14.9289 15.7575L14.8937 15.7234L8.50017 9.3298L2.10662 15.7243L2.07146 15.7575C1.70198 16.0914 1.13164 16.0804 0.775562 15.7243C0.419562 15.3682 0.408556 14.7979 0.742359 14.4284L0.775562 14.3933L7.16912 7.99875L0.775562 1.60617C0.408165 1.23862 0.408127 0.642643 0.775562 0.275116C1.14308 -0.092404 1.73904 -0.0923087 2.10662 0.275116L8.50017 6.66769L14.8927 0.276093Z" fill="#999999" />
                                    </svg>
                                  </div>
                                )}
          
                                {/* Public Range Checkbox */}
                                <div className="flex flex-row gap-4 items-start w-full">
                                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-1 min-w-[130px] text-right">
                                    公開範囲
                                  </label>
                                  <div className="flex flex-row gap-2 items-start w-[400px]">
                                    <div
                                      className="w-5 h-5 mt-1 cursor-pointer"
                                      onClick={() => updateSelectionEntry(index, 'isPrivate', !entry.isPrivate)}
                                    >
                                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z" fill={entry.isPrivate ? '#0F9058' : '#DCDCDC'} />
                                      </svg>
                                    </div>
                                    <div className="flex flex-col gap-1 flex-1">
                                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                                        企業名を非公開（業種・進捗のみ公開）
                                      </span>
                                      <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] leading-[1.6]">
                                        企業に選考状況を伝えることで、<br />
                                        スカウトの質やあなたへの興味度が高まりやすくなります。<br />
                                        ※選考中の企業には自動で非公開になります。
                                      </p>
                                    </div>
                                  </div>
                                </div>
          
                                {/* Industry Selection */}
                                <div className="flex flex-row gap-4 items-start w-full">
                                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                                    業種
                                  </label>
                                  <div className="flex flex-col gap-2 w-[400px]">
                                    <button
                                      type="button"
                                      onClick={() => openIndustryModal(index)}
                                      className="px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-fit"
                                    >
                                      業種を選択
                                    </button>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedIndustriesMap[index]?.map((industry) => (
                                        <div key={industry} className="bg-[#d2f1da] px-6 py-2 rounded-[10px] flex items-center gap-2">
                                          <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                            {industry}
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => removeIndustryFromSelection(index, industry)}
                                          >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                              <path d="M1 1L11 11M1 11L11 1" stroke="#0F9058" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
          
                                {/* Company Name */}
                                <div className="flex flex-row gap-4 items-start w-full">
                                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                                    企業名
                                  </label>
                                  <CompanyNameInput
                                    value={entry.companyName}
                                    onChange={(value) => updateSelectionEntry(index, 'companyName', value)}
                                    placeholder="企業名を入力"
                                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                                  />
                                </div>
          
                                {/* Department */}
                                <div className="flex flex-row gap-4 items-start w-full">
                                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                                    部署名・役職名
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="部署名・役職名を入力"
                                    value={entry.department || ''}
                                    onChange={(e) => updateSelectionEntry(index, 'department', e.target.value)}
                                    className="w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                                  />
                                </div>
          
                                {/* Progress Status */}
                                <div className="flex flex-row gap-4 items-start w-full">
                                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                                    進捗状況
                                  </label>
                                  <div className="w-[400px]">
                                    <div className="relative">
                                      <select
                                        value={entry.progressStatus}
                                        onChange={(e) => updateSelectionEntry(index, 'progressStatus', e.target.value)}
                                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                                      >
                                        <option value="">未選択</option>
                                        {PROGRESS_STATUS_OPTIONS.map((option) => (
                                          <option key={option.value} value={option.value}>
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                          <path d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z" fill="#0F9058" />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
          
                                {/* Decline Reason */}
                                {entry.progressStatus === 'declined' && (
                                  <div className="flex flex-row gap-4 items-start w-full">
                                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right">
                                      辞退理由
                                    </label>
                                    <div className="w-[400px]">
                                      <div className="relative">
                                        <select
                                          value={entry.declineReason || ''}
                                          onChange={(e) => updateSelectionEntry(index, 'declineReason', e.target.value)}
                                          className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                                        >
                                          <option value="">未選択</option>
                                          {DECLINE_REASON_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                              {option.label}
                                            </option>
                                          ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
                                            <path d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z" fill="#0F9058" />
                                          </svg>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
          
                            <button
                              type="button"
                              onClick={addSelectionEntry}
                              className="bg-white border border-[#0f9058] rounded-[32px] px-6 py-2.5 flex items-center gap-2"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 1.5V14.5M1.5 8H14.5" stroke="#0f9058" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                企業を追加
                              </span>
                            </button>
                          </div>
                        )}
                      
                    </section>
          
                    {/* 職務経歴 */}
                    <section className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                        職務経歴
                      </h3>
                      
                      {/* 職務経歴エントリ */}
                      {selectionEntries.map((entry, index) => (
                        <div key={entry.id} className="bg-[#f9f9f9] rounded-[10px] p-6 mb-6 relative">
                          {/* 削除ボタン（最初のエントリ以外） */}
                          {index > 0 && (
                            <div 
                              className="absolute top-4 right-4 w-4 h-4 cursor-pointer"
                              onClick={() => removeSelectionEntry(index)}
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M1 1L15 15M1 15L15 1" stroke="#999999" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                            </div>
                          )}
                          
                          {/* 会社名 */}
                          <div className="flex items-center gap-8 mb-6">
                            <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                              会社名
                            </label>
                            <CompanyNameInput
                              value={entry.companyName}
                              onChange={(value) => updateSelectionEntry(index, 'companyName', value)}
                              placeholder="企業名を入力"
                              className="w-[400px]"
                            />
                          </div>
          
                          {/* 部署・役職 */}
                          <div className="flex items-center gap-8 mb-6">
                            <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0">
                              部署・役職
                            </label>
                            <input
                              type="text"
                              value={entry.department}
                              onChange={(e) => updateSelectionEntry(index, 'department', e.target.value)}
                              className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px]"
                              placeholder="部署名・役職名を入力"
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
                                  value={entry.startYear || ''}
                                  onChange={(e) => updateSelectionEntry(index, 'startYear', e.target.value)}
                                  className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                                >
                                  <option value="">年</option>
                                  {generateYearOptions(1970).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                  ))}
                                </select>
                                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                                <select
                                  value={entry.startMonth || ''}
                                  onChange={(e) => updateSelectionEntry(index, 'startMonth', e.target.value)}
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
                                    checked={entry.isCurrentlyWorking || false}
                                    onChange={(e) => updateSelectionEntry(index, 'isCurrentlyWorking', e.target.checked)}
                                  />
                                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">現在も在籍中</span>
                                </label>
                              </div>
          
                              {!entry.isCurrentlyWorking && (
                                <div className="flex gap-4 items-center">
                                  <select
                                    value={entry.endYear || ''}
                                    onChange={(e) => updateSelectionEntry(index, 'endYear', e.target.value)}
                                    className="px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                                  >
                                    <option value="">年</option>
                                    {generateYearOptions(1970).map(year => (
                                      <option key={year} value={year}>{year}</option>
                                    ))}
                                  </select>
                                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">年</span>
                                  <select
                                    value={entry.endMonth || ''}
                                    onChange={(e) => updateSelectionEntry(index, 'endMonth', e.target.value)}
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
          
                          {/* 業種 */}
                          <div className="flex items-start gap-8 mb-6">
                            <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                              業種
                            </label>
                            <div className="w-[400px]">
                              <div className="flex flex-col gap-2">
                                <button
                                  type="button"
                                  className="w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                                  onClick={() => openIndustryModal(index + 1000)} // Use unique modal index for job history
                                >
                                  業種を選択
                                </button>
                                <div className="flex flex-wrap gap-2">
                                  {(entry.industries || []).map((industry, industryIndex) => (
                                    <div
                                      key={industryIndex}
                                      className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                                    >
                                      <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                        {industry}
                                      </span>
                                      <button
                                        type="button"
                                        className="w-3 h-3"
                                        onClick={() => {
                                          const newIndustries = [...(entry.industries || [])];
                                          newIndustries.splice(industryIndex, 1);
                                          updateSelectionEntry(index, 'industries', newIndustries);
                                        }}
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

                          {/* 職種 */}
                          <div className="flex items-start gap-8 mb-6">
                            <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                              職種
                            </label>
                            <div className="w-[400px]">
                              <div className="flex flex-col gap-2">
                                <button
                                  type="button"
                                  className="w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                                  onClick={() => openJobTypeModal(index + 2000)} // Use unique modal index for job history
                                >
                                  職種を選択
                                </button>
                                <div className="flex flex-wrap gap-2">
                                  {(entry.jobTypes || []).map((jobType, jobTypeIndex) => (
                                    <div
                                      key={jobTypeIndex}
                                      className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                                    >
                                      <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                        {jobType}
                                      </span>
                                      <button
                                        type="button"
                                        className="w-3 h-3"
                                        onClick={() => {
                                          const newJobTypes = [...(entry.jobTypes || [])];
                                          newJobTypes.splice(jobTypeIndex, 1);
                                          updateSelectionEntry(index, 'jobTypes', newJobTypes);
                                        }}
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

                          {/* 職務内容 */}
                          <div className="flex items-start gap-8 mb-6">
                            <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                              職務内容
                            </label>
                            <textarea
                              value={entry.jobDescription || ''}
                              onChange={(e) => updateSelectionEntry(index, 'jobDescription', e.target.value)}
                              rows={4}
                              className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                              placeholder="職務内容を入力してください"
                            />
                          </div>
                        </div>
                      ))}

                      {/* 職務経歴追加ボタン */}
                      <div className="flex justify-center mt-6">
                        <button
                          type="button"
                          onClick={addSelectionEntry}
                          className="px-8 py-3 bg-[#0F9058] text-white rounded-[32px] text-[16px] font-bold tracking-[1.6px] hover:bg-[#0d7a4a] transition-colors"
                        >
                          + 職務経歴を追加
                        </button>
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
                                onChange={(e) => updateEducation('final_education', e.target.value)}
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
                              onChange={(e) => updateEducation('school_name', e.target.value)}
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
                              onChange={(e) => updateEducation('department', e.target.value)}
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
                                onChange={(e) => updateEducation('graduation_year', e.target.value ? parseInt(e.target.value) : null)}
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
                                onChange={(e) => updateEducation('graduation_month', e.target.value ? parseInt(e.target.value) : null)}
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
                              onClick={() => openIndustryModal(-2)}
                              className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                            >
                              業種を選択
                            </button>
                            <div className="flex flex-wrap gap-2">
                              {formData.recentJobIndustries.map((industry, index) => (
                                <div
                                  key={index}
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                                >
                                  <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                    {industry}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeRecentJobIndustry(index)}
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
                              onClick={() => openJobTypeModal(-2)}
                              className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                            >
                              職種を選択
                            </button>
                            <div className="flex flex-wrap gap-2">
                              {formData.recentJobTypes.map((jobType, index) => (
                                <div
                                  key={index}
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                                >
                                  <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                    {jobType}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeRecentJobType(index)}
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
                              onChange={(e) => updateSkills('english_level', e.target.value)}
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

                      {/* その他の言語 */}
                      {skills.other_languages && skills.other_languages.map((field, index) => (
                        <div key={index} className="flex items-start gap-8 mb-6">
                          <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                            {index === 0 && 'その他の言語'}
                          </label>
                          <div className="w-[400px]">
                            <div className="flex gap-2 mb-2">
                              <div className="flex-1 relative">
                                <select
                                  value={field.language}
                                  onChange={(e) => handleLanguageChange(index, 'language', e.target.value)}
                                  className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                                >
                                  <option value="">言語を選択</option>
                                  <option value="indonesian">インドネシア語</option>
                                  <option value="italian">イタリア語</option>
                                  <option value="spanish">スペイン語</option>
                                  <option value="thai">タイ語</option>
                                  <option value="german">ドイツ語</option>
                                  <option value="french">フランス語</option>
                                  <option value="portuguese">ポルトガル語</option>
                                  <option value="malaysian">マレー語</option>
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
                              <div className="flex-1 relative">
                                <select
                                  value={field.level}
                                  onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
                                  disabled={!field.language}
                                  className="w-full px-[11px] py-[11px] pr-10 border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer disabled:opacity-50"
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
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLanguage(index)}
                                  className="px-3 py-2 text-red-600 border border-red-600 rounded-[5px] hover:bg-red-50"
                                >
                                  削除
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* 言語追加ボタン */}
                      {(!skills.other_languages || skills.other_languages.length < 5) && (
                        <div className="flex items-center gap-8 mb-6">
                          <div className="w-32"></div>
                          <button
                            type="button"
                            onClick={handleAddLanguage}
                            className="px-6 py-2.5 bg-white border border-[#0f9058] rounded-[32px] flex items-center gap-2"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path
                                d="M8 3V13M3 8H13"
                                stroke="#0f9058"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-[#0f9058] text-[14px] font-bold">言語を追加</span>
                          </button>
                        </div>
                      )}
          
                      {/* Skills Input */}
                      <div className="flex items-start gap-8 mb-6">
                        <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                          スキル
                        </label>
                        <div className="w-[400px]">
                          <div className="flex gap-2 mb-2">
                            <textarea
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              onKeyDown={handleSkillInputKeyDown}
                              placeholder="業務で活かしたスキル・ツール・得意分野を入力してください（Enterで追加）"
                              className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[80px] resize-none"
                            />
                          </div>
                          <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-2">
                            ※最低3つ以上のキーワードを選択/登録してください。
                          </p>
                          {skills.skills_tags.length > 0 && (
                            <div className="flex flex-col gap-2 mt-2">
                              {skills.skills_tags.map((skill, index) => (
                                <div
                                  key={index}
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5 w-fit"
                                >
                                  <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                    {skill}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeSkillTag(skill)}
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
                            onChange={(e) => updateSkills('qualifications', e.target.value)}
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
                          value={formData.jobSummary}
                          onChange={(e) => updateFormData('jobSummary', e.target.value)}
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
                          value={formData.selfPr}
                          onChange={(e) => updateFormData('selfPr', e.target.value)}
                          rows={4}
                          className="w-[400px] px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none"
                          placeholder="自己PRやその他の情報を入力してください"
                        />
                      </div>
                    </section>

                    {/* 希望条件 */}
                    <section className="mb-12">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                        希望条件
                      </h3>

                      {/* 興味のある働き方 */}
                      <div className="flex items-start gap-8">
                        <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                          興味のある働き方
                        </label>
                        <div className="flex-1">
                          <button
                            type="button"
                            onClick={() => openWorkStyleModal(-4)}
                            className="px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px] mb-4 w-fit"
                          >
                            興味のある働き方を選択
                          </button>
                          <div className="flex flex-wrap gap-2">
                            {formData.desiredWorkStyles?.map((workStyle, index) => (
                              <div
                                key={index}
                                className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                              >
                                <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                                  {workStyle}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newWorkStyles = formData.desiredWorkStyles?.filter((_, i) => i !== index) || [];
                                    updateFormData('desiredWorkStyles', newWorkStyles);
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
          onClose={closeModal}
          onConfirm={handleIndustryConfirm}
          initialSelected={getModalInitialData('industry', modalState.targetIndex || 0)}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'jobtype' && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleJobTypeConfirm}
          initialSelected={getModalInitialData('jobtype', modalState.targetIndex || 0)}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'workstyle' && (
        <WorkStyleSelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleWorkStyleConfirm}
          initialSelected={getModalInitialData('workstyle', modalState.targetIndex || 0)}
        />
      )}
    </>
  );
}