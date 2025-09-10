
import React from 'react';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import FormRow from '@/components/education/common/FormRow';
import { RemoveButton } from '@/components/education/common/RemoveButton';

interface JobHistoryEditRowProps {
  index: number;
  register: any;
  watch: any;
  setValue: any;
  remove: (index: number) => void;
  openIndustryModal: (index: number) => void;
  openJobTypeModal: (index: number) => void;
  selectedIndustries: Array<{ id: string; name: string }>;
  selectedJobTypes: Array<{ id: string; name: string }>;
  errors: any;
  monthOptions: Array<{ value: string; label: string }>;
  yearOptions: Array<{ value: string; label: string }>;
  removeIndustry: (index: number, industryId: string) => void;
  removeJobType: (index: number, jobTypeId: string) => void;
}

const JobHistoryEditRow: React.FC<JobHistoryEditRowProps> = ({
  index,
  register,
  watch,
  setValue,
  remove,
  openIndustryModal,
  openJobTypeModal,
  selectedIndustries,
  selectedJobTypes,
  errors,
  monthOptions,
  yearOptions,
  removeIndustry,
  removeJobType,
}) => {
  return (
    <div className='relative'>
      {/* 削除ボタン */}
      {index > 0 && (
        <RemoveButton
          onClick={() => remove(index)}
          ariaLabel='職歴を削除'
          className='absolute top-4 right-4 w-6 h-6 flex items-center justify-center'
        />
      )}
      <div className='space-y-6 lg:space-y-2'>
        {/* 企業名 */}
        <FormRow
          label='企業名'
          error={errors?.jobHistories?.[index]?.companyName?.message}
        >
          <CompanyNameInput
            value={watch(`jobHistories.${index}.companyName`) || ''}
            onChange={value =>
              setValue(`jobHistories.${index}.companyName`, value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            placeholder='企業名を入力'
            className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]'
          />
        </FormRow>
        {/* 部署名・役職名 */}
        <FormRow label='部署名・役職名'>
          <input
            type='text'
            {...register(`jobHistories.${index}.departmentPosition`)}
            placeholder='部署名・役職名を入力'
            className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]'
          />
        </FormRow>
        {/* 在籍期間 */}
        <FormRow
          label='在籍期間'
          error={
            errors?.jobHistories?.[index]?.startYear?.message ||
            errors?.jobHistories?.[index]?.startMonth?.message
          }
        >
          <div className='flex flex-wrap items-center gap-2'>
            <select
              {...register(`jobHistories.${index}.startYear`)}
              className='bg-white border font-bold border-[#999999] rounded-[5px] px-3 py-2 pr-4 text-[16px] text-[#323232] tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
            >
              <option value=''>未選択</option>
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
              年
            </span>
            <select
              {...register(`jobHistories.${index}.startMonth`)}
              className='bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
            >
              <option value=''>未選択</option>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
              月
            </span>
            <span className='mx-2'>〜</span>
            <select
              {...register(`jobHistories.${index}.endYear`)}
              className='bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-4 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
            >
              <option value=''>未選択</option>
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
              年
            </span>
            <select
              {...register(`jobHistories.${index}.endMonth`)}
              className='bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
            >
              <option value=''>未選択</option>
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
              月
            </span>
            {/* 在籍中チェックボックス */}
            <div className='flex items-center gap-2 ml-4'>
              <input
                type='checkbox'
                checked={
                  watch(`jobHistories.${index}.isCurrentlyWorking`) || false
                }
                onChange={() =>
                  setValue(
                    `jobHistories.${index}.isCurrentlyWorking`,
                    !watch(`jobHistories.${index}.isCurrentlyWorking`)
                  )
                }
                className='w-5 h-5 cursor-pointer accent-[#0f9058]'
                id={`currentlyWorking-${index}`}
              />
              <label
                htmlFor={`currentlyWorking-${index}`}
                className='text-[16px] text-[#323232] font-bold tracking-[1.6px] cursor-pointer'
              >
                在籍中
              </label>
            </div>
          </div>
        </FormRow>
        {/* 業種 */}
        <FormRow label='業種'>
          <button
            type='button'
            onClick={() => openIndustryModal(index)}
            className='w-full lg:w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]'
          >
            業種を選択
          </button>
          <div className='flex flex-wrap gap-2 mt-2'>
            {selectedIndustries?.map(industry => (
              <div
                key={industry.id}
                className='bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5'
              >
                <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                  {industry.name}
                </span>
                <button
                  type='button'
                  className='w-3 h-3'
                  onClick={() => removeIndustry(index, industry.id)}
                >
                  <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                    <path
                      d='M1 1L11 11M1 11L11 1'
                      stroke='#0f9058'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </FormRow>
        {/* 職種 */}
        <FormRow label='職種'>
          <button
            type='button'
            onClick={() => openJobTypeModal(index)}
            className='w-full lg:w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]'
          >
            職種を選択
          </button>
          <div className='flex flex-wrap gap-2 mt-2'>
            {selectedJobTypes?.map(jobType => (
              <div
                key={jobType.id}
                className='bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5'
              >
                <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                  {jobType.name}
                </span>
                <button
                  type='button'
                  className='w-3 h-3'
                  onClick={() => removeJobType(index, jobType.id)}
                >
                  <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                    <path
                      d='M1 1L11 11M1 11L11 1'
                      stroke='#0f9058'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </FormRow>
        {/* 業務内容 */}
        <FormRow label='業務内容'>
          <textarea
            {...register(`jobHistories.${index}.jobDescription`)}
            placeholder='業務内容を入力'
            rows={5}
            className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-3 text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058] resize-none'
          />
        </FormRow>
      </div>
    </div>
  );
};

export default JobHistoryEditRow;
