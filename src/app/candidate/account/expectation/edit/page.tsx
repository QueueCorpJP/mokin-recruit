'use client';

import { Button } from '@/components/ui/button';
import { SALARY_OPTIONS } from '../../_shared/constants/forms';
import { idFor, describedByIdFor, ariaPropsFor } from '../../_shared/utils';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { getExpectationData, updateExpectationData } from './actions';
import { useEditForm } from '../../_shared/hooks/useEditForm';
import {
  expectationSchema,
  type ExpectationFormData,
} from '../../_shared/schemas/expectation';
import { IndustryModal } from '@/app/company/job/IndustryModal';
import { JobTypeModal } from '@/app/company/job/JobTypeModal';
import WorkLocationSelectModal from '@/components/career-status/WorkLocationSelectModal';
import WorkStyleSelectModal from '@/components/career-status/WorkStyleSelectModal';
import { Modal } from '@/components/ui/mo-dal';
import { type Industry, INDUSTRY_GROUPS } from '@/constants/industry-data';
import { type JobType, JOB_TYPE_GROUPS } from '@/constants/job-type-data';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import { SelectInput } from '@/components/ui/select-input';
import Breadcrumb from '@/components/candidate/account/Breadcrumb';

// スキーマは共通化されたものを使用

// 選択肢は共通定数を使用

// 候補者_希望条件編集ページ
export default function CandidateExpectationEditPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [isJobTypeModalOpen, setIsJobTypeModalOpen] = useState(false);
  const [isWorkLocationModalOpen, setIsWorkLocationModalOpen] = useState(false);
  const [isWorkStyleModalOpen, setIsWorkStyleModalOpen] = useState(false);

  // Modal refs - must be defined before any early returns
  const industryModalRef = useRef<{ handleConfirm: () => void } | null>(null);
  const jobTypeModalRef = useRef<{ handleConfirm: () => void } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    isSubmitting,
    onSubmit,
    handleCancel,
  } = useEditForm<ExpectationFormData>({
    schema: expectationSchema,
    defaultValues: {
      desiredIncome: '',
      industries: [],
      jobTypes: [],
      workLocations: [],
      workStyles: [],
    },
    fetchInitialData: async () => {
      const data = await getExpectationData();
      if (!data) return null;
      return {
        desiredIncome: data.desiredIncome || '',
        industries: data.industries || [],
        jobTypes: data.jobTypes || [],
        workLocations: data.workLocations || [],
        workStyles: data.workStyles || [],
      };
    },
    redirectPath: '/candidate/account/expectation',
    buildFormData: data => {
      const formData = new FormData();
      formData.append('desiredIncome', data.desiredIncome || '');
      formData.append('industries', JSON.stringify(data.industries || []));
      formData.append('jobTypes', JSON.stringify(data.jobTypes || []));
      formData.append(
        'workLocations',
        JSON.stringify(data.workLocations || [])
      );
      formData.append('workStyles', JSON.stringify(data.workStyles || []));
      return formData;
    },
    submitAction: updateExpectationData,
  });

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

  // 初期データロード・送信・キャンセルは useEditForm に委譲

  // 業種モーダル
  const handleIndustriesConfirm = (industryNames: string[]) => {
    // 日本語名を文字列配列として保存（signupと同じ形式）
    setValue('industries', industryNames, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsIndustryModalOpen(false);
  };

  const removeIndustry = (industryName: string) => {
    const currentIndustries = watch('industries') || [];
    setValue(
      'industries',
      currentIndustries.filter(industry => industry !== industryName),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  // 職種モーダル
  const handleJobTypesConfirm = (jobTypeNames: string[]) => {
    // 日本語名を文字列配列として保存（signupと同じ形式）
    setValue('jobTypes', jobTypeNames, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setIsJobTypeModalOpen(false);
  };

  const removeJobType = (jobTypeName: string) => {
    const currentJobTypes = watch('jobTypes') || [];
    setValue(
      'jobTypes',
      currentJobTypes.filter(jobType => jobType !== jobTypeName),
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

  if (!isAuthenticated || !candidateUser) {
    return null;
  }

  return (
    <>
      {/* メインコンテンツ */}
      <main className='flex-1 relative z-[2]'>
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: 'プロフィール確認・編集', href: '/candidate/mypage' },
              { label: '希望条件', href: '/candidate/account/expectation' },
              { label: '希望条件編集' },
            ]}
          />

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
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              {/* 説明文セクション */}
              <div className='mb-6'>
                <p className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-8 text-center lg:text-left'>
                  希望条件を登録・編集できます。
                </p>
              </div>

              {/* 希望条件入力セクション */}
              <div className='space-y-6 lg:space-y-2'>
                {/* 希望年収 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                      希望年収
                    </div>
                  </div>
                  <div className='flex-1 lg:py-6'>
                    <SelectInput
                      options={[
                        { value: '', label: '未選択' },
                        ...SALARY_OPTIONS,
                      ]}
                      value={watch('desiredIncome')}
                      onChange={value =>
                        setValue('desiredIncome', value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
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
                  </div>
                </div>

                {/* 希望業種 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                      希望業種
                    </div>
                  </div>
                  <div className='flex-1 lg:py-6'>
                    <div className='flex flex-col gap-2'>
                      <button
                        type='button'
                        onClick={() => setIsIndustryModalOpen(true)}
                        className='px-6 py-[14px] bg-white border border-[#999999] rounded-[100px] text-[14px] text-[#323232] font-bold tracking-[1.4px] w-full lg:w-[170px]'
                      >
                        業種を選択
                      </button>
                      {industries && industries.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {(industries || []).map((industry, index) => (
                            <div
                              key={index}
                              className='bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px] flex items-center gap-2'
                            >
                              {industry}
                              <button
                                type='button'
                                onClick={() => removeIndustry(industry)}
                                className='ml-1'
                              >
                                <svg
                                  width='10'
                                  height='10'
                                  viewBox='0 0 10 10'
                                  fill='none'
                                >
                                  <path
                                    d='M1 1L9 9M1 9L9 1'
                                    stroke='#0f9058'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
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

                {/* 希望職種 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                      希望職種
                    </div>
                  </div>
                  <div className='flex-1 lg:py-6'>
                    <div className='flex flex-col gap-2'>
                      <button
                        type='button'
                        onClick={() => setIsJobTypeModalOpen(true)}
                        className='px-6 py-[14px] bg-white border border-[#999999] rounded-[100px] text-[14px] text-[#323232] font-bold tracking-[1.4px] w-full lg:w-[170px]'
                      >
                        職種を選択
                      </button>
                      {jobTypes && jobTypes.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {(jobTypes || []).map((jobType, index) => (
                            <div
                              key={index}
                              className='bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px] flex items-center gap-2'
                            >
                              {jobType}
                              <button
                                type='button'
                                onClick={() => removeJobType(jobType)}
                                className='ml-1'
                              >
                                <svg
                                  width='10'
                                  height='10'
                                  viewBox='0 0 10 10'
                                  fill='none'
                                >
                                  <path
                                    d='M1 1L9 9M1 9L9 1'
                                    stroke='#0f9058'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
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

                {/* 希望勤務地 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px]'>
                      希望勤務地
                    </div>
                  </div>
                  <div className='flex-1 lg:py-6'>
                    <div className='flex flex-col gap-2'>
                      <button
                        type='button'
                        onClick={() => setIsWorkLocationModalOpen(true)}
                        className='px-6 py-[14px] bg-white border border-[#999999] rounded-[100px] text-[14px] text-[#323232] font-bold tracking-[1.4px] w-full lg:w-[170px]'
                      >
                        勤務地を選択
                      </button>
                      {workLocations && workLocations.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {(workLocations || [])
                            .slice(0, 6)
                            .map((location, index) => (
                              <div
                                key={`location-${location.id || index}`}
                                className='bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px] flex items-center gap-2'
                              >
                                {location.name}
                                <button
                                  type='button'
                                  onClick={() => removeLocation(location.id)}
                                  className='ml-1'
                                >
                                  <svg
                                    width='10'
                                    height='10'
                                    viewBox='0 0 10 10'
                                    fill='none'
                                  >
                                    <path
                                      d='M1 1L9 9M1 9L9 1'
                                      stroke='#0f9058'
                                      strokeWidth='1.5'
                                      strokeLinecap='round'
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          {workLocations.length > 6 && (
                            <button
                              type='button'
                              onClick={() => setIsWorkLocationModalOpen(true)}
                              className='bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px] flex items-center gap-2 cursor-pointer hover:bg-[#b6e5c5] transition-colors'
                            >
                              +{workLocations.length - 6}件
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 興味のある働き方 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0'>
                      興味のある働き方
                    </div>
                  </div>
                  <div className='flex-1 lg:py-6'>
                    <div className='flex flex-col gap-2'>
                      <button
                        type='button'
                        onClick={() => setIsWorkStyleModalOpen(true)}
                        className='px-6 py-[14px] bg-white border border-[#999999] rounded-[100px] text-[14px] text-[#323232] font-bold tracking-[1.4px] w-full lg:w-[170px]'
                      >
                        働き方を選択
                      </button>
                      {workStyles && workStyles.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {(workStyles || []).map(workStyle => (
                            <div
                              key={workStyle.id}
                              className='bg-[#d2f1da] px-4 py-1.5 rounded-[10px] text-[#0f9058] text-[14px] font-medium tracking-[1.4px] flex items-center gap-2'
                            >
                              {workStyle.name}
                              <button
                                type='button'
                                onClick={() => removeWorkStyle(workStyle.id)}
                                className='ml-1'
                              >
                                <svg
                                  width='10'
                                  height='10'
                                  viewBox='0 0 10 10'
                                  fill='none'
                                >
                                  <path
                                    d='M1 1L9 9M1 9L9 1'
                                    stroke='#0f9058'
                                    strokeWidth='1.5'
                                    strokeLinecap='round'
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
      {isIndustryModalOpen && (
        <Modal
          title='業種を選択'
          isOpen={isIndustryModalOpen}
          onClose={() => setIsIndustryModalOpen(false)}
          primaryButtonText='決定'
          onPrimaryAction={() => industryModalRef.current?.handleConfirm()}
          width='800px'
          height='680px'
        >
          <IndustryModal
            selectedIndustries={industries || []}
            onIndustriesChange={handleIndustriesConfirm}
            onClose={() => setIsIndustryModalOpen(false)}
            ref={industryModalRef}
          />
        </Modal>
      )}

      {/* 職種選択モーダル */}
      {isJobTypeModalOpen && (
        <Modal
          title='職種を選択'
          isOpen={isJobTypeModalOpen}
          onClose={() => setIsJobTypeModalOpen(false)}
          primaryButtonText='決定'
          onPrimaryAction={() => jobTypeModalRef.current?.handleConfirm()}
          width='800px'
          height='680px'
        >
          <JobTypeModal
            selectedJobTypes={jobTypes || []}
            onJobTypesChange={handleJobTypesConfirm}
            onClose={() => setIsJobTypeModalOpen(false)}
            ref={jobTypeModalRef}
          />
        </Modal>
      )}

      {/* 勤務地選択モーダル */}
      <WorkLocationSelectModal
        isOpen={isWorkLocationModalOpen}
        onClose={() => setIsWorkLocationModalOpen(false)}
        onConfirm={handleLocationsConfirm}
        initialSelected={
          (workLocations || []).filter(
            loc => loc.id && loc.name
          ) as Prefecture[]
        }
      />

      {/* 働き方選択モーダル */}
      <WorkStyleSelectModal
        isOpen={isWorkStyleModalOpen}
        onClose={() => setIsWorkStyleModalOpen(false)}
        onConfirm={handleWorkStylesConfirm}
        initialSelected={
          (workStyles || []).filter(
            style => style.id && style.name
          ) as WorkStyle[]
        }
        maxSelections={6}
      />
    </>
  );
}
