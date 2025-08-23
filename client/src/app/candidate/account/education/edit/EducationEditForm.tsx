'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// フォームスキーマ定義
const educationSchema = z.object({
  educationHistory: z.array(
    z.object({
      schoolName: z.string().min(1, '学校名を入力してください'),
      department: z.string().optional(),
      graduationYear: z.string().min(1, '卒業年を入力してください'),
      graduationMonth: z.string().min(1, '卒業月を入力してください'),
      graduationStatus: z.string().min(1, '卒業状況を選択してください'),
    }),
  ),
});

type EducationFormData = z.infer<typeof educationSchema>;

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

// 卒業状況の選択肢
const GRADUATION_STATUS_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'graduated', label: '卒業' },
  { value: 'expected', label: '卒業見込' },
  { value: 'dropped', label: '中退' },
];

interface EducationEditFormProps {
  candidateData: any;
  educationData: any;
}

export default function EducationEditForm({ candidateData, educationData }: EducationEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      educationHistory: [
        {
          schoolName: '',
          department: '',
          graduationYear: '',
          graduationMonth: '',
          graduationStatus: '',
        },
      ],
    },
  });

  // 初期データを設定
  useEffect(() => {
    if (educationData && educationData.educationHistory) {
      reset({
        educationHistory: educationData.educationHistory.length > 0 
          ? educationData.educationHistory 
          : [
              {
                schoolName: '',
                department: '',
                graduationYear: '',
                graduationMonth: '',
                graduationStatus: '',
              },
            ],
      });
    }
  }, [educationData, reset]);

  const onSubmit = async () => {
    setIsSubmitting(true);
    // TODO: API呼び出し
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/candidate/account/education');
    }, 1000);
  };

  const handleCancel = () => {
    router.push('/candidate/account/education');
  };

  const addEducationHistory = () => {
    const currentHistory = getValues('educationHistory');
    setValue('educationHistory', [
      ...currentHistory,
      {
        schoolName: '',
        department: '',
        graduationYear: '',
        graduationMonth: '',
        graduationStatus: '',
      },
    ]);
  };

  const removeEducationHistory = (index: number) => {
    const currentHistory = getValues('educationHistory');
    setValue(
      'educationHistory',
      currentHistory.filter((_, i) => i !== index),
    );
  };

  const educationHistory = watch('educationHistory');

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
              学歴
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
              学歴編集
            </span>
          </div>

          {/* タイトル */}
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center">
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
              学歴編集
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
                <p className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-8 text-center lg:text-left">
                  学歴を登録・編集できます。
                </p>
              </div>

              {/* 学歴リスト */}
              <div className="space-y-4">
                {(educationHistory || []).map((_, index) => (
                  <div
                    key={index}
                    className="relative border border-[#dcdcdc] rounded-[10px] p-6"
                  >
                    {/* 削除ボタン */}
                    {(educationHistory || []).length > 1 && index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEducationHistory(index)}
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
                      {/* 学校名 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            学校名
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <input
                            type="text"
                            {...register(`educationHistory.${index}.schoolName`)}
                            placeholder="学校名を入力"
                            className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                          />
                          {errors.educationHistory?.[index]?.schoolName && (
                            <p className="text-red-500 text-[14px] mt-1">
                              {errors.educationHistory[index].schoolName?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 学部・学科 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            学部・学科
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <input
                            type="text"
                            {...register(`educationHistory.${index}.department`)}
                            placeholder="学部・学科を入力"
                            className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                          />
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
                          <div className="flex flex-wrap items-center gap-1 lg:gap-2 justify-between lg:justify-start w-fit max-w-[260px] lg:max-w-full lg:w-full">
                            <div className="relative">
                              <select
                                {...register(`educationHistory.${index}.graduationYear`)}
                                className="bg-white border font-bold border-[#999999] rounded-[5px] px-3 py-2 pr-4 text-[16px] text-[#323232] tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                              >
                                <option value="">未選択</option>
                                {YEAR_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M4.07178 6.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H8.8376C9.7937 0 10.3395 1.00828 9.7658 1.71483L5.92822 6.90462C5.46411 7.47624 4.53589 7.47624 4.07178 6.90462Z" fill="#0F9058" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">年</span>
                            <div className="relative">
                              <select
                                {...register(`educationHistory.${index}.graduationMonth`)}
                                className="bg-white border border-[#999999] rounded-[5px] px-3 py-2 pr-6 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                              >
                                <option value="">未選択</option>
                                {MONTH_OPTIONS.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                  <path d="M4.07178 6.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H8.8376C9.7937 0 10.3395 1.00828 9.7658 1.71483L5.92822 6.90462C5.46411 7.47624 4.53589 7.47624 4.07178 6.90462Z" fill="#0F9058" />
                                </svg>
                              </div>
                            </div>
                            <span className="text-[16px] text-[#323232] font-bold tracking-[1.6px]">月</span>
                          </div>
                          {(errors.educationHistory?.[index]?.graduationYear ||
                            errors.educationHistory?.[index]?.graduationMonth) && (
                            <p className="text-red-500 text-[14px] mt-1">
                              {errors.educationHistory[index].graduationYear?.message ||
                                errors.educationHistory[index].graduationMonth?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 卒業状況 */}
                      <div className="flex flex-col lg:flex-row lg:gap-6">
                        <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                          <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                            卒業状況
                          </div>
                        </div>
                        <div className="flex-1 lg:py-6">
                          <div className="relative">
                            <select
                              {...register(`educationHistory.${index}.graduationStatus`)}
                              className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-10 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                            >
                              {GRADUATION_STATUS_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                <path d="M7 10L0 0H14L7 10Z" fill="#0f9058" />
                              </svg>
                            </div>
                          </div>
                          {errors.educationHistory?.[index]?.graduationStatus && (
                            <p className="text-red-500 text-[14px] mt-1">
                              {errors.educationHistory[index].graduationStatus?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 学歴を追加ボタン */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={addEducationHistory}
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
                    学歴を追加
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
    </>
  );
}