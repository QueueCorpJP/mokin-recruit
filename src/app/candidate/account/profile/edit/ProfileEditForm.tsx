'use client';

import { Button } from '@/components/ui/button';
import {
  GENDER_OPTIONS,
  INCOME_RANGES,
  PREFECTURES,
  generateDayOptions,
  generateMonthOptions,
  generateYearOptions,
} from '@/constants/profile';
import { useMediaQuery } from '@/hooks/useMediaQuery';
// import { useRouter } from 'next/navigation';
//
import { FormErrorMessage } from '../../_shared/fields/FormErrorMessage';
import { useProfileForm } from '../../_shared/hooks/useProfileForm';

interface CandidateData {
  last_name?: string;
  first_name?: string;
  last_name_kana?: string;
  first_name_kana?: string;
  gender?: string;
  prefecture?: string;
  birth_date?: string;
  phone_number?: string;
  current_income?: string;
}

interface ProfileEditFormProps {
  candidateData: CandidateData;
}

export default function ProfileEditForm({
  candidateData,
}: ProfileEditFormProps) {
  // useProfileFormカスタムフックでフォームロジックを共通化
  const {
    // register,
    handleSubmit,
    errors,
    setValue,
    watch,
    selectedGender,
    setSelectedGender,
    isSubmitting,
    handleSubmitForm,
    handleCancel,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  } = useProfileForm(candidateData);

  // const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // 生年月日の初期値は useProfileForm で管理
  const yearOptions = generateYearOptions();
  const monthOptions = generateMonthOptions();
  const dayOptions = generateDayOptions(
    watch('birthYear'),
    watch('birthMonth')
  );

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        {isDesktop ? (
          /* PC Version */
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
                  基本情報
                </span>
              </div>

              {/* Title */}
              <div className='flex items-center gap-2 lg:gap-4'>
                <div className='w-6 h-6 lg:w-8 lg:h-8'>
                  {/* プロフィールアイコン */}
                  <svg
                    className='w-6 h-6 lg:w-8 lg:h-8'
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
                <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
                  基本情報
                </h1>
              </div>
            </div>

            {/* Form Content */}
            <div className='bg-[#f9f9f9] px-20 py-10 flex flex-col items-center gap-10 min-h-[730px]'>
              <div className='bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-10 w-[728px]'>
                {/* Description */}
                <div className='mb-6'>
                  <p className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] font-bold'>
                    ご本人確認やご連絡のための基本情報を編集できます。
                    <br />
                    ※氏名はスカウトに返信した場合のみ企業に開示されます
                    <br />
                    ※電話番号は企業には公開されません
                  </p>
                </div>

                {/* Form Fields */}
                <div className='flex flex-col gap-2'>
                  {/* Name (Read-only) */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        氏名
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex gap-2'>
                        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
                          {candidateData.last_name || '未設定'}
                        </span>
                        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
                          {candidateData.first_name || '未設定'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Furigana (Read-only) */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        フリガナ
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex gap-2'>
                        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
                          {candidateData.last_name_kana || '未設定'}
                        </span>
                        <span className='text-[#323232] text-[16px] font-medium tracking-[1.6px]'>
                          {candidateData.first_name_kana || '未設定'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        性別
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      {/* hidden inputもselectedGenderをuseProfileFormから受け取る */}
                      <input
                        type='hidden'
                        name='gender'
                        value={selectedGender}
                      />
                      <div className='flex gap-2 w-[400px]'>
                        {GENDER_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type='button'
                            onClick={() => setSelectedGender(option.value)}
                            className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                              selectedGender === option.value
                                ? 'bg-[#0f9058] border-[#0f9058] text-white'
                                : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={errors.gender?.message ?? null}
                      />
                    </div>
                  </div>

                  {/* Current Address */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        現在の住まい
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='w-[400px] relative'>
                        <select
                          name='prefecture'
                          value={watch('prefecture')}
                          onChange={e =>
                            setValue('prefecture', e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer'
                        >
                          {PREFECTURES.map(prefecture => (
                            <option key={prefecture} value={prefecture}>
                              {prefecture}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                          <svg
                            width='14'
                            height='10'
                            viewBox='0 0 14 10'
                            fill='none'
                          >
                            <path
                              d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                              fill='#0F9058'
                            />
                          </svg>
                        </div>
                      </div>
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={errors.prefecture?.message ?? null}
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        生年月日
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='flex gap-2 items-center w-[400px]'>
                        <div className='relative flex-1'>
                          <select
                            name='birthYear'
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer'
                          >
                            {yearOptions.map(year => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                            <svg
                              width='14'
                              height='10'
                              viewBox='0 0 14 10'
                              fill='none'
                            >
                              <path
                                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                fill='#0F9058'
                              />
                            </svg>
                          </div>
                        </div>
                        <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                          年
                        </span>
                        <div className='relative flex-1'>
                          <select
                            name='birthMonth'
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer'
                          >
                            <option value=''>未選択</option>
                            {monthOptions.map(month => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                            <svg
                              width='14'
                              height='10'
                              viewBox='0 0 14 10'
                              fill='none'
                            >
                              <path
                                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                fill='#0F9058'
                              />
                            </svg>
                          </div>
                        </div>
                        <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                          月
                        </span>
                        <div className='relative flex-1'>
                          <select
                            name='birthDay'
                            value={watch('birthDay')}
                            onChange={e => setValue('birthDay', e.target.value)}
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer'
                          >
                            <option value=''>未選択</option>
                            {dayOptions.map(day => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                            <svg
                              width='14'
                              height='10'
                              viewBox='0 0 14 10'
                              fill='none'
                            >
                              <path
                                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                fill='#0F9058'
                              />
                            </svg>
                          </div>
                        </div>
                        <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                          日
                        </span>
                        {/* バリデーションエラー表示（共通部品） */}
                        <FormErrorMessage
                          error={
                            (errors.birthYear?.message as string | undefined) ||
                            (errors.birthMonth?.message as
                              | string
                              | undefined) ||
                            (errors.birthDay?.message as string | undefined) ||
                            null
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        連絡先電話番号
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='w-[400px]'>
                        <input
                          type='tel'
                          name='phoneNumber'
                          placeholder='08011112222'
                          value={watch('phoneNumber')}
                          onChange={e =>
                            setValue('phoneNumber', e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]'
                        />
                        {/* バリデーションエラー表示（共通部品） */}
                        <FormErrorMessage
                          error={errors.phoneNumber?.message ?? null}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Income */}
                  <div className='flex gap-6'>
                    <div className='w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 min-h-[50px] flex items-center'>
                      <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                        現在の年収
                      </label>
                    </div>
                    <div className='flex-1 py-6'>
                      <div className='w-[400px] relative'>
                        <select
                          name='currentIncome'
                          value={watch('currentIncome')}
                          onChange={e =>
                            setValue('currentIncome', e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className='w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer'
                        >
                          {INCOME_RANGES.map(income => (
                            <option key={income.value} value={income.value}>
                              {income.label}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                          <svg
                            width='14'
                            height='10'
                            viewBox='0 0 14 10'
                            fill='none'
                          >
                            <path
                              d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                              fill='#0F9058'
                            />
                          </svg>
                        </div>
                      </div>
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={errors.currentIncome?.message ?? null}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Outside the white card */}
              <div className='flex justify-center gap-4'>
                <Button
                  type='button'
                  variant='green-outline'
                  size='figma-default'
                  onClick={handleCancel}
                  className='min-w-[160px] text-[16px] tracking-[1.6px]'
                >
                  キャンセル
                </Button>
                <Button
                  type='submit'
                  variant='green-gradient'
                  size='figma-default'
                  disabled={isSubmitting}
                  className='min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? '保存中...' : '保存する'}
                </Button>
              </div>
            </div>
          </main>
        ) : (
          /* SP (Mobile) Version - 同様の構造でモバイル版 */
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
                  基本情報
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
                  基本情報
                </h1>
              </div>
            </div>

            {/* Form Content */}
            <div className='bg-[#f9f9f9] px-4 py-6 flex flex-col items-center gap-6 min-h-[730px]'>
              <div className='bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 pb-6 pt-10 w-full'>
                {/* Description */}
                <div className='mb-6'>
                  <p className='text-[#323232] text-[14px] leading-6 tracking-[1.4px] font-bold'>
                    ご本人確認やご連絡のための基本情報を編集できます。
                    <br />
                    ※氏名はスカウトに返信した場合のみ企業に開示されます
                    <br />
                    ※電話番号は企業には公開されません
                  </p>
                </div>

                {/* Form Fields */}
                <div className='space-y-6'>
                  {/* Name (Read-only) */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        氏名
                      </div>
                    </div>
                    <div className='px-4'>
                      <div className='flex gap-2 text-[16px] text-[#323232] tracking-[1.6px] font-medium'>
                        <span>{candidateData.last_name || '未設定'}</span>
                        <span>{candidateData.first_name || '未設定'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Furigana (Read-only) */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        フリガナ
                      </div>
                    </div>
                    <div className='px-4'>
                      <div className='flex gap-2 text-[16px] font-medium text-[#323232] tracking-[1.6px]'>
                        <span>{candidateData.last_name_kana || '未設定'}</span>
                        <span>{candidateData.first_name_kana || '未設定'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gender (SP版) */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        性別
                      </div>
                    </div>
                    <div className='px-4'>
                      {/* hidden inputもselectedGenderをuseProfileFormから受け取る */}
                      <input
                        type='hidden'
                        name='gender'
                        value={selectedGender}
                      />
                      <div className='flex gap-2'>
                        {GENDER_OPTIONS.map(option => (
                          <button
                            key={option.value}
                            type='button'
                            onClick={() => setSelectedGender(option.value)}
                            className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[14px] font-bold tracking-[1.4px] transition-colors ${
                              selectedGender === option.value
                                ? 'bg-[#0f9058] border-[#0f9058] text-white'
                                : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={
                          (errors.gender?.message as string | undefined) ?? null
                        }
                      />
                    </div>
                  </div>

                  {/* Current Address */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        現在の住まい
                      </div>
                    </div>
                    <div className='px-4'>
                      <div className='relative'>
                        <select
                          name='prefecture'
                          value={watch('prefecture')}
                          onChange={e =>
                            setValue('prefecture', e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[14px] text-[#323232] font-bold tracking-[1.4px] appearance-none cursor-pointer'
                        >
                          {PREFECTURES.map(prefecture => (
                            <option key={prefecture} value={prefecture}>
                              {prefecture}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                          <svg
                            width='14'
                            height='10'
                            viewBox='0 0 14 10'
                            fill='none'
                          >
                            <path
                              d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                              fill='#0F9058'
                            />
                          </svg>
                        </div>
                      </div>
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={
                          (errors.prefecture?.message as string | undefined) ??
                          null
                        }
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        生年月日
                      </div>
                    </div>
                    <div className='px-4'>
                      <div className='flex gap-2 items-center'>
                        <div className='relative flex-1'>
                          <select
                            name='birthYear'
                            value={selectedYear}
                            onChange={e => setSelectedYear(e.target.value)}
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[14px] text-[#323232] font-bold tracking-[1.4px] appearance-none cursor-pointer'
                          >
                            {yearOptions.map(year => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <div className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none'>
                            <svg
                              width='12'
                              height='8'
                              viewBox='0 0 14 10'
                              fill='none'
                            >
                              <path
                                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                fill='#0F9058'
                              />
                            </svg>
                          </div>
                        </div>
                        <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                          年
                        </span>
                        <div className='relative flex-1'>
                          <select
                            name='birthMonth'
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[14px] text-[#323232] font-bold tracking-[1.4px] appearance-none cursor-pointer'
                          >
                            <option value=''>未選択</option>
                            {monthOptions.map(month => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <div className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none'>
                            <svg
                              width='12'
                              height='8'
                              viewBox='0 0 14 10'
                              fill='none'
                            >
                              <path
                                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                fill='#0F9058'
                              />
                            </svg>
                          </div>
                        </div>
                        <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                          月
                        </span>
                        <div className='relative flex-1'>
                          <select
                            name='birthDay'
                            value={watch('birthDay')}
                            onChange={e => setValue('birthDay', e.target.value)}
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[14px] text-[#323232] font-bold tracking-[1.4px] appearance-none cursor-pointer'
                          >
                            <option value=''>未選択</option>
                            {dayOptions.map(day => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            ))}
                          </select>
                          <div className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none'>
                            <svg
                              width='12'
                              height='8'
                              viewBox='0 0 14 10'
                              fill='none'
                            >
                              <path
                                d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                                fill='#0F9058'
                              />
                            </svg>
                          </div>
                        </div>
                        <span className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                          日
                        </span>
                        {/* バリデーションエラー表示（共通部品） */}
                        <FormErrorMessage
                          error={
                            (errors.birthYear?.message as string | undefined) ||
                            (errors.birthMonth?.message as
                              | string
                              | undefined) ||
                            (errors.birthDay?.message as string | undefined) ||
                            null
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        連絡先電話番号
                      </div>
                    </div>
                    <div className='px-4'>
                      <input
                        type='tel'
                        name='phoneNumber'
                        placeholder='08011112222'
                        value={watch('phoneNumber')}
                        onChange={e =>
                          setValue('phoneNumber', e.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[14px] text-[#323232] font-medium tracking-[1.4px] placeholder:text-[#999999]'
                      />
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={
                          (errors.phoneNumber?.message as string | undefined) ??
                          null
                        }
                      />
                    </div>
                  </div>

                  {/* Current Income */}
                  <div>
                    <div className='bg-[#f9f9f9] rounded-[5px] px-4 py-2 mb-2'>
                      <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                        現在の年収
                      </div>
                    </div>
                    <div className='px-4'>
                      <div className='relative'>
                        <select
                          name='currentIncome'
                          value={watch('currentIncome')}
                          onChange={e =>
                            setValue('currentIncome', e.target.value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }
                          className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[14px] text-[#323232] font-bold tracking-[1.4px] appearance-none cursor-pointer'
                        >
                          {INCOME_RANGES.map(income => (
                            <option key={income.value} value={income.value}>
                              {income.label}
                            </option>
                          ))}
                        </select>
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                          <svg
                            width='14'
                            height='10'
                            viewBox='0 0 14 10'
                            fill='none'
                          >
                            <path
                              d='M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z'
                              fill='#0F9058'
                            />
                          </svg>
                        </div>
                      </div>
                      {/* バリデーションエラー表示（共通部品） */}
                      <FormErrorMessage
                        error={
                          (errors.currentIncome?.message as
                            | string
                            | undefined) ?? null
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='w-full px-4'>
                <div className='flex flex-col gap-4'>
                  <Button
                    type='submit'
                    variant='green-gradient'
                    size='figma-default'
                    disabled={isSubmitting}
                    className='w-full text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {isSubmitting ? '保存中...' : '保存する'}
                  </Button>
                  <Button
                    type='button'
                    variant='green-outline'
                    size='figma-default'
                    onClick={handleCancel}
                    className='w-full text-[16px] tracking-[1.6px]'
                  >
                    キャンセル
                  </Button>
                </div>
              </div>
            </div>
          </main>
        )}
      </form>
    </>
  );
}

//
