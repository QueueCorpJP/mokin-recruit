'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import type { Industry } from '@/constants/industry-data';
import type { JobType } from '@/constants/job-type-data';

// フォームスキーマ定義
const recentJobSchema = z.object({
  jobHistories: z.array(
    z.object({
      companyName: z.string().min(1, '企業名を入力してください'),
      departmentPosition: z.string().optional(),
      startYear: z.string().min(1, '開始年を入力してください'),
      startMonth: z.string().min(1, '開始月を入力してください'),
      endYear: z.string().optional(),
      endMonth: z.string().optional(),
      isCurrentlyWorking: z.boolean(),
      industries: z.array(z.string()),
      jobTypes: z.array(z.string()),
      jobDescription: z.string().optional(),
    }),
  ),
});

type RecentJobFormData = z.infer<typeof recentJobSchema>;

// 月の選択肢
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, '0'),
  label: `${i + 1}月`,
}));

// 年の選択肢（過去50年から現在まで）
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 51 }, (_, i) => ({
  value: String(currentYear - i),
  label: `${currentYear - i}年`,
}));

// 候補者_職務経歴編集ページ
export default function CandidateRecentJobEditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndustryModalIndex, setCurrentIndustryModalIndex] = useState<
    number | null
  >(null);
  const [currentJobTypeModalIndex, setCurrentJobTypeModalIndex] = useState<
    number | null
  >(null);
  const [selectedIndustriesMap, setSelectedIndustriesMap] = useState<{
    [key: number]: Industry[];
  }>({});
  const [selectedJobTypesMap, setSelectedJobTypesMap] = useState<{
    [key: number]: JobType[];
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm<RecentJobFormData>({
    resolver: zodResolver(recentJobSchema),
    defaultValues: {
      jobHistories: [
        {
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
      ],
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    // TODO: API呼び出し
    // Form data: data
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/account/recent-job');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/account/recent-job');
  };

  const addJobHistory = () => {
    const currentHistories = getValues('jobHistories');
    setValue('jobHistories', [
      ...currentHistories,
      {
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
    ]);
  };

  const removeJobHistory = (index: number) => {
    const currentHistories = getValues('jobHistories');
    setValue(
      'jobHistories',
      currentHistories.filter((_, i) => i !== index),
    );
  };

  // 業種モーダル
  const openIndustryModal = (index: number) => {
    setCurrentIndustryModalIndex(index);
  };

  const closeIndustryModal = () => {
    setCurrentIndustryModalIndex(null);
  };

  const handleIndustriesConfirm = (industries: Industry[]) => {
    if (currentIndustryModalIndex !== null) {
      // selectedIndustriesMapを更新
      setSelectedIndustriesMap((prev) => ({
        ...prev,
        [currentIndustryModalIndex]: industries,
      }));

      // フォームフィールドの値も更新
      setValue(
        `jobHistories.${currentIndustryModalIndex}.industries`,
        industries.map((ind) => ind.id),
        { shouldValidate: true, shouldDirty: true },
      );
      closeIndustryModal();
    }
  };

  const removeIndustry = (index: number, industryId: string) => {
    // selectedIndustriesMapから削除
    setSelectedIndustriesMap((prev) => ({
      ...prev,
      [index]: prev[index]?.filter((ind) => ind.id !== industryId) || [],
    }));

    // フォームフィールドからも削除
    const currentIndustries = watch(`jobHistories.${index}.industries`) || [];
    setValue(
      `jobHistories.${index}.industries`,
      currentIndustries.filter((id: string) => id !== industryId),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const getSelectedIndustries = (index: number): Industry[] => {
    // selectedIndustriesMapからデータを取得
    return selectedIndustriesMap[index] || [];
  };

  // 職種モーダル
  const openJobTypeModal = (index: number) => {
    setCurrentJobTypeModalIndex(index);
  };

  const closeJobTypeModal = () => {
    setCurrentJobTypeModalIndex(null);
  };

  const handleJobTypesConfirm = (jobTypes: JobType[]) => {
    if (currentJobTypeModalIndex !== null) {
      // selectedJobTypesMapを更新
      setSelectedJobTypesMap((prev) => ({
        ...prev,
        [currentJobTypeModalIndex]: jobTypes,
      }));

      // フォームフィールドの値も更新
      setValue(
        `jobHistories.${currentJobTypeModalIndex}.jobTypes`,
        jobTypes.map((jt) => jt.id),
        { shouldValidate: true, shouldDirty: true },
      );
      closeJobTypeModal();
    }
  };

  const removeJobType = (index: number, jobTypeId: string) => {
    // selectedJobTypesMapから削除
    setSelectedJobTypesMap((prev) => ({
      ...prev,
      [index]: prev[index]?.filter((jt) => jt.id !== jobTypeId) || [],
    }));

    // フォームフィールドからも削除
    const currentJobTypes = watch(`jobHistories.${index}.jobTypes`) || [];
    setValue(
      `jobHistories.${index}.jobTypes`,
      currentJobTypes.filter((id: string) => id !== jobTypeId),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  const getSelectedJobTypes = (index: number): JobType[] => {
    // selectedJobTypesMapからデータを取得
    return selectedJobTypesMap[index] || [];
  };

  const jobHistories = watch('jobHistories');

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
              職務経歴
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
              職務経歴編集
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
              {/* プロファイルアイコン */}
              <svg
                width="28"
                height="32"
                viewBox="0 0 28 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.34868 0H16.9813H17.8047L18.3871 0.581312L26.4372 8.63138L27.0186 9.21319V10.0366V26.6313C27.0186 29.5911 24.6102 32 21.6498 32H6.34862C3.38936 32 0.98099 29.5911 0.98099 26.6313V5.36763C0.981053 2.40775 3.38937 0 6.34868 0ZM2.96874 26.6313C2.96874 28.4984 4.48199 30.0123 6.34862 30.0123H21.6498C23.517 30.0123 25.0308 28.4984 25.0308 26.6313V10.0367H19.7984C18.2432 10.0367 16.9813 8.77525 16.9813 7.21956V1.98763H6.34862C4.48199 1.98763 2.96874 3.5015 2.96874 5.36756V26.6313Z"
                  fill="white"
                />
                <path
                  d="M8.58029 9.96484C9.05954 10.3003 9.64304 10.4984 10.271 10.4984C10.8995 10.4984 11.4825 10.3003 11.9624 9.96484C12.801 10.3258 13.3161 10.9587 13.6304 11.5178C14.0478 12.2593 13.7205 13.309 12.9996 13.309C12.2777 13.309 10.271 13.309 10.271 13.309C10.271 13.309 8.26492 13.309 7.54298 13.309C6.8216 13.309 6.49379 12.2593 6.91173 11.5178C7.22604 10.9587 7.74117 10.3258 8.58029 9.96484Z"
                  fill="white"
                />
                <path
                  d="M10.2711 9.79659C9.03838 9.79659 8.04019 8.79841 8.04019 7.56628V7.03166C8.04019 5.80066 9.03838 4.80078 10.2711 4.80078C11.5032 4.80078 12.5024 5.80066 12.5024 7.03166V7.56628C12.5024 8.79841 11.5031 9.79659 10.2711 9.79659Z"
                  fill="white"
                />
                <path
                  d="M6.87283 16.2734H21.2725V17.6716H6.87283V16.2734Z"
                  fill="white"
                />
                <path
                  d="M6.80008 20.4688H21.1997V21.8675H6.80008V20.4688Z"
                  fill="white"
                />
                <path
                  d="M6.85304 24.6641H16.9331V26.0618H6.85304V24.6641Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]">
              職務経歴編集
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
                  ご自身の職務経歴を編集できます。
                  <br />
                  ご経験に変化があった際は、最新の情報に更新してください。更新内容は、履歴書・職務経歴書にも反映されます。
                </p>
              </div>

              {/* 職務経歴リスト */}
              <div className="space-y-4">
                {jobHistories.map((_, index) => (
                  <div
                    key={index}
                    className="relative border border-[#dcdcdc] rounded-[10px] p-6"
                  >
                    {/* 削除ボタン */}
                    {jobHistories.length > 1 && index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeJobHistory(index)}
                        className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1L13 13M1 13L13 1"
                            stroke="#999999"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}

                    <div className="space-y-6 lg:space-y-2">
                      {/* 企業名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            企業名
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <input
                            type="text"
                            {...register(`jobHistories.${index}.companyName`)}
                            placeholder="企業名を入力"
                            className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                          />
                          {errors.jobHistories?.[index]?.companyName && (
                            <p className="text-red-500 text-[14px] mt-1">
                              {errors.jobHistories[index].companyName?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 部署名・役職名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            部署名・役職名
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <input
                            type="text"
                            {...register(
                              `jobHistories.${index}.departmentPosition`,
                            )}
                            placeholder="部署名・役職名を入力"
                            className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                          />
                        </div>
                      </div>

                      {/* 在籍期間 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            在籍期間
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <div className="space-y-4">
                            {/* 在籍期間開始 */}
                            <div className="flex flex-wrap items-center gap-1 lg:gap-2 justify-between lg:justify-start w-fit max-w-[260px] lg:max-w-full lg:w-full">
                              <span className="text-[16px] font-bold tracking-[1.4px] min-w-[60px] w-full lg:w-fit">
                                開始年月
                              </span>
                              <div className="relative">
                                <select
                                  {...register(
                                    `jobHistories.${index}.startYear`,
                                  )}
                                  className="bg-white border font-bold border-[#999999] rounded-[5px] px-3 py-2 pr-4 text-[16px] text-[#323232] tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  <option value="">未選択</option>
                                  {YEAR_OPTIONS.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                  >
                                    <path
                                      d="M4.07178 6.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H8.8376C9.7937 0 10.3395 1.00828 9.7658 1.71483L5.92822 6.90462C5.46411 7.47624 4.53589 7.47624 4.07178 6.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                                年
                              </span>
                              <div className="relative">
                                <select
                                  {...register(
                                    `jobHistories.${index}.startMonth`,
                                  )}
                                  className="bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  <option value="">未選択</option>
                                  {MONTH_OPTIONS.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                  >
                                    <path
                                      d="M4.07178 6.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H8.8376C9.7937 0 10.3395 1.00828 9.7658 1.71483L5.92822 6.90462C5.46411 7.47624 4.53589 7.47624 4.07178 6.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                                月
                              </span>
                            </div>

                            {/* 在籍期間終了 */}
                            <div className="flex flex-wrap items-center gap-1 lg:gap-2 justify-between lg:justify-start w-fit max-w-[260px] lg:max-w-full lg:w-full">
                              <span className="text-[16px] font-bold tracking-[1.4px] min-w-[60px] w-full lg:w-fit">
                                終了年月
                              </span>
                              <div className="relative">
                                <select
                                  {...register(`jobHistories.${index}.endYear`)}
                                  className="bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-4 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  <option value="">未選択</option>
                                  {YEAR_OPTIONS.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                  >
                                    <path
                                      d="M4.07178 6.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H8.8376C9.7937 0 10.3395 1.00828 9.7658 1.71483L5.92822 6.90462C5.46411 7.47624 4.53589 7.47624 4.07178 6.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                                年
                              </span>
                              <div className="relative">
                                <select
                                  {...register(
                                    `jobHistories.${index}.endMonth`,
                                  )}
                                  className="bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  <option value="">未選択</option>
                                  {MONTH_OPTIONS.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg
                                    width="10"
                                    height="8"
                                    viewBox="0 0 10 8"
                                    fill="none"
                                  >
                                    <path
                                      d="M4.07178 6.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H8.8376C9.7937 0 10.3395 1.00828 9.7658 1.71483L5.92822 6.90462C5.46411 7.47624 4.53589 7.47624 4.07178 6.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                                月
                              </span>
                            </div>

                            {/* 在籍中チェックボックス */}
                            <div className="pt-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-5 h-5 cursor-pointer"
                                  onClick={() => {
                                    const currentValue = watch(
                                      `jobHistories.${index}.isCurrentlyWorking`,
                                    );
                                    setValue(
                                      `jobHistories.${index}.isCurrentlyWorking`,
                                      !currentValue,
                                    );
                                  }}
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
                                      fill={
                                        watch(
                                          `jobHistories.${index}.isCurrentlyWorking`,
                                        )
                                          ? '#0F9058'
                                          : '#DCDCDC'
                                      }
                                    />
                                  </svg>
                                </div>
                                <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                                  在籍中
                                </span>
                              </div>
                            </div>
                          </div>
                          {(errors.jobHistories?.[index]?.startYear ||
                            errors.jobHistories?.[index]?.startMonth) && (
                            <p className="text-red-500 text-[14px] mt-1">
                              {errors.jobHistories[index].startYear?.message ||
                                errors.jobHistories[index].startMonth?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 業種 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            業種
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => openIndustryModal(index)}
                              className="w-full lg:w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                            >
                              業種を選択
                            </button>
                            <div className="flex flex-wrap gap-2">
                              {selectedIndustriesMap[index]?.map((industry) => (
                                <div
                                  key={industry.id}
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                                >
                                  <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                    {industry.name}
                                  </span>
                                  <button
                                    type="button"
                                    className="w-3 h-3"
                                    onClick={() =>
                                      removeIndustry(index, industry.id)
                                    }
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

                      {/* 職種 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            職種
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              onClick={() => openJobTypeModal(index)}
                              className="w-full lg:w-[170px] py-[11px] bg-white border border-[#999999] rounded-[32px] text-[16px] text-[#323232] font-bold tracking-[1.6px]"
                            >
                              職種を選択
                            </button>
                            <div className="flex flex-wrap gap-2">
                              {selectedJobTypesMap[index]?.map((jobType) => (
                                <div
                                  key={jobType.id}
                                  className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                                >
                                  <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                    {jobType.name}
                                  </span>
                                  <button
                                    type="button"
                                    className="w-3 h-3"
                                    onClick={() =>
                                      removeJobType(index, jobType.id)
                                    }
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

                      {/* 業務内容 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0">
                            業務内容
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <textarea
                            {...register(
                              `jobHistories.${index}.jobDescription`,
                            )}
                            placeholder="業務内容を入力"
                            rows={5}
                            className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-3 text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058] resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 職務経歴を追加ボタン */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addJobHistory}
                    className="border border-[#0f9058] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] px-6 py-2.5 rounded-[32px] flex items-center gap-2"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 3V13M3 8H13"
                        stroke="#0f9058"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    職務経歴を追加
                  </button>
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

      {/* 業種選択モーダル */}
      {currentIndustryModalIndex !== null && (
        <IndustrySelectModal
          isOpen={true}
          onClose={closeIndustryModal}
          onConfirm={handleIndustriesConfirm}
          initialSelected={getSelectedIndustries(currentIndustryModalIndex)}
          maxSelections={3}
        />
      )}

      {/* 職種選択モーダル */}
      {currentJobTypeModalIndex !== null && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={closeJobTypeModal}
          onConfirm={handleJobTypesConfirm}
          initialSelected={getSelectedJobTypes(currentJobTypeModalIndex)}
          maxSelections={3}
        />
      )}
    </>
  );
}
