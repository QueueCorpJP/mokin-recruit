'use client';

import { useRouter } from 'next/navigation';
import { useEditForm } from '../../_shared/hooks/useEditForm';
import { useState, useEffect } from 'react';
import { getCareerStatusData, updateCareerStatusData } from './actions';
import {
  careerStatusSchema,
  type CareerStatusFormData,
} from '../../_shared/schemas';
import { idFor, describedByIdFor, ariaPropsFor } from '../../_shared/utils';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import {
  CURRENT_ACTIVITY_STATUS_OPTIONS,
  JOB_CHANGE_TIMING_OPTIONS,
} from '@/constants/career-status';
import { SelectInput } from '@/components/ui/select-input';
import Section from '@/components/education/common/Section';
import SectionCard from '@/components/education/common/SectionCard';
import FormRow from '@/components/education/common/FormRow';
import Breadcrumbs from '@/components/education/common/Breadcrumbs';
import FormActions from '@/components/education/common/FormActions';
import CompanyStatusEditRow from './CompanyStatusEditRow';

// スキーマは共通化されたものを使用

// 候補者_転職活動状況編集ページ
export default function CandidateCareerStatusEditPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [currentModalIndex, setCurrentModalIndex] = useState<number | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    isSubmitting,
    onSubmit,
    handleCancel,
  } = useEditForm<CareerStatusFormData>({
    schema: careerStatusSchema,
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
    fetchInitialData: async () => {
      const data = await getCareerStatusData();
      if (!data) return null;
      return {
        transferDesiredTime: data.transferDesiredTime || '',
        currentActivityStatus: data.currentActivityStatus || '',
        selectionCompanies:
          data.selectionCompanies && data.selectionCompanies.length > 0
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
      };
    },
    redirectPath: '/candidate/account/career-status',
    buildFormData: data => {
      const formData = new FormData();
      formData.append('transferDesiredTime', data.transferDesiredTime);
      formData.append('currentActivityStatus', data.currentActivityStatus);
      formData.append(
        'selectionCompanies',
        JSON.stringify(data.selectionCompanies)
      );
      return formData;
    },
    submitAction: updateCareerStatusData,
  });

  // 初期化は useEditForm に委譲

  // 認証チェック
  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

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

  // onSubmit / handleCancel は useEditForm に委譲

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
      currentCompanies.filter((_, i) => i !== index)
    );
  };

  const closeIndustryModal = () => {
    setCurrentModalIndex(null);
  };

  const handleIndustriesConfirm = (industryNames: string[]) => {
    // 日本語名をそのまま使用
    if (currentModalIndex !== null) {
      // フォームフィールドの値を更新（日本語名の配列として保存）
      setValue(
        `selectionCompanies.${currentModalIndex}.industries`,
        industryNames,
        { shouldValidate: true, shouldDirty: true }
      );
      closeIndustryModal();
    }
  };

  const removeIndustry = (index: number, industryName: string) => {
    // フォームフィールドから削除
    const currentIndustries =
      watch(`selectionCompanies.${index}.industries`) || [];
    const updatedIndustries = currentIndustries.filter(
      (name: string) => name !== industryName
    );
    setValue(`selectionCompanies.${index}.industries`, updatedIndustries, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const getSelectedIndustries = (index: number): string[] => {
    // フォームから日本語名の配列を取得
    return watch(`selectionCompanies.${index}.industries`) || [];
  };

  const selectionCompanies = watch('selectionCompanies');

  return (
    <>
      {/* メインコンテンツ */}
      <main className='flex-1 relative z-[2]'>
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          {/* パンくずリスト */}
          <Breadcrumbs
            items={[
              { label: 'プロフィール確認・編集', href: '/candidate/account' },
              {
                label: '転職活動状況',
                href: '/candidate/account/career-status',
              },
              { label: '転職活動状況編集', isCurrent: true },
            ]}
          />
          {/* タイトル */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center'>
              {/* プロファイルアイコン */}
              <svg
                width='32'
                height='32'
                viewBox='0 0 32 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z'
                  fill='white'
                />
                <path
                  d='M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z'
                  fill='white'
                />
                <path
                  d='M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z'
                  fill='white'
                />
                <path
                  d='M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z'
                  fill='white'
                />
                <path
                  d='M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z'
                  fill='white'
                />
                <path
                  d='M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z'
                  fill='white'
                />
              </svg>
            </div>
            <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
              転職活動状況編集
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
              <Section title='転職活動状況'>
                <FormRow
                  label='転職希望時期'
                  error={errors.transferDesiredTime?.message || ''}
                >
                  <SelectInput
                    options={JOB_CHANGE_TIMING_OPTIONS}
                    value={watch('transferDesiredTime')}
                    onChange={value =>
                      setValue('transferDesiredTime', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    error={!!errors.transferDesiredTime}
                    errorMessage={errors.transferDesiredTime?.message}
                    className='w-full'
                    style={{
                      padding: '11px',
                      border: '1px solid #999999',
                      borderRadius: '5px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      letterSpacing: '1.6px',
                    }}
                    radius={5}
                  />
                </FormRow>
                <FormRow
                  label='現在の活動状況'
                  error={errors.currentActivityStatus?.message || ''}
                >
                  <SelectInput
                    options={CURRENT_ACTIVITY_STATUS_OPTIONS}
                    value={watch('currentActivityStatus')}
                    onChange={value =>
                      setValue('currentActivityStatus', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                    error={!!errors.currentActivityStatus}
                    errorMessage={errors.currentActivityStatus?.message}
                    className='w-full'
                    style={{
                      padding: '11px',
                      border: '1px solid #999999',
                      borderRadius: '5px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      letterSpacing: '1.6px',
                    }}
                    radius={5}
                  />
                </FormRow>
              </Section>
              <Section title='選考状況'>
                {(selectionCompanies || []).map((_, index) => (
                  <CompanyStatusEditRow
                    key={index}
                    index={index}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    removeCompany={removeCompany}
                    getSelectedIndustries={getSelectedIndustries}
                    removeIndustry={removeIndustry}
                    setCurrentModalIndex={setCurrentModalIndex}
                  />
                ))}
                {/* 企業を追加ボタン */}
                <div className='flex justify-center'>
                  <button
                    type='button'
                    onClick={addCompany}
                    className='border border-[#0f9058] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] px-6 py-2.5 rounded-[32px] flex items-center gap-2'
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M8 3V13M3 8H13'
                        stroke='#0f9058'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    企業を追加
                  </button>
                </div>
              </Section>
            </SectionCard>
            {/* ボタン */}
            <FormActions onCancel={handleCancel} isSubmitting={isSubmitting} />
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
