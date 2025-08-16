'use client';

import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { Navigation } from '@/components/ui/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, KeyboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// 言語レベルの選択肢
const ENGLISH_LEVELS = [
  { value: '', label: 'レベルを選択' },
  { value: 'native', label: 'ネイティブ' },
  { value: 'business', label: 'ビジネスレベル' },
  { value: 'conversation', label: '日常会話' },
  { value: 'basic', label: '基礎会話' },
  { value: 'none', label: 'なし' },
] as const;

// その他言語の選択肢
const OTHER_LANGUAGES = [
  { value: '', label: '言語を選択' },
  { value: 'indonesian', label: 'インドネシア語' },
  { value: 'italian', label: 'イタリア語' },
  { value: 'spanish', label: 'スペイン語' },
  { value: 'thai', label: 'タイ語' },
  { value: 'german', label: 'ドイツ語' },
  { value: 'french', label: 'フランス語' },
  { value: 'portuguese', label: 'ポルトガル語' },
  { value: 'malaysian', label: 'マレー語' },
  { value: 'russian', label: 'ロシア語' },
  { value: 'korean', label: '韓国語' },
  { value: 'chinese-simplified', label: '中国語（簡体字）' },
  { value: 'chinese-traditional', label: '中国語（繁体字）' },
  { value: 'vietnamese', label: 'ベトナム語' },
  { value: 'arabic', label: 'アラビア語' },
  { value: 'hindi', label: 'ヒンディー語' },
  { value: 'dutch', label: 'オランダ語' },
  { value: 'swedish', label: 'スウェーデン語' },
  { value: 'polish', label: 'ポーランド語' },
  { value: 'turkish', label: 'トルコ語' },
  { value: 'japanese', label: '日本語' },
  { value: 'bengali', label: 'ベンガル語' },
  { value: 'tagalog', label: 'タガログ語' },
  { value: 'tamil', label: 'タミル語' },
  { value: 'burmese', label: 'ミャンマー語' },
] as const;

// バリデーションスキーマ
const skillsSchema = z.object({
  englishLevel: z.string().min(1, '英語レベルを選択してください'),
  otherLanguages: z
    .array(
      z.object({
        language: z.string(),
        level: z.string(),
      }),
    )
    .max(5, '言語は最大5つまで追加できます')
    .superRefine((languages, ctx) => {
      languages.forEach((lang, index) => {
        if (
          lang.language &&
          lang.language !== '' &&
          (!lang.level || lang.level === '')
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '言語を選択した場合はレベルも選択してください',
            path: [index, 'level'],
          });
        }
      });
    }),
  skills: z.array(z.string()).min(3, 'スキルは最低3つ以上入力してください'),
  qualifications: z.string().optional(),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

export default function SignupSkillsPage() {
  const router = useRouter();
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<SkillsFormData>({
    resolver: zodResolver(skillsSchema),
    mode: 'onChange',
    defaultValues: {
      englishLevel: '',
      otherLanguages: [],
      skills: [],
      qualifications: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'otherLanguages',
  });

  const watchOtherLanguages = watch('otherLanguages');
  const watchSkills = watch('skills');

  // Initialize with one empty language field
  useEffect(() => {
    if (fields.length === 0) {
      append({ language: '', level: '' });
    }
  }, [fields.length, append]);

  const handleAddLanguage = () => {
    if (fields.length < 5) {
      append({ language: '', level: '' });
    }
  };

  const handleSkillInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!watchSkills.includes(newSkill)) {
        setValue('skills', [...watchSkills, newSkill], {
          shouldValidate: true,
        });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue(
      'skills',
      watchSkills.filter((skill) => skill !== skillToRemove),
      { shouldValidate: true },
    );
  };

  const onSubmit = (_data: SkillsFormData) => {
    router.push('/signup/expectation');
  };

  // PCとモバイルで異なるコンポーネントをレンダリング
  if (isDesktop) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Navigation
          variant="candidate"
          isLoggedIn={false}
          userInfo={undefined}
        />

        {/* PC Version */}
        <form onSubmit={handleSubmit(onSubmit)}>
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
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.625 3.5H15.375C15.5813 3.5 15.75 3.66875 15.75 3.875V5.75H8.25V3.875C8.25 3.66875 8.41875 3.5 8.625 3.5ZM6 3.875V5.75H3C1.34531 5.75 0 7.09531 0 8.75V13.25H9H15H24V8.75C24 7.09531 22.6547 5.75 21 5.75H18V3.875C18 2.42656 16.8234 1.25 15.375 1.25H8.625C7.17656 1.25 6 2.42656 6 3.875ZM24 14.75H15V16.25C15 17.0797 14.3297 17.75 13.5 17.75H10.5C9.67031 17.75 9 17.0797 9 16.25V14.75H0V20.75C0 22.4047 1.34531 23.75 3 23.75H21C22.6547 23.75 24 22.4047 24 20.75V14.75Z"
                        fill="#DCDCDC"
                      />
                    </svg>
                  </div>
                  <span className="text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]">
                    経歴詳細
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
                        d="M16.6687 2.45833L22.6582 8.44427C25.1139 10.8979 25.1139 14.8422 22.6582 17.2959L17.4092 22.5411C16.9733 22.9763 16.261 22.9809 15.8204 22.5503C15.3799 22.1198 15.3752 21.4161 15.8111 20.9809L21.0554 15.7357C22.6441 14.1478 22.6441 11.597 21.0554 10.009L15.0706 4.0231C14.6347 3.58793 14.6394 2.88425 15.08 2.4537C15.5205 2.02316 16.2329 2.02779 16.6687 2.46296V2.45833ZM0.5 11.2729V4.3518C0.5 3.12498 1.50762 2.12964 2.74956 2.12964H9.756C10.5527 2.12964 11.3166 2.43981 11.879 2.99535L19.7525 10.7729C20.9241 11.9303 20.9241 13.8052 19.7525 14.9626L13.4959 21.143C12.3243 22.3004 10.4262 22.3004 9.25454 21.143L1.38108 13.3654C0.814001 12.8099 0.5 12.0599 0.5 11.2729ZM7.24868 7.31467C7.24868 6.92177 7.09068 6.54496 6.80943 6.26714C6.52818 5.98931 6.14672 5.83324 5.74897 5.83324C5.35123 5.83324 4.96977 5.98931 4.68852 6.26714C4.40727 6.54496 4.24927 6.92177 4.24927 7.31467C4.24927 7.70758 4.40727 8.08439 4.68852 8.36221C4.96977 8.64003 5.35123 8.79611 5.74897 8.79611C6.14672 8.79611 6.52818 8.64003 6.80943 8.36221C7.09068 8.08439 7.24868 7.70758 7.24868 7.31467Z"
                        fill="#0F9058"
                      />
                    </svg>
                  </div>
                  <span className="text-[#0f9058] text-[18px] font-bold tracking-[1.8px]">
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
                  あなたの語学力やスキルは、企業から見た「強み」になります。
                </p>
                <p>
                  スカウトのマッチ度や関心度を高めるために、ぜひご記入ください。
                </p>
              </div>

              {/* Language Section */}
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
                  語学
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

              {/* Language Form Fields */}
              <div className="flex flex-col gap-6 w-[520px] items-end">
                {/* English */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      英語
                    </label>
                  </div>
                  <div className="w-[400px]">
                    <div className="relative">
                      <select
                        {...register('englishLevel')}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                      >
                        {ENGLISH_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
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
                    {errors.englishLevel && (
                      <p className="text-red-500 text-[14px] mt-1">
                        {errors.englishLevel.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Other Languages */}
                <div className="flex flex-col gap-2 w-full">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex flex-row gap-4 items-start relative"
                    >
                      <div className="pt-[11px] min-w-[130px] text-right">
                        {index === 0 && (
                          <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                            その他の言語
                          </label>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 w-[400px]">
                        <div className="relative">
                          <select
                            {...register(
                              `otherLanguages.${index}.language` as const,
                            )}
                            className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                          >
                            {OTHER_LANGUAGES.map((lang) => (
                              <option key={lang.value} value={lang.value}>
                                {lang.label}
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
                        <div className="relative">
                          <select
                            {...register(
                              `otherLanguages.${index}.level` as const,
                            )}
                            disabled={!watchOtherLanguages[index]?.language}
                            className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer disabled:opacity-50"
                          >
                            {ENGLISH_LEVELS.map((level) => (
                              <option key={level.value} value={level.value}>
                                {level.label}
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
                        {errors.otherLanguages?.[index]?.level && (
                          <p className="text-red-500 text-[12px] mt-1">
                            {errors.otherLanguages[index].level?.message}
                          </p>
                        )}
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute right-[-30px] top-[15px]"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.275391 0.274902C0.642879 -0.0925724 1.23886 -0.0924205 1.60645 0.274902L8 6.66846L14.3936 0.275879C14.7611 -0.0916649 15.357 -0.0916051 15.7246 0.275879C16.0922 0.643453 16.0922 1.23936 15.7246 1.60693L9.33105 7.99951L15.7246 14.3931L15.7578 14.4282C16.0914 14.7977 16.0806 15.3681 15.7246 15.7241C15.3686 16.0801 14.7982 16.0909 14.4287 15.7573L14.3936 15.7241L8 9.33057L1.60742 15.7251L1.57227 15.7583C1.20284 16.092 0.632419 16.081 0.276367 15.7251C-0.0796619 15.3691 -0.090524 14.7987 0.243164 14.4292L0.276367 14.394L6.66895 7.99951L0.275391 1.60596C-0.0919365 1.23837 -0.0920968 0.64239 0.275391 0.274902Z"
                              fill="#999999"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Language Button */}
                  {fields.length < 5 && (
                    <div>
                      <div className="min-w-[130px]"></div>
                      <div className="w-fit mx-auto flex justify-center">
                        <button
                          type="button"
                          onClick={handleAddLanguage}
                          className="px-6 py-2.5 bg-white border border-[#0f9058] rounded-[32px] flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8 3V13M3 8H13"
                              stroke="#0f9058"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                            言語を追加
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Section */}
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
                  スキル
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

              {/* Skills Form Fields */}
              <div className="flex flex-col gap-6 w-fit items-end">
                {/* Skills Input */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      スキル
                    </label>
                  </div>
                  <div className="flex flex-col gap-2 w-[400px]">
                    <textarea
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillInputKeyDown}
                      placeholder="業務で活かしたスキル・ツール・得意分野を入力してください"
                      className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#999999] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[80px] resize-none"
                    />
                    <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                      ※最低3つ以上のキーワードを選択/登録してください。
                    </p>
                    {watchSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {watchSkills.map((skill) => (
                          <div
                            key={skill}
                            className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                          >
                            <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                              {skill}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="w-3 h-3"
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
                    )}
                    {errors.skills && (
                      <p className="text-red-500 text-[14px]">
                        {errors.skills.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Qualifications */}
                <div className="flex flex-row gap-4 items-start w-full">
                  <div className="pt-[11px] min-w-[130px] text-right">
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      保有資格
                    </label>
                  </div>
                  <div className="flex flex-col gap-2 w-[400px]">
                    <textarea
                      {...register('qualifications')}
                      placeholder="例）TOEIC850点、簿記2級、中小企業診断士など"
                      className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#999999] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[147px] resize-none"
                    />
                    <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                      ※履歴書・職務経歴書をアップロードした場合、記載内容に追記されます。
                    </p>
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
          </main>
        </form>

        <AuthAwareFooter />
      </div>
    );
  }

  // Mobile Version
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />

      {/* SP (Mobile) Version */}
      <form onSubmit={handleSubmit(onSubmit)}>
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
                    strokeDasharray="90.48 90.48"
                    transform="rotate(-90 36 36)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-[#0f9058] text-[24px] font-medium tracking-[2.4px]">
                      2
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
                  語学・スキル
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold">
              <p>あなたの語学力やスキルは、</p>
              <p>企業から見た「強み」になります。</p>
              <p>スカウトのマッチ度や関心度を高める</p>
              <p>ために、ぜひご記入ください。</p>
            </div>

            {/* Language Section */}
            <div className="flex flex-row w-full items-center justify-center gap-4">
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
              <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px] text-nowrap">
                語学
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

            {/* Language Form Fields */}
            <div className="flex flex-col gap-6 w-full">
              {/* English */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  英語
                </label>
                <div className="relative">
                  <select
                    {...register('englishLevel')}
                    className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                  >
                    {ENGLISH_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
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
                {errors.englishLevel && (
                  <p className="text-red-500 text-[14px]">
                    {errors.englishLevel.message}
                  </p>
                )}
              </div>

              {/* Other Languages */}
              {fields.map((field, index) => (
                <div key={field.id} className="flex flex-col gap-2">
                  {index === 0 && (
                    <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                      その他の言語
                    </label>
                  )}
                  <div className="flex flex-col gap-2">
                    <div className="relative">
                      <select
                        {...register(
                          `otherLanguages.${index}.language` as const,
                        )}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer"
                      >
                        {OTHER_LANGUAGES.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
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
                    <div className="relative">
                      <select
                        {...register(`otherLanguages.${index}.level` as const)}
                        disabled={!watchOtherLanguages[index]?.language}
                        className="w-full px-[11px] py-[11px] pr-10 bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer disabled:opacity-50"
                      >
                        {ENGLISH_LEVELS.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
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
                    {errors.otherLanguages?.[index]?.level && (
                      <p className="text-red-500 text-[12px] mt-1">
                        {errors.otherLanguages[index].level?.message}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Add Language Button */}
              {fields.length < 5 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleAddLanguage}
                    className="px-6 py-2.5 bg-white border border-[#0f9058] rounded-[32px] flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M8 3V13M3 8H13"
                        stroke="#0f9058"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="text-[#0f9058] text-[14px] font-bold tracking-[1.4px]">
                      言語を追加
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="flex flex-row w-full items-center justify-center gap-4">
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
              <span className="text-[#323232] text-[16px] font-bold tracking-[1.6px] text-nowrap">
                スキル
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

            {/* Skills Form Fields */}
            <div className="flex flex-col gap-6 w-full">
              {/* Skills Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  スキル
                </label>
                <textarea
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="業務で活かしたスキル・ツール・得意分野を入力してください"
                  className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#999999] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[90px] resize-none"
                />
                <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                  ※最低3つ以上のキーワードを選択/登録してください。
                </p>
                {watchSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {watchSkills.map((skill) => (
                      <div
                        key={skill}
                        className="bg-[#d2f1da] px-6 py-[10px] rounded-[10px] flex items-center gap-2.5"
                      >
                        <span className="text-[#0f9058] text-[14px] font-medium tracking-[1.4px]">
                          {skill}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="w-3 h-3"
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
                )}
                {errors.skills && (
                  <p className="text-red-500 text-[14px]">
                    {errors.skills.message}
                  </p>
                )}
              </div>

              {/* Qualifications */}
              <div className="flex flex-col gap-2">
                <label className="text-[#323232] text-[16px] font-bold tracking-[1.6px]">
                  保有資格
                </label>
                <textarea
                  {...register('qualifications')}
                  placeholder="例）TOEIC850点、簿記2級、中小企業診断士など"
                  className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#999999] font-medium tracking-[1.6px] placeholder:text-[#999999] min-h-[147px] resize-none"
                />
                <p className="text-[#999999] text-[14px] font-medium tracking-[1.4px]">
                  ※履歴書・職務経歴書をアップロードした場合、記載内容に追記されます。
                </p>
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
        </main>
      </form>

      <AuthAwareFooter />
    </div>
  );
}
