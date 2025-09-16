import React from 'react';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import FormRow from '@/components/education/common/FormRow';
import { RemoveButton } from '@/components/education/common/RemoveButton';
import { SelectInput } from '@/components/ui/select-input';
import { Checkbox } from '@/components/ui/checkbox';

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
          <div className='flex flex-col gap-3'>
            {/* 開始年月 */}
            <div className='flex items-center gap-2'>
              <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px] w-[90px]'>
                開始年月
              </span>
              <SelectInput
                options={[{ value: '', label: '未選択' }, ...yearOptions]}
                value={watch(`jobHistories.${index}.startYear`) || ''}
                onChange={value =>
                  setValue(`jobHistories.${index}.startYear`, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder='未選択'
                className='w-auto min-w-[100px]'
                radius={5}
              />
              <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
                年
              </span>
              <SelectInput
                options={[{ value: '', label: '未選択' }, ...monthOptions]}
                value={watch(`jobHistories.${index}.startMonth`) || ''}
                onChange={value =>
                  setValue(`jobHistories.${index}.startMonth`, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder='未選択'
                className='w-auto min-w-[80px]'
                radius={5}
              />
              <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
                月
              </span>
            </div>
            {/* 終了年月 */}
            <div className='flex items-center gap-2'>
              <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px] w-[90px]'>
                終了年月
              </span>
              <SelectInput
                options={[{ value: '', label: '未選択' }, ...yearOptions]}
                value={watch(`jobHistories.${index}.endYear`) || ''}
                onChange={value =>
                  setValue(`jobHistories.${index}.endYear`, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder='未選択'
                className='w-auto min-w-[100px]'
                radius={5}
              />
              <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
                年
              </span>
              <SelectInput
                options={[{ value: '', label: '未選択' }, ...monthOptions]}
                value={watch(`jobHistories.${index}.endMonth`) || ''}
                onChange={value =>
                  setValue(`jobHistories.${index}.endMonth`, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                placeholder='未選択'
                className='w-auto min-w-[80px]'
                radius={5}
              />
              <span className='text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
                月
              </span>
            </div>
            {/* 在籍中チェックボックス */}
            <div className='flex items-center gap-2 ml-[90px]'>
              <Checkbox
                id={`currentlyWorking-${index}`}
                label='在籍中'
                checked={
                  watch(`jobHistories.${index}.isCurrentlyWorking`) || false
                }
                onCheckedChange={checked =>
                  setValue(
                    `jobHistories.${index}.isCurrentlyWorking`,
                    !!checked
                  )
                }
                className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
              />
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
          <div className='border border-[#999999] rounded-[5px] p-1'>
            <textarea
              {...register(`jobHistories.${index}.jobDescription`)}
              placeholder='業務内容を入力'
              rows={5}
              className='w-full bg-white border-0 rounded-[5px] px-4 py-3 text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none resize-none'
            />
          </div>
        </FormRow>
      </div>
    </div>
  );
};

export default JobHistoryEditRow;
