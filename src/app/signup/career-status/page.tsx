'use client';

import { type CareerStatusFormData } from '@/lib/schema/career-status';
import { useState, useEffect } from 'react';
import {
  JOB_CHANGE_TIMING_OPTIONS,
  CURRENT_ACTIVITY_STATUS_OPTIONS,
  PROGRESS_STATUS_OPTIONS,
  DECLINE_REASON_OPTIONS,
} from '@/constants/career-status';
import { useRouter } from 'next/navigation';
import IndustrySelectModal from '@/components/career-status/IndustrySelectModal';
import { Button } from '@/components/ui/button';
import { CompanyNameInput } from '@/components/ui/CompanyNameInput';
import { SelectInput } from '@/components/ui/select-input';
import { saveCareerStatusAction } from './actions';
import { INDUSTRY_GROUPS } from '@/constants/industry-data';

type SelectionEntry = {
  id: string;
  isPrivate: boolean;
  industries: string[];
  companyName: string;
  department: string;
  progressStatus: string;
  declineReason?: string;
};

export default function SignupCareerStatusPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    targetIndex: number | null;
  }>({ isOpen: false, targetIndex: null });
  const [selectedIndustriesMap, setSelectedIndustriesMap] = useState<{
    [key: number]: string[];
  }>({});

  const [formData, setFormData] = useState<CareerStatusFormData>({
    hasCareerChange: 'なし',
    jobChangeTiming: '',
    currentActivityStatus: '',
    selectionEntries: [
      {
        id: '1',
        isPrivate: false,
        industries: [],
        companyName: '',
        department: '',
        progressStatus: '',
        declineReason: '',
      },
    ] as SelectionEntry[],
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const getCookieValue = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };

      const savedUserId = getCookieValue('signup_user_id');
      if (savedUserId) {
        setUserId(savedUserId);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    // Validation
    if (!isFormValid()) {
      alert('すべての必須項目を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveCareerStatusAction(formData, userId);

      if (result.success) {
        router.push('/signup/recent-job');
      } else {
        console.error('Career status save failed:', result.error);
      }
    } catch (error) {
      console.error('Career status save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      selectionEntries: [
        ...prev.selectionEntries,
        {
          id: `entry-${Date.now()}`,
          isPrivate: false,
          industries: [],
          companyName: '',
          department: '',
          progressStatus: '',
          declineReason: '',
        },
      ],
    }));
  };

  const removeEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selectionEntries: prev.selectionEntries.filter((_, i) => i !== index),
    }));
  };

  const updateEntry = (
    index: number,
    field: keyof SelectionEntry,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      selectionEntries: prev.selectionEntries.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      ),
    }));
  };

  // 詳細なバリデーション関数
  const isFormValid = () => {
    // 基本必須項目
    if (
      !formData.hasCareerChange ||
      !formData.jobChangeTiming ||
      !formData.currentActivityStatus
    ) {
      return false;
    }

    // 情報収集中・まだ始めていない場合は基本項目のみでOK
    if (
      formData.currentActivityStatus === 'まだ始めていない' ||
      formData.currentActivityStatus === '情報収集中'
    ) {
      return true;
    }

    // それ以外は選考状況エントリーの検証
    for (const entry of formData.selectionEntries) {
      // 業種が選択されていない
      if (!entry.industries || entry.industries.length === 0) {
        return false;
      }
      // 企業名が入力されていない
      if (!entry.companyName || entry.companyName.trim() === '') {
        return false;
      }
      // 部署名・役職名が入力されていない
      if (!entry.department || entry.department.trim() === '') {
        return false;
      }
      // 進捗状況が選択されていない
      if (!entry.progressStatus || entry.progressStatus === '') {
        return false;
      }
      // 進捗状況が「辞退」の場合のみ辞退理由が必須
      if (
        entry.progressStatus === '辞退' &&
        (!entry.declineReason || entry.declineReason === '')
      ) {
        return false;
      }
    }
    return true;
  };

  return (
    <>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* PC Version */}
        <div className='hidden lg:block'>
          <main
            className='flex relative py-20 flex-col items-center justify-start min-h-[calc(100vh+1700px)]'
            style={{
              backgroundImage: "url('/background-pc.svg')",
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <div className='bg-white rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-20 w-[1000px] flex flex-col gap-10 items-center'>
              <div className='flex flex-col gap-6 items-center w-full'>
                <h1 className='text-[#0f9058] text-[32px] font-bold tracking-[3.2px] text-center'>
                  会員情報
                </h1>
              </div>

              {/* Progress Tabs */}
              <div className='flex flex-row w-full h-[45px]'>
                <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-2 border-[#0f9058]'>
                  <div className='w-6 h-6 flex items-center justify-center'>
                    <svg
                      width='22'
                      height='25'
                      viewBox='0 0 22 25'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M10.9997 12.5C12.6162 12.5 14.1666 11.8679 15.3097 10.7426C16.4527 9.61742 17.0949 8.0913 17.0949 6.5C17.0949 4.9087 16.4527 3.38258 15.3097 2.25736C14.1666 1.13214 12.6162 0.5 10.9997 0.5C9.38312 0.5 7.83277 1.13214 6.68969 2.25736C5.54661 3.38258 4.90444 4.9087 4.90444 6.5C4.90444 8.0913 5.54661 9.61742 6.68969 10.7426C7.83277 11.8679 9.38312 12.5 10.9997 12.5ZM8.82348 14.75C4.13301 14.75 0.333008 18.4906 0.333008 23.1078C0.333008 23.8766 0.966341 24.5 1.74729 24.5H20.2521C21.033 24.5 21.6663 23.8766 21.6663 23.1078C21.6663 18.4906 17.8663 14.75 13.1759 14.75H8.82348Z'
                        fill='#DCDCDC'
                      />
                    </svg>
                  </div>
                  <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                    基本情報
                  </span>
                </div>
                <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-2 border-[#0f9058]'>
                  <div className='w-6 h-6 flex items-center justify-center'>
                    <svg
                      width='25'
                      height='25'
                      viewBox='0 0 25 25'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M12.5 2.75011C12.5 2.15334 12.734 1.58102 13.1505 1.15904C13.567 0.737064 14.132 0.5 14.7211 0.5C15.3101 0.5 15.8751 0.737064 16.2916 1.15904C16.7082 1.58102 16.9422 2.15334 16.9422 2.75011C16.9422 3.34688 16.7082 3.9192 16.2916 4.34118C15.8751 4.76315 15.3101 5.00022 14.7211 5.00022C14.132 5.00022 13.567 4.76315 13.1505 4.34118C12.734 3.9192 12.5 3.34688 12.5 2.75011ZM10.9498 9.84264C10.9035 9.86139 10.8619 9.88015 10.8156 9.8989L10.4454 10.063C9.68655 10.4052 9.1035 11.0568 8.83975 11.8537L8.71944 12.2193C8.46031 13.0069 7.62276 13.4288 6.84537 13.1662C6.06798 12.9037 5.65152 12.0553 5.91065 11.2677L6.03096 10.9021C6.55848 9.30355 7.72456 8.00037 9.24232 7.31596L9.61251 7.15189C10.575 6.72062 11.6161 6.4956 12.6712 6.4956C14.735 6.4956 16.5951 7.75192 17.3864 9.67857L18.099 11.4083L19.0893 11.9099C19.8204 12.2803 20.1165 13.1803 19.751 13.921C19.3854 14.6616 18.497 14.9616 17.7659 14.5913L16.5257 13.9678C16.0491 13.7241 15.6743 13.3209 15.4707 12.8194L15.0265 11.7412L14.1334 14.8116L16.4239 17.343C16.6738 17.6196 16.8496 17.9524 16.9422 18.3181L18.0065 22.6355C18.2054 23.4371 17.7242 24.2527 16.9283 24.4543C16.1324 24.6559 15.3319 24.1683 15.1329 23.3621L14.1149 19.2322L10.8434 15.6179C10.1585 14.8632 9.90403 13.8085 10.1632 12.8194L10.9452 9.84264H10.9498ZM8.27521 19.1572L9.43204 16.232C9.52922 16.3727 9.64027 16.5039 9.75596 16.6352L11.6393 18.7165L10.9683 20.4135C10.8573 20.6947 10.6907 20.9526 10.4778 21.1682L7.62276 24.0605C7.04435 24.6465 6.105 24.6465 5.52658 24.0605C4.94817 23.4746 4.94817 22.5229 5.52658 21.937L8.27521 19.1572Z'
                        fill='#0F9058'
                      />
                    </svg>
                  </div>
                  <span className='text-[#0f9058] text-[18px] font-bold tracking-[1.8px]'>
                    転職活動状況
                  </span>
                </div>
                <div className='flex-1 flex flex-row gap-2 items-center justify-center py-2 px-6 border-b-2 border-[#dcdcdc]'>
                  <div className='w-6 h-6 flex items-center justify-center'>
                    <svg
                      width='25'
                      height='25'
                      viewBox='0 0 25 25'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M5.83355 0.5C4.6067 0.5 3.61133 1.50781 3.61133 2.75V22.25C3.61133 23.4922 4.6067 24.5 5.83355 24.5H10.278V20.75C10.278 19.5078 11.2734 18.5 12.5002 18.5C13.7271 18.5 14.7224 19.5078 14.7224 20.75V24.5H19.1669C20.3937 24.5 21.3891 23.4922 21.3891 22.25V2.75C21.3891 1.50781 20.3937 0.5 19.1669 0.5H5.83355ZM6.57429 11.75C6.57429 11.3375 6.90762 11 7.31503 11H8.79651C9.20392 11 9.53725 11.3375 9.53725 11.75V13.25C9.53725 13.6625 9.20392 14 8.79651 14H7.31503C6.90762 14 6.57429 13.6625 6.57429 13.25V11.75ZM11.7595 11H13.241C13.6484 11 13.9817 11.3375 13.9817 11.75V13.25C13.9817 13.6625 13.6484 14 13.241 14H11.7595C11.3521 14 11.0187 13.6625 11.0187 13.25V11.75C11.0187 11.3375 11.3521 11 11.7595 11ZM15.4632 11.75C15.4632 11.3375 15.7965 11 16.2039 11H17.6854C18.0928 11 18.4261 11.3375 18.4261 11.75V13.25C18.4261 13.6625 18.0928 14 17.6854 14H16.2039C15.7965 14 15.4632 13.6625 15.4632 13.25V11.75ZM7.31503 5H8.79651C9.20392 5 9.53725 5.3375 9.53725 5.75V7.25C9.53725 7.6625 9.20392 8 8.79651 8H7.31503C6.90762 8 6.57429 7.6625 6.57429 7.25V5.75C6.57429 5.3375 6.90762 5 7.31503 5ZM11.0187 5.75C11.0187 5.3375 11.3521 5 11.7595 5H13.241C13.6484 5 13.9817 5.3375 13.9817 5.75V7.25C13.9817 7.6625 13.6484 8 13.241 8H11.7595C11.3521 8 11.0187 7.6625 11.0187 7.25V5.75ZM16.2039 5H17.6854C18.0928 5 18.4261 5.3375 18.4261 5.75V7.25C18.4261 7.6625 18.0928 8 17.6854 8H16.2039C15.7965 8 15.4632 7.6625 15.4632 7.25V5.75C15.4632 5.3375 15.7965 5 16.2039 5Z'
                        fill='#DCDCDC'
                      />
                    </svg>
                  </div>
                  <span className='text-[#dcdcdc] text-[18px] font-bold tracking-[1.8px]'>
                    直近の在籍企業
                  </span>
                </div>
              </div>

              <div className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold max-w-[792px]'>
                <p>
                  あなたの活動状況や志望企業を共有すると、あなたの志向や強みがより伝わりやすく、
                </p>
                <p>マッチしたスカウトが届きやすくなります。</p>
              </div>

              {/* Divider */}
              <div className='flex flex-row w-full h-[29px] items-center justify-center gap-6'>
                <div className='flex-1 h-px relative'>
                  <div className='absolute inset-[-1px_-0.3%]'>
                    <svg
                      width='100%'
                      height='1'
                      viewBox='0 0 100 1'
                      preserveAspectRatio='none'
                    >
                      <line
                        x1='0'
                        y1='0'
                        x2='100'
                        y2='0'
                        stroke='#dcdcdc'
                        strokeWidth='1'
                      />
                    </svg>
                  </div>
                </div>
                <span className='text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap'>
                  転職経験
                </span>
                <div className='flex-1 h-px relative'>
                  <div className='absolute inset-[-1px_-0.3%]'>
                    <svg
                      width='100%'
                      height='1'
                      viewBox='0 0 100 1'
                      preserveAspectRatio='none'
                    >
                      <line
                        x1='0'
                        y1='0'
                        x2='100'
                        y2='0'
                        stroke='#dcdcdc'
                        strokeWidth='1'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-6 w-full items-end'>
                {/* Career Change Experience */}
                <div className='flex flex-row gap-4 items-start w-fit mx-auto mb-4'>
                  <div className='pt-[11px] min-w-[130px] text-right'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      転職経験
                    </label>
                  </div>
                  <div className='flex flex-col gap-2 w-[400px]'>
                    <div className='flex flex-row gap-2'>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            hasCareerChange: 'あり',
                          }))
                        }
                        className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                          formData.hasCareerChange === 'あり'
                            ? 'bg-[#0f9058] border-[#0f9058] text-white'
                            : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                        }`}
                      >
                        あり
                      </button>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            hasCareerChange: 'なし',
                          }))
                        }
                        className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                          formData.hasCareerChange === 'なし'
                            ? 'bg-[#0f9058] border-[#0f9058] text-white'
                            : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                        }`}
                      >
                        なし
                      </button>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className='flex flex-row w-full h-[29px] items-center justify-center gap-6 '>
                  <div className='flex-1 h-px relative'>
                    <div className='absolute inset-[-1px_-0.3%]'>
                      <svg
                        width='100%'
                        height='1'
                        viewBox='0 0 100 1'
                        preserveAspectRatio='none'
                      >
                        <line
                          x1='0'
                          y1='0'
                          x2='100'
                          y2='0'
                          stroke='#dcdcdc'
                          strokeWidth='1'
                        />
                      </svg>
                    </div>
                  </div>
                  <span className='text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap'>
                    転職活動状況
                  </span>
                  <div className='flex-1 h-px relative'>
                    <div className='absolute inset-[-1px_-0.3%]'>
                      <svg
                        width='100%'
                        height='1'
                        viewBox='0 0 100 1'
                        preserveAspectRatio='none'
                      >
                        <line
                          x1='0'
                          y1='0'
                          x2='100'
                          y2='0'
                          stroke='#dcdcdc'
                          strokeWidth='1'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Job Change Timing */}
                <div className='flex flex-row gap-4 items-start w-fit mx-auto mt-4'>
                  <div className='pt-[11px] min-w-[130px] text-right'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      転職希望時期
                    </label>
                  </div>
                  <div className='w-[400px]'>
                    <SelectInput
                      value={formData.jobChangeTiming}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          jobChangeTiming: value,
                        }))
                      }
                      options={[
                        { value: '', label: '未選択' },
                        ...JOB_CHANGE_TIMING_OPTIONS.map(option => ({
                          value: option.value,
                          label: option.label,
                        })),
                      ]}
                      placeholder='未選択'
                      className='w-full'
                      radius={5}
                    />
                  </div>
                </div>

                {/* Current Activity Status */}
                <div className='flex flex-row gap-4 items-start w-fit mx-auto mb-4'>
                  <div className='pt-[11px] min-w-[130px] text-right'>
                    <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                      現在の活動状況
                    </label>
                  </div>
                  <div className='w-[400px]'>
                    <SelectInput
                      value={formData.currentActivityStatus}
                      onChange={value =>
                        setFormData(prev => ({
                          ...prev,
                          currentActivityStatus: value,
                        }))
                      }
                      options={[
                        { value: '', label: '未選択' },
                        ...CURRENT_ACTIVITY_STATUS_OPTIONS.map(
                          (option: { value: string; label: string }) => ({
                            value: option.value,
                            label: option.label,
                          })
                        ),
                      ]}
                      placeholder='未選択'
                      className='w-full'
                      radius={5}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              {formData.currentActivityStatus &&
                !['まだ始めていない', '情報収集中'].includes(
                  formData.currentActivityStatus
                ) && (
                  <div className='flex flex-row w-full h-[29px] items-center justify-center gap-6'>
                    <div className='flex-1 h-px relative'>
                      <div className='absolute inset-[-1px_-0.3%]'>
                        <svg
                          width='100%'
                          height='1'
                          viewBox='0 0 100 1'
                          preserveAspectRatio='none'
                        >
                          <line
                            x1='0'
                            y1='0'
                            x2='100'
                            y2='0'
                            stroke='#dcdcdc'
                            strokeWidth='1'
                          />
                        </svg>
                      </div>
                    </div>
                    <span className='text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap'>
                      選考状況
                    </span>
                    <div className='flex-1 h-px relative'>
                      <div className='absolute inset-[-1px_-0.3%]'>
                        <svg
                          width='100%'
                          height='1'
                          viewBox='0 0 100 1'
                          preserveAspectRatio='none'
                        >
                          <line
                            x1='0'
                            y1='0'
                            x2='100'
                            y2='0'
                            stroke='#dcdcdc'
                            strokeWidth='1'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

              {/* Selection Status Entries */}
              {formData.currentActivityStatus &&
                !['まだ始めていない', '情報収集中'].includes(
                  formData.currentActivityStatus
                ) && (
                  <div className='flex flex-col gap-2 items-center w-[536]px'>
                    {formData.selectionEntries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className='bg-[#f9f9f9] rounded-[10px] p-10 w-full flex flex-col gap-6 items-end relative'
                      >
                        {index > 0 && (
                          <div
                            className='absolute top-6 right-6 w-4 h-4 cursor-pointer'
                            onClick={() => removeEntry(index)}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='17'
                              height='16'
                              viewBox='0 0 17 16'
                              fill='none'
                            >
                              <path
                                d='M14.8927 0.276093C15.2603 -0.0914467 15.8562 -0.09139 16.2238 0.276093C16.5914 0.64366 16.5914 1.23958 16.2238 1.60715L9.83123 7.99875L16.2248 14.3923L16.258 14.4275C16.5917 14.7968 16.5805 15.3672 16.2248 15.7234C15.8688 16.0793 15.2984 16.091 14.9289 15.7575L14.8937 15.7234L8.50017 9.3298L2.10662 15.7243L2.07146 15.7575C1.70198 16.0914 1.13164 16.0804 0.775562 15.7243C0.419562 15.3682 0.408556 14.7979 0.742359 14.4284L0.775562 14.3933L7.16912 7.99875L0.775562 1.60617C0.408165 1.23862 0.408127 0.642643 0.775562 0.275116C1.14308 -0.092404 1.73904 -0.0923087 2.10662 0.275116L8.50017 6.66769L14.8927 0.276093Z'
                                fill='#999999'
                              />
                            </svg>
                          </div>
                        )}

                        {/* Public Range Checkbox */}
                        <div className='flex flex-row gap-4 items-start w-full'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-1 min-w-[130px] text-right'>
                            公開範囲
                          </label>
                          <div className='flex flex-row gap-2 items-start w-[400px]'>
                            <div
                              className='w-5 h-5 mt-1 cursor-pointer'
                              onClick={() =>
                                updateEntry(
                                  index,
                                  'isPrivate',
                                  !entry.isPrivate
                                )
                              }
                            >
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z'
                                  fill={entry.isPrivate ? '#0F9058' : '#DCDCDC'}
                                />
                              </svg>
                            </div>
                            <div className='flex flex-col gap-1 flex-1'>
                              <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                企業名を非公開（業種・進捗のみ公開）
                              </span>
                              <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px] leading-[1.6]'>
                                企業に選考状況を伝えることで、
                                <br />
                                スカウトの質やあなたへの興味度が高まりやすくなります。
                                <br />
                                ※選考中の企業には自動で非公開になります。
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Industry Selection */}
                        <div className='flex flex-row gap-4 items-start w-full'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right'>
                            業種
                          </label>
                          <div className='flex flex-col gap-2 w-[400px]'>
                            <button
                              type='button'
                              onClick={() =>
                                setModalState({
                                  isOpen: true,
                                  targetIndex: index,
                                })
                              }
                              className='px-10 h-[50px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white w-fit'
                            >
                              業種を選択
                            </button>
                            <div className='flex flex-wrap gap-2'>
                              {selectedIndustriesMap[index]?.map(industry => (
                                <div
                                  key={industry}
                                  className='bg-[#d2f1da] px-6 py-2 rounded-[10px] flex items-center gap-2'
                                >
                                  <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                                    {industry}
                                  </span>
                                  <button
                                    type='button'
                                    onClick={() => {
                                      setSelectedIndustriesMap(prev => ({
                                        ...prev,
                                        [index]:
                                          prev[index]?.filter(
                                            j => j !== industry
                                          ) || [],
                                      }));
                                      const newIndustries =
                                        selectedIndustriesMap[index]?.filter(
                                          j => j !== industry
                                        ) || [];
                                      updateEntry(
                                        index,
                                        'industries',
                                        newIndustries
                                      );
                                    }}
                                  >
                                    <svg
                                      width='12'
                                      height='12'
                                      viewBox='0 0 12 12'
                                      fill='none'
                                    >
                                      <path
                                        d='M1 1L11 11M1 11L11 1'
                                        stroke='#0F9058'
                                        strokeWidth='1.5'
                                        strokeLinecap='round'
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Company Name */}
                        <div className='flex flex-row gap-4 items-start w-full'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right'>
                            企業名
                          </label>
                          <CompanyNameInput
                            value={entry.companyName}
                            onChange={value =>
                              updateEntry(index, 'companyName', value)
                            }
                            placeholder='企業名を入力'
                            className='w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>

                        {/* Department */}
                        <div className='flex flex-row gap-4 items-start w-full'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right'>
                            部署名・役職名
                          </label>
                          <input
                            type='text'
                            placeholder='部署名・役職名を入力'
                            value={entry.department || ''}
                            onChange={e =>
                              updateEntry(index, 'department', e.target.value)
                            }
                            className='w-[400px] px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>

                        {/* Progress Status */}
                        <div className='flex flex-row gap-4 items-start w-full'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right'>
                            進捗状況
                          </label>
                          <div className='w-[400px]'>
                            <SelectInput
                              value={entry.progressStatus}
                              onChange={value =>
                                updateEntry(index, 'progressStatus', value)
                              }
                              options={[
                                { value: '', label: '未選択' },
                                ...PROGRESS_STATUS_OPTIONS.map(option => ({
                                  value: option.value,
                                  label: option.label,
                                })),
                              ]}
                              placeholder='未選択'
                              className='w-full'
                              radius={5}
                            />
                          </div>
                        </div>

                        {/* Decline Reason - show only if progressStatus is '辞退' */}
                        {entry.progressStatus === '辞退' && (
                          <div className='flex flex-row gap-4 items-start w-full'>
                            <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px] pt-[11px] min-w-[130px] text-right'>
                              辞退理由
                            </label>
                            <div className='w-[400px]'>
                              <SelectInput
                                value={entry.declineReason || ''}
                                onChange={value =>
                                  updateEntry(index, 'declineReason', value)
                                }
                                options={[
                                  { value: '', label: '未選択' },
                                  ...DECLINE_REASON_OPTIONS.map(option => ({
                                    value: option.value,
                                    label: option.label,
                                  })),
                                ]}
                                placeholder='未選択'
                                className='w-full'
                                radius={5}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      type='button'
                      onClick={addEntry}
                      className='bg-white border border-[#0f9058] rounded-[32px] px-6 py-2.5 flex items-center gap-2'
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                      >
                        <path
                          d='M8 1.5V14.5M1.5 8H14.5'
                          stroke='#0f9058'
                          strokeWidth='2'
                          strokeLinecap='round'
                        />
                      </svg>
                      <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                        企業を追加
                      </span>
                    </button>
                  </div>
                )}

              <Button
                type='submit'
                disabled={isSubmitting || !isFormValid()}
                variant='green-gradient'
                size='figma-default'
                className='min-w-[160px] text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? '送信中...' : '次へ'}
              </Button>
            </div>
          </main>
        </div>

        {/* SP (Mobile) Version */}
        <div className='lg:hidden'>
          <main
            className='flex relative pt-6 pb-20 flex-col items-center px-4'
            style={{
              backgroundImage: "url('/background-sp.svg')",
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          >
            <div className='bg-white rounded-3xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 py-10 mx-4 w-full flex flex-col gap-10 items-center'>
              <div className='flex flex-row gap-4 items-center w-full pb-4 border-b border-[#efefef]'>
                <div className='relative w-[72px] h-[72px]'>
                  <svg width='72' height='72' viewBox='0 0 72 72' fill='none'>
                    <circle
                      cx='36'
                      cy='36'
                      r='28.8'
                      stroke='#e0e0e0'
                      strokeWidth='7.2'
                      fill='none'
                      strokeLinecap='round'
                      transform='rotate(-90 36 36)'
                    />
                    <circle
                      cx='36'
                      cy='36'
                      r='28.8'
                      stroke='#0f9058'
                      strokeWidth='7.2'
                      fill='none'
                      strokeLinecap='round'
                      strokeDasharray='120.64 60.32'
                      transform='rotate(-90 36 36)'
                    />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                      <span className='text-[#0f9058] text-[24px] font-medium tracking-[2.4px]'>
                        2
                      </span>
                      <span className='text-[#999999] text-[17px] font-medium tracking-[1.7px]'>
                        /3
                      </span>
                    </div>
                  </div>
                </div>
                <div className='flex flex-col'>
                  <p className='text-[#999999] text-[16px] font-bold tracking-[1.6px]'>
                    会員情報
                  </p>
                  <p className='text-[#0f9058] text-[20px] font-bold tracking-[2px]'>
                    転職活動状況
                  </p>
                </div>
              </div>

              <div className='text-[#323232] text-[16px] leading-8 tracking-[1.6px] text-center font-bold'>
                <p>
                  あなたの活動状況や志望企業を共有すると、あなたの志向や強みがより伝わりやすく、マッチしたスカウトが届きやすくなります。
                </p>
              </div>

              <div className='flex flex-col gap-6 w-full'>
                {/* Section header: 転職経験 */}
                <div className='flex flex-row w-full h-[29px] items-center justify-center gap-6'>
                  <div className='flex-1 h-px relative'>
                    <div className='absolute inset-[-1px_-0.3%]'>
                      <svg
                        width='100%'
                        height='1'
                        viewBox='0 0 100 1'
                        preserveAspectRatio='none'
                      >
                        <line
                          x1='0'
                          y1='0'
                          x2='100'
                          y2='0'
                          stroke='#dcdcdc'
                          strokeWidth='1'
                        />
                      </svg>
                    </div>
                  </div>
                  <span className='text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap'>
                    転職経験
                  </span>
                  <div className='flex-1 h-px relative'>
                    <div className='absolute inset-[-1px_-0.3%]'>
                      <svg
                        width='100%'
                        height='1'
                        viewBox='0 0 100 1'
                        preserveAspectRatio='none'
                      >
                        <line
                          x1='0'
                          y1='0'
                          x2='100'
                          y2='0'
                          stroke='#dcdcdc'
                          strokeWidth='1'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Career Change Experience */}
                <div className='flex flex-col gap-2'>
                  <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                    転職経験
                  </label>
                  <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2'>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            hasCareerChange: 'あり',
                          }))
                        }
                        className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                          formData.hasCareerChange === 'あり'
                            ? 'bg-[#0f9058] border-[#0f9058] text-white'
                            : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                        }`}
                      >
                        あり
                      </button>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            hasCareerChange: 'なし',
                          }))
                        }
                        className={`flex-1 px-[11px] py-[11px] border rounded-[5px] text-[16px] font-bold tracking-[1.6px] transition-colors ${
                          formData.hasCareerChange === 'なし'
                            ? 'bg-[#0f9058] border-[#0f9058] text-white'
                            : 'bg-white border-[#999999] text-[#999999] hover:border-[#0f9058]'
                        }`}
                      >
                        なし
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section header: 転職活動状況 */}
                <div className='flex flex-row w-full h-[29px] items-center justify-center gap-6'>
                  <div className='flex-1 h-px relative'>
                    <div className='absolute inset-[-1px_-0.3%]'>
                      <svg
                        width='100%'
                        height='1'
                        viewBox='0 0 100 1'
                        preserveAspectRatio='none'
                      >
                        <line
                          x1='0'
                          y1='0'
                          x2='100'
                          y2='0'
                          stroke='#dcdcdc'
                          strokeWidth='1'
                        />
                      </svg>
                    </div>
                  </div>
                  <span className='text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap'>
                    転職活動状況
                  </span>
                  <div className='flex-1 h-px relative'>
                    <div className='absolute inset-[-1px_-0.3%]'>
                      <svg
                        width='100%'
                        height='1'
                        viewBox='0 0 100 1'
                        preserveAspectRatio='none'
                      >
                        <line
                          x1='0'
                          y1='0'
                          x2='100'
                          y2='0'
                          stroke='#dcdcdc'
                          strokeWidth='1'
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Job Change Timing */}
                <div className='flex flex-col gap-2'>
                  <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                    転職希望時期
                  </label>
                  <SelectInput
                    value={formData.jobChangeTiming}
                    onChange={value =>
                      setFormData(prev => ({
                        ...prev,
                        jobChangeTiming: value,
                      }))
                    }
                    options={[
                      { value: '', label: '未選択' },
                      ...JOB_CHANGE_TIMING_OPTIONS.map(option => ({
                        value: option.value,
                        label: option.label,
                      })),
                    ]}
                    placeholder='未選択'
                    className='w-full'
                    radius={5}
                  />
                </div>

                {/* Current Activity Status */}
                <div className='flex flex-col gap-2'>
                  <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                    現在の活動状況
                  </label>
                  <SelectInput
                    value={formData.currentActivityStatus}
                    onChange={value =>
                      setFormData(prev => ({
                        ...prev,
                        currentActivityStatus: value,
                      }))
                    }
                    options={[
                      { value: '', label: '未選択' },
                      ...CURRENT_ACTIVITY_STATUS_OPTIONS.map(
                        (option: { value: string; label: string }) => ({
                          value: option.value,
                          label: option.label,
                        })
                      ),
                    ]}
                    placeholder='未選択'
                    className='w-full'
                    radius={5}
                  />
                </div>
              </div>

              {/* Section header: 選考状況 */}
              {formData.currentActivityStatus &&
                !['まだ始めていない', '情報収集中'].includes(
                  formData.currentActivityStatus
                ) && (
                  <div className='flex flex-row w-full h-[29px] items-center justify-center gap-6'>
                    <div className='flex-1 h-px relative'>
                      <div className='absolute inset-[-1px_-0.3%]'>
                        <svg
                          width='100%'
                          height='1'
                          viewBox='0 0 100 1'
                          preserveAspectRatio='none'
                        >
                          <line
                            x1='0'
                            y1='0'
                            x2='100'
                            y2='0'
                            stroke='#dcdcdc'
                            strokeWidth='1'
                          />
                        </svg>
                      </div>
                    </div>
                    <span className='text-[#323232] text-[18px] font-bold tracking-[1.8px] text-nowrap'>
                      選考状況
                    </span>
                    <div className='flex-1 h-px relative'>
                      <div className='absolute inset-[-1px_-0.3%]'>
                        <svg
                          width='100%'
                          height='1'
                          viewBox='0 0 100 1'
                          preserveAspectRatio='none'
                        >
                          <line
                            x1='0'
                            y1='0'
                            x2='100'
                            y2='0'
                            stroke='#dcdcdc'
                            strokeWidth='1'
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

              {/* Mobile version of Selection Status Entries */}
              {formData.currentActivityStatus &&
                !['まだ始めていない', '情報収集中'].includes(
                  formData.currentActivityStatus
                ) && (
                  <div className='flex flex-col gap-2 items-center w-full'>
                    {formData.selectionEntries.map((entry, index) => (
                      <div
                        key={entry.id}
                        className='bg-[#f9f9f9] rounded-[10px] p-6 w-full flex flex-col gap-6 relative'
                      >
                        {index > 0 && (
                          <div
                            className='absolute top-4 right-4 w-4 h-4 cursor-pointer'
                            onClick={() => removeEntry(index)}
                          >
                            <svg
                              width='16'
                              height='16'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M1 1L15 15M1 15L15 1'
                                stroke='#999999'
                                strokeWidth='2'
                                strokeLinecap='round'
                              />
                            </svg>
                          </div>
                        )}

                        {/* Public Range Checkbox */}
                        <div className='flex flex-col gap-2'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            公開範囲
                          </label>
                          <div className='flex flex-row gap-2 items-start'>
                            <div
                              className='w-5 h-5 mt-1 cursor-pointer'
                              onClick={() =>
                                updateEntry(
                                  index,
                                  'isPrivate',
                                  !entry.isPrivate
                                )
                              }
                            >
                              <svg
                                width='20'
                                height='20'
                                viewBox='0 0 20 20'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z'
                                  fill={entry.isPrivate ? '#0F9058' : '#DCDCDC'}
                                />
                              </svg>
                            </div>
                            <div className='flex flex-col gap-1 flex-1'>
                              <span className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                企業名を非公開（業種・進捗のみ公開）
                              </span>
                              <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px] leading-[1.6]'>
                                企業に選考状況を伝えることで、スカウトの質やあなたへの興味度が高まりやすくなります。
                                <br />
                                ※選考中の企業には自動で非公開になります。
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Industry Selection */}
                        <div className='flex flex-col gap-2'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            業種
                          </label>
                          <button
                            type='button'
                            onClick={() =>
                              setModalState({
                                isOpen: true,
                                targetIndex: index,
                              })
                            }
                            className='w-full px-10 py-[11px] border border-[#999999] rounded-[32px] text-[#323232] text-[16px] font-bold tracking-[1.6px] bg-white'
                          >
                            業種を選択
                          </button>
                          <div className='flex flex-wrap gap-2'>
                            {selectedIndustriesMap[index]?.map(industry => (
                              <div
                                key={industry}
                                className='bg-[#d2f1da] px-6 py-2 rounded-[10px] flex items-center gap-2'
                              >
                                <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                                  {industry}
                                </span>
                                <button
                                  type='button'
                                  onClick={() => {
                                    setSelectedIndustriesMap(prev => ({
                                      ...prev,
                                      [index]: prev[index].filter(
                                        j => j !== industry
                                      ),
                                    }));
                                  }}
                                >
                                  <svg
                                    width='12'
                                    height='12'
                                    viewBox='0 0 12 12'
                                    fill='none'
                                  >
                                    <path
                                      d='M1 1L11 11M1 11L11 1'
                                      stroke='#0F9058'
                                      strokeWidth='1.5'
                                      strokeLinecap='round'
                                    />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Company Name */}
                        <div className='flex flex-col gap-2'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            企業名
                          </label>
                          <CompanyNameInput
                            value={entry.companyName}
                            onChange={value =>
                              updateEntry(index, 'companyName', value)
                            }
                            placeholder='企業名を入力'
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>

                        {/* Department */}
                        <div className='flex flex-col gap-2'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            部署名・役職名
                          </label>
                          <input
                            type='text'
                            value={entry.department || ''}
                            onChange={e =>
                              updateEntry(index, 'department', e.target.value)
                            }
                            placeholder='部署名・役職名を入力'
                            className='w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999]'
                          />
                        </div>

                        {/* Progress Status */}
                        <div className='flex flex-col gap-2'>
                          <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                            進捗状況
                          </label>
                          <SelectInput
                            value={entry.progressStatus}
                            onChange={value =>
                              updateEntry(index, 'progressStatus', value)
                            }
                            options={[
                              { value: '', label: '未選択' },
                              ...PROGRESS_STATUS_OPTIONS.map(option => ({
                                value: option.value,
                                label: option.label,
                              })),
                            ]}
                            placeholder='未選択'
                            className='w-full'
                            radius={5}
                          />
                        </div>

                        {/* Decline Reason - show only if progressStatus is '辞退' */}
                        {entry.progressStatus === '辞退' && (
                          <div className='flex flex-col gap-2'>
                            <label className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              辞退理由
                            </label>
                            <SelectInput
                              value={entry.declineReason || ''}
                              onChange={value =>
                                updateEntry(index, 'declineReason', value)
                              }
                              options={[
                                { value: '', label: '未選択' },
                                ...DECLINE_REASON_OPTIONS.map(option => ({
                                  value: option.value,
                                  label: option.label,
                                })),
                              ]}
                              placeholder='未選択'
                              className='w-full'
                              radius={5}
                            />
                          </div>
                        )}
                      </div>
                    ))}

                    <button
                      type='button'
                      onClick={addEntry}
                      className='bg-white border border-[#0f9058] rounded-[32px] px-6 py-2.5 flex items-center gap-2'
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                      >
                        <path
                          d='M8 1.5V14.5M1.5 8H14.5'
                          stroke='#0f9058'
                          strokeWidth='2'
                          strokeLinecap='round'
                        />
                      </svg>
                      <span className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'>
                        企業を追加
                      </span>
                    </button>
                  </div>
                )}

              <Button
                type='submit'
                disabled={isSubmitting || !isFormValid()}
                variant='green-gradient'
                size='figma-default'
                className='w-full text-[16px] tracking-[1.6px] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {isSubmitting ? '送信中...' : '次へ'}
              </Button>
            </div>
          </main>
        </div>
      </form>

      {/* Industry Select Modal */}
      <IndustrySelectModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, targetIndex: null })}
        onConfirm={industries => {
          if (modalState.targetIndex !== null) {
            const targetIndex = modalState.targetIndex;
            setSelectedIndustriesMap(prev => ({
              ...prev,
              [targetIndex]: industries,
            }));
            updateEntry(targetIndex, 'industries', industries);
          }
        }}
        initialSelected={
          modalState.targetIndex !== null
            ? selectedIndustriesMap[modalState.targetIndex] || []
            : []
        }
      />
    </>
  );
}
