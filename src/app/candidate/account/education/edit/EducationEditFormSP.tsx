'use client';
import { Button } from '@/components/ui/button';
import EducationSection from '@/components/education/EducationSection';
import IndustrySection from '@/components/education/IndustrySection';
import JobTypeSection from '@/components/education/JobTypeSection';
import { FormActions } from '@/components/education/common/FormActions';
import { EducationEditFormProps } from './types/education';

export default function EducationEditFormSP(props: EducationEditFormProps) {
  const {
    register,
    errors,
    watch,
    isSubmitting,
    selectedIndustries,
    selectedJobTypes,
    yearOptions,
    monthOptions,
    removeIndustry,
    updateIndustryExperience,
    removeJobType,
    updateJobTypeExperience,
    handleCancel,
    setIsIndustryModalOpen,
    setIsJobTypeModalOpen,
  } = props;
  return (
    <main className='flex flex-col'>
      {/* Hero Section with Gradient */}
      <div className='bg-gradient-to-b from-[#229a4e] to-[#17856f] px-4 py-6'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
            プロフィール確認・編集
          </span>
          <svg width='8' height='14' viewBox='0 0 8 14' fill='none'>
            <path d='M1 1L7 7L1 13' stroke='#FFFFFF' strokeWidth='2' />
          </svg>
          <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
            学歴・経験業種/職種 編集
          </span>
        </div>
        {/* Title */}
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 flex items-center justify-center'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M6.26127 0H14.2357H14.8533L15.2901 0.435984L21.3277 6.47353L21.7637 6.90989V7.52747V19.9734C21.7637 22.1933 19.9574 24 17.7371 24H6.26122C4.04178 24 2.2355 22.1933 2.2355 19.9734V4.02572C2.23555 1.80581 4.04178 0 6.26127 0ZM3.72631 19.9734C3.72631 21.3738 4.86125 22.5092 6.26122 22.5092H17.7371C19.1375 22.5092 20.2729 21.3738 20.2729 19.9734V7.52752H16.3485C15.1822 7.52752 14.2357 6.58144 14.2357 5.41467V1.49072H6.26122C4.86125 1.49072 3.72631 2.62612 3.72631 4.02567V19.9734Z'
                fill='white'
              />
              <path
                d='M7.93473 7.47266C8.29417 7.72423 8.73179 7.87283 9.20279 7.87283C9.67417 7.87283 10.1114 7.72423 10.4713 7.47266C11.1002 7.74336 11.4866 8.21806 11.7223 8.63736C12.0354 9.19348 11.7899 9.98075 11.2492 9.98075C10.7078 9.98075 9.20279 9.98075 9.20279 9.98075C9.20279 9.98075 7.6982 9.98075 7.15675 9.98075C6.61572 9.98075 6.36986 9.19348 6.68331 8.63736C6.91904 8.21802 7.30539 7.74336 7.93473 7.47266Z'
                fill='white'
              />
              <path
                d='M9.20245 7.34452C8.27793 7.34452 7.52929 6.59588 7.52929 5.67178V5.27081C7.52929 4.34756 8.27793 3.59766 9.20245 3.59766C10.1265 3.59766 10.876 4.34756 10.876 5.27081V5.67178C10.876 6.59588 10.1265 7.34452 9.20245 7.34452Z'
                fill='white'
              />
              <path
                d='M6.65438 12.2031H17.4541V13.2518H6.65438V12.2031Z'
                fill='white'
              />
              <path
                d='M6.5997 15.3516H17.3994V16.4006H6.5997V15.3516Z'
                fill='white'
              />
              <path
                d='M6.63917 18.4961H14.1992V19.5444H6.63917V18.4961Z'
                fill='white'
              />
            </svg>
          </div>
          <h1 className='text-white text-[20px] font-bold tracking-[2px]'>
            学歴・経験業種/職種 編集
          </h1>
        </div>
      </div>
      {/* Form Content */}
      <div className='bg-[#f9f9f9] px-4 py-6 flex flex-col items-center gap-6 min-h-[730px]'>
        <div className='bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 pb-6 pt-10 w-full'>
          {/* Description */}
          <div className='mb-10'>
            <p className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] font-bold'>
              学歴・経験業種/職種を編集できます。
            </p>
          </div>
          {/* 学歴 Section */}
          <div className='mb-10'>
            <h2 className='text-[#323232] text-[18px] font-bold tracking-[1.8px] mb-2'>
              学歴
            </h2>
            <div className='flex flex-col gap-6'>
              <EducationSection
                register={register}
                errors={errors}
                watch={watch}
                yearOptions={yearOptions}
                monthOptions={monthOptions}
              />
            </div>
          </div>
          {/* 今までに経験した業種・職種 Section */}
          <div>
            <h2 className='text-[#323232] text-[18px] font-bold tracking-[1.8px] mb-4'>
              今までに経験した業種・職種
            </h2>
            <div className='flex flex-col gap-6'>
              {/* 業種 */}
              <IndustrySection
                selectedIndustries={selectedIndustries}
                errors={errors.industries}
                onSelect={() => setIsIndustryModalOpen(true)}
                onRemove={removeIndustry}
                onExperienceChange={updateIndustryExperience}
                variant='sp'
              />
              {/* 職種 */}
              <JobTypeSection
                selectedJobTypes={selectedJobTypes}
                errors={errors.jobTypes}
                onSelect={() => setIsJobTypeModalOpen(true)}
                onRemove={removeJobType}
                onExperienceChange={updateJobTypeExperience}
                variant='sp'
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <FormActions
          onCancel={handleCancel}
          onSubmit={undefined}
          isSubmitting={isSubmitting}
          variant='sp'
        />
      </div>
    </main>
  );
}
