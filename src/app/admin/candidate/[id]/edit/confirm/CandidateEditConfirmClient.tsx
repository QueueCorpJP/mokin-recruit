'use client';

import React, { useState, useEffect } from 'react';
import { CandidateDetailData } from '../../page';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { updateCandidateData } from '../actions';

interface Props {
  candidate: CandidateDetailData;
  formData: any;
}

export default function CandidateEditConfirmClient({ candidate, formData: initialFormData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<any>(initialFormData);

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') {
      return;
    }
    
    // Retrieve form data from sessionStorage if not provided
    if (!formData) {
      const storedData = sessionStorage.getItem('candidateEditData');
      if (storedData) {
        try {
          setFormData(JSON.parse(storedData));
        } catch (error) {
          if (process.env.NODE_ENV === 'development') console.error('Error parsing stored form data:', error);
          router.push(`/admin/candidate/${candidate.id}/edit`);
        }
      } else {
        // No data found, redirect back to edit page
        router.push(`/admin/candidate/${candidate.id}/edit`);
      }
    }
  }, [formData, candidate.id, router]);

  // Show loading state while retrieving data from sessionStorage
  if (!formData) {
    return <div>Loading...</div>;
  }

  // Safe fallback for scout_stats if undefined
  const scoutStats = candidate.scout_stats || {
    scout_received_7days: 0,
    scout_opened_7days: 0,
    scout_replied_7days: 0,
    applications_7days: 0,
    scout_received_30days: 0,
    scout_opened_30days: 0,
    scout_replied_30days: 0,
    applications_30days: 0,
    scout_received_total: 0,
    scout_opened_total: 0,
    scout_replied_total: 0,
    applications_total: 0,
  };

  // Calculate age from formData birth_date
  const age = formData.birth_date 
    ? new Date().getFullYear() - new Date(formData.birth_date).getFullYear()
    : null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };


  const handleConfirmSave = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateCandidateData({
        candidateId: candidate.id,
        formData: formData.updateData,
        education: formData.education,
        workExperience: formData.workExperience,
        jobTypeExperience: formData.jobTypeExperience,
        skills: formData.skills,
        expectations: formData.expectations || {},
        memo: formData.memo,
        selectionEntries: formData.selectionEntries
      });

      if (result.success) {
        setShowModal(true);
      } else {
        alert('更新に失敗しました: ' + result.error);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error updating candidate:', error);
      alert('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    // Clear stored data from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('candidateEditData');
    }
    router.push(`/admin/candidate/${candidate.id}`);
  };

  return (
    <>
      <div className="min-h-screen">
        {/* ユーザーID表示 */}
        <div className="p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            候補者情報編集確認 - ユーザーID: {candidate.id}
          </h1>
        </div>

        <div className="p-8">
          {/* 候補者分析 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              候補者分析
            </h2>
            <div className="bg-white relative rounded-[4px] w-full">
              <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-full">
                {/* ヘッダー行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">&nbsp;</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">スカウト受信数</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">開封数（開封率）</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">返信数（返信率）</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">応募数（応募率）</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 過去7日合計行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">過去7日合計</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">{scoutStats.scout_received_7days}</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_opened_7days}
                          {scoutStats.scout_received_7days > 0 ? ` (${Math.round(scoutStats.scout_opened_7days / scoutStats.scout_received_7days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_replied_7days}
                          {scoutStats.scout_received_7days > 0 ? ` (${Math.round(scoutStats.scout_replied_7days / scoutStats.scout_received_7days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                        <p className="leading-[1.3] whitespace-pre">
                          {scoutStats.applications_7days}
                          {scoutStats.scout_received_7days > 0 ? ` (${Math.round(scoutStats.applications_7days / scoutStats.scout_received_7days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 過去30日間合計行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">過去30日間合計</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">{scoutStats.scout_received_30days}</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_opened_30days}
                          {scoutStats.scout_received_30days > 0 ? ` (${Math.round(scoutStats.scout_opened_30days / scoutStats.scout_received_30days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_replied_30days}
                          {scoutStats.scout_received_30days > 0 ? ` (${Math.round(scoutStats.scout_replied_30days / scoutStats.scout_received_30days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                        <p className="leading-[1.3] whitespace-pre">
                          {scoutStats.applications_30days}
                          {scoutStats.scout_received_30days > 0 ? ` (${Math.round(scoutStats.applications_30days / scoutStats.scout_received_30days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 累計行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">累計</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">{scoutStats.scout_received_total}</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_opened_total}
                          {scoutStats.scout_received_total > 0 ? ` (${Math.round(scoutStats.scout_opened_total / scoutStats.scout_received_total * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_replied_total}
                          {scoutStats.scout_received_total > 0 ? ` (${Math.round(scoutStats.scout_replied_total / scoutStats.scout_received_total * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                        <p className="leading-[1.3] whitespace-pre">
                          {scoutStats.applications_total}
                          {scoutStats.scout_received_total > 0 ? ` (${Math.round(scoutStats.applications_total / scoutStats.scout_received_total * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#b9b9b9] border-solid inset-0 pointer-events-none rounded-[4px]" />
            </div>
          </section>

          {/* メールアドレス */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              メールアドレス
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="text-gray-900">{formData.updateData?.email || '未入力'}</div>
              </div>
            </div>
          </section>

          {/* パスワード */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              パスワード
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <div className="text-gray-900">
                  {formData.updateData?.password ? '変更あり' : (candidate.password_hash ? '設定済み' : '未設定')}
                </div>
              </div>
            </div>
          </section>

          {/* 基本情報 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              基本情報
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">お名前</span>
                <span className="text-gray-900 flex-1">
                  {formData.updateData?.last_name && formData.updateData?.first_name ? `${formData.updateData.last_name} ${formData.updateData.first_name}` : '入力された内容を表示'}
                </span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">フリガナ</span>
                <span className="text-gray-900 flex-1">
                  {formData.updateData?.last_name_kana && formData.updateData?.first_name_kana ? `${formData.updateData.last_name_kana} ${formData.updateData.first_name_kana}` : '入力された内容を表示'}
                </span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">性別</span>
                <span className="text-gray-900 flex-1">
                  {formData.updateData?.gender === 'male' ? '男性' : 
                   formData.updateData?.gender === 'female' ? '女性' : 
                   '選択された内容を表示'}
                </span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">現在の住まい</span>
                <span className="text-gray-900 flex-1">{formData.updateData?.prefecture || '選択された内容を表示'}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">生年月日</span>
                <div className="flex gap-2 items-center text-gray-900 flex-1">
                  {formData.updateData?.birth_date ? (
                    <>
                      <span>{new Date(formData.updateData.birth_date).getFullYear()}</span>
                      <span className="text-gray-600">年</span>
                      <span>{new Date(formData.updateData.birth_date).getMonth() + 1}</span>
                      <span className="text-gray-600">月</span>
                      <span>{new Date(formData.updateData.birth_date).getDate()}</span>
                      <span className="text-gray-600">日</span>
                      {age && <span className="text-gray-600 ml-2">({age}歳)</span>}
                    </>
                  ) : (
                    <>
                      <span>選択された内容を表示</span>
                      <span className="text-gray-600">年</span>
                      <span>選択された内容を表示</span>
                      <span className="text-gray-600">月</span>
                      <span>選択された内容を表示</span>
                      <span className="text-gray-600">日</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">連絡先電話番号</span>
                <span className="text-gray-900 flex-1">{formData.updateData?.phone_number || '入力された内容を表示'}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">現在の年収</span>
                <span className="text-gray-900 flex-1">{formData.updateData?.current_income || '選択された内容を表示'}</span>
              </div>
            </div>
          </section>

          {/* 転職活動状況 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              転職活動状況
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                  転職経験
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">転職経験</span>
                    <span className="text-gray-900 flex-1">
                      {formData.updateData?.has_career_change === 'yes' ? 'あり' : 
                       formData.updateData?.has_career_change === 'no' ? 'なし' : '選択された内容を表示'}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                  転職活動状況
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">転職希望時期</span>
                    <span className="text-gray-900 flex-1">
                      {formData.updateData?.job_change_timing === 'immediately' ? 'すぐにでも' :
                       formData.updateData?.job_change_timing === 'within_3months' ? '3ヶ月以内' :
                       formData.updateData?.job_change_timing === 'within_6months' ? '6ヶ月以内' :
                       formData.updateData?.job_change_timing === 'within_1year' ? '1年以内' :
                       formData.updateData?.job_change_timing === 'undecided' ? '未定' : '選択された内容を表示'}
                    </span>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">現在の活動状況</span>
                    <span className="text-gray-900 flex-1">
                      {formData.updateData?.current_activity_status === 'active' ? '積極的に活動中' :
                       formData.updateData?.current_activity_status === 'passive' ? '良い求人があれば' :
                       formData.updateData?.current_activity_status === 'not_active' ? '活動していない' : '選択された内容を表示'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 職務経歴 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務経歴
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">直近の在籍企業</span>
                <span className="text-gray-900 flex-1">{formData.updateData?.recent_job_company_name || '入力された内容を表示'}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">部署・役職</span>
                <span className="text-gray-900 flex-1">{formData.updateData?.recent_job_department_position || '入力された内容を表示'}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">在籍期間</span>
                <div className="flex gap-2 items-center text-gray-900 flex-1">
                  {formData.updateData?.recent_job_start_year && formData.updateData?.recent_job_start_month ? (
                    <>
                      <span>{formData.updateData.recent_job_start_year}</span>
                      <span className="text-gray-600">年</span>
                      <span>{formData.updateData.recent_job_start_month}</span>
                      <span className="text-gray-600">月</span>
                      <span className="text-gray-600 mx-2">〜</span>
                      {formData.updateData?.recent_job_is_currently_working ? (
                        <span>現在</span>
                      ) : formData.updateData?.recent_job_end_year && formData.updateData?.recent_job_end_month ? (
                        <>
                          <span>{formData.updateData.recent_job_end_year}</span>
                          <span className="text-gray-600">年</span>
                          <span>{formData.updateData.recent_job_end_month}</span>
                          <span className="text-gray-600">月</span>
                        </>
                      ) : (
                        <span>選択された内容を表示</span>
                      )}
                    </>
                  ) : (
                    <span>選択された内容を表示</span>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">直近の在籍企業での業種</span>
                <div className="flex flex-col gap-2 flex-1">
                  {formData.updateData?.recent_job_industries && formData.updateData.recent_job_industries.length > 0 ? (
                    formData.updateData.recent_job_industries.map((industry: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                      >
                        {industry}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">未入力</span>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">直近の在籍企業での職種</span>
                <div className="flex flex-col gap-2 flex-1">
                  {formData.updateData?.recent_job_types && formData.updateData.recent_job_types.length > 0 ? (
                    formData.updateData.recent_job_types.map((jobType: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                      >
                        {jobType}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">未入力</span>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">直近の在籍企業での業務内容</span>
                <div className="text-gray-900 whitespace-pre-wrap flex-1">
                  {formData.updateData?.recent_job_description || '入力された業務内容を表示'}
                </div>
              </div>
            </div>
          </section>

          {/* 学歴・経験業種/職種 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              学歴・経験業種/職種
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                  最終学歴
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">最終学歴</span>
                    <span className="text-gray-900 flex-1">
                      {formData.education?.final_education === 'high_school' ? '高校卒' :
                       formData.education?.final_education === 'vocational' ? '専門学校卒' :
                       formData.education?.final_education === 'junior_college' ? '短大卒' :
                       formData.education?.final_education === 'university' ? '大学卒' :
                       formData.education?.final_education === 'graduate' ? '大学院卒' : '未設定'}
                    </span>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">学校名</span>
                    <span className="text-gray-900 flex-1">{formData.education?.school_name || '未設定'}</span>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">学部学科専攻</span>
                    <span className="text-gray-900 flex-1">{formData.education?.department || '未設定'}</span>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">卒業年月</span>
                    <div className="flex gap-2 items-center text-gray-900 flex-1">
                      <span>{formData.education?.graduation_year || '未設定'}</span>
                      <span className="text-gray-600">年</span>
                      <span>{formData.education?.graduation_month || '未設定'}</span>
                      <span className="text-gray-600">月</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                  今までに経験した業種・職種
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">業種</span>
                    <div className="flex flex-col gap-2 flex-1">
                      {formData.workExperience && formData.workExperience.length > 0 ? (
                        formData.workExperience.map((exp: any, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                          >
                            {exp.industry_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">未入力</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">職種</span>
                    <div className="flex flex-col gap-2 flex-1">
                      {formData.jobTypeExperience && formData.jobTypeExperience.length > 0 ? (
                        formData.jobTypeExperience.map((exp: any, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                          >
                            {exp.job_type_name}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">未入力</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 資格・語学・スキル */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              資格・語学・スキル
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                  語学
                </h4>
                <div className="space-y-4">
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">英語レベル</span>
                    <span className="text-gray-900 flex-1">
                      {formData.skills?.english_level === 'none' ? 'なし' :
                       formData.skills?.english_level === 'basic' ? '日常会話レベル' :
                       formData.skills?.english_level === 'business' ? 'ビジネスレベル' :
                       formData.skills?.english_level === 'native' ? 'ネイティブレベル' : '未設定'}
                    </span>
                  </div>
                  {/* その他の言語はデータがある場合のみ表示 */}
                  {(() => {
                    const otherLanguages = formData.skills?.other_languages;
                    if (process.env.NODE_ENV === 'development') console.log('Other languages debug:', otherLanguages, typeof otherLanguages);
                    if (!otherLanguages) return null;

                    let languageArray = [];
                    
                    // 文字列の場合（JSON形式の可能性）
                    if (typeof otherLanguages === 'string') {
                      try {
                        const parsed = JSON.parse(otherLanguages);
                        if (Array.isArray(parsed)) {
                          languageArray = parsed;
                        } else {
                          languageArray = [parsed];
                        }
                      } catch (e) {
                        if (process.env.NODE_ENV === 'development') console.log('JSON parse failed:', e);
                        // JSON parseに失敗した場合は、そのまま文字列として扱う
                        return (
                          <div className="flex gap-8">
                            <span className="text-sm font-medium text-gray-700 w-[120px] text-right">その他の言語</span>
                            <div className="flex flex-col gap-2 flex-1">
                              <span className="text-gray-900">{otherLanguages}</span>
                            </div>
                          </div>
                        );
                      }
                    } 
                    // 配列の場合
                    else if (Array.isArray(otherLanguages)) {
                      languageArray = otherLanguages;
                    } 
                    // オブジェクトの場合
                    else if (typeof otherLanguages === 'object') {
                      languageArray = [otherLanguages];
                    }

                    return languageArray.length > 0 ? (
                      <div className="flex gap-8">
                        <span className="text-sm font-medium text-gray-700 w-[120px] text-right">その他の言語</span>
                        <div className="flex flex-col gap-2 flex-1">
                          {languageArray.map((lang, langIndex) => (
                            <span key={`lang-${langIndex}`} className="text-gray-900">
                              {typeof lang === 'object' && lang.language && lang.level 
                                ? `${lang.language} (${lang.level}レベル)` 
                                : typeof lang === 'object' 
                                  ? JSON.stringify(lang)
                                  : String(lang)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200">
                  スキル
                </h4>
                <div className="space-y-6">
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">スキル</span>
                    <div className="flex flex-col gap-2 flex-1">
                      {formData.skills?.skills_list && formData.skills.skills_list.length > 0 ? (
                        formData.skills.skills_list.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">未入力</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <span className="text-sm font-medium text-gray-700 w-[120px] text-right">保有資格</span>
                    <div className="text-gray-900 flex-1">
                      {formData.skills?.qualifications || '未入力'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 希望条件 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              希望条件
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">希望年収</span>
                <span className="text-gray-900 flex-1">{formData.updateData?.desired_salary || '選択された内容を表示'}</span>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">希望業種</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {formData.updateData?.desired_industries && formData.updateData.desired_industries.length > 0 ? (
                    formData.updateData.desired_industries.map((industry: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]"
                      >
                        {industry}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">未入力</span>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">希望職種</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {formData.updateData?.desired_job_types && formData.updateData.desired_job_types.length > 0 ? (
                    formData.updateData.desired_job_types.map((jobType: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]"
                      >
                        {jobType}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">未入力</span>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">希望勤務地</span>
                <div className="flex flex-wrap gap-2 flex-1">
                  {formData.updateData?.desired_locations && formData.updateData.desired_locations.length > 0 ? (
                    formData.updateData.desired_locations.map((location: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]"
                      >
                        {location}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">未入力</span>
                  )}
                </div>
              </div>
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">興味のある働き方</span>
                <div className="flex flex-col gap-2 flex-1">
                  {formData.updateData?.desired_work_styles && formData.updateData.desired_work_styles.length > 0 ? (
                    formData.updateData.desired_work_styles.map((workStyle: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                      >
                        {workStyle}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">未入力</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 職務要約 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務要約
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">職務要約</span>
                <div className="text-gray-900 whitespace-pre-wrap flex-1">
                  {formData.updateData?.job_summary || '入力された内容を表示'}
                </div>
              </div>
            </div>
          </section>

          {/* 自己PR */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              自己PR・その他
            </h3>
            <div className="px-4 py-4 space-y-6">
              <div className="flex gap-8">
                <span className="text-sm font-medium text-gray-700 w-[120px] text-right">自己PR・その他</span>
                <div className="text-gray-900 whitespace-pre-wrap flex-1">
                  {formData.updateData?.self_pr || '入力された内容を表示'}
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-8">
            <AdminButton 
              text={isSubmitting ? "保存中..." : "保存する"} 
              variant="green-gradient" 
              size="figma-default"
              onClick={handleConfirmSave}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AdminNotificationModal
        isOpen={showModal}
        title="候補者情報の変更完了"
        description="候補者情報の変更が完了しました。"
        confirmText="候補者情報に戻る"
        onConfirm={handleModalClose}
      />
    </>
  );
}