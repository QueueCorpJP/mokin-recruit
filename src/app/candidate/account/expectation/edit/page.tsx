'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { getExpectationData, updateExpectationData } from './actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import JobTypeSelectModal from '@/components/career-status/JobTypeSelectModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { type Industry, INDUSTRY_GROUPS } from '@/constants/industry-data';
import { type JobType, JOB_TYPE_GROUPS } from '@/constants/job-type-data';
import { SALARY_OPTIONS } from 'src/constants/expectation';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import FormRow from '@/components/education/common/FormRow';
import Section from '@/components/education/common/Section';
import SectionCard from '@/components/education/common/SectionCard';
import FormActions from '@/components/education/common/FormActions';
import TagList from '@/components/education/common/TagList';
import SelectButton from '@/components/education/common/SelectButton';

// フォームスキーマ定義
const expectationSchema = z.object({
  desiredIncome: z.string().min(1, '希望年収を選択してください'),
  industries: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, '業種を選択してください')
    .max(3, '業種は最大3つまで選択可能です'),
  jobTypes: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, '職種を選択してください')
    .max(3, '職種は最大3つまで選択可能です'),
  workLocations: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, '勤務地を選択してください'),
  workStyles: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, '働き方を選択してください'),
});

type ExpectationFormData = z.infer<typeof expectationSchema>;

// 候補者_希望条件編集ページ
export default function CandidateExpectationEditPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);
  const [isWorkLocationModalOpen, setIsWorkLocationModalOpen] = useState(false);
  const [isWorkStyleModalOpen, setIsWorkStyleModalOpen] = useState(false);

  // 認証チェック
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpectationFormData>({
    resolver: zodResolver(expectationSchema),
    defaultValues: {
      desiredIncome: '',
      industries: [],
      jobTypes: [],
      workLocations: [],
      workStyles: [],
    },
    mode: 'onChange',
  });

  // 初期データを取得してフォームに設定
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getExpectationData();
        if (data) {
          reset({
            desiredIncome: data.desiredIncome || '',
            industries: data.industries || [],
            jobTypes: data.jobTypes || [],
            workLocations: data.workLocations || [],
            workStyles: data.workStyles || [],
          });
        }
      } catch (error) {
        console.error('初期データの取得に失敗しました:', error);
      }
    };
    fetchInitialData();
  }, [reset]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-pulse'>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !candidateUser) {
    return null;
  }

  const onSubmit = async (data: ExpectationFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('desiredIncome', data.desiredIncome || '');
      formData.append('industries', JSON.stringify(data.industries || []));
      formData.append('jobTypes', JSON.stringify(data.jobTypes || []));
      formData.append(
        'workLocations',
        JSON.stringify(data.workLocations || [])
      );
      formData.append('workStyles', JSON.stringify(data.workStyles || []));

      const result = await updateExpectationData(formData);

      if (result.success) {
        router.push('/candidate/account/expectation');
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
    router.push('/candidate/account/expectation');
  };

  // 業種モーダル
  const handleIndustriesConfirm = (industryIds: string[]) => {
    // IDからIndustryオブジェクトに変換
    const industries: Industry[] = industryIds
      .map(id =>
        INDUSTRY_GROUPS.flatMap(g => g.industries).find(i => i.id === id)
      )
      .filter(Boolean) as Industry[];
    setValue('industries', industries, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  };

  const removeIndustry = (industryId: string) => {
    const currentIndustries = watch('industries') || [];
    setValue(
      'industries',
      currentIndustries.filter(industry => industry.id !== industryId),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  // 職種モーダル
  const handleJobTypesConfirm = (jobTypeIds: string[]) => {
    // IDからJobTypeオブジェクトに変換
    const jobTypes: JobType[] = jobTypeIds
      .map(id =>
        JOB_TYPE_GROUPS.flatMap(g => g.jobTypes).find(jt => jt.id === id)
      )
      .filter(Boolean) as JobType[];
    setValue('jobTypes', jobTypes, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
  };

  const removeJobType = (jobTypeId: string) => {
    const currentJobTypes = watch('jobTypes') || [];
    setValue(
      'jobTypes',
      currentJobTypes.filter(jobType => jobType.id !== jobTypeId),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  // 勤務地モーダル
  interface Prefecture {
    id: string;
    name: string;
  }

  const handleLocationsConfirm = (locations: Prefecture[]) => {
    setValue('workLocations', locations, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsWorkLocationModalOpen(false);
  };

  const removeLocation = (locationId: string) => {
    const currentLocations = watch('workLocations') || [];
    setValue(
      'workLocations',
      currentLocations.filter(loc => loc.id !== locationId),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  // 働き方モーダル
  interface WorkStyle {
    id: string;
    name: string;
  }

  const handleWorkStylesConfirm = (workStyles: WorkStyle[]) => {
    setValue('workStyles', workStyles, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsWorkStyleModalOpen(false);
  };

  const removeWorkStyle = (workStyleId: string) => {
    const currentWorkStyles = watch('workStyles') || [];
    setValue(
      'workStyles',
      currentWorkStyles.filter(style => style.id !== workStyleId),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const industries = watch('industries');
  const jobTypes = watch('jobTypes');
  const workLocations = watch('workLocations');
  const workStyles = watch('workStyles');

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
              希望条件
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
              希望条件編集
            </span>
          </div>

          {/* タイトル */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center'>
              {/* プロフィールアイコン */}
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
              希望条件編集
            </h1>
          </div>
        </div>

        {/* フォーム部分 */}
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-center gap-6 lg:gap-10'
          >
            <SectionCard>
              <Section title='希望条件'>
                <FormRow
                  label='希望年収'
                  error={errors.desiredIncome?.message || ''}
                >
                  <select
                    {...register('desiredIncome')}
                    className='w-full bg-white border border-[#999999] rounded-[5px] px-4 py-[11px] pr-10 text-[16px] text-[#323232] font-bold tracking-[1.6px] appearance-none cursor-pointer focus:outline-none focus:border-[#0f9058]'
                  >
                    <option value=''>未選択</option>
                    {SALARY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormRow>
                <FormRow
                  label='希望業種'
                  error={errors.industries?.message || ''}
                >
                  <SelectButton
                    label='業種を選択'
                    onClick={() => setIsIndustryModalOpen(true)}
                  />
                  <TagList
                    items={industries || []}
                    onRemove={item => removeIndustry(item.id)}
                    getKey={item => item.id}
                    getLabel={item => item.name}
                  />
                </FormRow>
                <FormRow
                  label='希望職種'
                  error={errors.jobTypes?.message || ''}
                >
                  <SelectButton
                    label='職種を選択'
                    onClick={() => setIsJobTypeModalOpen(true)}
                  />
                  <TagList
                    items={jobTypes || []}
                    onRemove={item => removeJobType(item.id)}
                    getKey={item => item.id}
                    getLabel={item => item.name}
                  />
                </FormRow>
                <FormRow
                  label='希望勤務地'
                  error={errors.workLocations?.message || ''}
                >
                  <SelectButton
                    label='勤務地を選択'
                    onClick={() => setIsWorkLocationModalOpen(true)}
                  />
                  <TagList
                    items={workLocations || []}
                    onRemove={item => removeLocation(item.id)}
                    getKey={(item, idx) => item.id || idx}
                    getLabel={item => item.name}
                  />
                </FormRow>
                <FormRow
                  label='興味のある働き方'
                  error={errors.workStyles?.message || ''}
                >
                  <SelectButton
                    label='働き方を選択'
                    onClick={() => setIsWorkStyleModalOpen(true)}
                  />
                  <TagList
                    items={workStyles || []}
                    onRemove={item => removeWorkStyle(item.id)}
                    getKey={item => item.id}
                    getLabel={item => item.name}
                  />
                </FormRow>
              </Section>
            </SectionCard>
            {/* ボタン */}
            <FormActions onCancel={handleCancel} isSubmitting={isSubmitting} />
          </form>
        </div>
      </main>
      {/* 各種モーダルはprops型・呼び出し方法をcareer-statusに合わせて統一 */}
      {isIndustryModalOpen && (
        <IndustrySelectModal
          isOpen={true}
          onClose={() => setIsIndustryModalOpen(false)}
          onConfirm={handleIndustriesConfirm}
          initialSelected={industries?.map(i => i.id) || []}
          maxSelections={3}
        />
      )}
      {isJobTypeModalOpen && (
        <JobTypeSelectModal
          isOpen={true}
          onClose={() => setIsJobTypeModalOpen(false)}
          onConfirm={handleJobTypesConfirm}
          initialSelected={jobTypes?.map(jt => jt.id) || []}
          maxSelections={3}
        />
      )}
      {isWorkLocationModalOpen && (
        <WorkLocationSelectModal
          isOpen={true}
          onClose={() => setIsWorkLocationModalOpen(false)}
          onConfirm={handleLocationsConfirm}
          initialSelected={workLocations}
        />
      )}
      {isWorkStyleModalOpen && (
        <WorkStyleSelectModal
          isOpen={true}
          onClose={() => setIsWorkStyleModalOpen(false)}
          onConfirm={handleWorkStylesConfirm}
          initialSelected={workStyles}
        />
      )}
    </>
  );
}
