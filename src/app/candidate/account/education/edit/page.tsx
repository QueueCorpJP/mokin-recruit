'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useMemo } from 'react';
import { getEducationData, updateEducationData } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import type { Industry } from '@/constants/industry-data';
import type { JobType } from '@/constants/job-type-data';
import { useSchoolAutocomplete } from '@/hooks/useSchoolAutocomplete';
import AutocompleteInput from '@/components/ui/AutocompleteInput';

const educationSchema = z.object({
  finalEducation: z.string(),
  schoolName: z.string(),
  department: z.string(),
  graduationYear: z.string(),
  graduationMonth: z.string(),
  industries: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        experienceYears: z.string().optional(),
      }),
    )
    .max(3)
    .refine(
      (items) =>
        items.length === 0 || items.every(
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
    .max(3)
    .refine(
      (items) =>
        items.length === 0 || items.every(
          (item) => item.experienceYears && item.experienceYears !== '',
        ),
      '経験年数を選択してください。',
    ),
});

type EducationFormData = z.infer<typeof educationSchema>;

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

// 候補者_学歴・経験業種/職種編集ページ
export default function CandidateEducationEditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
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
  const watchedSchoolName = watch('schoolName');
  const watchedFinalEducation = watch('finalEducation');

  // School suggestion hook
  const { suggestions: schoolSuggestions } = useSchoolAutocomplete(watchedSchoolName, watchedFinalEducation);

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

  // 初期データを取得してフォームに設定
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getEducationData();
        if (data) {
          reset({
            finalEducation: data.finalEducation || '',
            schoolName: data.schoolName || '',
            department: data.department || '',
            graduationYear: data.graduationYear || '',
            graduationMonth: data.graduationMonth || '',
            industries: data.industries || [],
            jobTypes: data.jobTypes || [],
          });
        }
      } catch (error) {
        console.error('初期データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [reset]);

  const onSubmit = async (data: EducationFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // 基本的な学歴情報
      formData.append('finalEducation', data.finalEducation);
      formData.append('schoolName', data.schoolName);
      formData.append('department', data.department);
      formData.append('graduationYear', data.graduationYear);
      formData.append('graduationMonth', data.graduationMonth);
      
      // 業種・職種情報をJSON形式で追加
      if (data.industries && data.industries.length > 0) {
        formData.append('industries', JSON.stringify(data.industries));
      }
      if (data.jobTypes && data.jobTypes.length > 0) {
        formData.append('jobTypes', JSON.stringify(data.jobTypes));
      }

      const result = await updateEducationData(formData);
      
      if (result.success) {
        router.push('/candidate/account/education');
      } else {
        console.error('保存エラー:', result.error);
        alert('保存に失敗しました。もう一度お試しください。');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('保存処理でエラーが発生しました:', error);
      alert('保存に失敗しました。もう一度お試しください。');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/candidate/account/education');
  };

  const handleIndustryConfirm = (industries: string[]) => {
    const industriesWithExperience = industries.map((industryId) => {
      const existing = selectedIndustries.find((i) => i.id === industryId);
      return {
        id: industryId,
        name: industryId,
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('industries', industriesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  };

  const removeIndustry = (industryId: string) => {
    const updated = selectedIndustries.filter((i) => i.id !== industryId);
    setValue('industries', updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

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

  const handleJobTypeConfirm = (jobTypes: string[]) => {
    const jobTypesWithExperience = jobTypes.map((jobTypeId) => {
      const existing = selectedJobTypes.find((jt) => jt.id === jobTypeId);
      return {
        id: jobTypeId,
        name: jobTypeId,
        experienceYears: existing?.experienceYears || '',
      };
    });
    setValue('jobTypes', jobTypesWithExperience, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
  };

  const removeJobType = (jobTypeId: string) => {
    const updated = selectedJobTypes.filter((jt) => jt.id !== jobTypeId);
    setValue('jobTypes', updated, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[16px] font-bold text-[#323232]">読み込み中...</div>
      </div>
    );
  }

  return (
    <>
      {/* メインコンテンツ */}
      <main className="flex-1 relative z-[2]">
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10">
          {/* パンくずリスト */}
          <div className="flex flex-wrap items-center gap-2 mb-2 lg:mb-4">
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              プロフィール確認・編集
            </span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M3 1L6 4L3 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              学歴・経験業種/職種
            </span>
            <svg
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M3 1L6 4L3 7"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-white text-[14px] font-bold tracking-[1.4px]">
              学歴・経験業種/職種 編集
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
              {/* プロフィールアイコン */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.26175 0H14.2362H14.8538L15.2906 0.435984L21.3282 6.47353L21.7642 6.90989V7.52747V19.9734C21.7642 22.1933 19.9579 24 17.7376 24H6.26171C4.04227 24 2.23599 22.1933 2.23599 19.9734V4.02572C2.23604 1.80581 4.04227 0 6.26175 0ZM3.7268 19.9734C3.7268 21.3738 4.86174 22.5092 6.26171 22.5092H17.7376C19.138 22.5092 20.2733 21.3738 20.2733 19.9734V7.52752H16.349C15.1827 7.52752 14.2362 6.58144 14.2362 5.41467V1.49072H6.26171C4.86174 1.49072 3.7268 2.62612 3.7268 4.02567V19.9734Z"
                  fill="white"
                />
                <path
                  d="M7.93522 7.47266C8.29466 7.72423 8.73228 7.87283 9.20328 7.87283C9.67466 7.87283 10.1119 7.72423 10.4718 7.47266C11.1007 7.74336 11.4871 8.21806 11.7228 8.63736C12.0358 9.19348 11.7904 9.98075 11.2497 9.98075C10.7083 9.98075 9.20328 9.98075 9.20328 9.98075C9.20328 9.98075 7.69869 9.98075 7.15724 9.98075C6.6162 9.98075 6.37034 9.19348 6.6838 8.63736C6.91953 8.21802 7.30588 7.74336 7.93522 7.47266Z"
                  fill="white"
                />
                <path
                  d="M9.20342 7.34452C8.27891 7.34452 7.53027 6.59588 7.53027 5.67178V5.27081C7.53027 4.34756 8.27891 3.59766 9.20342 3.59766C10.1275 3.59766 10.877 4.34756 10.877 5.27081V5.67178C10.877 6.59588 10.1275 7.34452 9.20342 7.34452Z"
                  fill="white"
                />
                <path
                  d="M6.65487 12.2031H17.4546V13.2518H6.65487V12.2031Z"
                  fill="white"
                />
                <path
                  d="M6.60018 15.3516H17.3999V16.4006H6.60018V15.3516Z"
                  fill="white"
                />
                <path
                  d="M6.64015 18.4961H14.2002V19.5444H6.64015V18.4961Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]">
              学歴・経験業種/職種 編集
            </h1>
          </div>
        </div>

        {/* フォーム部分 */}
        <div className="bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-6 lg:gap-10"
          >
            <div className="bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]">
              {/* 説明文セクション */}
              <div className="mb-6">
                <p className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-8 text-left">
                  学歴・経験業種/職種を編集できます。
                  <br className="hidden md:block" />
                  内容は履歴書・職務経歴書にも反映されます。
                </p>
              </div>

              {/* 学歴セクション */}
              <div className="mb-6 lg:mb-6">
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    学歴
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-6 lg:space-y-2">
                  {/* 最終学歴 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        最終学歴
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="relative">
                        <select
                          {...register('finalEducation')}
                          className={`w-full bg-white border ${
                            errors.finalEducation
                              ? 'border-red-500'
                              : 'border-[#999999]'
                          } rounded-[5px] px-4 py-[11px] pr-10 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]`}
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
                            width="14"
                            height="10"
                            viewBox="0 0 14 10"
                            fill="none"
                          >
                            <path d="M7 10L0 0H14L7 10Z" fill="#0f9058" />
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

                  {/* 学校名 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        学校名
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <AutocompleteInput
                        value={watchedSchoolName}
                        onChange={(value) => setValue('schoolName', value, { shouldValidate: true, shouldDirty: true })}
                        placeholder="学校名を入力"
                        suggestions={schoolSuggestions.map(s => ({ 
                          id: s.id, 
                          name: s.name, 
                          category: s.category 
                        }))}
                        className={`w-full bg-white border ${
                          errors.schoolName
                            ? 'border-red-500'
                            : 'border-[#999999]'
                        } rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]`}
                      />
                      {errors.schoolName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.schoolName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 学部学科専攻 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        学部学科専攻
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <input
                        type="text"
                        {...register('department')}
                        placeholder="学部学科専攻を入力"
                        className={`w-full bg-white border ${
                          errors.department
                            ? 'border-red-500'
                            : 'border-[#999999]'
                        } rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]`}
                      />
                      {errors.department && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.department.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 卒業年月 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        卒業年月
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="flex gap-2 items-center">
                        <div className="relative w-[109px]">
                          <select
                            {...register('graduationYear')}
                            className={`w-[109px] bg-white border ${
                              errors.graduationYear || errors.graduationMonth
                                ? 'border-red-500'
                                : 'border-[#999999]'
                            } rounded-[5px] px-4 py-[11px] pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]`}
                          >
                            <option value="">未選択</option>
                            {yearOptions.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                            >
                              <path d="M7 10L0 0H14L7 10Z" fill="#0f9058" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                          年
                        </span>
                        <div className="relative w-[109px]">
                          <select
                            {...register('graduationMonth')}
                            className={`w-[109px] bg-white border ${
                              errors.graduationYear || errors.graduationMonth
                                ? 'border-red-500'
                                : 'border-[#999999]'
                            } rounded-[5px] px-4 py-[11px] pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]`}
                          >
                            <option value="">未選択</option>
                            {monthOptions.map((month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            ))}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <svg
                              width="14"
                              height="10"
                              viewBox="0 0 14 10"
                              fill="none"
                            >
                              <path d="M7 10L0 0H14L7 10Z" fill="#0f9058" />
                            </svg>
                          </div>
                        </div>
                        <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                          月
                        </span>
                      </div>
                      {(errors.graduationYear || errors.graduationMonth) && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.graduationYear?.message || errors.graduationMonth?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 今までに経験した業種・職種セクション */}
              <div>
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    今までに経験した業種・職種
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-6 lg:space-y-2">
                  {/* 業種 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] md:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        業種
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setIsIndustryModalOpen(true)}
                          className="border border-[#999999] text-[#323232] text-[16px] font-bold tracking-[1.6px] px-6 py-2.5 w-full md:w-auto rounded-[32px] flex text-center justify-center items-center gap-2"
                        >
                          業種を選択
                        </button>
                        {/* 選択された業種 */}
                        {(selectedIndustries || []).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(selectedIndustries || []).map((industry) => (
                              <div
                                key={industry.id}
                                className="inline-flex items-center gap-[2px]"
                              >
                                <div className="flex items-start md:items-center flex-col md:flex-row w-full gap-[2px]">
                                <span className="bg-[#d2f1da] rounded-tl-[10px] md:rounded-l-[10px] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 w-full sm:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
                                  {industry.name}
                                </span>
                                <div className="bg-[#d2f1da] h-[40px] flex items-center px-4 relative rounded-bl-[10px] md:rounded-b-none w-full">
                                  <select
                                    className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none cursor-pointer focus:outline-none w-full"
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
                                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                  >
                                    <path
                                      d="M7 10L0 0H14L7 10Z"
                                      fill="#0f9058"
                                    />
                                  </svg>
                                </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeIndustry(industry.id)
                                  }
                                  className="bg-[#d2f1da] flex items-center justify-center w-10 h-[80px] md:h-[40px] rounded-r-[10px] md:rounded-br-[10px] rounded-br-[10px]"
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
                        )}
                      </div>
                      {errors.industries && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.industries.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 職種 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        職種
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="space-y-4">
                        <button
                          type="button"
                          onClick={() => setIsJobTypeModalOpen(true)}
                          className="border border-[#999999] text-[#323232] text-[16px] w-full md:w-auto text-center justify-center items-center font-bold tracking-[1.6px] px-6 py-2.5 rounded-[32px] flex items-center gap-2"
                        >
                          職種を選択
                        </button>
                        {/* 選択された職種 */}
                        {(selectedJobTypes || []).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(selectedJobTypes || []).map((jobType) => (
                              <div
                                key={jobType.id}
                                className="inline-flex items-center gap-[2px]"
                              >
                                <div className="flex items-start md:items-center flex-col md:flex-row w-full gap-[2px]">
                                <span className="bg-[#d2f1da] rounded-tl-[10px] md:rounded-l-[10px] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 w-full md:max-w-[120px] sm:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
                                  {jobType.name}
                                </span>
                                <div className="bg-[#d2f1da] h-[40px] flex items-center px-4 relative rounded-bl-[10px] md:rounded-b-none w-full">
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
                                    className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                                  >
                                    <path
                                      d="M7 10L0 0H14L7 10Z"
                                      fill="#0f9058"
                                    />
                                  </svg>
                                </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeJobType(jobType.id)
                                  }
                                  className="bg-[#d2f1da] flex items-center justify-center w-10 h-[80px] md:h-[40px] rounded-r-[10px] md:rounded-br-[10px] rounded-br-[10px]"
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
                        )}
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
            </div>

            {/* ボタン */}
            <div className="flex gap-4 w-full lg:w-auto">
              <Button
                type="button"
                variant="green-outline"
                size="figma-default"
                onClick={handleCancel}
                className="min-w-[160px] flex-1 lg:flex-none text-[16px] tracking-[1.6px]"
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                variant="green-gradient"
                size="figma-default"
                disabled={isSubmitting}
                className="min-w-[160px] flex-1 lg:flex-none text-[16px] tracking-[1.6px]"
              >
                {isSubmitting ? '保存中...' : '保存する'}
              </Button>
            </div>
          </form>
        </div>
      </main>

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
    </>
  );
}