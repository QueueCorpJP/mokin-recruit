'use client';

import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import AutocompleteInput from '@/components/ui/AutocompleteInput';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useCompanyAutocomplete } from '@/hooks/useCompanyAutocomplete';
import type { Industry } from '@/constants/industry-data';
import type { JobType } from '@/constants/job-type-data';
import { saveRecentJobAction } from './actions';
import { useEffect } from 'react';

// フォームスキーマの定義
const recentJobSchema = z
  .object({
    companyName: z.string().min(1, '企業名を入力してください'),
    departmentPosition: z.string().min(1, '部署名・役職名を入力してください'),
    startYear: z.string().min(1, '開始年月を選択してください'),
    startMonth: z.string().min(1, '開始年月を選択してください'),
    endYear: z.string().optional(),
    endMonth: z.string().optional(),
    isCurrentlyWorking: z.boolean(),
    industries: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      )
      .min(1, '業種を1つ以上選択してください')
      .max(3),
    jobTypes: z
      .array(
        z.object({
          id: z.string(),
          name: z.string(),
        }),
      )
      .min(1, '職種を1つ以上選択してください')
      .max(3),
    jobDescription: z.string().min(1, '業務内容を入力してください'),
  })
  .superRefine((data, ctx) => {
    // 在職中でない場合は終了年月が必須
    if (!data.isCurrentlyWorking) {
      if (!data.endYear || data.endYear === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '終了年月を選択するか、「在職中」にチェックを入れてください',
          path: ['endYear'],
        });
      }
      if (!data.endMonth || data.endMonth === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '終了年月を選択するか、「在職中」にチェックを入れてください',
          path: ['endMonth'],
        });
      }
    }
  });

type RecentJobFormData = z.infer<typeof recentJobSchema>;

export default function SignupRecentJobPage() {
  const router = useRouter();
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<RecentJobFormData>({
    resolver: zodResolver(recentJobSchema),
    mode: 'onChange',
    defaultValues: {
      companyName: '',
      departmentPosition: '',
      startYear: '',
      startMonth: '',
      endYear: '',
      endMonth: '',
      isCurrentlyWorking: false,
      industries: [],
      jobTypes: [],
      jobDescription: '',
    },
  });

  const isCurrentlyWorking = watch('isCurrentlyWorking');
  const selectedIndustries = watch('industries');
  const selectedJobTypes = watch('jobTypes');
  const startYear = watch('startYear');
  const companyName = watch('companyName');

  // Company autocomplete
  const { suggestions: companySuggestions, loading: companyLoading } = useCompanyAutocomplete(companyName);

  // 年の選択肢を生成（1973年から現在の年まで）
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = currentYear; year >= 1973; year--) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear]);

  // 終了年の選択肢を生成（開始年から現在の年まで）
  const endYearOptions = useMemo(() => {
    if (!startYear) return [];
    const years = [];
    const startYearNum = parseInt(startYear);
    for (let year = currentYear; year >= startYearNum; year--) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear, startYear]);

  // 月の選択肢を生成（1〜12月）
  const monthOptions = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0'),
  );

  // Get user ID from cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const savedUserId = getCookieValue('signup_user_id');
      if (savedUserId) {
        setUserId(savedUserId);
      }
    }
  }, []);

  const onSubmit = async (data: RecentJobFormData) => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveRecentJobAction(data, userId);
      
      if (result.success) {
        router.push('/signup/resume');
      } else {
        console.error('Recent job save failed:', result.error);
        // You could add error state handling here
      }
    } catch (error) {
      console.error('Recent job save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // モーダルから選択された値を設定
  const handleIndustryConfirm = (industries: Industry[]) => {
    setValue('industries', industries, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  };

  const handleJobTypeConfirm = (jobTypes: JobType[]) => {
    setValue('jobTypes', jobTypes, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
  };

  // 在職中チェックボックスの切り替え
  const handleCurrentlyWorkingToggle = () => {
    const newValue = !isCurrentlyWorking;
    setValue('isCurrentlyWorking', newValue, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // 在職中の場合、終了年月をクリア
    if (newValue) {
      setValue('endYear', '', { shouldValidate: true });
      setValue('endMonth', '', { shouldValidate: true });
    }
  };

  // 業種・職種を削除
  const removeIndustry = (industryId: string) => {
    const updated = selectedIndustries.filter((i) => i.id !== industryId);
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeJobType = (jobTypeId: string) => {
    const updated = selectedJobTypes.filter((jt) => jt.id !== jobTypeId);
    setValue('jobTypes', updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <>
      {/* PC Version */}
      <div className="hidden lg:block">
        <main
          className="flex relative py-20 flex-col items-center justify-start"
          style={{
            backgroundImage: "url('/background-pc.svg')",
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Container */}
          <div className="bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center">
            {/* Title */}
            <div className="flex flex-col gap-6 items-center w-full">
              <h1 className="text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center">
                会員情報
              </h1>
            </div>

            {/* Progress Tabs */}
            <div className="flex flex-row w-full h-[45px]">
              <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    width="22"
                    height="25"
                    viewBox="0 0 22 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.0007 12.5C12.6172 12.5 14.1676 11.8679 15.3106 10.7426C16.4537 9.61742 17.0959 8.0913 17.0959 6.5C17.0959 4.9087 16.4537 3.38258 15.3106 2.25736C14.1676 1.13214 12.6172 0.5 11.0007 0.5C9.38409 0.5 7.83375 1.13214 6.69067 2.25736C5.54759 3.38258 4.90541 4.9087 4.90541 6.5C4.90541 8.0913 5.54759 9.61742 6.69067 10.7426C7.83375 11.8679 9.38409 12.5 11.0007 12.5ZM8.82446 14.75C4.13398 14.75 0.333984 18.4906 0.333984 23.1078C0.333984 23.8766 0.967318 24.5 1.74827 24.5H20.253C21.034 24.5 21.6673 23.8766 21.6673 23.1078C21.6673 18.4906 17.8673 14.75 13.1768 14.75H8.82446Z"
                      fill="#DCDCDC"
                    />
                  </svg>
                </div>
                <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                  基本情報
                </span>
              </div>
              <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.499 2.75011C12.499 2.15334 12.733 1.58102 13.1495 1.15904C13.5661 0.737064 14.131 0.5 14.7201 0.5C15.3092 0.5 15.8741 0.737064 16.2907 1.15904C16.7072 1.58102 16.9412 2.15334 16.9412 2.75011C16.9412 3.34688 16.7072 3.9192 16.2907 4.34118C15.8741 4.76315 15.3092 5.00022 14.7201 5.00022C14.131 5.00022 13.5661 4.76315 13.1495 4.34118C12.733 3.9192 12.499 3.34688 12.499 2.75011ZM10.9488 9.84264C10.9026 9.86139 10.8609 9.88015 10.8146 9.8989L10.4445 10.063C9.68557 10.4052 9.10253 11.0568 8.83877 11.8537L8.71846 12.2193C8.45933 13.0069 7.62178 13.4288 6.84439 13.1662C6.067 12.9037 5.65055 12.0553 5.90968 11.2677L6.02999 10.9021C6.5575 9.30355 7.72359 8.00037 9.24135 7.31596L9.61153 7.15189C10.574 6.72062 11.6152 6.4956 12.6702 6.4956C14.734 6.4956 16.5942 7.75192 17.3854 9.67857L18.098 11.4083L19.0883 11.9099C19.8194 12.2803 20.1156 13.1803 19.75 13.921C19.3844 14.6616 18.496 14.9616 17.7649 14.5913L16.5248 13.9678C16.0481 13.7241 15.6733 13.3209 15.4697 12.8194L15.0255 11.7412L14.1324 14.8116L16.4229 17.343C16.6728 17.6196 16.8487 17.9524 16.9412 18.3181L18.0055 22.6355C18.2045 23.4371 17.7232 24.2527 16.9273 24.4543C16.1314 24.6559 15.3309 24.1683 15.1319 23.3621L14.1139 19.2322L10.8424 15.6179C10.1576 14.8632 9.90305 13.8085 10.1622 12.8194L10.9442 9.84264H10.9488ZM8.27424 19.1572L9.43107 16.232C9.52824 16.3727 9.6393 16.5039 9.75498 16.6352L11.6383 18.7165L10.9673 20.4135C10.8563 20.6947 10.6897 20.9526 10.4768 21.1682L7.62178 24.0605C7.04337 24.6465 6.10402 24.6465 5.52561 24.0605C4.94719 23.4746 4.94719 22.5229 5.52561 21.937L8.27424 19.1572Z"
                      fill="#DCDCDC"
                    />
                  </svg>
                </div>
                <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                  転職活動状況
                </span>
              </div>
              <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#0f9058]">
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="19"
                    height="25"
                    viewBox="0 0 19 25"
                    fill="none"
                  >
                    <path
                      d="M2.83355 0.5C1.6067 0.5 0.611328 1.50781 0.611328 2.75V22.25C0.611328 23.4922 1.6067 24.5 2.83355 24.5H7.27799V20.75C7.27799 19.5078 8.27337 18.5 9.50022 18.5C10.7271 18.5 11.7224 19.5078 11.7224 20.75V24.5H16.1669C17.3937 24.5 18.3891 23.4922 18.3891 22.25V2.75C18.3891 1.50781 17.3937 0.5 16.1669 0.5H2.83355ZM3.57429 11.75C3.57429 11.3375 3.90762 11 4.31503 11H5.79651C6.20392 11 6.53725 11.3375 6.53725 11.75V13.25C6.53725 13.6625 6.20392 14 5.79651 14H4.31503C3.90762 14 3.57429 13.6625 3.57429 13.25V11.75ZM8.75948 11H10.241C10.6484 11 10.9817 11.3375 10.9817 11.75V13.25C10.9817 13.6625 10.6484 14 10.241 14H8.75948C8.35207 14 8.01874 13.6625 8.01874 13.25V11.75C8.01874 11.3375 8.35207 11 8.75948 11ZM12.4632 11.75C12.4632 11.3375 12.7965 11 13.2039 11H14.6854C15.0928 11 15.4261 11.3375 15.4261 11.75V13.25C15.4261 13.6625 15.0928 14 14.6854 14H13.2039C12.7965 14 12.4632 13.6625 12.4632 13.25V11.75ZM4.31503 5H5.79651C6.20392 5 6.53725 5.3375 6.53725 5.75V7.25C6.53725 7.6625 6.20392 8 5.79651 8H4.31503C3.90762 8 3.57429 7.6625 3.57429 7.25V5.75C3.57429 5.3375 3.90762 5 4.31503 5ZM8.01874 5.75C8.01874 5.3375 8.35207 5 8.75948 5H10.241C10.6484 5 10.9817 5.3375 10.9817 5.75V7.25C10.9817 7.6625 10.6484 8 10.241 8H8.75948C8.35207 8 8.01874 7.6625 8.01874 7.25V5.75ZM13.2039 5H14.6854C15.0928 5 15.4261 5.3375 15.4261 5.75V7.25C15.4261 7.6625 15.0928 8 14.6854 8H13.2039C12.7965 8 12.4632 7.6625 12.4632 7.25V5.75C12.4632 5.3375 12.7965 5 13.2039 5Z"
                      fill="#0F9058"
                    />
                  </svg>
                </div>
                <span className="text-[#0f9058] text-[18px] font-bold tracking-[1.8px]">
                  直近の在籍企業
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
              <p>直近の職務内容を教えてください。</p>
              <p>スカウトのマッチ度や企業からの関心が高まります。</p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6 w-fit items-end">
              {/* Company Name */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    企業名
                  </label>
                </div>
                <div className="w-[400px]">
                  <AutocompleteInput
                    value={companyName}
                    onChange={(value) => setValue('companyName', value, { shouldValidate: true })}
                    placeholder="企業名を入力"
                    suggestions={companySuggestions.map(c => ({ 
                      id: c.id, 
                      name: c.name, 
                      category: c.address 
                    }))}
                    loading={companyLoading}
                    className={errors.companyName ? 'border-red-500' : ''}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-red-500 text-[14px]">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Department/Position */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    部署名・役職名
                  </label>
                </div>
                <div className="w-[400px]">
                  <input
                    type="text"
                    placeholder="部署名・役職名を入力"
                    {...register('departmentPosition')}
                    className={`w-full px-[11px] py-[11px] bg-white border ${errors.departmentPosition ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]`}
                  />
                  {errors.departmentPosition && (
                    <p className="mt-1 text-red-500 text-[14px]">
                      {errors.departmentPosition.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    開始年月
                  </label>
                </div>
                <div className="w-[400px]">
                  <div className="flex flex-wrap gap-2 items-center">
                    <div className="relative">
                      <select
                        {...register('startYear')}
                        className={`px-[11px] py-[11px] pr-10 bg-white border ${errors.startYear ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                      >
                        <option value="">未選択</option>
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
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
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      年
                    </span>
                    <div className="relative">
                      <select
                        {...register('startMonth')}
                        className={`px-[11px] py-[11px] pr-10 bg-white border ${errors.startMonth ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                      >
                        <option value="">未選択</option>
                        {monthOptions.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
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
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      月
                    </span>
                  </div>
                </div>
              </div>

              {/* End Date */}
              {!isCurrentlyWorking && (
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      終了年月
                    </label>
                  </div>
                  <div className="w-[400px]">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative">
                          <select
                            {...register('endYear')}
                            className={`px-[11px] py-[11px] pr-10 bg-white border ${errors.endYear ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                          >
                            <option value="">未選択</option>
                            {endYearOptions.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
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
                        <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                          年
                        </span>
                        <div className="relative">
                          <select
                            {...register('endMonth')}
                            className={`px-[11px] py-[11px] pr-10 bg-white border ${errors.endMonth ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                          >
                            <option value="">未選択</option>
                            {monthOptions.map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
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
                        <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                          月
                        </span>
                      </div>
                      {(errors.endYear || errors.endMonth) && (
                        <p className="text-red-500 text-[14px]">
                          終了年月を選択するか、「在職中」にチェックを入れてください
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Currently Working Checkbox */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]"></label>
                </div>
                <div className="w-[400px]">
                  <div className="flex flex-row gap-2 items-center">
                    <div
                      className="w-5 h-5 cursor-pointer"
                      onClick={handleCurrentlyWorkingToggle}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                          fill={isCurrentlyWorking ? '#0F9058' : '#DCDCDC'}
                        />
                      </svg>
                    </div>
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      在籍中
                    </span>
                  </div>
                </div>
              </div>

              {/* Industry */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    業種
                  </label>
                </div>
                <div className="w-[400px]">
                  <div className="flex flex-col gap-2">
                    <button
                      className="w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      onClick={() => setIsIndustryModalOpen(true)}
                    >
                      業種を選択
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {selectedIndustries.map((industry) => (
                        <div
                          key={industry.id}
                          className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                        >
                          <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                            {industry.name}
                          </span>
                          <button
                            className="w-3 h-3"
                            onClick={() => removeIndustry(industry.id)}
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

              {/* Job Type */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    職種
                  </label>
                </div>
                <div className="w-[400px]">
                  <div className="flex flex-col gap-2">
                    <button
                      className="w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      onClick={() => setIsJobTypeModalOpen(true)}
                    >
                      職種を選択
                    </button>
                    <div className="flex flex-wrap gap-2">
                      {selectedJobTypes.map((jobType) => (
                        <div
                          key={jobType.id}
                          className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                        >
                          <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                            {jobType.name}
                          </span>
                          <button
                            className="w-3 h-3"
                            onClick={() => removeJobType(jobType.id)}
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

              {/* Job Description */}
              <div className="flex flex-row gap-4 items-start w-full">
                <div className="pt-[11px] min-w-[130px] text-right">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    業務内容
                  </label>
                </div>
                <div className="w-[400px]">
                  <textarea
                    placeholder="担当していた業務内容や役割を簡単にご記入ください。&#10;例）新規事業の立ち上げに従事。市場調査・事業計画の策定から、立ち上げ後のKPI設計・進捗管理までを担当"
                    {...register('jobDescription')}
                    className={`leading-[200%] w-full px-[11px] py-[11px] bg-white border ${errors.jobDescription ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[160px] resize-none`}
                  />
                  {errors.jobDescription && (
                    <p className="mt-1 text-red-500 text-[14px]">
                      {errors.jobDescription.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className={`px-10p py-[18px] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-[16px] font-bold tracking-[1.6px] min-w-[160px] ${
                isValid
                  ? 'bg-gradient-to-b from-[#229a4e] to-[#17856f] text-white cursor-pointer'
                  : 'bg-[#dcdcdc] text-[#999999] cursor-not-allowed'
              }`}
            >
              次へ
            </button>
          </div>
        </main>
      </div>
      {/* Mobile Version */}
      <div className="lg:hidden">
        <main
          className="flex relative pt-6 pb-20 flex-col items-center px-4"
          style={{
            backgroundImage: "url('/background-sp.svg')",
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Container */}
          <div className="bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 mx-4 w-full flex flex-col gap-10 items-center">
            {/* Progress Indicator */}
            <div className="flex flex-row gap-4 items-center w-full pb-4 border-b border-[#efefef]">
              <div className="relative w-[72px] h-[72px]">
                <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                  <circle
                    cx="36"
                    cy="36"
                    r="28.8"
                    stroke="#e0e0e0"
                    strokeWidth="7.2"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 36 36)"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r="28.8"
                    stroke="#0f9058"
                    strokeWidth="7.2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="180.96 0"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[#0f9058] text-[24px] font-medium tracking-[2.4px]">
                      3
                    </span>
                    <span className="text-[#999999] text-[17px] font-medium tracking-[1.7px]">
                      /3
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-[#999999] text-[16px] font-bold tracking-[1.6px]">
                  会員情報
                </p>
                <p className="text-[#0f9058] text-[20px] font-bold tracking-[2px]">
                  直近の在籍企業
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
              <p>
                直近の職務内容を教えてください。
                <br />
                スカウトのマッチ度や企業からの関心が高まります。
              </p>
            </div>

            {/* Form Fields */}
            <div className="flex flex-col gap-6 w-full">
              {/* Company Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  企業名
                </label>
                <AutocompleteInput
                  value={companyName}
                  onChange={(value) => setValue('companyName', value, { shouldValidate: true })}
                  placeholder="企業名を入力"
                  suggestions={companySuggestions.map(c => ({ 
                    id: c.id, 
                    name: c.name, 
                    category: c.address 
                  }))}
                  loading={companyLoading}
                  className={errors.companyName ? 'border-red-500' : ''}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-[14px]">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              {/* Department/Position */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  部署名・役職名
                </label>
                <input
                  type="text"
                  placeholder="部署名・役職名を入力"
                  {...register('departmentPosition')}
                  className={`w-full px-[11px] py-[11px] bg-white border ${errors.departmentPosition ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]`}
                />
                {errors.departmentPosition && (
                  <p className="text-red-500 text-[14px]">
                    {errors.departmentPosition.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  開始年月
                </label>
                <div className="flex gap-2 items-center">
                  <div className="relative flex-1">
                    <select
                      {...register('startYear')}
                      className={`w-full px-[11px] py-[11px] pr-10 bg-white border ${errors.startYear ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                    >
                      <option value="">未選択</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
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
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    年
                  </span>
                  <div className="relative flex-1">
                    <select
                      {...register('startMonth')}
                      className={`w-full px-[11px] py-[11px] pr-10 bg-white border ${errors.startMonth ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                    >
                      <option value="">未選択</option>
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      ))}
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
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    月
                  </span>
                </div>
                {(errors.startYear || errors.startMonth) && (
                  <p className="text-red-500 text-[14px]">
                    開始年月を選択してください
                  </p>
                )}
              </div>

              {/* End Date */}
              {!isCurrentlyWorking && (
                <div className="flex flex-col gap-2">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    終了年月
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <select
                        {...register('endYear')}
                        className={`w-full px-[11px] py-[11px] pr-10 bg-white border ${errors.endYear ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                      >
                        <option value="">未選択</option>
                        {endYearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
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
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      年
                    </span>
                    <div className="relative flex-1">
                      <select
                        {...register('endMonth')}
                        className={`w-full px-[11px] py-[11px] pr-10 bg-white border ${errors.endMonth ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer`}
                      >
                        <option value="">未選択</option>
                        {monthOptions.map((month) => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
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
                    <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      月
                    </span>
                  </div>
                  {(errors.endYear || errors.endMonth) && (
                    <p className="text-red-500 text-[14px]">
                      終了年月を選択するか、「在職中」にチェックを入れてください
                    </p>
                  )}
                </div>
              )}

              {/* Currently Working Checkbox */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <div
                    className="w-5 h-5 cursor-pointer"
                    onClick={handleCurrentlyWorkingToggle}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                        fill={isCurrentlyWorking ? '#0F9058' : '#DCDCDC'}
                      />
                    </svg>
                  </div>
                  <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    在籍中
                  </span>
                </div>
              </div>

              {/* Industry */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  業種
                </label>
                <button
                  className="w-full px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  onClick={() => setIsIndustryModalOpen(true)}
                >
                  業種を選択
                </button>
                <div className="flex flex-wrap gap-2">
                  {selectedIndustries.map((industry) => (
                    <div
                      key={industry.id}
                      className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                    >
                      <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                        {industry.name}
                      </span>
                      <button
                        className="w-3 h-3"
                        onClick={() => removeIndustry(industry.id)}
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
                {errors.industries && (
                  <p className="text-red-500 text-[14px]">
                    {errors.industries.message}
                  </p>
                )}
              </div>

              {/* Job Type */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  職種
                </label>
                <button
                  className="w-full px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  onClick={() => setIsJobTypeModalOpen(true)}
                >
                  職種を選択
                </button>
                <div className="flex flex-wrap gap-2">
                  {selectedJobTypes.map((jobType) => (
                    <div
                      key={jobType.id}
                      className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                    >
                      <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                        {jobType.name}
                      </span>
                      <button
                        className="w-3 h-3"
                        onClick={() => removeJobType(jobType.id)}
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
                {errors.jobTypes && (
                  <p className="text-red-500 text-[14px]">
                    {errors.jobTypes.message}
                  </p>
                )}
              </div>

              {/* Job Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  業務内容
                </label>
                <textarea
                  placeholder="担当していた業務内容や役割を簡単にご記入ください。例）新規事業の立ち上げに従事。市場調査・事業計画の策定から、立ち上げ後のKPI設計・進捗管理までを担当"
                  {...register('jobDescription')}
                  className={`leading-[200%] w-full px-[11px] py-[11px] bg-white border ${errors.jobDescription ? 'border-red-500' : 'border-[#999999]'} rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[192px] resize-none`}
                />
                {errors.jobDescription && (
                  <p className="text-red-500 text-[14px]">
                    {errors.jobDescription.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid}
              className={`w-full px-10 py-[18px] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-[16px] font-bold tracking-[1.6px] ${
                isValid
                  ? 'bg-gradient-to-b from-[#229a4e] to-[#17856f] text-white cursor-pointer'
                  : 'bg-[#dcdcdc] text-[#999999] cursor-not-allowed'
              }`}
            >
              次へ
            </button>
          </div>
        </main>
      </div>

      {/* Modals */}
      <IndustrySelectModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        onConfirm={handleIndustryConfirm}
        initialSelected={selectedIndustries}
        maxSelections={3}
      />

      <JobTypeSelectModal
        isOpen={isJobTypeModalOpen}
        onClose={() => setIsJobTypeModalOpen(false)}
        onConfirm={handleJobTypeConfirm}
        initialSelected={selectedJobTypes}
        maxSelections={3}
      />
    </>
  );
}
