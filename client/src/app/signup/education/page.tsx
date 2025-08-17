'use client';

import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { Navigation } from '@/components/ui/navigation';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import AutocompleteInput from '@/components/ui/AutocompleteInput';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSchoolAutocomplete } from '@/hooks/useSchoolAutocomplete';
import type { Industry } from '@/constants/industry-data';
import type { JobType } from '@/constants/job-type-data';

// フォームスキーマの定義
const educationSchema = z.object({
  finalEducation: z.string().min(1, '最終学歴を選択してください。'),
  schoolName: z.string().min(1, '学校名を入力してください。'),
  department: z.string().min(1, '学部・学科・専攻を入力してください。'),
  graduationYear: z.string().min(1, '卒業年月を選択してください。'),
  graduationMonth: z.string().min(1, '卒業年月を選択してください。'),
  industries: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        experienceYears: z.string().optional(),
      }),
    )
    .min(1, '業種を1つ以上選択してください。')
    .max(3)
    .refine(
      (items) =>
        items.every(
          (item) => item.experienceYears && item.experienceYears !== '',
        ),
      '経験年数を選択してください。',
    ),
  jobTypes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        experienceYears: z.string().optional(),
      }),
    )
    .min(1, '職種を1つ以上選択してください。')
    .max(3)
    .refine(
      (items) =>
        items.every(
          (item) => item.experienceYears && item.experienceYears !== '',
        ),
      '経験年数を選択してください。',
    ),
});

type EducationFormData = z.infer<typeof educationSchema>;

export default function SignupEducationPage() {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    mode: 'onChange',
    defaultValues: {
      finalEducation: '',
      schoolName: '',
      department: '',
      graduationYear: '',
      graduationMonth: '',
      industries: [],
      jobTypes: [],
    },
  });

  const selectedIndustries = watch('industries');
  const selectedJobTypes = watch('jobTypes');
  const finalEducation = watch('finalEducation');
  const schoolName = watch('schoolName');

  // School autocomplete
  const { suggestions: schoolSuggestions } = useSchoolAutocomplete(schoolName, finalEducation);

  // 最終学歴の選択肢
  const educationOptions = [
    '中学校卒業',
    '高等学校卒業',
    '高等専門学校卒業',
    '短期大学卒業',
    '専門学校卒業',
    '大学卒業（学士）',
    '大学院修士課程修了（修士）',
    '大学院博士課程修了（博士）',
    '海外大学卒業（学士）',
    '海外大学院修了（修士・博士含む）',
    'その他',
  ];

  // 年の選択肢を生成（1970年から2025年まで）
  const yearOptions = useMemo(() => {
    const years = [];
    for (let year = 2025; year >= 1970; year--) {
      years.push(year.toString());
    }
    return years;
  }, []);

  // 月の選択肢を生成（1〜12月）
  const monthOptions = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  // 経験年数の選択肢
  const experienceYearOptions = [
    '1年',
    '2年',
    '3年',
    '4年',
    '5年',
    '6年',
    '7年',
    '8年',
    '9年',
    '10年',
    '11年',
    '12年',
    '13年',
    '14年',
    '15年',
    '16年',
    '17年',
    '18年',
    '19年',
    '20年以上',
  ];

  const onSubmit = (_data: EducationFormData) => {
    // TODO: APIを呼び出してデータを保存
    // 次の画面へ遷移
    router.push('/signup/skills');
  };

  // モーダルから選択された値を設定
  const handleIndustryConfirm = (industries: Industry[]) => {
    const industriesWithExperience = industries.map((industry) => {
      const existing = selectedIndustries.find((i) => i.id === industry.id);
      return {
        ...industry,
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('industries', industriesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  };

  const handleJobTypeConfirm = (jobTypes: JobType[]) => {
    const jobTypesWithExperience = jobTypes.map((jobType) => {
      const existing = selectedJobTypes.find((jt) => jt.id === jobType.id);
      return {
        ...jobType,
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('jobTypes', jobTypesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
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
    setValue('jobTypes', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // 経験年数を更新
  const updateIndustryExperience = (
    industryId: string,
    experienceYears: string,
  ) => {
    const updated = selectedIndustries.map((industry) =>
      industry.id === industryId ? { ...industry, experienceYears } : industry,
    );
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const updateJobTypeExperience = (
    jobTypeId: string,
    experienceYears: string,
  ) => {
    const updated = selectedJobTypes.map((jobType) =>
      jobType.id === jobTypeId ? { ...jobType, experienceYears } : jobType,
    );
    setValue('jobTypes', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />

      {/* Conditional Rendering based on screen size */}
      {isDesktop ? (
        /* PC Version */
        <main
          className="flex relative py-20 flex-col items-center justify-start"
          style={{
            backgroundImage: "url('/background-pc.svg')",
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
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
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.625 3.5H15.375C15.5813 3.5 15.75 3.66875 15.75 3.875V5.75H8.25V3.875C8.25 3.66875 8.41875 3.5 8.625 3.5ZM6 3.875V5.75H3C1.34531 5.75 0 7.09531 0 8.75V13.25H9H15H24V8.75C24 7.09531 22.6547 5.75 21 5.75H18V3.875C18 2.42656 16.8234 1.25 15.375 1.25H8.625C7.17656 1.25 6 2.42656 6 3.875ZM24 14.75H15V16.25C15 17.0797 14.3297 17.75 13.5 17.75H10.5C9.67031 17.75 9 17.0797 9 16.25V14.75H0V20.75C0 22.4047 1.34531 23.75 3 23.75H21C22.6547 23.75 24 22.4047 24 20.75V14.75Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                  <span className="text-[#0f9058] text-[18px] font-bold tracking-[1.8px]">
                    経歴詳細
                  </span>
                </div>
                <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#dcdcdc]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6687 2.45833L22.6582 8.44427C25.1139 10.8979 25.1139 14.8422 22.6582 17.2959L17.4092 22.5411C16.9733 22.9763 16.261 22.9809 15.8204 22.5503C15.3799 22.1198 15.3752 21.4161 15.8111 20.9809L21.0554 15.7357C22.6441 14.1478 22.6441 11.597 21.0554 10.009L15.0706 4.0231C14.6347 3.58793 14.6394 2.88425 15.08 2.4537C15.5205 2.02316 16.2329 2.02779 16.6687 2.46296V2.45833ZM0.5 11.2729V4.3518C0.5 3.12498 1.50762 2.12964 2.74956 2.12964H9.756C10.5527 2.12964 11.3166 2.43981 11.879 2.99535L19.7525 10.7729C20.9241 11.9303 20.9241 13.8052 19.7525 14.9626L13.4959 21.143C12.3243 22.3004 10.4262 22.3004 9.25454 21.143L1.38108 13.3654C0.814001 12.8099 0.5 12.0599 0.5 11.2729ZM7.24868 7.31467C7.24868 6.92177 7.09068 6.54496 6.80943 6.26714C6.52818 5.98931 6.14672 5.83324 5.74897 5.83324C5.35123 5.83324 4.96977 5.98931 4.68852 6.26714C4.40727 6.54496 4.24927 6.92177 4.24927 7.31467C4.24927 7.70758 4.40727 8.08439 4.68852 8.36221C4.96977 8.64003 5.35123 8.79611 5.74897 8.79611C6.14672 8.79611 6.52818 8.64003 6.80943 8.36221C7.09068 8.08439 7.24868 7.70758 7.24868 7.31467Z"
                        fill="#DCDCDC"
                      />
                    </svg>
                  </div>
                  <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                    語学・スキル
                  </span>
                </div>
                <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#dcdcdc]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.48771 2C4.48771 1.17031 3.81622 0.5 2.98507 0.5C2.15392 0.5 1.48242 1.17031 1.48242 2V3.5V17.75V23C1.48242 23.8297 2.15392 24.5 2.98507 24.5C3.81622 24.5 4.48771 23.8297 4.48771 23V17L7.50709 16.2453C9.43705 15.7625 11.4797 15.9875 13.2594 16.8734C15.3349 17.9094 17.7439 18.0359 19.9133 17.2203L21.5427 16.6109C22.1297 16.3906 22.5195 15.8328 22.5195 15.2047V3.59375C22.5195 2.51562 21.3831 1.8125 20.4158 2.29531L19.965 2.52031C17.7908 3.60781 15.2316 3.60781 13.0575 2.52031C11.4093 1.69531 9.51688 1.48906 7.72779 1.93438L4.48771 2.75V2Z"
                        fill="#DCDCDC"
                      />
                    </svg>
                  </div>
                  <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                    希望条件
                  </span>
                </div>
                <div className="flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-3 border-[#dcdcdc]">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.26127 0.5H14.2357H14.8533L15.2901 0.935984L21.3277 6.97353L21.7637 7.40989V8.02747V20.4734C21.7637 22.6933 19.9574 24.5 17.7371 24.5H6.26122C4.04178 24.5 2.2355 22.6933 2.2355 20.4734V4.52572C2.23555 2.30581 4.04178 0.5 6.26127 0.5ZM3.72631 20.4734C3.72631 21.8738 4.86125 23.0092 6.26122 23.0092H17.7371C19.1375 23.0092 20.2729 21.8738 20.2729 20.4734V8.02752H16.3485C15.1822 8.02752 14.2357 7.08144 14.2357 5.91467V1.99072H6.26122C4.86125 1.99072 3.72631 3.12612 3.72631 4.52567V20.4734Z"
                        fill="#DCDCDC"
                      />
                      <path
                        d="M7.93571 7.97266C8.29514 8.22423 8.73277 8.37283 9.20377 8.37283C9.67514 8.37283 10.1124 8.22423 10.4723 7.97266C11.1012 8.24336 11.4876 8.71806 11.7233 9.13736C12.0363 9.69348 11.7908 10.4807 11.2502 10.4807C10.7088 10.4807 9.20377 10.4807 9.20377 10.4807C9.20377 10.4807 7.69918 10.4807 7.15772 10.4807C6.61669 10.4807 6.37083 9.69348 6.68429 9.13736C6.92002 8.71802 7.30636 8.24336 7.93571 7.97266Z"
                        fill="#DCDCDC"
                      />
                      <path
                        d="M9.20342 7.84598C8.27891 7.84598 7.53027 7.09734 7.53027 6.17325V5.77228C7.53027 4.84903 8.27891 4.09912 9.20342 4.09912C10.1275 4.09912 10.877 4.84903 10.877 5.77228V6.17325C10.877 7.09734 10.1275 7.84598 9.20342 7.84598Z"
                        fill="#DCDCDC"
                      />
                      <path
                        d="M6.65536 12.7046H17.4551V13.7532H6.65536V12.7046Z"
                        fill="#DCDCDC"
                      />
                      <path
                        d="M6.60067 15.8508H17.4004V16.8999H6.60067V15.8508Z"
                        fill="#DCDCDC"
                      />
                      <path
                        d="M6.63917 18.9976H14.1992V20.0458H6.63917V18.9976Z"
                        fill="#DCDCDC"
                      />
                    </svg>
                  </div>
                  <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                    職務要約
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
                <p>
                  あなたのご経験にあったスカウトが届くよう、これまでの学歴・職歴を教えてください。
                </p>
              </div>

              {/* Education Section */}
              <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6">
                <div className="flex-1 h-px relative">
                  <div className="absolute inset-[-1px_-0.3%]">
                    <svg
                      width="100%"
                      height="1"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="0"
                        stroke="#dcdcdc"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                  学歴
                </span>
                <div className="flex-1 h-px relative">
                  <div className="absolute inset-[-1px_-0.3%]">
                    <svg
                      width="100%"
                      height="1"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="0"
                        stroke="#dcdcdc"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Education Form Fields */}
              <div className="flex flex-col gap-6 w-fit items-end">
                {/* Final Education */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      最終学歴
                    </label>
                  </div>
                  <div className="w-[400px]">
                    <div className="relative">
                      <select
                        {...register('finalEducation')}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                      >
                        <option value="">未選択</option>
                        {educationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
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
                    {errors.finalEducation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.finalEducation.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* School Name */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      学校名
                    </label>
                  </div>
                  <div className="w-[400px]">
                    <AutocompleteInput
                      value={schoolName}
                      onChange={(value) => setValue('schoolName', value, { shouldValidate: true })}
                      placeholder="学校名を入力"
                      suggestions={schoolSuggestions.map(s => ({ 
                        id: s.id, 
                        name: s.name, 
                        category: s.category 
                      }))}
                      className={errors.schoolName ? 'border-red-500' : ''}
                    />
                    {errors.schoolName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.schoolName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Department/Major */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      学部学科専攻
                    </label>
                  </div>
                  <div className="w-[400px]">
                    <input
                      type="text"
                      placeholder="学部学科専攻を入力"
                      {...register('department')}
                      className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#999999] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.department.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Graduation Date */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      卒業年月
                    </label>
                  </div>
                  <div className="w-[274px]">
                    <div className="flex flex-wrap gap-2 items-center">
                      <div className="relative flex-1">
                        <select
                          {...register('graduationYear')}
                          className="w-full px-[11px] py-[11px] pl-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                        >
                          <option value="">未選択</option>
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
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
                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        年
                      </span>
                      <div className="relative flex-1">
                        <select
                          {...register('graduationMonth')}
                          className="w-full px-[11px] py-[11px] pl-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                        >
                          <option value="">未選択</option>
                          {monthOptions.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
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
                      <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                        月
                      </span>
                    </div>
                    {(errors.graduationYear || errors.graduationMonth) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.graduationYear?.message ||
                          errors.graduationMonth?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="flex flex-row w-full h-[29px] items-center justify-center gap-6">
                <div className="flex-1 h-px relative">
                  <div className="absolute inset-[-1px_-0.3%]">
                    <svg
                      width="100%"
                      height="1"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="0"
                        stroke="#dcdcdc"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap">
                  今までに経験した業種・職種
                </span>
                <div className="flex-1 h-px relative">
                  <div className="absolute inset-[-1px_-0.3%]">
                    <svg
                      width="100%"
                      height="1"
                      viewBox="0 0 100 1"
                      preserveAspectRatio="none"
                    >
                      <line
                        x1="0"
                        y1="0"
                        x2="100"
                        y2="0"
                        stroke="#dcdcdc"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Work Experience Form Fields */}
              <div className="flex flex-col gap-6 w-fit items-end">
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
                        type="button"
                        onClick={() => setIsIndustryModalOpen(true)}
                        className="w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      >
                        業種を選択
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {selectedIndustries.map((industry) => (
                          <div
                            key={industry.id}
                            className="inline-flex items-center gap-1"
                          >
                            <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px]">
                              {industry.name}
                            </span>
                            <div className="bg-[#d2f1da] h-[40px] flex items-center px-4">
                              <select
                                className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none"
                                value={industry.experienceYears || ''}
                                onChange={(e) =>
                                  updateIndustryExperience(
                                    industry.id,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">経験年数：未選択</option>
                                {experienceYearOptions.map((year) => (
                                  <option key={year} value={year}>
                                    経験年数：{year}
                                  </option>
                                ))}
                              </select>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                                className="ml-2"
                              >
                                <path
                                  d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                  fill="#0F9058"
                                />
                              </svg>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeIndustry(industry.id)}
                              className="bg-[#d2f1da] flex items-center justify-center w-10 h-[40px] rounded-r-[10px]"
                            >
                              <svg
                                width="13"
                                height="12"
                                viewBox="0 0 13 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z"
                                  fill="#0F9058"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors.industries && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.industries.message}
                        </p>
                      )}
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
                        type="button"
                        onClick={() => setIsJobTypeModalOpen(true)}
                        className="w-[160px] py-[12px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                      >
                        職種を選択
                      </button>
                      <div className="flex flex-wrap gap-2">
                        {selectedJobTypes.map((jobType) => (
                          <div
                            key={jobType.id}
                            className="inline-flex items-center gap-1"
                          >
                            <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px]">
                              {jobType.name}
                            </span>
                            <div className="bg-[#d2f1da] h-[40px] flex items-center px-4">
                              <select
                                className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none"
                                value={jobType.experienceYears || ''}
                                onChange={(e) =>
                                  updateJobTypeExperience(
                                    jobType.id,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">経験年数：未選択</option>
                                {experienceYearOptions.map((year) => (
                                  <option key={year} value={year}>
                                    経験年数：{year}
                                  </option>
                                ))}
                              </select>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                                className="ml-2"
                              >
                                <path
                                  d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                  fill="#0F9058"
                                />
                              </svg>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeJobType(jobType.id)}
                              className="bg-[#d2f1da] flex items-center justify-center w-10 h-[40px] rounded-r-[10px]"
                            >
                              <svg
                                width="13"
                                height="12"
                                viewBox="0 0 13 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z"
                                  fill="#0F9058"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                      {errors.jobTypes && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.jobTypes.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid}
                className={`px-10 py-[18px] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-white text-[16px] font-bold tracking-[1.6px] min-w-[160px] ${
                  isValid
                    ? 'bg-gradient-to-b from-[#229a4e] to-[#17856f] cursor-pointer'
                    : 'bg-[#dcdcdc] cursor-not-allowed'
                }`}
              >
                次へ
              </button>
            </div>
          </form>
        </main>
      ) : (
        /* SP (Mobile) Version */
        <main
          className="flex relative pt-6 pb-20 flex-col items-center px-4"
          style={{
            backgroundImage: "url('/background-sp.svg')",
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            {/* Container */}
            <div className="bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 w-full flex flex-col gap-10 items-center">
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
                      strokeDasharray="45.24 135.72"
                      transform="rotate(-90 36 36)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-[#0f9058] text-[24px] font-medium tracking-[2.4px]">
                        1
                      </span>
                      <span className="text-[#999999] text-[17px] font-medium tracking-[1.7px]">
                        /4
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="text-[#999999] text-[16px] font-bold tracking-[1.6px]">
                    会員情報
                  </p>
                  <p className="text-[#0f9058] text-[20px] font-bold tracking-[2px]">
                    経歴詳細
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
                <p>あなたのご経験にあったスカウトが</p>
                <p>届くよう、これまでの学歴・職歴を</p>
                <p>教えてください。</p>
              </div>

              {/* Education Section */}
              <div className="flex flex-row gap-4 items-center justify-center w-full">
                <div className="flex-1 h-px bg-[#dcdcdc]"></div>
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px] text-nowrap">
                  学歴
                </span>
                <div className="flex-1 h-px bg-[#dcdcdc]"></div>
              </div>

              {/* Education Form Fields */}
              <div className="flex flex-col gap-6 w-full">
                {/* Final Education */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    最終学歴
                  </label>
                  <div className="relative">
                    <select
                      {...register('finalEducation')}
                      className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                    >
                      <option value="">未選択</option>
                      {educationOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
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
                  {errors.finalEducation && (
                    <p className="text-red-500 text-sm">
                      {errors.finalEducation.message}
                    </p>
                  )}
                </div>

                {/* School Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    学校名
                  </label>
                  <AutocompleteInput
                    value={schoolName}
                    onChange={(value) => setValue('schoolName', value, { shouldValidate: true })}
                    placeholder="学校名を入力"
                    suggestions={schoolSuggestions.map(s => ({ 
                      id: s.id, 
                      name: s.name, 
                      category: s.category 
                    }))}
                    className={errors.schoolName ? 'border-red-500' : ''}
                  />
                  {errors.schoolName && (
                    <p className="text-red-500 text-sm">
                      {errors.schoolName.message}
                    </p>
                  )}
                </div>

                {/* Department/Major */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    学部学科専攻
                  </label>
                  <input
                    type="text"
                    placeholder="学部学科専攻を入力"
                    {...register('department')}
                    className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#999999] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                  />
                  {errors.department && (
                    <p className="text-red-500 text-sm">
                      {errors.department.message}
                    </p>
                  )}
                </div>

                {/* Graduation Date */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    卒業年月
                  </label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <select
                        {...register('graduationYear')}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
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
                        {...register('graduationMonth')}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
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

              {/* Work Experience Section */}
              <div className="flex flex-row gap-4 items-center justify-center w-full">
                <div className="flex-1 h-px bg-[#dcdcdc]"></div>
                <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px] text-nowrap">
                  今までに経験した業種・職種
                </span>
                <div className="flex-1 h-px bg-[#dcdcdc]"></div>
              </div>

              {/* Work Experience Form Fields */}
              <div className="flex flex-col gap-6 w-full">
                {/* Industry */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                    業種
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsIndustryModalOpen(true)}
                    className="w-full px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    業種を選択
                  </button>
                  {selectedIndustries.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {selectedIndustries.map((industry) => (
                        <div
                          key={industry.id}
                          className="flex flex-row gap-0.5"
                        >
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="bg-[#d2f1da] px-6 py-[10px] rounded-tl-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {industry.name}
                            </div>
                            <div className="bg-[#d2f1da] px-6 py-[10px] rounded-bl-[10px] flex items-center justify-between">
                              <select
                                className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none w-full"
                                value={industry.experienceYears || ''}
                                onChange={(e) =>
                                  updateIndustryExperience(
                                    industry.id,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">経験年数：未選択</option>
                                {experienceYearOptions.map((year) => (
                                  <option key={year} value={year}>
                                    経験年数：{year}
                                  </option>
                                ))}
                              </select>
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
                          <button
                            type="button"
                            onClick={() => removeIndustry(industry.id)}
                            className="bg-[#d2f1da] p-[14px] rounded-br-[10px] rounded-tr-[10px] flex items-center"
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
                  ) : null}
                  {errors.industries && (
                    <p className="text-red-500 text-sm">
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
                    type="button"
                    onClick={() => setIsJobTypeModalOpen(true)}
                    className="w-full px-10 py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                  >
                    職種を選択
                  </button>
                  {selectedJobTypes.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                      {selectedJobTypes.map((jobType) => (
                        <div key={jobType.id} className="flex flex-row gap-0.5">
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="bg-[#d2f1da] px-6 py-[10px] rounded-tl-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {jobType.name}
                            </div>
                            <div className="bg-[#d2f1da] px-6 py-[10px] rounded-bl-[10px] flex items-center justify-between">
                              <select
                                className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-6 cursor-pointer focus:outline-none w-full"
                                value={jobType.experienceYears || ''}
                                onChange={(e) =>
                                  updateJobTypeExperience(
                                    jobType.id,
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">経験年数：未選択</option>
                                {experienceYearOptions.map((year) => (
                                  <option key={year} value={year}>
                                    経験年数：{year}
                                  </option>
                                ))}
                              </select>
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
                          <button
                            type="button"
                            onClick={() => removeJobType(jobType.id)}
                            className="bg-[#d2f1da] p-[14px] rounded-br-[10px] rounded-tr-[10px] flex items-center"
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
                  ) : null}
                  {errors.jobTypes && (
                    <p className="text-red-500 text-sm">
                      {errors.jobTypes.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full px-10 py-[18px] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] text-white text-[16px] font-bold tracking-[1.6px] ${
                  isValid
                    ? 'bg-gradient-to-b from-[#229a4e] to-[#17856f] cursor-pointer'
                    : 'bg-[#dcdcdc] cursor-not-allowed'
                }`}
              >
                次へ
              </button>
            </div>
          </form>
        </main>
      )}

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

      <AuthAwareFooter />
    </div>
  );
}
