'use client';
import { Button } from '@/components/ui/button';
import EducationSection from '@/components/education/EducationSection';
import IndustrySection from '@/components/education/IndustrySection';
import JobTypeSection from '@/components/education/JobTypeSection';
import { EducationEditFormProps } from './types/education';
import { FormActions } from '@/components/education/common/FormActions';

export default function EducationEditFormPC(props: EducationEditFormProps) {
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
      <div className='bg-gradient-to-b from-[#229a4e] to-[#17856f] px-20 py-10'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 mb-4'>
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
        <div className='flex items-center gap-4'>
          <div className='w-8 h-8 flex items-center justify-center'>
            <svg
              width='32'
              height='32'
              viewBox='0 0 32 32'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z'
                fill='white'
              />
              <path
                d='M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z'
                fill='white'
              />
              <path
                d='M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z'
                fill='white'
              />
              <path
                d='M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z'
                fill='white'
              />
              <path
                d='M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z'
                fill='white'
              />
              <path
                d='M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z'
                fill='white'
              />
            </svg>
          </div>
          <h1 className='text-white text-[24px] font-bold tracking-[2.4px]'>
            学歴・経験業種/職種 編集
          </h1>
        </div>
      </div>
      {/* Form Content */}
      <div className='bg-[#f9f9f9] px-20 py-10 flex flex-col items-center gap-10 min-h-[730px]'>
        <div className='bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-10 w-[728px]'>
          {/* Description */}
          <div className='mb-6'>
            <p className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] font-bold'>
              学歴・経験業種/職種を編集できます。
            </p>
          </div>
          {/* 学歴 Section */}
          <div className='mb-8'>
            <h2 className='text-[#323232] text-[20px] font-bold tracking-[2px] mb-2'>
              学歴
            </h2>
            <div className='border-b border-[#dcdcdc] mb-6'></div>
            <EducationSection
              register={register}
              errors={errors}
              watch={watch}
              yearOptions={yearOptions}
              monthOptions={monthOptions}
            />
          </div>
          {/* 今までに経験した業種・職種 Section */}
          <div>
            <h2 className='text-[#323232] text-[20px] font-bold tracking-[2px] mb-2'>
              今までに経験した業種・職種
            </h2>
            <div className='border-b border-[#dcdcdc] mb-6'></div>
            <div className='flex flex-col gap-2'>
              {/* 業種 */}
              <IndustrySection
                selectedIndustries={selectedIndustries}
                errors={errors.industries}
                onSelect={() => setIsIndustryModalOpen(true)}
                onRemove={removeIndustry}
                onExperienceChange={updateIndustryExperience}
                variant='pc'
              />
              {/* 職種 */}
              <JobTypeSection
                selectedJobTypes={selectedJobTypes}
                errors={errors.jobTypes}
                onSelect={() => setIsJobTypeModalOpen(true)}
                onRemove={removeJobType}
                onExperienceChange={updateJobTypeExperience}
                variant='pc'
              />
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <FormActions
          onCancel={handleCancel}
          onSubmit={undefined}
          isSubmitting={isSubmitting}
          variant='pc'
        />
      </div>
    </main>
  );
}
