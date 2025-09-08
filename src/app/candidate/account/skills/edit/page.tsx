'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getSkillsData, updateSkillsData } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCandidateAuth } from '@/hooks/useClientAuth';

// フォームスキーマ定義
const skillsSchema = z.object({
  englishLevel: z.string().optional(),
  otherLanguages: z.array(
    z.object({
      language: z.string().optional(),
      level: z.string().optional(),
    }),
  ),
  skills: z.array(z.string()),
  qualifications: z.string().optional(),
});

type SkillsFormData = z.infer<typeof skillsSchema>;

// 英語レベルの選択肢
const ENGLISH_LEVELS = [
  { value: '', label: 'レベルを選択' },
  { value: 'native', label: 'ネイティブ' },
  { value: 'business', label: 'ビジネスレベル' },
  { value: 'conversation', label: '日常会話' },
  { value: 'basic', label: '基礎会話' },
  { value: 'none', label: 'なし' },
];

// その他言語の選択肢
const LANGUAGE_OPTIONS = [
  { value: '', label: '言語を選択' },
  { value: 'インドネシア語', label: 'インドネシア語' },
  { value: 'イタリア語', label: 'イタリア語' },
  { value: 'スペイン語', label: 'スペイン語' },
  { value: 'タイ語', label: 'タイ語' },
  { value: 'ドイツ語', label: 'ドイツ語' },
  { value: 'フランス語', label: 'フランス語' },
  { value: 'ポルトガル語', label: 'ポルトガル語' },
  { value: 'マレー語', label: 'マレー語' },
  { value: 'ロシア語', label: 'ロシア語' },
  { value: '韓国語', label: '韓国語' },
  { value: '中国語（簡体字）', label: '中国語（簡体字）' },
  { value: '中国語（繁体字）', label: '中国語（繁体字）' },
  { value: 'ベトナム語', label: 'ベトナム語' },
  { value: 'アラビア語', label: 'アラビア語' },
  { value: 'ヒンディー語', label: 'ヒンディー語' },
  { value: 'オランダ語', label: 'オランダ語' },
  { value: 'スウェーデン語', label: 'スウェーデン語' },
  { value: 'ポーランド語', label: 'ポーランド語' },
  { value: 'トルコ語', label: 'トルコ語' },
  { value: '日本語', label: '日本語' },
  { value: 'ベンガル語', label: 'ベンガル語' },
  { value: 'タガログ語', label: 'タガログ語' },
  { value: 'タミル語', label: 'タミル語' },
  { value: 'ミャンマー語', label: 'ミャンマー語' },
];

// 候補者_資格・語学・スキル編集ページ
export default function CandidateSkillsEditPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skillInput, setSkillInput] = useState('');

  const { register, handleSubmit, watch, setValue, getValues, reset } =
    useForm<SkillsFormData>({
      resolver: zodResolver(skillsSchema),
      defaultValues: {
        englishLevel: '',
        otherLanguages: [{ language: '', level: '' }],
        skills: [],
        qualifications: '',
      },
    });

  // 認証チェック
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  // 初期データを取得してフォームに設定
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getSkillsData();
        if (data) {
          reset({
            englishLevel: data.englishLevel || '',
            otherLanguages: data.otherLanguages && data.otherLanguages.length > 0 
              ? data.otherLanguages 
              : [{ language: '', level: '' }],
            skills: data.skills || [],
            qualifications: data.qualifications || '',
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

  const onSubmit = async (data: SkillsFormData) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('englishLevel', data.englishLevel || '');
      formData.append('qualifications', data.qualifications || '');
      formData.append('skills', JSON.stringify(data.skills || []));
      formData.append('otherLanguages', JSON.stringify(data.otherLanguages || []));

      const result = await updateSkillsData(formData);
      
      if (result.success) {
        router.push('/candidate/account/skills');
      } else {
        console.error('更新エラー:', result.error);
        alert('更新に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert('更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/candidate/account/skills');
  };

  // その他の言語を追加
  const addOtherLanguage = () => {
    const currentLanguages = getValues('otherLanguages');
    setValue('otherLanguages', [
      ...currentLanguages,
      { language: '', level: '' },
    ]);
  };

  // その他の言語を削除
  const removeOtherLanguage = (index: number) => {
    const currentLanguages = getValues('otherLanguages');
    setValue(
      'otherLanguages',
      currentLanguages.filter((_, i) => i !== index),
    );
  };

  // スキルを追加
  const addSkill = (skill: string) => {
    const currentSkills = getValues('skills') || [];
    if (!currentSkills.includes(skill)) {
      setValue('skills', [...currentSkills, skill]);
    }
  };

  // スキルを削除
  const removeSkill = (skill: string) => {
    const currentSkills = getValues('skills') || [];
    setValue(
      'skills',
      currentSkills.filter((s) => s !== skill),
    );
  };

  // カスタムスキルを追加
  const addCustomSkill = () => {
    if (skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  };

  const otherLanguages = watch('otherLanguages');
  const selectedSkills = watch('skills');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !candidateUser) {
    return null;
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
              語学・スキル
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
              語学・スキル編集
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
              語学・スキル編集
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
                  語学・スキル情報を編集できます。
                  <br className="hidden md:block" />
                  内容は履歴書・職務経歴書にも反映されます。
                </p>
              </div>

              {/* 語学セクション */}
              <div className="mb-6 lg:mb-6">
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    語学
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-6 lg:space-y-2">
                  {/* 英語 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        英語
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="relative">
                        <select
                          {...register('englishLevel')}
                          className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-10 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                        >
                          {ENGLISH_LEVELS.map((level) => (
                            <option key={level.value} value={level.value}>
                              {level.label}
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
                    </div>
                  </div>

                  {/* その他の言語 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0">
                        その他の言語
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="space-y-4">
                        {(otherLanguages || []).map((_, index) => (
                          <div key={index} className="space-y-2 relative">
                            <div className="flex flex-col gap-2">
                              <div className="relative">
                                <select
                                  {...register(
                                    `otherLanguages.${index}.language`,
                                  )}
                                  className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-10 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  {LANGUAGE_OPTIONS.map((lang) => (
                                    <option key={lang.value} value={lang.value}>
                                      {lang.label}
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
                                    <path
                                      d="M7 10L0 0H14L7 10Z"
                                      fill="#0f9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                              <div className="relative">
                                <select
                                  {...register(`otherLanguages.${index}.level`)}
                                  className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-10 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]"
                                >
                                  {ENGLISH_LEVELS.map((level) => (
                                    <option
                                      key={level.value}
                                      value={level.value}
                                    >
                                      {level.label}
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
                                    <path
                                      d="M7 10L0 0H14L7 10Z"
                                      fill="#0f9058"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {otherLanguages.length > 1 && index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeOtherLanguage(index)}
                                className="absolute -right-6 top-4 w-6 h-6 flex items-center justify-center"
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
                          </div>
                        ))}
                        {/* 言語を追加ボタン */}
                        <div className="flex justify-center justify-center mt-4">
                          <button
                            type="button"
                            onClick={addOtherLanguage}
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
                            言語を追加
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* スキルセクション */}
              <div>
                <div className="mb-2">
                  <h2 className="text-[#323232] text-[18px] lg:text-[20px] font-bold tracking-[1.8px] lg:tracking-[2px] leading-[1.6]">
                    スキル
                  </h2>
                </div>
                <div className="border-b border-[#dcdcdc] mb-6"></div>

                <div className="space-y-6 lg:space-y-2">
                  {/* スキル */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px]">
                        スキル
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && skillInput.trim()) {
                              e.preventDefault();
                              addCustomSkill();
                            }
                          }}
                          placeholder="スキルを入力"
                          className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058]"
                        />
                        <p className="text-[#999999] text-[14px] font-bold tracking-[1.4px]">
                          ※最低3つ以上のキーワードを選択/登録してください。
                        </p>
                        {/* 選択されたスキル */}
                        {(selectedSkills || []).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {(selectedSkills || []).map((skill) => (
                              <div
                                key={skill}
                                className="bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] flex items-center gap-2"
                              >
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skill)}
                                  className="ml-1"
                                >
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 10 10"
                                    fill="none"
                                  >
                                    <path
                                      d="M1 1L9 9M1 9L9 1"
                                      stroke="#0f9058"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 保有資格 */}
                  <div className="flex flex-col lg:flex-row lg:gap-6">
                    <div className="bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0">
                      <div className="font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0">
                        保有資格
                      </div>
                    </div>
                    <div className="flex-1 lg:py-6">
                      <div className="space-y-2">
                        <textarea
                          {...register('qualifications')}
                          placeholder="保有資格を入力"
                          rows={5}
                          className="w-full bg-white border border-[#999999] rounded-[5px] px-4 py-3 text-[16px] text-[#323232] font-bold tracking-[1.6px] placeholder-[#999999] focus:outline-none focus:border-[#0f9058] resize-none"
                        />
                        <p className="text-[#999999] text-[14px] font-bold tracking-[1.4px]">
                          ※履歴書・職務経歴書をアップロードした場合、記載内容に追記されます。
                        </p>
                      </div>
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
    </>
  );
}
