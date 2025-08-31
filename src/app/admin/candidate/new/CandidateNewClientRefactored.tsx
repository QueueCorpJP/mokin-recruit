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
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import {
  JOB_CHANGE_TIMING_OPTIONS,
  CURRENT_ACTIVITY_STATUS_OPTIONS,
  PROGRESS_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
} from '@/constants/career-status';
import { useCandidateData } from '@/hooks/useCandidateData';
import { useCandidateModals } from '@/hooks/useCandidateModals';

export default function CandidateNewClientRefactored() {
  const router = useRouter();
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
    openIndustryModal,
    openJobTypeModal,
    closeModal,
    removeIndustryFromSelection,
    removeRecentJobIndustry,
    removeRecentJobType,
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

  // イベントリスナーの設定
  useEffect(() => {
    const handleDraftSave = () => {
      console.log('Saving draft...');
      alert('下書きを保存しました（実装予定）');
    };

    const handleConfirm = () => {
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
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder:text-[#999999]"
                  />
                  <input
                    type="text"
                    placeholder="名"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
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

              {/* その他のフィールドも同様にリファクタリング */}
              
            </section>

            {/* スキル入力セクションの改善版 */}
            <section className="mb-12">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                資格・語学・スキル
              </h3>
              
              {/* スキル入力 */}
              <div className="flex items-start gap-8 mb-6">
                <label className="text-sm font-medium text-gray-700 w-32 text-right shrink-0 pt-2">
                  スキル
                </label>
                <div className="w-[400px]">
                  <div className="flex gap-2 mb-2">
                    <textarea
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="業務で活かしたスキル・ツール・得意分野を入力してください"
                      className="flex-1 px-[11px] py-[11px] border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[80px] resize-none"
                    />
                    <button
                      type="button"
                      onClick={addSkillTag}
                      className="px-4 py-2 bg-[#0f9058] text-white rounded-[5px] text-[14px] font-bold self-start"
                    >
                      追加
                    </button>
                  </div>
                  
                  {/* スキルタグ表示 */}
                  {skills.skills_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.skills_tags.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                        >
                          <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                            {skill}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSkillTag(skill)}
                            className="w-3 h-3"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
                  
                  <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px] mt-2">
                    ※最低3つ以上のキーワードを選択/登録してください。（現在: {skills.skills_tags.length}個）
                  </p>
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
          initialSelected={formData.recentJobIndustries}
        />
      )}

      {modalState.isOpen && modalState.targetType === 'jobtype' && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={closeModal}
          onConfirm={handleJobTypeConfirm}
          initialSelected={formData.recentJobTypes}
        />
      )}
    </>
  );
}