'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getRecentJobData, updateRecentJobData } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import { type Industry, INDUSTRY_GROUPS } from '@/constants/industry-data';
import { type JobType, JOB_TYPE_GROUPS } from '@/constants/job-type-data';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import AddButton from '@/components/education/common/AddButton';
import JobHistoryEditRow from '@/components/education/common/JobHistoryEditRow';

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
    })
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

  // useForm, useFieldArray, useState, useEffect などのフックは必ずトップレベルで呼ぶ
  // 認証チェックやローディングによるearly returnはこの後で行う
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    control, // useFieldArray用
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
  const {
    fields: jobHistoryFields,
    append,
    remove,
    replace: replaceJobHistories,
  } = useFieldArray({
    control,
    name: 'jobHistories',
  });

  const addJobHistory = () =>
    append({
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
    });

  // 初期データを取得してフォームに設定
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getRecentJobData();
        if (data && data.jobHistories) {
          reset({
            jobHistories:
              data.jobHistories.length > 0
                ? data.jobHistories
                : [
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
          });

          // selectedMapsを初期データから再構築
          const industryMap: { [key: number]: Industry[] } = {};
          const jobTypeMap: { [key: number]: JobType[] } = {};
          data.jobHistories.forEach((job, index) => {
            if (job.industries && job.industries.length > 0) {
              const industries: Industry[] = job.industries
                .map((item: string) => {
                  const allIndustries = INDUSTRY_GROUPS.flatMap(
                    g => g.industries
                  );
                  return allIndustries.find(
                    i => i.id === item || i.name === item
                  );
                })
                .filter(Boolean) as Industry[];
              industryMap[index] = industries;
            }
            if (job.jobTypes && job.jobTypes.length > 0) {
              const jobTypes: JobType[] = job.jobTypes
                .map((item: string) => {
                  const allJobTypes = JOB_TYPE_GROUPS.flatMap(g => g.jobTypes);
                  return allJobTypes.find(
                    jt => jt.id === item || jt.name === item
                  );
                })
                .filter(Boolean) as JobType[];
              jobTypeMap[index] = jobTypes;
            }
          });
          setSelectedIndustriesMap(industryMap);
          setSelectedJobTypesMap(jobTypeMap);
          // useFieldArrayのreplaceで初期化
          replaceJobHistories(
            data.jobHistories.length > 0
              ? data.jobHistories
              : [
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
                ]
          );
        }
      } catch (error) {
        console.error('初期データの取得に失敗しました:', error);
      }
    };
    fetchInitialData();
  }, [reset, replaceJobHistories]);

  const onSubmit = async (data: RecentJobFormData) => {
    setIsSubmitting(true);

    try {
      // 全ての職歴を送信
      const formData = new FormData();
      formData.append('jobHistories', JSON.stringify(data.jobHistories));

      const result = await updateRecentJobData(formData);

      if (result.success) {
        router.push('/candidate/account/recent-job');
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
    router.push('/candidate/account/recent-job');
  };

  // 業種モーダル
  const openIndustryModal = (index: number) => {
    setCurrentIndustryModalIndex(index);
  };

  const closeIndustryModal = () => {
    setCurrentIndustryModalIndex(null);
  };

  const handleIndustriesConfirm = (industryIds: string[]) => {
    if (currentIndustryModalIndex !== null) {
      // IDからIndustryオブジェクトに変換
      const industries: Industry[] = industryIds
        .map(id =>
          INDUSTRY_GROUPS.flatMap(g => g.industries).find(i => i.id === id)
        )
        .filter(Boolean) as Industry[];

      // selectedIndustriesMapを更新
      setSelectedIndustriesMap(prev => ({
        ...prev,
        [currentIndustryModalIndex]: industries,
      }));

      // フォームフィールドの値も更新
      setValue(
        `jobHistories.${currentIndustryModalIndex}.industries`,
        industries.map(ind => ind.id),
        { shouldValidate: true, shouldDirty: true }
      );
      closeIndustryModal();
    }
  };

  const removeIndustry = (index: number, industryId: string) => {
    // selectedIndustriesMapから削除
    setSelectedIndustriesMap(prev => ({
      ...prev,
      [index]: prev[index]?.filter(ind => ind.id !== industryId) || [],
    }));

    // フォームフィールドからも削除
    const currentIndustries = watch(`jobHistories.${index}.industries`) || [];
    setValue(
      `jobHistories.${index}.industries`,
      currentIndustries.filter((id: string) => id !== industryId),
      { shouldValidate: true, shouldDirty: true }
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

  const handleJobTypesConfirm = (jobTypeIds: string[]) => {
    if (currentJobTypeModalIndex !== null) {
      // IDからJobTypeオブジェクトに変換
      const jobTypes: JobType[] = jobTypeIds
        .map(id =>
          JOB_TYPE_GROUPS.flatMap(g => g.jobTypes).find(jt => jt.id === id)
        )
        .filter(Boolean) as JobType[];

      // selectedJobTypesMapを更新
      setSelectedJobTypesMap(prev => ({
        ...prev,
        [currentJobTypeModalIndex]: jobTypes,
      }));

      // フォームフィールドの値も更新
      setValue(
        `jobHistories.${currentJobTypeModalIndex}.jobTypes`,
        jobTypes.map(jt => jt.id),
        { shouldValidate: true, shouldDirty: true }
      );
      closeJobTypeModal();
    }
  };

  const removeJobType = (index: number, jobTypeId: string) => {
    // selectedJobTypesMapから削除
    setSelectedJobTypesMap(prev => ({
      ...prev,
      [index]: prev[index]?.filter(jt => jt.id !== jobTypeId) || [],
    }));

    // フォームフィールドからも削除
    const currentJobTypes = watch(`jobHistories.${index}.jobTypes`) || [];
    setValue(
      `jobHistories.${index}.jobTypes`,
      currentJobTypes.filter((id: string) => id !== jobTypeId),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  const getSelectedJobTypes = (index: number): JobType[] => {
    // selectedJobTypesMapからデータを取得
    return selectedJobTypesMap[index] || [];
  };

  return (
    <>
      {/* メインコンテンツ */}
      <main className='flex-1 relative z-[2]'>
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          {/* パンくずリスト */}
          <div className='flex flex-wrap items-center gap-2 mb-2 lg:mb-4'>
            <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
              プロフィール確認・編集
            </span>
            <svg
              width='8'
              height='8'
              viewBox='0 0 8 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0'
            >
              <path
                d='M3 1L6 4L3 7'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
              職務経歴
            </span>
            <svg
              width='8'
              height='8'
              viewBox='0 0 8 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0'
            >
              <path
                d='M3 1L6 4L3 7'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span className='text-white text-[14px] font-bold tracking-[1.4px]'>
              職務経歴編集
            </span>
          </div>

          {/* タイトル */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center'>
              {/* プロファイルアイコン */}
              <svg
                width='28'
                height='32'
                viewBox='0 0 28 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M6.34868 0H16.9813H17.8047L18.3871 0.581312L26.4372 8.63138L27.0186 9.21319V10.0366V26.6313C27.0186 29.5911 24.6102 32 21.6498 32H6.34862C3.38936 32 0.98099 29.5911 0.98099 26.6313V5.36763C0.981053 2.40775 3.38937 0 6.34868 0ZM2.96874 26.6313C2.96874 28.4984 4.48199 30.0123 6.34862 30.0123H21.6498C23.517 30.0123 25.0308 28.4984 25.0308 26.6313V10.0367H19.7984C18.2432 10.0367 16.9813 8.77525 16.9813 7.21956V1.98763H6.34862C4.48199 1.98763 2.96874 3.5015 2.96874 5.36756V26.6313Z'
                  fill='white'
                />
                <path
                  d='M8.58029 9.96484C9.05954 10.3003 9.64304 10.4984 10.271 10.4984C10.8995 10.4984 11.4825 10.3003 11.9624 9.96484C12.801 10.3258 13.3161 10.9587 13.6304 11.5178C14.0478 12.2593 13.7205 13.309 12.9996 13.309C12.2777 13.309 10.271 13.309 10.271 13.309C10.271 13.309 8.26492 13.309 7.54298 13.309C6.8216 13.309 6.49379 12.2593 6.91173 11.5178C7.22604 10.9587 7.74117 10.3258 8.58029 9.96484Z'
                  fill='white'
                />
                <path
                  d='M10.2711 9.79659C9.03838 9.79659 8.04019 8.79841 8.04019 7.56628V7.03166C8.04019 5.80066 9.03838 4.80078 10.2711 4.80078C11.5032 4.80078 12.5024 5.80066 12.5024 7.03166V7.56628C12.5024 8.79841 11.5031 9.79659 10.2711 9.79659Z'
                  fill='white'
                />
                <path
                  d='M6.87283 16.2734H21.2725V17.6716H6.87283V16.2734Z'
                  fill='white'
                />
                <path
                  d='M6.80008 20.4688H21.1997V21.8675H6.80008V20.4688Z'
                  fill='white'
                />
                <path
                  d='M6.85304 24.6641H16.9331V26.0618H6.85304V24.6641Z'
                  fill='white'
                />
              </svg>
            </div>
            <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
              職務経歴編集
            </h1>
          </div>
        </div>

        {/* フォーム部分 */}
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-center gap-6 lg:gap-10'
          >
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              {/* 説明文セクション */}
              <div className='mb-6'>
                <p className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-8 text-left'>
                  ご自身の職務経歴を編集できます。
                  <br />
                  ご経験に変化があった際は、最新の情報に更新してください。更新内容は、履歴書・職務経歴書にも反映されます。
                </p>
              </div>

              {/* 職務経歴リスト */}
              <div className='space-y-4'>
                {jobHistoryFields.map((field, index) => (
                  <JobHistoryEditRow
                    key={field.id}
                    index={index}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    remove={remove}
                    openIndustryModal={openIndustryModal}
                    openJobTypeModal={openJobTypeModal}
                    selectedIndustries={getSelectedIndustries(index)}
                    selectedJobTypes={getSelectedJobTypes(index)}
                    errors={errors}
                    monthOptions={MONTH_OPTIONS}
                    yearOptions={YEAR_OPTIONS}
                    removeIndustry={removeIndustry}
                    removeJobType={removeJobType}
                  />
                ))}

                {/* 職務経歴を追加ボタン */}
                <div className='flex justify-center'>
                  <AddButton label='企業を追加' onClick={addJobHistory} />
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className='flex gap-4 w-full lg:w-auto'>
              <Button
                type='button'
                variant='green-outline'
                size='figma-default'
                onClick={handleCancel}
                className='min-w-[160px] flex-1 lg:flex-none text-[16px] tracking-[1.6px]'
              >
                キャンセル
              </Button>
              <Button
                type='submit'
                variant='green-gradient'
                size='figma-default'
                disabled={isSubmitting}
                className='min-w-[160px] flex-1 lg:flex-none text-[16px] tracking-[1.6px]'
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
          initialSelected={getSelectedIndustries(currentIndustryModalIndex).map(
            i => i.id
          )}
          maxSelections={3}
        />
      )}

      {/* 職種選択モーダル */}
      {currentJobTypeModalIndex !== null && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={closeJobTypeModal}
          onConfirm={handleJobTypesConfirm}
          initialSelected={getSelectedJobTypes(currentJobTypeModalIndex).map(
            jt => jt.id
          )}
          maxSelections={3}
        />
      )}
    </>
  );
}
