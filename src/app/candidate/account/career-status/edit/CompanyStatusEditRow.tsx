import React from 'react';
import FormRow from '@/components/education/common/FormRow';
import {
  PROGRESS_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
} from '@/constants/career-status';

interface CompanyStatusEditRowProps {
  index: number;
  register: any;
  watch: any;
  setValue: any;
  removeCompany: (index: number) => void;
  getSelectedIndustries: (index: number) => string[];
  setCurrentModalIndex: (index: number) => void;
  removeIndustry: (index: number, industryName: string) => void;
}

const CompanyStatusEditRow: React.FC<CompanyStatusEditRowProps> = ({
  index,
  register,
  watch,
  setValue,
  removeCompany,
  getSelectedIndustries,
  removeIndustry,
  setCurrentModalIndex,
}) => {
  return (
    <div className='relative border border-[#dcdcdc] rounded-[10px] p-4 lg:p-6 mb-6'>
      {/* 公開範囲 */}
      <FormRow label='公開範囲'>
        <div className='flex items-start gap-2'>
          <div
            className='w-5 h-5 mt-1 cursor-pointer'
            onClick={() => {
              const currentValue = watch(
                `selectionCompanies.${index}.isPrivate`
              );
              setValue(`selectionCompanies.${index}.isPrivate`, !currentValue, {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z'
                fill={
                  watch(`selectionCompanies.${index}.isPrivate`)
                    ? '#0F9058'
                    : '#DCDCDC'
                }
              />
            </svg>
          </div>
          <div className='flex-1'>
            <span className='block text-[16px] text-[#323232] font-bold tracking-[1.6px]'>
              企業名を非公開（業種・進捗のみ公開）
            </span>
            <span className='block text-[14px] text-[#999999] font-medium tracking-[1.4px] mt-1'>
              企業に選考状況を伝えることで、
              <br className='hidden lg:block' />
              スカウトの質やあなたへの興味度が高まりやすくなります。
              <br className='hidden lg:block' />
              ※選考中の企業には自動で非公開になります。
            </span>
          </div>
        </div>
      </FormRow>
      {/* 業種 */}
      <FormRow label='業種'>
        <button
          type='button'
          onClick={() => setCurrentModalIndex(index)}
          className='px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-full lg:w-fit'
        >
          業種を選択
        </button>
        <div className='flex flex-wrap gap-2 mt-2'>
          {getSelectedIndustries(index)?.map(industryName => (
            <div
              key={industryName}
              className='bg-[#d2f1da] px-6 py-2 rounded-[10px] flex items-center gap-2'
            >
              <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                {industryName}
              </span>
              <button
                type='button'
                onClick={() => removeIndustry(index, industryName)}
              >
                <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                  <path
                    d='M1 1L11 11M1 11L11 1'
                    stroke='#0f9058'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </FormRow>
      {/* 企業名 */}
      <FormRow label='企業名'>
        <input
          type='text'
          {...register(`selectionCompanies.${index}.companyName`)}
          placeholder='企業名を入力'
          className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]'
        />
      </FormRow>
      {/* 部署名・役職名 */}
      <FormRow label='部署名・役職名'>
        <input
          type='text'
          {...register(`selectionCompanies.${index}.department`)}
          placeholder='部署名・役職名を入力'
          className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]'
        />
      </FormRow>
      {/* 進捗状況 */}
      <FormRow label='進捗状況'>
        <select
          {...register(`selectionCompanies.${index}.progressStatus`)}
          className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-12 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
        >
          <option value=''>未選択</option>
          {PROGRESS_STATUS_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormRow>
      {/* 辞退理由 - 辞退選択時のみ表示 */}
      {(watch(`selectionCompanies.${index}.progressStatus`) === '辞退' ||
        watch(`selectionCompanies.${index}.progressStatus`) === '不合格') && (
        <FormRow label='辞退理由'>
          <select
            {...register(`selectionCompanies.${index}.declineReason`)}
            className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-12 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
          >
            <option value=''>未選択</option>
            {DECLINE_REASON_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormRow>
      )}
      {/* 削除ボタン - 2個目以降のみ表示 */}
      {index > 0 && (
        <button
          type='button'
          onClick={() => removeCompany(index)}
          className='absolute top-4 right-4 w-6 h-6 flex items-center justify-center'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1 1L13 13M1 13L13 1'
              stroke='#999999'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CompanyStatusEditRow;