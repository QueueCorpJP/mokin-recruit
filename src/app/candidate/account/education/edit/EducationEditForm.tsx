'use client';

// Header/Footer はレイアウトで提供されるため本フォームでは描画しない
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import { useEducationForm } from './useEducationForm';
import EducationEditFormPC from './EducationEditFormPC';
import EducationEditFormSP from './EducationEditFormSP';

// 最終学歴の選択肢
// const educationOptions = [
//   '中学校卒業',
//   '高等学校卒業',
//   '高等専門学校卒業',
//   '短期大学卒業',
//   '専門学校卒業',
//   '大学卒業（学士）',
//   '大学院修士課程修了（修士）',
//   '大学院博士課程修了（博士）',
//   '海外大学卒業（学士）',
//   '海外大学院修了（修士・博士含む）',
//   'その他',
// ];

// 経験年数の選択肢
// const experienceYearOptions = [
//   '1年',
//   '2年',
//   '3年',
//   '4年',
//   '5年',
//   '6年',
//   '7年',
//   '8年',
//   '9年',
//   '10年',
//   '11年',
//   '12年',
//   '13年',
//   '14年',
//   '15年',
//   '16年',
//   '17年',
//   '18年',
//   '19年',
//   '20年以上',
// ];

export default function CandidateEducationEditPage() {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // useEducationFormからすべてのロジック・状態・ハンドラを受け取る
  const {
    register,
    handleSubmit,
    errors,
    watch,
    setValue,
    isSubmitting,
    setIsSubmitting,
    isIndustryModalOpen,
    setIsIndustryModalOpen,
    isJobTypeModalOpen,
    setIsJobTypeModalOpen,
    selectedIndustries,
    selectedJobTypes,
    yearOptions,
    monthOptions,
    handleIndustryConfirm,
    removeIndustry,
    updateIndustryExperience,
    handleJobTypeConfirm,
    removeJobType,
    updateJobTypeExperience,
  } = useEducationForm();

  useEffect(() => {
    // TODO: APIから既存のデータを取得
    // データが存在しない場合はデフォルト値を設定
  }, [setValue]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: APIを通じてデータを保存
      router.push('/account/education');
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className='min-h-screen flex flex-col'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isDesktop ? (
          <EducationEditFormPC
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            setValue={setValue}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            isIndustryModalOpen={isIndustryModalOpen}
            setIsIndustryModalOpen={setIsIndustryModalOpen}
            isJobTypeModalOpen={isJobTypeModalOpen}
            setIsJobTypeModalOpen={setIsJobTypeModalOpen}
            selectedIndustries={selectedIndustries}
            selectedJobTypes={selectedJobTypes}
            yearOptions={yearOptions}
            monthOptions={monthOptions}
            handleIndustryConfirm={handleIndustryConfirm}
            removeIndustry={removeIndustry}
            updateIndustryExperience={updateIndustryExperience}
            handleJobTypeConfirm={handleJobTypeConfirm}
            removeJobType={removeJobType}
            updateJobTypeExperience={updateJobTypeExperience}
            onSubmit={onSubmit}
            handleCancel={handleCancel}
          />
        ) : (
          <EducationEditFormSP
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            watch={watch}
            setValue={setValue}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            isIndustryModalOpen={isIndustryModalOpen}
            setIsIndustryModalOpen={setIsIndustryModalOpen}
            isJobTypeModalOpen={isJobTypeModalOpen}
            setIsJobTypeModalOpen={setIsJobTypeModalOpen}
            selectedIndustries={selectedIndustries}
            selectedJobTypes={selectedJobTypes}
            yearOptions={yearOptions}
            monthOptions={monthOptions}
            handleIndustryConfirm={handleIndustryConfirm}
            removeIndustry={removeIndustry}
            updateIndustryExperience={updateIndustryExperience}
            handleJobTypeConfirm={handleJobTypeConfirm}
            removeJobType={removeJobType}
            updateJobTypeExperience={updateJobTypeExperience}
            onSubmit={onSubmit}
            handleCancel={handleCancel}
          />
        )}
      </form>
      {/* Footer はレイアウトで描画済み */}
      {/* Modals */}
      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={handleIndustryConfirm}
        initialSelected={selectedIndustries.map(i => i.id)}
        maxSelections={3}
      />
      <JobTypeSelectModal
        isOpen={isJobTypeModalOpen}
        onClose={() => setIsJobTypeModalOpen(false)}
        onConfirm={handleJobTypeConfirm}
        initialSelected={selectedJobTypes.map(jt => jt.id)}
        maxSelections={3}
      />
    </div>
  );
}
