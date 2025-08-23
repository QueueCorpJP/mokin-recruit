'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getCareerStatusData } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import {
  PROGRESS_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
} from '@/constants/career-status';
import { Industry, INDUSTRY_GROUPS } from '@/constants/industry-data';

// フォームスキーマ定義
const careerStatusSchema = z.object({
  transferDesiredTime: z.string().min(1, '転職希望時期を選択してください'),
  currentActivityStatus: z.string().min(1, '現在の活動状況を選択してください'),
  selectionCompanies: z.array(
    z.object({
      privacyScope: z.string(),
      isPrivate: z.boolean(),
      industries: z.array(z.string()),
      companyName: z.string(),
      department: z.string(),
      progressStatus: z.string(),
      declineReason: z.string(),
    }),
  ),
});

type CareerStatusFormData = z.infer<typeof careerStatusSchema>;

// 転職希望時期の選択肢
const TRANSFER_DESIRED_TIME_OPTIONS = [
  { value: '', label: '未選択' },
  { value: 'immediately', label: 'すぐにでも' },
  { value: 'within-3months', label: '3ヶ月以内' },
  { value: 'within-6months', label: '6ヶ月以内' },
  { value: 'within-1year', label: '1年以内' },
  { value: 'not-considering', label: '今は考えていない' },
];

// 現在の活動状況の選択肢
const CURRENT_ACTIVITY_STATUS_OPTIONS = [
  { value: '', label: '未選択' },
  { value: 'actively-searching', label: '積極的に活動中' },
  { value: 'considering', label: '良い案件があれば検討' },
  { value: 'information-gathering', label: '情報収集中' },
  { value: 'not-searching', label: '転職活動はしていない' },
];

// 候補者_転職活動状況編集ページ
export default function CandidateCareerStatusEditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(
    null,
  );
  const [selectedIndustriesMap, setSelectedIndustriesMap] = useState<{
    [key: number]: Industry[];
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<CareerStatusFormData>({
    resolver: zodResolver(careerStatusSchema),
    defaultValues: {
      transferDesiredTime: '',
      currentActivityStatus: '',
      selectionCompanies: [
        {
          privacyScope: '',
          isPrivate: false,
          industries: [],
          companyName: '',
          department: '',
          progressStatus: '',
          declineReason: '',
        },
      ],
    },
  });

  // 初期データを取得してフォームに設定
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getCareerStatusData();
        if (data) {
          // フォームの値を設定
          reset({
            transferDesiredTime: data.transferDesiredTime || '',
            currentActivityStatus: data.currentActivityStatus || '',
            selectionCompanies: data.selectionCompanies && data.selectionCompanies.length > 0 
              ? data.selectionCompanies 
              : [
                  {
                    privacyScope: '',
                    isPrivate: false,
                    industries: [],
                    companyName: '',
                    department: '',
                    progressStatus: '',
                    declineReason: '',
                  },
                ],
          });

          // selectedIndustriesMapを設定
          if (data.selectionCompanies) {
            const industryMap: { [key: number]: Industry[] } = {};
            data.selectionCompanies.forEach((company, index) => {
              if (company.industries && company.industries.length > 0) {
                const industries: Industry[] = company.industries.map(id => 
                  INDUSTRY_GROUPS.flatMap(g => g.industries).find(i => i.id === id)
                ).filter(Boolean) as Industry[];
                industryMap[index] = industries;
              }
            });
            setSelectedIndustriesMap(industryMap);
          }
        }
      } catch (error) {
        console.error('初期データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [reset]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    // TODO: API呼び出し
    // Form data: data
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/candidate/account/career-status');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/candidate/account/career-status');
  };

  const addCompany = () => {
    const currentCompanies = getValues('selectionCompanies');
    setValue('selectionCompanies', [
      ...currentCompanies,
      {
        privacyScope: '',
        isPrivate: false,
        industries: [],
        companyName: '',
        department: '',
        progressStatus: '',
        declineReason: '',
      },
    ]);
  };

  const removeCompany = (index: number) => {
    const currentCompanies = getValues('selectionCompanies');
    setValue(
      'selectionCompanies',
      currentCompanies.filter((_, i) => i !== index),
    );
  };

  const openIndustryModal = (index: number) => {
    setCurrentModalIndex(index);
  };

  const closeIndustryModal = () => {
    setCurrentModalIndex(null);
  };

  const handleIndustriesConfirm = (industryIds: string[]) => {
    // IDからIndustryオブジェクトに変換
    const industries: Industry[] = industryIds.map(id => 
      INDUSTRY_GROUPS.flatMap(g => g.industries).find(i => i.id === id)
    ).filter(Boolean) as Industry[];
    if (currentModalIndex !== null) {
      // selectedIndustriesMapを更新
      setSelectedIndustriesMap((prev) => ({
        ...prev,
        [currentModalIndex]: industries,
      }));

      // フォームフィールドの値も更新（IDの配列として保存）
      setValue(
        `selectionCompanies.${currentModalIndex}.industries`,
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
    const currentIndustries =
      watch(`selectionCompanies.${index}.industries`) || [];
    const updatedIndustries = currentIndustries.filter(
      (id: string) => id !== industryId,
    );
    setValue(`selectionCompanies.${index}.industries`, updatedIndustries, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const getSelectedIndustries = (index: number): string[] => {
    // selectedIndustriesMapからIDの配列を取得（存在しない場合は空配列）
    return (selectedIndustriesMap[index] || []).map(industry => industry.id);
  };

  const selectionCompanies = watch('selectionCompanies');

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
              転職活動状況
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
              転職活動状況編集
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
              {/* プロファイルアイコン */}
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z"
                  fill="white"
                />
                <path
                  d="M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z"
                  fill="white"
                />
                <path
                  d="M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z"
                  fill="white"
                />
                <path
                  d="M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z"
                  fill="white"
                />
                <path
                  d="M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z"
                  fill="white"
                />
                <path
                  d="M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z"
                  fill="white"
                />
              </svg>
            </div>
            <h1 className="text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]">
              転職活動状況編集
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
                <p className="text-[#323232] text-[16px] font-bold tracking-[1.4px] leading-8 text-left">
                  転職活動状況を編集できます。
                  <br />
                  興味がある企業や、進捗をアップデートしておくと、スカウトの質が高まります。
                  <br />
                  選考状況や志向が変わったときはぜひ更新してみてください。
                </p>
              </div>

              {/* 転職活動状況セクション */}
              <div className="mb-6 lg:mb-6">
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    転職活動状況
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-6 lg:space-y-2">
                  {/* 転職希望時期 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        転職希望時期
                      </div>
                    </div>
                    <div className="flex-1 py-2 lg:py-6">
                      <div className="relative">
                        <select
                          {...register('transferDesiredTime')}
                          className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-12 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                        >
                          {TRANSFER_DESIRED_TIME_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg
                            width="14"
                            height="10"
                            viewBox="0 0 14 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                              fill="#0F9058"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.transferDesiredTime && (
                        <p className="text-red-500 text-[14px] mt-1">
                          {errors.transferDesiredTime.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 現在の活動状況 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        現在の活動状況
                      </div>
                    </div>
                    <div className="flex-1 py-2 lg:py-6">
                      <div className="relative">
                        <select
                          {...register('currentActivityStatus')}
                          className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-12 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                        >
                          {CURRENT_ACTIVITY_STATUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg
                            width="14"
                            height="10"
                            viewBox="0 0 14 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                              fill="#0F9058"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.currentActivityStatus && (
                        <p className="text-red-500 text-[14px] mt-1">
                          {errors.currentActivityStatus.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 選考状況セクション */}
              <div>
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    選考状況
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-4">
                  {(selectionCompanies || []).map((company, index) => (
                    <div
                      key={index}
                      className="relative border border-[#dcdcdc] rounded-[10px] p-4 lg:p-6"
                    >
                      {/* 削除ボタン - 2個目以降のみ表示 */}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeCompany(index)}
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
                        {/* 公開範囲 */}
                        <div className="flex flex-col lg:flex-row lg:gap-6">
                          <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                            <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                              公開範囲
                            </div>
                          </div>
                          <div className="flex-1 py-2 lg:py-6">
                            <div className="flex items-start gap-2">
                              <div
                                className="w-5 h-5 mt-1 cursor-pointer"
                                onClick={() => {
                                  const currentValue = watch(
                                    `selectionCompanies.${index}.isPrivate`,
                                  );
                                  setValue(
                                    `selectionCompanies.${index}.isPrivate`,
                                    !currentValue,
                                    {
                                      shouldValidate: true,
                                      shouldDirty: true,
                                    },
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
                                        `selectionCompanies.${index}.isPrivate`,
                                      )
                                        ? '#0F9058'
                                        : '#DCDCDC'
                                    }
                                  />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <span className="block text-[16px] text-[#323232] font-bold tracking-[1.6px]">
                                  企業名を非公開（業種・進捗のみ公開）
                                </span>
                                <span className="block text-[14px] text-[#999999] font-medium tracking-[1.4px] mt-1">
                                  企業に選考状況を伝えることで、
                                  <br className="hidden lg:block" />
                                  スカウトの質やあなたへの興味度が高まりやすくなります。
                                  <br className="hidden lg:block" />
                                  ※選考中の企業には自動で非公開になります。
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 業種 */}
                        <div className="flex flex-col lg:flex-row lg:gap-6">
                          <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                            <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                              業種
                            </div>
                          </div>
                          <div className="flex-1 py-2 lg:py-6">
                            <div className="flex flex-col gap-2">
                              <button
                                type="button"
                                onClick={() => openIndustryModal(index)}
                                className="px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-full lg:w-fit"
                              >
                                業種を選択
                              </button>
                              <div className="flex flex-wrap gap-2">
                                {selectedIndustriesMap[index]?.map(
                                  (industry) => (
                                    <div
                                      key={industry.id}
                                      className="bg-[#d2f1da] px-6 py-2 rounded-[10px] flex items-center gap-2"
                                    >
                                      <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                                        {industry.name}
                                      </span>
                                      <button
                                        type="button"
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
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                          />
                                        </svg>
                                      </button>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 企業名 */}
                        <div className="flex flex-col lg:flex-row lg:gap-6">
                          <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                            <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                              企業名
                            </div>
                          </div>
                          <div className="flex-1 py-2 lg:py-6">
                            <input
                              type="text"
                              {...register(
                                `selectionCompanies.${index}.companyName`,
                              )}
                              placeholder="企業名を入力"
                              className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                            />
                          </div>
                        </div>

                        {/* 部署名・役職名 */}
                        <div className="flex flex-col lg:flex-row lg:gap-6">
                          <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                            <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                              部署名・役職名
                            </div>
                          </div>
                          <div className="flex-1 py-2 lg:py-6">
                            <input
                              type="text"
                              {...register(
                                `selectionCompanies.${index}.department`,
                              )}
                              placeholder="部署名・役職名を入力"
                              className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                            />
                          </div>
                        </div>

                        {/* 進捗状況 */}
                        <div className="flex flex-col lg:flex-row lg:gap-6">
                          <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                            <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                              進捗状況
                            </div>
                          </div>
                          <div className="flex-1 py-2 lg:py-6">
                            <div className="relative">
                              <select
                                {...register(
                                  `selectionCompanies.${index}.progressStatus`,
                                )}
                                className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-12 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                              >
                                <option value="">未選択</option>
                                {PROGRESS_STATUS_OPTIONS.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg
                                  width="14"
                                  height="10"
                                  viewBox="0 0 14 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                    fill="#0F9058"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 辞退理由 - 辞退選択時のみ表示 */}
                        {watch(`selectionCompanies.${index}.progressStatus`) ===
                          'declined' && (
                          <div className="flex flex-col lg:flex-row lg:gap-6">
                            <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center">
                              <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                                辞退理由
                              </div>
                            </div>
                            <div className="flex-1 py-2 lg:py-6">
                              <div className="relative">
                                <select
                                  {...register(
                                    `selectionCompanies.${index}.declineReason`,
                                  )}
                                  className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-12 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  <option value="">未選択</option>
                                  {DECLINE_REASON_OPTIONS.map((option) => (
                                    <option
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                  <svg
                                    width="14"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
                                      fill="#0F9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* 企業を追加ボタン */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={addCompany}
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
                      企業を追加
                    </button>
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

      {/* 業種選択モーダル */}
      {currentModalIndex !== null && (
        <IndustrySelectModal
          isOpen={true}
          onClose={closeIndustryModal}
          onConfirm={handleIndustriesConfirm}
          initialSelected={getSelectedIndustries(currentModalIndex)}
          maxSelections={3}
        />
      )}
    </>
  );
}
